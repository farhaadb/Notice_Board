var http = require("http");
var express  = require("express");
var app = express();
var db = require("./server_modules/dbconfig");
var auth = require("./server_modules/auth")();
var dbquery = require("./server_modules/dbquery");

var pool = db.start("107.170.89.145","nb","root","athens");
//var pool = db.start("localhost","nb","root","");

var config = require('./server_modules/config.js')(app, express);
require('./server_modules/routes.js')(app, pool, auth, dbquery);

http.createServer(app).listen(80, "107.170.89.145");
//http.createServer(app).listen(3000, "localhost");
