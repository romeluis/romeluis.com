//Variables to keep track if videos have already been played
var projectPlayed = 0;
var aboutPlayed = 0;

//Main function block to run after webpage has fully loaded
$(document).ready(function(){

    // Lists pointing to changes & random number generator
    var cssList = ["css/home/home-stylesheet-green.css", "css/home/home-stylesheet-red.css", "css/home/home-stylesheet-yellow.css", "css/home/home-stylesheet-pink.css"];
    var projectsVideoList = ["videos/home-projects-red.mp4", "videos/home-projects-green.mp4", "videos/home-projects-green.mp4", "videos/home-projects-green.mp4"];
    var aboutVideoList = ["videos/home-about-pink.mp4", "videos/home-about-pink.mp4", "videos/home-about-red.mp4", "videos/home-about-red.mp4"];
    var projectsArrow = ["filter: invert(14%) sepia(75%) saturate(7467%) hue-rotate(346deg) brightness(94%) contrast(116%);", "filter: invert(70%) sepia(10%) saturate(2906%) hue-rotate(44deg) brightness(97%) contrast(83%);", "filter: invert(70%) sepia(10%) saturate(2906%) hue-rotate(44deg) brightness(97%) contrast(83%);", "filter: invert(70%) sepia(10%) saturate(2906%) hue-rotate(44deg) brightness(97%) contrast(83%);"];
    var aboutArrow = ["filter: invert(80%) sepia(16%) saturate(763%) hue-rotate(302deg) brightness(101%) contrast(105%);", "filter: invert(80%) sepia(16%) saturate(763%) hue-rotate(302deg) brightness(101%) contrast(105%);", "filter: invert(14%) sepia(75%) saturate(7467%) hue-rotate(346deg) brightness(94%) contrast(116%);", "filter: invert(14%) sepia(75%) saturate(7467%) hue-rotate(346deg) brightness(94%) contrast(116%);"];
    var footerArrow = ["invert(2%) sepia(15%) saturate(3681%) hue-rotate(347deg) brightness(94%) contrast(84%);", "invert(2%) sepia(15%) saturate(3681%) hue-rotate(347deg) brightness(94%) contrast(84%);", "images/white-arrow-right.sinvert(90%) sepia(20%) saturate(27%) hue-rotate(296deg) brightness(104%) contrast(99%);vg", "invert(2%) sepia(15%) saturate(3681%) hue-rotate(347deg) brightness(94%) contrast(84%);"];
    var rand = Math.floor(Math.random()*4);

    // Change Video src
    $("#css-selector").attr("href", cssList[rand]);
    document.getElementById("projects-video-source").setAttribute("src", projectsVideoList[rand]);
    document.getElementById("projects-video").load();
    document.getElementById("about-video-source").setAttribute("src", aboutVideoList[rand]);
    document.getElementById("about-video").load();
    //Change img src
    document.getElementById("projects-arrow").setAttribute("style", projectsArrow[rand]);
    document.getElementById("about-arrow").setAttribute("style", aboutArrow[rand]);
    document.getElementById("footer-arrow").setAttribute("style", footerArrow[rand]);
    
    //Check if videos are in frame on first load
    //Project Video
    $("#projects-video").each(function(){
        if (projectPlayed == 0) {
            if ($("#projects-video").is(":in-viewport")) {
            $("#projects-video")[0].play();
            projectPlayed = 1;
            }
        }
    });
//About Video
    $("#about-video").each(function(){
        if (aboutPlayed == 0) {
            if ($("#about-video").is(":in-viewport")) {
            $("#about-video")[0].play();
            aboutPlayed = 1;
            }
        }
    });
});

//Check if videos become visible on user scroll
//Projects Video
$(window).scroll(function() {
    $("#projects-video").each(function(){
        if (projectPlayed == 0) {
            if ($("#projects-video").is(":in-viewport")) {
            $("#projects-video")[0].play();
            projectPlayed = 1;
            }
        }
    });
});
//About Video
$(window).scroll(function() {
$				("#about-video").each(function(){
        if (aboutPlayed == 0) {
            if ($("#about-video").is(":in-viewport")) {
            $("#about-video")[0].play();
            aboutPlayed = 1;
            }
        }
    });
});