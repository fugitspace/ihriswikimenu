function search(){
    const qry = document.getElementById('search_input');
    qry.addEventListener('keyup', () => {
        const needle = qry.value.toUpperCase();
        const li = document.getElementsByTagName('a');
        
        for( i = 0; i < li.length; i++){
            const aTag = li[i];
            const anchorTxt = aTag.textContent || aTag.innerText;
            if(anchorTxt.toUpperCase().indexOf(needle) === -1) {
                aTag.style.display = "none"; //hide
                found_match = false;
            } else {
                aTag.style.display = "";
                found_match = true;
            }
        }
    });
    qry.focus(); //set focus on the search bar
}

function onError(error){
    console.log(`Error: ${error.message}`);
}

function openURL(){
    document.body.addEventListener('click', (event) => {
        if(event.target.localName === 'a' && event.target.href){
            sendMessage(event.target.href);
        } else if(event.target.localName === 'a' && !event.target.href){
            sendMessage('https://wiki.ihris.org/wiki/CapacityPlus%27s_iHRIS_Suite');
        };
    });
}

function sendMessage(url) {
    browser.tabs.query({active:true, currentWindow: true})
        .then((tabs) => {
            browser.tabs.sendMessage(tabs[0].id, {url: url})
            .then(()=>console.log(`Message successfully sent`))
            .catch(onError);
        })
        .catch(error => console.error(`${error.message}`));
}

browser.tabs.executeScript({file: "/browser-polyfill.js"}).then(()=>console.log('nothing really')).catch(onError);
browser.tabs.executeScript({file: '/content_scripts/ihriswikimenu.js'})
    .then(search)
    .then(openURL)
    .catch(onError);