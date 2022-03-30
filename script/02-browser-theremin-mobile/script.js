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

var alpha = 0;
var beta = 0;

if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", function(event) {
        // alpha: rotation around z-axis
        var rotateDegrees = event.alpha;
        // gamma: left to right
        var leftToRight = event.gamma;
        // beta: front back motion
        var frontToBack = event.beta;

        handleOrientationEvent(frontToBack, leftToRight, rotateDegrees);
    }, true);
}

var handleOrientationEvent = function(frontToBack, leftToRight, rotateDegrees) {
	alpha = frontToBack;
	beta = rotateDegrees;
	document.getElementById('alpha-value').innerHTML = alpha;
	document.getElementById('beta-value').innerHTML = beta;

};

function startOscil() {
	if (!isPlaying){
		oscil = audioCntx.createOscillator();
		oscil.frequency.value = 200;
		oscil.connect(gain);
		oscil.start();
		isPlaying = true;
		window.requestAnimationFrame(changeOscValue);	
	}
}

function stopOscil() {
	if (isPlaying){
		oscil.stop();
		oscil = null;
		isPlaying = false;	
	}
}

function changeOscValue() {
	if (isPlaying){
		window.requestAnimationFrame(changeOscValue);	
		var f = Math.abs((beta/180)*1000);
		var a = Math.abs((alpha/180)*1);
		oscil.frequency.linearRampToValueAtTime(f, audioCntx.currentTime + 0.05);
		gain.gain.linearRampToValueAtTime(a, audioCntx.currentTime + 0.05);
	}
}
