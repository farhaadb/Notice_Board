var http = require("http");
var path = require("path");
var express  = require("express");
var app = express();
var db = require("./server_modules/dbconfig");
var auth = require("./server_modules/auth")();
var dbquery = require("./server_modules/dbquery");
var busboy = require('connect-busboy');
var excelParser = require('excel-parser');
var fs = require('fs');
var dir = require("./server_modules/directory");
var subdomain = require('subdomain');

//var pool = db.start("107.170.89.145","nb","root","athens");
var pool = db.start("localhost","nb","root","");

var config = require('./server_modules/config.js')(app, express, busboy, subdomain);
require('./server_modules/routes.js')(app, pool, auth, dbquery, excelParser, fs, dir, path);

//http.createServer(app).listen(80, "107.170.89.145");
http.createServer(app).listen(3000, "127.0.0.1");
