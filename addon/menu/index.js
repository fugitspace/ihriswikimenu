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
            } else {
                aTag.style.display = "";
            }
        }
        
    });
}

function reportExecuteError(error){
    console.error(`Failed to execute script: ${error.message}`);
}

browser.tabs.executeScript({file: '/content_scripts/ihriswikimenu.js'})
    .then(search)
    .catch(reportExecuteError);