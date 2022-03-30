function fileLoader(filepath, callback){
	var req = new XMLHttpRequest();
	req.open("GET", filepath, true);
	req.responseType = "arraybuffer";
	req.onload = function(){
		buffer = req.response;
		callback(buffer);
	}	
	req.send();
}