const http = require('https');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');
const readline = require('readline');

const host = 'https://wiki.ihris.org'; 
//read all categories

http.get(`${host}/mediawiki/index.php?title=Special:Categories&offset=&limit=500`, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        let dom = new JSDOM(data).window.document;
        let writeStream = fs.createWriteStream('data/categories.txt', {flags: 'a'});
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
                input: fs.createReadStream('data/categories.txt'),
                crlfDelay: Infinity // wait for both \r and \n
            });
            rl.on('line', (line) => {
                // need to be careful here. let's finish processing the line until we are done then move to the next line.
                // otherwise, these are going to be intertwined so much so that we can't control
                let lineJson = JSON.parse(line);
                http.get(`${host}${lineJson.url}`, (res) => {
                    let newdata = '';
                    res.on('data', (chunk) => newdata += chunk);
                    res.on('end', () => {
                        let newdom = new JSDOM(newdata).window.document;
                        let newwriteStream = fs.createWriteStream('data/pages.txt', {flags: 'a'});
                        let links_div = newdom.getElementById('mw-pages');
                        links_div =  links_div ? links_div : newdom.getElementById('mw-content-text'); 
                        Array.from(links_div.getElementsByTagName('a')).map((newelem) => {
                            if(!RegExp('/wiki/Category*').test(newelem)) {
                                let urls = {
                                    category: lineJson.text,
                                    url: newelem.href,
                                    text: newelem.innerHTML
                                };
                                newwriteStream.write(`${JSON.stringify(urls)}\n`);
                            }
                        });
                    });
                }).on('error', () => console.log(`Error: ${e.message}`));
            });
        });
    });
}).on('error', (e) => {
    console.error(`Got an error: ${e.message}`);
});
