const fs = require('fs');
const readline = require('readline');
const events = require('events');
const fd = new events.EventEmitter();

var menu = {};
var keys = [];
function organize(line) {
    // parse line into json object
    // {"category":"Blueprints","url":"/wiki/Organizational_Charts","text":"Organizational Charts"}

    const line_json = JSON.parse(line);
    // read the key
    if(keys.includes(line_json.category)) {
        addToMenu(line_json, true);
    } else {
        addToMenu(line_json, false);
    }
}

function addToMenu(item, processed) {
    if(!processed) {
        keys.push(item.category);
    }
    menu[item.category].push({ 
        url: item.url, 
        text: item.text
    });
}