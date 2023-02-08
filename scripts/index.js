//Variables to keep track if videos have already been played
var projectPlayed = 0;
var aboutPlayed = 0;

//Main function block to run after webpage has fully loaded
$(document).ready(function(){

    // Lists pointing to changes & random number generator
    var cssList = ["css/home/home-stylesheet.css", "css/home/home-stylesheet.css", "css/home/home-stylesheet.css", "css/home/home-stylesheet.css"];
    var projectsVideoList = ["videos/home-projects-red.mp4", "videos/home-projects-green.mp4", "videos/home-projects-green.mp4", "videos/home-projects-green.mp4"];
    var aboutVideoList = ["videos/home-about-pink.mp4", "videos/home-about-pink.mp4", "videos/home-about-red.mp4", "videos/home-about-red.mp4"];
    var projectsArrow = ["images/red-arrow-right.svg", "images/green-arrow-right.svg", "images/green-arrow-right.svg", "images/green-arrow-right.svg"];
    var aboutArrow = ["images/pink-arrow-right.svg", "images/pink-arrow-right.svg", "images/red-arrow-right.svg", "images/red-arrow-right.svg"];
    var footerArrow = ["images/black-arrow-right.svg", "images/black-arrow-right.svg", "images/white-arrow-right.svg", "images/black-arrow-right.svg"];
    var rand = Math.floor(Math.random()*4);

    // Change Video src
    $("#css-selector").attr("href", cssList[rand]);
    document.getElementById("projects-video-source").setAttribute("src", projectsVideoList[rand]);
    document.getElementById("projects-video").load();
    document.getElementById("about-video-source").setAttribute("src", aboutVideoList[rand]);
    document.getElementById("about-video").load();
    //Change img src
    document.getElementById("projects-arrow").setAttribute("src", projectsArrow[rand]);
    document.getElementById("about-arrow").setAttribute("src", aboutArrow[rand]);
    document.getElementById("footer-arrow").setAttribute("src", footerArrow[rand]);
    
    //Check if videos are in frame on first load
    //Project Video
$				("#projects-video").each(function(){
        if (projectPlayed == 0) {
            if ($("#projects-video").is(":in-viewport")) {
            $("#projects-video")[0].play();
            projectPlayed = 1;
            }
        }
    });
//About Video
$				("#about-video").each(function(){
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