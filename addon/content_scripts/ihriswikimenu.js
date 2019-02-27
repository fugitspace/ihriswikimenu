(function(){
    
    function onError(error){
        console.log(`Error: ${error}`);
    }
    
    function notify(tabid, message){
        browser.tabs.sendMessage(
            tabid, {msg: message}
        ).then( () => {
        }).catch(browser.window.alert(`Can't open URL`));
    }
    
    function openTab(url){
        console.log(`The url is ${url}`);
        browser.tabs.create({url: url}).then(() => {}, (error) => {
            window.alert(`Can't open URL ${url} because ${error}`);
        });
    }

    browser.runtime.onMessage.addListener((msg) => {
        console.log(`Content script loaded`);
        if(msg.url) {
            openTab(msg.url);
        }
    });

})();