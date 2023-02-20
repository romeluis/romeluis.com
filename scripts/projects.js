//Main function block to run after webpage has fully loaded
$(document).ready(function(){
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    const heroAnimation = document.getElementById("hero-animation");
    if (prefersDarkScheme.matches) {
        document.getElementById("css-selector").setAttribute("href", "../css/projects/projects-stylesheet-dark.css");
        document.getElementById("about-favicon").setAttribute("href", "../images/favicons/logo_pink_dark.ico");
        heroAnimation.load("https://lottie.host/1f0f860b-5369-4696-b5cb-29ea2c7fe0f6/abuM073MDi.json");
    } else {
        document.getElementById("css-selector").setAttribute("href", "../css/projects/projects-stylesheet.css");
        heroAnimation.load("https://lottie.host/a9a8ee1a-992d-46c1-b85c-6b5196e4de88/cdqtmLu0r5.json");
    }
});