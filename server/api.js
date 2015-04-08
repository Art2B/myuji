function getGenre(hearthBeat){
	var genres = Meteor.settings.public.bpmByGenre;
	var selectedGenres = [];

	var bpm = mapRange(hearthBeat, 55, 85, 50, 140)

	genres.forEach(function(value, index){
		if(bpm >= value.bpmMin && bpm <= value.bpmMax){
			selectedGenres.push(value);
		}
	});
	var selected = {
		name: selectedGenres[getRandomInt(selectedGenres.length-1, 0)].name,
		bpmMin: mapRange(hearthBeat*0.9, 55, 85, 50, 140),
		bpmMax: mapRange(hearthBeat*1.1, 55, 85, 50, 140)
	};
	return selected;
};
function searchForTracks(hearthBeat){
	var options = getGenre(hearthBeat);
	console.log(options);
	var url = "https://api.deezer.com/search?q="+options.name;

	HTTP.get(url, function(err, result) {
		if(err) {
			console.log('Error: ', err);
		} else {
	 		var index = getRandomInt(result.data.data.length, 0);		
			chooseOneTrack(result.data.data, options);
		}
	});
};
function chooseOneTrack(data, options){
	var searchResult = data;
	console.log('Nb of data', searchResult.length);
	var bpmMin = options.bpmMin;
	var bpmMax = options.bpmMax;

	var index = Math.floor(Math.random() * searchResult.length);
	getTrack(searchResult[index].id, function(data){
		console.log(data.bpm);
		if(data.bpm > bpmMin && data.bpm < bpmMax){
			console.log(data);
		} else {
			searchResult.splice(index, 1);
			if(searchResult.length > 0) {
				chooseOneTrack(searchResult, options);
			} else {
				searchForTracks();
			}
		}
	});
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
	'/songs/:bpm': function() {
		searchForTracks(this.params.bpm);
		return this.params.bpm;
	}
});