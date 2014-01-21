var express = require('express'),
    app = express(),
    open = require('openurl');

app.use(express.static(__dirname + '/'));

app.listen(3000);

open.open('http://localhost:3000');