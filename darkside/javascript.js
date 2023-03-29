const audio = new Audio("yamate-kudesai.mp3");
document.getElementById("b1").addEventListener("click" , function(){
audio.play();
audio.addEventListener("play", function() {
  b1.style.display = "none";
});

audio.addEventListener("pause", function() {
  b1.style.display = "block";
});
});
