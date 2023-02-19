//Variables to keep track if videos have already been played
var projectPlayed = 0;
var aboutPlayed = 0;

//Main function block to run after webpage has fully loaded
$(document).ready(function(){
    // Lists pointing to changes & random number generator
    var cssList = ["css/home/home-stylesheet-green.css", "css/home/home-stylesheet-red.css", "css/home/home-stylesheet-yellow.css", "css/home/home-stylesheet-pink.css","css/home/home-stylesheet-green-dark.css", "css/home/home-stylesheet-red-dark.css", "css/home/home-stylesheet-yellow-dark.css", "css/home/home-stylesheet-pink-dark.css"];
    var faviconList = ["images/favicons/logo_green.ico", "images/favicons/logo_red.ico", "images/favicons/logo_yellow.ico", "images/favicons/logo_pink.ico", "images/favicons/logo_green_dark.ico", "images/favicons/logo_red_dark.ico", "images/favicons/logo_yellow_dark.ico", "images/favicons/logo_pink_dark.ico"];
    var projectsVideoList = ["https://lottie.host/542d74f6-6563-4220-8c81-00a9a42bdf73/fwwj9vGrwp.json", "https://lottie.host/5abc9adb-ba9e-4f8e-b54f-18232343224e/zn7QUcRIRu.json", "https://lottie.host/5abc9adb-ba9e-4f8e-b54f-18232343224e/zn7QUcRIRu.json", "https://lottie.host/5abc9adb-ba9e-4f8e-b54f-18232343224e/zn7QUcRIRu.json"];
    var aboutVideoList = ["https://lottie.host/8203ae98-026c-4c74-802f-cd64199eddd0/fp6OsQRvrI.json", "https://lottie.host/8203ae98-026c-4c74-802f-cd64199eddd0/fp6OsQRvrI.json", "https://lottie.host/2bc4c196-f54f-4e7b-a5ad-4918e03a2c74/goaZndotZv.json", "https://lottie.host/2bc4c196-f54f-4e7b-a5ad-4918e03a2c74/goaZndotZv.json"];
    var projectsArrow = ["filter: invert(14%) sepia(75%) saturate(7467%) hue-rotate(346deg) brightness(94%) contrast(116%);", "filter: invert(70%) sepia(10%) saturate(2906%) hue-rotate(44deg) brightness(97%) contrast(83%);", "filter: invert(70%) sepia(10%) saturate(2906%) hue-rotate(44deg) brightness(97%) contrast(83%);", "filter: invert(70%) sepia(10%) saturate(2906%) hue-rotate(44deg) brightness(97%) contrast(83%);", "filter: invert(97%) sepia(30%) saturate(154%) hue-rotate(286deg) brightness(100%) contrast(98%);", "filter: invert(97%) sepia(30%) saturate(154%) hue-rotate(286deg) brightness(100%) contrast(98%);", "filter: invert(97%) sepia(30%) saturate(154%) hue-rotate(286deg) brightness(100%) contrast(98%);", "filter: invert(97%) sepia(30%) saturate(154%) hue-rotate(286deg) brightness(100%) contrast(98%);"];
    var aboutArrow = ["filter: invert(80%) sepia(16%) saturate(763%) hue-rotate(302deg) brightness(101%) contrast(105%);", "filter: invert(80%) sepia(16%) saturate(763%) hue-rotate(302deg) brightness(101%) contrast(105%);", "filter: invert(14%) sepia(75%) saturate(7467%) hue-rotate(346deg) brightness(94%) contrast(116%);", "filter: invert(14%) sepia(75%) saturate(7467%) hue-rotate(346deg) brightness(94%) contrast(116%);", "filter: invert(97%) sepia(30%) saturate(154%) hue-rotate(286deg) brightness(100%) contrast(98%);", "filter: invert(97%) sepia(30%) saturate(154%) hue-rotate(286deg) brightness(100%) contrast(98%);", "filter: invert(97%) sepia(30%) saturate(154%) hue-rotate(286deg) brightness(100%) contrast(98%);", "filter: invert(97%) sepia(30%) saturate(154%) hue-rotate(286deg) brightness(100%) contrast(98%);"];
    var footerArrow = ["invert(2%) sepia(15%) saturate(3681%) hue-rotate(347deg) brightness(94%) contrast(84%);", "invert(2%) sepia(15%) saturate(3681%) hue-rotate(347deg) brightness(94%) contrast(84%);", "images/white-arrow-right.sinvert(90%) sepia(20%) saturate(27%) hue-rotate(296deg) brightness(104%) contrast(99%);vg", "invert(2%) sepia(15%) saturate(3681%) hue-rotate(347deg) brightness(94%) contrast(84%);"];
    var rand = Math.floor(Math.random()*4);

    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    const heroAnimation = document.getElementById("hero-animation");
    const projectsAnimation = document.getElementById("projects-animation");
    const aboutAnimation = document.getElementById("about-animation");
    
    if (prefersDarkScheme.matches) {
        $("#css-selector").attr("href", cssList[rand+4]);
        heroAnimation.load("https://lottie.host/13ca4d99-d8fc-48e8-ae57-deeea01bb7a0/chlRqhOqFk.json");
        document.getElementById("hero-arrow").setAttribute("src", "images/arrow-down-dark.svg");
        document.getElementById("index-favicon").setAttribute("href", faviconList[rand+4]);
        projectsAnimation.load(projectsVideoList[rand]);
        aboutAnimation.load(aboutVideoList[rand]);
        document.getElementById("projects-arrow").setAttribute("style", projectsArrow[rand+4]);
        document.getElementById("about-arrow").setAttribute("style", aboutArrow[rand+4]);
        document.getElementById("footer-arrow").setAttribute("style", footerArrow[rand]);
    } else {
        //Set light theme
        $("#css-selector").attr("href", cssList[rand]);
        heroAnimation.load("https://lottie.host/4ae71f1e-f32e-4a1e-af33-34799cab7e3a/TkdN71r9RV.json");
        document.getElementById("index-favicon").setAttribute("href", faviconList[rand]);
        projectsAnimation.load(projectsVideoList[rand]);
        aboutAnimation.load(aboutVideoList[rand]);
        document.getElementById("projects-arrow").setAttribute("style", projectsArrow[rand]);
        document.getElementById("about-arrow").setAttribute("style", aboutArrow[rand]);
        document.getElementById("footer-arrow").setAttribute("style", footerArrow[rand]);
    }
    
    //About Video
    $("#about-animation").each(function(){
            if (aboutPlayed == 0) {
                if ($("#about-animation").is(":in-viewport")) {
                $("#about-video")[0].play();
                aboutPlayed = 1;
                }
            }
        });

    //Projects animation
    $("#projects-animation").each(function(){
        if (projectPlayed == 0) {
            if ($("#projects-animation").is(":in-viewport")) {
                aboutAnimation.play();
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
            if ($("#about-animation").is(":in-viewport")) {
                aboutAnimation.play();
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
            if ($("#projects-animation").is(":in-viewport")) {
                projectsAnimation.play();
                projectPlayed = 1;
            }
        }
    });
});


