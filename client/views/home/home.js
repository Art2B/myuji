Template.home.helpers({});

Template.home.events({
	'change #hBeat': function(){
		var newVal = $('#hBeat').val();
		$('#value').text(newVal);
		var bpm = map_range(newVal, 50, 120, 50, 140);
	}
});

Template.home.rendered = function(){
	var newVal = $('#hBeat').val();
	$('#value').text(newVal);
	var bpm = map_range(newVal, 50, 120, 50, 140);

	SC.initialize({
		client_id: "45ba4ffbd0d3eabcb09951a6b3566c72",
	});

	SC.get("/tracks", {limit: 10, 'bpm[from]': 70, 'bpm[to]': 80}, function(tracks){
		var randomSelect = getRandomInt(0, 9);
		$.each(tracks, function(index, val) {
			if(index == randomSelect){
				console.log(val);
			}
		});
		var track_url = 'http://soundcloud.com/forss/flickermood';
		SC.oEmbed(track_url, { auto_play: true }, function(oEmbed) {
		  console.log('oEmbed response: ' , oEmbed);
		});
	});
};


function map_range(value, low1, high1, low2, high2) {
	return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}