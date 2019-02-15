const fs = require('fs');
const readline = require('readline');
const events = require('events');
const fd = new events.EventEmitter();

var menu = {};
var keys = [];

// read the file line by line and process
const rl = readline.createInterface({
    input: fs.createReadStream('data/all_urls.txt'),
    crlfDelay: Infinity // wait for both \r and \n
});
rl.on('line', (line) => {
    organize(line);
});
rl.on('end', () => {
    console.log(menu);
})

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
    if(!menu[item.category]){
        menu[item.category] = [{ 
            url: item.url, 
            text: item.text
        }];
    } else {
        menu[item.category].push({ 
            url: item.url, 
            text: item.text || ''
        });
    }
    console.log(menu);
}