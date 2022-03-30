var AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext = new AudioContext({
    sampleRate: 44100,
    latencyHint: 'interactive'
});

// array of gran
var granulator = new Array(16);
var bufferData;
var globalCue = 0;
var globalPitch = 0;

var x = 100;
var y = 100;
var z = 100;

const listener = audioContext.listener;
listener.setPosition(x, y, z)
listener.setOrientation(0, 0, -1, 0, 1, 0);

var globalPosition = 0;
var globalDistance = 10;

var globalDensity = 10;

//calback after loaded file
function callbackLoadFile(buffer) {
    audioContext.decodeAudioData(buffer, function(data){
        bufferData = data;
        for (var g = 0; g<this.granulator.length; g++){
            granulator[g] = new Gran();
            granulator[g].playGran();
        }
    })
}

var Gran = function(){
    var self = this;
    self.source;
    self.gain = audioContext.createGain();
    self.gain.gain.value = 0;

    self.grainLength = 0;
    self.grainCue = 0;

    // PANNER
    self.pannerNode = audioContext.createPanner();
    self.pannerNode.panningModel = 'HRTF';
    self.pannerNode.distanceModel = 'linear';
    self.pannerNode.maxDistance = 10000;
    self.pannerNode.refDistance = 1;
    self.pannerNode.rolloffFactor = 10;
    self.pannerNode.coneInnerAngle = 360;
    self.pannerNode.coneOuterAngle = 0;
    self.pannerNode.coneOuterGain = 1;
    self.pannerNode.setPosition(x, y, z);
    self.pannerNode.setOrientation(0, 0, -1);
    // POSITION
    self.angle = 0;

    self.gain.connect(self.pannerNode).connect(audioContext.destination);

    self.playGran = function(){
        self.source = audioContext.createBufferSource();
        self.source.buffer = bufferData;
        // get random granLength
        self.grainLength = Math.random()*0.8+0.2;
        // get buffer duration
        var bufLength = self.source.buffer.duration;
        // get random cue
        this.grainCue = globalCue * bufLength;
        this.grainCue = (this.grainCue+this.grainLength>bufLength) ? 0 : this.grainCue;
        // GET POSITION
        self.angle = Math.random()*360-180;
        self.getPosition();
        self.source.connect(self.gain);
        self.source.playbackRate.value = globalPitch;
        self.source.start(audioContext.currentTime, self.grainCue);
        self.gain.gain.setValueCurveAtTime([0, 1, 0], audioContext.currentTime, self.grainLength);
        self.source.stop(audioContext.currentTime+self.grainLength);
        self.source.onended = function(){
            setTimeout(function(){
                self.playGran();
            }, (Math.random()*(10000-globalDensity))+5);
        }
    }

    self.getPosition = function(){
        var sZ = Math.cos((self.angle/180)*Math.PI) * globalDistance;
        var sX = Math.sin((self.angle/180)*Math.PI) * globalDistance;
        self.pannerNode.setPosition(x+sX, y, z+sZ)
    }
}

function changeCue(value){
    globalCue = parseFloat(value);
}

// load audio file
loadFile('piano.wav', callbackLoadFile);