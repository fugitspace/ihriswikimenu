const fs = require('fs');
const readline = require('readline');
const events = require('events');
const fd = new events.EventEmitter();

var menu = {};
var keys = [];
function organize(line) {
    // parse line into json object
    // {"category":"Blueprints","url":"/wiki/Organizational_Charts","text":"Organizational Charts"}
    // read the key

    // check if key exists in keys

    // add to it an entry of {url:"", "text"}

    // 
}