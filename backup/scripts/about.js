//Main function block to run after webpage has fully loaded
$(document).ready(function(){
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    if (prefersDarkScheme.matches) {
        document.getElementById("css-selector").setAttribute("href", "../css/about/about-stylesheet-dark.css");
        document.getElementById("about-favicon").setAttribute("href", "../images/favicons/logo_yellow_dark.ico");
    } else {
        document.getElementById("css-selector").setAttribute("href", "../css/about/about-stylesheet.css");
    }
});