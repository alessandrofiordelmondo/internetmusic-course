function loadFile(filepath, callback){
    var req = new XMLHttpRequest();
    req.open("GET", filepath, true);
    req.responseType = "arraybuffer";
    req.onload = function(){
        callback(req.response);
    }
    req.send();
}