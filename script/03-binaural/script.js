var AudioContext = window.AudioContext || window.webkitAudioContext;
var adudioCntx = new AudioContext;

var mouse = {x: 0, y:0};
var drag = false;
var object = undefined;
var soundObjects = [];

var binaural = new BinauralNode(adudioCntx);

class SoundObject {

	obj = undefined;

	constructor(name){
		this.name = name;
		this.obj = document.createElement("div")
		this.obj.setAttribute("class", "sound-object");
		this.obj.setAttribute("id", this.name);
		document.body.appendChild(this.obj); 
		this.init();	

		this.obj.addEventListener('click', function (event) {
			console.log(name)
			drag = !drag;
			object = document.getElementById(name);
			getMousePosition();
		});
	}

	init(){
		var x = Math.random()*window.innerWidth;
		var y = Math.random()*window.innerHeight;
		this.obj.style.left = x+"px";
		this.obj.style.top = y+"px";
	}
}




function addSoundObject(){
	soundObjects.push(new SoundObject("sound"+soundObjects.length));
}

function removeSoundObject(){
	if (soundObjects.length > 0){
		var name = soundObjects[soundObjects.length-1].name;
		var elem = document.getElementById(soundObjects[soundObjects.length-1].name);
		elem.parentNode.removeChild(elem);
		soundObjects.pop();	
	}
}

function done(){
	console.log('done');
}

function getMousePosition() {
	if (drag){
		window.requestAnimationFrame(getMousePosition);
		window.document.onmousemove = mouseCoord;
		object.style.left = mouse.x+"px";
		object.style.top = mouse.y+"px";
	}
}

function mouseCoord(event) {
	var x = event.clientX
	var y = event.clientY;
	mouse.x = x;
	mouse.y = y;
}
