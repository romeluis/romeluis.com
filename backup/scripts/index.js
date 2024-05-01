//Variables to keep track if videos have already been played
var projectPlayed = 0;
var aboutPlayed = 0;

//Main function block to run after webpage has fully loaded
$(document).ready(function(){
    // Lists pointing to changes & random number generator
    var cssList = ["css/home/home-stylesheet-green.css", "css/home/home-stylesheet-red.css", "css/home/home-stylesheet-yellow.css", "css/home/home-stylesheet-pink.css","css/home/home-stylesheet-green-dark.css", "css/home/home-stylesheet-red-dark.css", "css/home/home-stylesheet-yellow-dark.css", "css/home/home-stylesheet-pink-dark.css"];
    var faviconList = ["images/favicons/logo_green.ico", "images/favicons/logo_red.ico", "images/favicons/logo_yellow.ico", "images/favicons/logo_pink.ico", "images/favicons/logo_green_dark.ico", "images/favicons/logo_red_dark.ico", "images/favicons/logo_yellow_dark.ico", "images/favicons/logo_pink_dark.ico"];
    var projectsVideoList = ["https://raw.githubusercontent.com/romeluis/romeluis.github.io/website3.0/projects_animation_red.json", "https://raw.githubusercontent.com/romeluis/romeluis.github.io/website3.0/projects_animation_green.json", "https://raw.githubusercontent.com/romeluis/romeluis.github.io/website3.0/projects_animation_green.json", "https://raw.githubusercontent.com/romeluis/romeluis.github.io/website3.0/projects_animation_green.json"];
    var aboutVideoList = ["https://raw.githubusercontent.com/romeluis/romeluis.github.io/website3.0/about-animation-pink.json", "https://raw.githubusercontent.com/romeluis/romeluis.github.io/website3.0/about-animation-pink.json", "https://raw.githubusercontent.com/romeluis/romeluis.github.io/website3.0/about-animation-red.json", "https://raw.githubusercontent.com/romeluis/romeluis.github.io/website3.0/about-animation-pink.json"];
    var projectsArrow = ["filter: invert(14%) sepia(75%) saturate(7467%) hue-rotate(346deg) brightness(94%) contrast(116%);", "filter: invert(70%) sepia(10%) saturate(2906%) hue-rotate(44deg) brightness(97%) contrast(83%);", "filter: invert(70%) sepia(10%) saturate(2906%) hue-rotate(44deg) brightness(97%) contrast(83%);", "filter: invert(70%) sepia(10%) saturate(2906%) hue-rotate(44deg) brightness(97%) contrast(83%);", "filter: invert(97%) sepia(30%) saturate(154%) hue-rotate(286deg) brightness(100%) contrast(98%);", "filter: invert(97%) sepia(30%) saturate(154%) hue-rotate(286deg) brightness(100%) contrast(98%);", "filter: invert(97%) sepia(30%) saturate(154%) hue-rotate(286deg) brightness(100%) contrast(98%);", "filter: invert(97%) sepia(30%) saturate(154%) hue-rotate(286deg) brightness(100%) contrast(98%);"];
    var aboutArrow = ["filter: invert(80%) sepia(16%) saturate(763%) hue-rotate(302deg) brightness(101%) contrast(105%);", "filter: invert(80%) sepia(16%) saturate(763%) hue-rotate(302deg) brightness(101%) contrast(105%);", "filter: invert(14%) sepia(75%) saturate(7467%) hue-rotate(346deg) brightness(94%) contrast(116%);", "filter: invert(14%) sepia(75%) saturate(7467%) hue-rotate(346deg) brightness(94%) contrast(116%);", "filter: invert(97%) sepia(30%) saturate(154%) hue-rotate(286deg) brightness(100%) contrast(98%);", "filter: invert(97%) sepia(30%) saturate(154%) hue-rotate(286deg) brightness(100%) contrast(98%);", "filter: invert(97%) sepia(30%) saturate(154%) hue-rotate(286deg) brightness(100%) contrast(98%);", "filter: invert(97%) sepia(30%) saturate(154%) hue-rotate(286deg) brightness(100%) contrast(98%);"];
    var rand = Math.floor(Math.random()*4);

    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    const heroAnimation = document.getElementById("hero-animation");
    const projectsAnimation = document.getElementById("projects-animation");
    const aboutAnimation = document.getElementById("about-animation");
    
    if (prefersDarkScheme.matches) {
        $("#css-selector").attr("href", cssList[rand+4]);
        heroAnimation.load("https://raw.githubusercontent.com/romeluis/romeluis.github.io/website3.0/hero_message_dark.json");
        document.getElementById("hero-arrow").setAttribute("src", "images/arrow-down-dark.svg");
        document.getElementById("index-favicon").setAttribute("href", faviconList[rand+4]);
        document.getElementById("projects-arrow").setAttribute("style", projectsArrow[rand+4]);
        document.getElementById("about-arrow").setAttribute("style", aboutArrow[rand+4]);
    } else {
        //Set light theme
        $("#css-selector").attr("href", cssList[rand]);
        heroAnimation.load("https://raw.githubusercontent.com/romeluis/romeluis.github.io/website3.0/hero_message.json");
        document.getElementById("index-favicon").setAttribute("href", faviconList[rand]);
        document.getElementById("projects-arrow").setAttribute("style", projectsArrow[rand]);
        document.getElementById("about-arrow").setAttribute("style", aboutArrow[rand]);
    }

    projectsAnimation.load(projectsVideoList[rand]);
    aboutAnimation.load(aboutVideoList[rand]);
    
    //About Video
    $("#about-animation").each(function(){
        if (aboutPlayed == 0) {
            if ($("#about-animation").is(":in-viewport(600)")) {
                aboutAnimation.play();
                console.log("played abou");
                aboutPlayed = 1;
            }
        }
    });

    //Projects animation
    $("#projects-animation").each(function(){
        if (projectPlayed == 0) {
            if ($("#projects-animation").is(":in-viewport(600)")) {
                projectsAnimation.play();
                console.log("played proj");
                projectPlayed = 1;
            }
        }
    });
});

//About Video
$(window).scroll(function() {
    $("#about-animation").each(function(){
        const aboutAnimation = document.getElementById("about-animation");
        if (aboutPlayed == 0) {
            if ($("#about-animation").is(":in-viewport(600)")) {
                aboutAnimation.play();
                console.log("played abou");
                aboutPlayed = 1;
            }
        }
    });
});

//Project animation
$(window).scroll(function() {
    $("#projects-animation").each(function(){
        const projectsAnimation = document.getElementById("projects-animation");
        if (projectPlayed == 0) {
            if ($("#projects-animation").is(":in-viewport(600)")) {
                projectsAnimation.play();
                console.log("played proj");
                projectPlayed = 1;
            }
        }
    });
});


