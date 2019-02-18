(function(){
    /**
     * do not re-inject the script
     */
    document.body.style.border = "5px solid red";
    document.getElementById('p-tb').innerText = "Soko la Wakulima";
    if(window.hasRun) {
        return;
    }
    window.hasRun = true;

    function insertMenu(){
        let div = document.createElement("");
        $('#p-tb').load(browser.extension.getURL("data/links.html")); //need to load jQuery here, otherwise, load template natively
    }
    insertMenu();
})();