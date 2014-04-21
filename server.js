var http = require("http");
var express  = require("express");
var app = express();
var db = require("./server_modules/dbconfig");
var auth = require("./server_modules/auth")();
var dbquery = require("./server_modules/dbquery");
var multer = require('multer');
var excelParser = require('excel-parser');
var fs = require('fs');
var listDir = require("./server_modules/directory");

var pool = db.start("107.170.89.145","nb","root","athens");
//var pool = db.start("localhost","nb","root","");

var config = require('./server_modules/config.js')(app, express, multer);
require('./server_modules/routes.js')(app, pool, auth, dbquery, excelParser, fs, listDir);

http.createServer(app).listen(80, "107.170.89.145");
//http.createServer(app).listen(3000, "localhost");
