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
    const wikiWriteStream = fs.createWriteStream('data/wikimedia_links.txt', {flags: 'w'});
    const htmlWriteStream = fs.createWriteStream('data/links.html', {flags: 'w'});
    htmlWriteStream.write(`<div id="accordion">\n`);
    makeWikimediaMenus(menu, wikiWriteStream);
    buildHTMLCollapsible(menu, htmlWriteStream);
    htmlWriteStream.write(`</div>`)
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

function makeWikimediaMenus(organized_menu, writeStream) {
    Object.keys(organized_menu).forEach(key => {
        writeStream.write(`\n\n* ${key}\n`);
        organized_menu[key].forEach(link => {
            writeStream.write(`** [[${link.text}]]\n`);
        });
    });
}

function buildHTMLCollapsible(organized_menu, writeStream) {
    // create a bootstrap accordion card
    // collapse id like collapseOne, collapseTwo, collapseThree, etc
    Object.keys(organized_menu).forEach(key => {
        const heading_id = `${key.replace(/\s+/g, '-', '-')}`;
        const collapse_id = `collapse-${heading_id}`
        writeStream.write(`\t<div class="card">\n`); //initialize the card
        writeStream.write(`\t\t<div class="card-header" id="${heading_id}">\n`)
        writeStream.write(`\t\t\t<h5 class="mb-0">\n`);
        writeStream.write(`\t\t\t\t<button class="btn btn-link" data-toggle="collapse" data-target="#${collapse_id}" aria-expanded="true" aria-controls="${collapse_id}">${key}</button>\n`);
        writeStream.write(`\t\t\t</h5>\n`);
        writeStream.write(`\t\t</div>\n`);
        writeStream.write(`\t\t<div id="${collapse_id}"  class="collapse" aria-labelledby="${heading_id}" data-parent="#accordion">\n`);
        writeStream.write(`\t\t\t<div class="card-body">\n`);
        writeStream.write(`\t\t\t\t<ul class="list-group">\n`);
        organized_menu[key].forEach(link => {
            writeStream.write(`\t\t\t\t\t<a class="list-group-item list-group-item-action" href="${link.url}">${link.text}</a>\n`);
        });
        writeStream.write(`\t\t\t\t</ul>\n`);
        writeStream.write(`\t\t\t</div>\n`);
        writeStream.write(`\t\t</div>\n`);
        writeStream.write(`\t</div>\n`);
    });
}