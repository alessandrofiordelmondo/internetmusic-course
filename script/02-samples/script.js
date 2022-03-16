var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioCntx = new AudioContext()

var sample = audioCntx.createBufferSource();

function loadBuffer(buffer){
	audioCntx.decodeAudioData(buffer, function(buf){
		sample.buffer = buf;
		sample.connect(audioCntx.destination);
		sample.loop = true;
		sample.start()	
	})
}

fileLoader('./guitar.mp3', loadBuffer);

