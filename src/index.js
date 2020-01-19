var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var exec = require('child_process').exec;
var { job } = require("./jobs");
var port = process.env.PORT || 3000;

Files = {};

app.use('/Video', express.static('Video'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/upload', function(req, res){
  res.sendFile(__dirname + '/upload.html');
});

io.sockets.on('connection', function (socket) {
  //Events will go here
  socket.on('Start', function (data) { //data contains the variables that we passed through in the html file
    var Name = data['Name'];
    Files[Name] = {  //Create a new Entry in The Files Variable
        FileSize : data['Size'],
        Data   : "",
        Downloaded : 0
    }
    var Place = 0;
    try{
        var Stat = fs.statSync('Temp/' +  Name);
        if(Stat.isFile())
        {
            Files[Name]['Downloaded'] = Stat.size;
            Place = Stat.size / 524288;
        }
    }
    catch(er){} //It's a New File
    fs.open("Temp/" + Name, "a", 0755, function(err, fd){
        if(err)
        {
            console.log(err);
        }
        else
        {
            Files[Name]['Handler'] = fd; //We store the file handler so we can write to it later
            socket.emit('MoreData', { 'Place' : Place, Percent : 0 });
        }
    });
  });

  socket.on('Upload', function (data){
    var Name = data['Name'];
    Files[Name]['Downloaded'] += data['Data'].length;
    Files[Name]['Data'] += data['Data'];
    if(Files[Name]['Downloaded'] == Files[Name]['FileSize']) //If File is Fully Uploaded
    {
        fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function(err, Writen){
          var input = fs.createReadStream("Temp/" + Name);
          var output = fs.createWriteStream("Video/" + Name);

          input.pipe(output);
          input.on("end", function() {
              console.log("Uploaded file: Video/" + Name );
              job("./Video/" + Name, function(gesture){
                //console.log("response is here man ", tired);
                var answer = { "gesture": gesture };
                socket.emit('GotGesture', answer);
              });
              fs.unlink("Temp/" + Name, function ()
              {
                exec("ffmpeg -i Video/" + Name  + " -ss 00:00:01.01 -y -f image2 -vcodec mjpeg -vframes 1 Video/" + Name  + ".jpg", function(err){
                  socket.emit('Done', {'Image' : 'Video/' + Name + '.jpg'});
                });
            });
          });
      });

    }
    else if(Files[Name]['Data'].length > 10485760){ //If the Data Buffer reaches 10MB
        fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function(err, Writen){
            Files[Name]['Data'] = ""; //Reset The Buffer
            var Place = Files[Name]['Downloaded'] / 524288;
            var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
            socket.emit('MoreData', { 'Place' : Place, 'Percent' :  Percent});
        });
    }
    else
    {
        var Place = Files[Name]['Downloaded'] / 524288;
        var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
        socket.emit('MoreData', { 'Place' : Place, 'Percent' :  Percent});
    }
  });

});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
