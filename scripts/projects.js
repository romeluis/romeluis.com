//Main function block to run after webpage has fully loaded
$(document).ready(function(){
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    const heroAnimation = document.getElementById("hero-animation");
    if (prefersDarkScheme.matches) {
        document.getElementById("css-selector").setAttribute("href", "../css/projects/projects-stylesheet-dark.css");
        document.getElementById("about-favicon").setAttribute("href", "../images/favicons/logo_pink_dark.ico");
        heroAnimation.load("https://raw.githubusercontent.com/romeluis/romeluis.github.io/website3.0/projects/projects-hero-dark.json");
    } else {
        document.getElementById("css-selector").setAttribute("href", "../css/projects/projects-stylesheet.css");
        heroAnimation.load("https://raw.githubusercontent.com/romeluis/romeluis.github.io/website3.0/projects/projects-hero.json");
    }
});