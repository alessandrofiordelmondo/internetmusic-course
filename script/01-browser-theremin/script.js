/* cross browser variant AudioContext */
var AudioContext = window.AudioContext || window.webkitAudioContext;
/* Initialize audioContext */
var audioCntx = new AudioContext();

var gain = audioCntx.createGain();
gain.gain.value = 0.5;
gain.connect(audioCntx.destination)

var oscil;
var isPlaying = false;
var mouse = {
	x: 0,
	y: 0
}

function startOscil() {
	if (!isPlaying){
		oscil = audioCntx.createOscillator();
		oscil.frequency.value = 200;
		oscil.connect(gain);
		oscil.start();
		isPlaying = true;
		window.requestAnimationFrame(getMousePosition);	
	}
}

function stopOscil() {
	if (isPlaying){
		oscil.stop();
		oscil = null;
		isPlaying = false;	
	}
}

function getMousePosition() {
	if (isPlaying){
		window.requestAnimationFrame(getMousePosition);
		window.document.onmousemove = mouseCoord;
		var f = mouse.x / window.innerWidth * 1000;
		var a = mouse.y / window.innerHeight;
		oscil.frequency.linearRampToValueAtTime(f, audioCntx.currentTime + 0.05);
		gain.gain.linearRampToValueAtTime(a, audioCntx.currentTime + 0.05);
	}
}

function mouseCoord(event) {
	var x = event.clientX
	var y = event.clientY;
	mouse.x = x;
	mouse.y = y;
}
