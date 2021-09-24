var express = require('express');
var app = express();
var port = 5000;
//Idiomatic expression in express to route and respond to a client request
app.get('/', function (req, res) {
    res.sendFile('index.html', { root: __dirname }); //server responds by sending the index.html file to the client's browser
    //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
});
app.listen(port, function () {
    console.log("Now listening on port " + port);
});
