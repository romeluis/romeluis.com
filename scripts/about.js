//Main function block to run after webpage has fully loaded
$(document).ready(function(){
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    if (prefersDarkScheme.matches) {
        document.getElementById("css-selector").setAttribute("href", "../css/about/about-stylesheet-dark.css");
    } else {
        document.getElementById("css-selector").setAttribute("href", "../css/about/about-stylesheet.css");
    }
});