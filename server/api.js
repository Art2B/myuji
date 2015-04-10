var Future = Npm.require("fibers/future");

function getGenre(hearthBeat){
	var genres = Meteor.settings.public.bpmByGenre;
	var selectedGenres = [];

	var bpm = mapRange(hearthBeat, Meteor.settings.biology.hearthBeatMin, Meteor.settings.biology.hearthBeatMax, Meteor.settings.music.bpmMin, Meteor.settings.music.bpmMax)

	genres.forEach(function(value, index){
		if(bpm >= value.bpmMin && bpm <= value.bpmMax){
			selectedGenres.push(value);
		}
	});
	var selected = {
		name: selectedGenres[getRandomInt(selectedGenres.length-1, 0)].name,
		bpmMin: mapRange(hearthBeat*0.9, Meteor.settings.biology.hearthBeatMin, Meteor.settings.biology.hearthBeatMax, Meteor.settings.music.bpmMin, Meteor.settings.music.bpmMax),
		bpmMax: mapRange(hearthBeat*1.1, Meteor.settings.biology.hearthBeatMin, Meteor.settings.biology.hearthBeatMax, Meteor.settings.music.bpmMin, Meteor.settings.music.bpmMax),
		hearthBeat: hearthBeat
	};
	return selected;
};
function searchForTracks(hearthBeat, beginIndex){
	var options = getGenre(hearthBeat);
	var url = "https://api.deezer.com/search?&index="+beginIndex+"&limit=25&order=RATING_DESC&q="+options.name;

	var fut = new Future();
	HTTP.get(url, function(err, result) {
		if(err) {
			console.log('Error: ', err);
		} else {	
			var song = chooseOneTrack(result.data.data, options);
			fut.return(song);
		}
	});
	var song = fut.wait();
	return song;
};
function chooseOneTrack(data, options){
	var searchResult = data;

	var songFounded = false;
	do {
		var index = Math.floor(Math.random() * searchResult.length);
    	
    	var fut = new Future();
		getTrack(searchResult[index].id, function(data){
			fut.return(data);
		});
		var song = fut.wait();
		
		if(song.bpm > options.bpmMin && song.bpm < options.bpmMax){
			songFounded = true;
			return song;
		} else {
			searchResult.splice(index, 1);
		}

	} while (searchResult.length > 0 && !songFounded);
	return;
};
function getTrack(id, callback){
	var url = "https://api.deezer.com/track/"+id;
	HTTP.get(url, function(err, result) {
		if(err){
			console.log('Error: ', err);
		} else {
			callback(result.data);
		}
	});
};
function mapRange(value, low1, high1, low2, high2) {
	return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
};
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

HTTP.methods({
	'/songs/:hearthbeat': function() {
		this.addHeader('Access-Control-Allow-Origin', '*');
		if(this.params.hearthbeat < Meteor.settings.biology.hearthBeatMin){
			return "The specified hearthbeat is too low";
		}
		if(this.params.hearthbeat > Meteor.settings.biology.hearthBeatMax){
			return "The specified hearthbeat is too high";
		}
		var step = 0;
		var songToReturn;
		do {
			songToReturn = searchForTracks(this.params.hearthbeat, step);
			step += 25;
		} while(!songToReturn);
		return JSON.stringify(songToReturn.id, null, '\t');;
	}
});