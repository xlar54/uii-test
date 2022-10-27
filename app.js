
const express=require('express');
const bodyParser = require('body-parser')
const path = require('path')
const spawn = require("child_process").spawn;
const fs = require('fs');

const EXTENSION = '.py';

var scripts = [];

function getPythonScripts() {
    fs.readdir(path.join(__dirname), (err, files) => {
        files.forEach(file => {
            if(file.endsWith(EXTENSION))
            {
                console.log(file);
                scripts.push(file);
            }     
        });
      });
}


const app=express();
var urlencodedParser = bodyParser.urlencoded({ extended: true });

//app.use(express.static(path.join(__dirname, '../www')));
app.use(express.static('www'))

app.get("/", function(request, response) {
    response.sendFile('index.html', {root: 'www'});
});

// this api is called when begin test button is clicked
app.post("/api/start", urlencodedParser, function(request, response) {
    console.log(request.body.start)
    response.sendStatus(200);
});

// this api is called per test
app.post("/api/test", urlencodedParser, function(request, response) {

    //console.log(request.body)
    let scriptName = "test"+request.body.testNum+".py"
    const pythonProcess = spawn('python3',[scriptName]);

    // when the python script is done, this is where we handle returned data
    pythonProcess.stdout.on('data', (data) => {
        console.log("script:"+scriptName + " - result:"+ data)
        response.send(data);
    });

});

var listener = app.listen(8100, function() {
    console.log("Listening on port " + listener.address().port);

    getPythonScripts();
});