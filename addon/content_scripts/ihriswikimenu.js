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
    
    browser.runtime.onMessage.addListener((msg) => {
        if(msg.url) {
            browser.tabs.create({url: url}).then(() => {}, (error) => {
                window.alert(`Can't open URL ${url} because ${error}`);
            });
        }
    });

})();