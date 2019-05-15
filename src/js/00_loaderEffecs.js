/*Contains the code to load with the page and not in defer mode*/
function loadStyleSheet(src) {
    if (document.createStyleSheet) document.createStyleSheet(src);
    else {
        var stylesheet = document.createElement('link');
        stylesheet.href = src;
        stylesheet.rel = 'stylesheet';
        stylesheet.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(stylesheet);
    }
}
(function () {
    //load main css on page loaded
    loadStyleSheet("/dist/css/main.css");
})();