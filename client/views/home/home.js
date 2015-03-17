Template.home.helpers({
	'yolo': function(){
		return 'Salut c est cool';
	}
});

Template.home.events({
	'click #js-getSong': function(){
		var newVal = $('#hearthBeat').val();
		var bpm = map_range(newVal, 50, 120, 50, 140);
		getTracks(bpm*0.9, bpm*1.1);
	}
});

Template.home.rendered = function(){
	var newVal = $('#hBeat').val();
	$('#value').text(newVal);
	var bpm = map_range(newVal, 50, 120, 50, 140);

	SC.initialize({
		client_id: "45ba4ffbd0d3eabcb09951a6b3566c72",
	});
};

function getTracks(bpmMin, bpmMax){
	SC.get("/tracks", {bpm: {from: bpmMin, to: bpmMax}, duration: {from: 120000}}, function(tracks){
		var randomSelect = getRandomInt(0, tracks.length-1);
		$.each(tracks, function(index, val) {
			if(index == randomSelect){
				console.log(val);
			}
		});
		// var track_url = 'http://soundcloud.com/forss/flickermood';
		// SC.oEmbed(track_url, { auto_play: true }, function(oEmbed) {
		//   console.log('oEmbed response: ' , oEmbed);
		// });
	});
}
function map_range(value, low1, high1, low2, high2) {
	return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}