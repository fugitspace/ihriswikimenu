(function(){
    if(window.hasRun) {
        return;
    }
    window.hasRun = true;


    /**
     * Need to insert this menu to the navigation panel
     * However, the page is broken and only one entry has an id.
     * Need to fix this before we can work on adding this menu
     */
    function insertMenu(){
        let div = document.createElement("");
        $('#p-tb').load(browser.extension.getURL("data/links.html")); //need to load jQuery here, otherwise, load template natively
    }
})();