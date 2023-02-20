//Main function block to run after webpage has fully loaded
$(document).ready(function(){
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    const heroAnimation = document.getElementById("hero-animation");
    if (prefersDarkScheme.matches) {
        document.getElementById("css-selector").setAttribute("href", "../css/projects/projects-stylesheet-dark.css");
        document.getElementById("about-favicon").setAttribute("href", "../images/favicons/logo_pink_dark.ico");
        heroAnimation.load("https://lottie.host/9460ca1a-f8d1-469c-815f-1d660074615a/kWR4jOQDrO.json");
    } else {
        document.getElementById("css-selector").setAttribute("href", "../css/projects/projects-stylesheet.css");
        heroAnimation.load("https://lottie.host/9eb5c40c-68d8-4e54-8298-c7bdc7ab0298/1qPKeiJLm0.json");
    }
});