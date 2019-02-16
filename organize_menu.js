const fs = require('fs');
const readline = require('readline');

var menu = {};

fd = fs.createReadStream('data/all_urls.txt');
// read the file line by line and process
const rl = readline.createInterface({
    input: fd,
    crlfDelay: Infinity // wait for both \r and \n
});
// organize the line
rl.on('line', (line) => {
    organize(line);
});

//when done reading the urls into the object, we write to file as JSON
fd.on('close', () => {
    const ws = fs.createWriteStream('data/organized_links.json', {flags: 'w'});
    ws.write(JSON.stringify(menu));
});

/**
 * organize the data into hierarchical links
 * @param {String} line line read from the file 
 */
function organize(line) {
    // parse line into json object
    // {"category":"Blueprints","url":"/wiki/Organizational_Charts","text":"Organizational Charts"}
    const item = JSON.parse(line);
    if(!menu[item.category]){
        menu[item.category] = [];
    }
    menu[item.category].push({ 
        url: item.url, 
        text: item.text || ''
    });
}