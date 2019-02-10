const http = require('https');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');
const readline = require('readline');
const events = require('events');
const fd = new events.EventEmitter();

const host = 'https://wiki.ihris.org'; 
//read all categories

http.get(`${host}/mediawiki/index.php?title=Special:Categories&offset=&limit=500`, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        let dom = new JSDOM(data).window.document;
        let elements = Array.from(dom.getElementById('mw-content-text').getElementsByTagName('a')).filter(elem => RegExp('/wiki/Category*').test(elem));
        dataToFile('categories.txt', elements, true);
        
        fd.on('close', () => {
            const rl = readline.createInterface({
                input: fs.createReadStream('data/categories.txt'),
                crlfDelay: Infinity // wait for both \r and \n
            });
            rl.on('line', (line) => {
                let lineJson = JSON.parse(line);
                http.get(`${host}${lineJson.url}`, (res) => {
                    let newdata = '';
                    res.on('data', (chunk) => newdata += chunk);
                    res.on('end', () => {
                        let newdom = new JSDOM(newdata).window.document;
                     let links_div = newdom.getElementById('mw-pages');
                    links_div =  links_div ? links_div : newdom.getElementById('mw-content-text'); 
                    let all_links = Array.from(links_div.getElementsByTagName('a')).filter(newelem => !RegExp('/wiki/Category*').test(newelem));
                    dataToFile('all_urls.txt', all_links, true, lineJson.category);
                    });
                });
            });
        });
    });
}).on('error', (e) => {
    console.error(`Got an error: ${e.message}`);
});

/**
 * Write data to file. created filename if not exists
 * @param {String} filename to write data to
 * @param {Array} data an array of data to write to filename
 * @param {boolean} append if true, data will be appended to filename
 * 
 */
function dataToFile(filename, data, append, category){
    let ws = fs.createWriteStream(`data/${filename}`, {flags: `${append ? 'a' : 'w'}`});
    if(category) {
        for(let d of data) {
            ws.write(`${JSON.stringify(createURLObject(d, category))}\n`);
        }
        return;
    }
    for( let d of data){
        ws.write(`${JSON.stringify(createCategoryObject(d))}\n`);
    }
    ws.end(''); // must explicitly have this for finish/close event to fire
    ws.on('finish', () => fd.emit('close'));
}

/**
 * 
 * @param {Object} data 
 */
function createCategoryObject(dom_obj){
    return {
        url: dom_obj.href,
        category: dom_obj.innerHTML
    };
}

function createURLObject(dom_obj, category) {
    return {
        category: category,
        url: dom_obj.href,
        text: dom_obj.innerHTML
    };
}