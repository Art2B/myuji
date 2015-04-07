Template.home.helpers({});

Template.home.events({
	'click #js-getSong': function(){
		var newVal = $('#hearthBeat').val();
		var bpm = map_range(newVal, 50, 120, 50, 140);
		getTracks();
	}
});

Template.home.rendered = function(){
	var url = "https://api.deezer.com/search?q=hip hop";

	$.get(url, function(data) {
		var index = Math.floor(Math.random() * (data.data.length - 0)) + 0;
		chooseOneTrack(data.data);
	}, "json" )
	.fail(function(err) {
		console.log("error :", err);
	});
};

function chooseOneTrack(data){
	var searchResult = data;
	console.log('chooseOneTrack');
	console.log('Nb of data', searchResult.length);
	var bpmMin = 60;
	var bpmMax = 80;
	var isGoodSong = false;
	do {
		var index = Math.floor(Math.random() * (searchResult.length - 0)) + 0;
		getTrack(searchResult[index].id, function(data){
			console.log(data.bpm);
			if(data.bpm > bpmMin && data.bpm < bpmMax){
				isGoodSong = true;
				console.log(data);
			} else {
				console.log('pas bon');
				searchResult.splice(index, 1);
				console.log('Nb of data', searchResult.length);
			}
		});
	} while (!isGoodSong);
};

function getTrack(id, callback){
	console.log('getTrack')
	var url = "https://api.deezer.com/track/"+id;
	$.get(url, function(data) {
		callback(data);
	}, "json" )
	.fail(function(err) {
		console.log("error :", err);
	});
};
function map_range(value, low1, high1, low2, high2) {
	return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
};
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};