var http = require("http");
var express  = require("express");
var app = express();
var db = require("./server_modules/dbconfig");

var connection = db.start("127.12.201.2","nb","adminycZWy2b","esZFLqNQvlf9");
//var connection = db.start("localhost","nb","root","");
var port = process.env.OPENSHIFT_NODEJS_PORT ||  process.env.OPENSHIFT_INTERNAL_PORT || 8080;  
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || process.env.OPENSHIFT_INTERNAL_IP || localhost;

var config = require('./server_modules/config.js')(app, express);
require('./server_modules/routes.js')(app, connection);


http.createServer(app).listen(port, ipaddress);
