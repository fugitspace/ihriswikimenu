(function(){
    /**
     * do not re-inject the script
     */
    if(window.hasRun) {
        return;
    }
    window.hasRun = true;

    function insertMenu(){
        let div = document.createElement("");
        $('#p-tb').load(browser.extension.getURL("data/links.html"));
    }
    insertMenu();
})();