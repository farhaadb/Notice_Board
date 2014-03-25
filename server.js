var http = require("http");
var express  = require("express");
var app = express();
var db = require("./server_modules/dbconfig");

var connection = db.start("107.170.89.145","nb","root","athens");
//var connection = db.start("localhost","nb","root","");

var config = require('./server_modules/config.js')(app, express);
require('./server_modules/routes.js')(app, connection);

http.createServer(app).listen(80, "107.170.89.145");
