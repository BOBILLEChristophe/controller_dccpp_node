//***** v 4.2 - le 27/11/2017 à 23:48:00

// Node-Serialport : https://www.npmjs.com/package/serialport

var conx_serial = false;

if(conx_serial) { 
  //var usbserial = '/dev/cu.usbmodem1411'; // A modifier selon votre propre configuration
  var usbserial = '/dev/cu.usbmodem1411'; // A modifier selon votre propre configuration
}
else {
  var host = '192.168.1.200'; // IP de l'Arduino
  //var host = '169.254.14.200'; // IP de l'Arduino
  var port = 2560;
}

var http = require('http');
var fs   = require('fs');
var path = require("path");
var url  = require("url");
var ip = require('ip');


// Gestion des pages HTML
function sendError(errCode, errString, response) {
  response.writeHead(errCode, {"Content-Type": "text/plain"});
  response.write(errString + "\n");
  response.end();
  return;
}

function sendFile(err, file, response) {
  if(err) return sendError(500, err, response);
  response.writeHead(200);
  response.write(file, "binary");
  response.end();
}

function getFile(exists, response, localpath) {
  if(!exists) return sendError(404, '404 Not Found', response);
  fs.readFile(localpath, "binary",
   function(err, file){ sendFile(err, file, response);});
}

function getFilename(request, response) {
  var urlpath = url.parse(request.url).pathname; 
  var localpath = path.join(process.cwd(), urlpath); 
  fs.exists(localpath, function(result) { getFile(result, response, localpath)});
}

var server = http.createServer(getFilename);


// -- socket.io --
// Chargement
var io = require('socket.io').listen(server);

if(conx_serial) { // Si var conx_serial = true; // ligne 5 ci-dessus
  // -- SerialPort --
  // Chargement
  var SerialPort = require('serialport');
  var arduinoSerial = new SerialPort(usbserial, {
    autoOpen: false,
    baudRate: 115200
  });

  /************ IMPORTANT ********
  Pour fonctionner correctement, le fichier 'serialport' @ Users/node_modules/serialport/lib/serialport.js
  à été modifié à la ligne 32
  baudRate: 115200,

  La communication série dans les sketches arduino doit être paramètrés à 115200 bauds : Serial.begin(115200);  
  */

  //Ouverture du port serie
  arduinoSerial.open(function (err) {
    if (err) {
      return console.log('Error opening port : ', err.message);
    }
    else {
      console.log ('Connected to Arduino DCC++ serial at : '+usbserial)
    }
  });
}
else {
  // TCP server
  var net = require('net');
  var arduinoTcp = new net.Socket();
  arduinoTcp.connect(port, host, function(err) {
    arduinoTcp.on('connect', function(){
      console.log('Connected to Arduino Mega DCC++ at : ' + host + ':' + port);
    });
    arduinoTcp.on('error', function() {
      console.log('Error opening port');
    });
    if (err) { 
      return console.log('Error opening port : ', err.message);
    }
    else {
      console.log('Connected to Arduino Mega DCC++ at : ' + host + ':' + port);
    }
  });
}


// Requetes
io.sockets.on('connection', function (socket) {
  console.log('Connection socket : Ok');
  socket.emit('response', 'Connection : Ok');
  //Le serveur reçoit un message" du navigateur    
  socket.on('message', function (msg) {
    if(conx_serial) {
      console.log(msg)
      //arduinoSerial.write(msg);
      setTimeout(function(){ arduinoSerial.write(msg); }, 100);
    }
    else {
      arduinoTcp.write(msg);
      console.log(msg)
    }// End else
  });

  socket.on('hdSave', function (data, file) {
     fs.writeFile(file, data, function (err) {
       if (err) throw err;
        console.log(file);
     }); 
  }); 
});  


// Reponse
var responseServ = "";
if(conx_serial) {
  arduinoSerial.on('data', function (data) {
    sendServ(data);
  });
}
else {
  arduinoTcp.on('data', function(data) {
    sendServ(data);
  }); 
}

var sendServ = function(data) {
  responseServ = responseServ + data;
  if(responseServ.indexOf(">") > 0 ) {
    let buf = new Buffer(responseServ);
    io.sockets.emit('response', buf.toString('ascii')); 
    console.log('Arduino response : ', buf.toString('ascii'));
    responseServ = "";
  }
}    

var serverPort = 8080;
server.listen(serverPort);
console.log("\nServer NodeJs at : " + ip.address()+':'+serverPort);