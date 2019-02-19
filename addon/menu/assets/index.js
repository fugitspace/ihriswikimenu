function search(){
    //for this to work you currently need to disable csp in about:config.
    //this should not go into production security.csp.enable, security.csp.enableStrictDynamic
    const qry = document.getElementById('search_input');
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
}