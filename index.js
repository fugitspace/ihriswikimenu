const http = require('https');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');
const readline = require('readline');

const host = 'https://wiki.ihris.org'; 
//read all categories
fs.open('data/categories.json', 'a', (err, fd) => {
    http.get(`${host}/mediawiki/index.php?title=Special:Categories&offset=&limit=500`, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            let dom = new JSDOM(data).window.document;
            let writeStream = fs.createWriteStream('', {flas: 'a', fd: fd});
            Array.from(dom.getElementById('mw-content-text').getElementsByTagName('a')).map((elem, idx, elems) => {
                if(RegExp('/wiki/Category*').test(elem)) {
                    let category = {
                        url: elem.href,
                        text: elem.innerHTML
                    };
                    writeStream.write(`${JSON.stringify(category)}\n`);
                }
            });
            writeStream.on('error', e => {
                console.log(e);
            });
            writeStream.end('');
            writeStream.on('close', () => {
                const rl = readline.createInterface({
                    input: fs.createReadStream('data/categories.json'),
                    crlfDelay: Infinity // wait for both \r and \n
                })
                rl.on('line', (line) => {
                    // need to be careful here. let's finish processing the line until we are done then move to the next line.
                    // otherwise, these are going to be intertwined so much so that we can't control
                    let lineJson = JSON.parse(line);
                    http.get(`${host}${lineJson.url}`, (res) => {
                        let newdata = '';
                        res.on('data', (chunk) => newdata += chunk);
                        res.on('end', () => {
                            let newdom = new JSDOM(data).window.document;
                            let newwriteStream = fs.createWriteStream('data/pages.txt', {flags: 'a'});
                            Array.from(newdom.getElementById('mw-content-text').getElementsByTagName('a')).map((elem, idx, elems) => {
                                if(RegExp('/wiki/Category*').test(elem)) {
                                    let urls = {
                                        category: lineJson.text,
                                        url: elem.href,
                                        text: elem.innerHTML
                                    };
                                    newwriteStream.write(`${JSON.stringify(urls)}\n`);
                                }
                            });
                        });
                    }).on('');
                });
            });
        });
    }).on('error', (e) => {
        console.error(`Got an error: ${e.message}`);
    });
});

