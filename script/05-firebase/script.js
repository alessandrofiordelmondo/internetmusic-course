// Firebase configuration
var firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};  

// initialize app
var app = firebase.initializeApp(firebaseConfig);
// initialize databasde
var database = firebase.database();

var light = false;

function lightbutton(){
    database.ref('light/').set({
        // file JSON
        on: light
    })
    if (light){
        document.getElementById('light-onoff').innerHTML = 'ON';
    } else {
        document.getElementById('light-onoff').innerHTML = 'OFF';
    }
    light = !light;
}

database.ref('sensors/').on('value', function(snapshot){
    var sensors = snapshot.val()
    document.getElementById('temp-stem').innerHTML = sensors.temp;
    document.getElementById('hum-stem').innerHTML = sensors.hum;
    document.getElementById('ax-stem').innerHTML = sensors.accel.x;
    document.getElementById('ay-stem').innerHTML = sensors.accel.y;
    document.getElementById('az-stem').innerHTML = sensors.accel.z;
    document.getElementById('mx-stem').innerHTML = sensors.mag.x;
    document.getElementById('my-stem').innerHTML = sensors.mag.y;
    document.getElementById('mz-stem').innerHTML = sensors.mag.z;
})