//https://www.w3schools.com/graphics/game_sound.asp
var max_volume =.5;

function sound(src) {

  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.style.display = "none";
  document.getElementById("game").appendChild(this.sound);

}

sound.prototype.play = function(volume) {

    if(volume==null)
      this.sound.volume=max_volume;
    else if(volume>max_volume)
      this.sound.volume=max_volume;
    else
      this.sound.volume=volume/100;

    this.sound.play();
};

sound.prototype.stop = function() {
    this.sound.pause();
};


sound.prototype.change = function(src){
  this.sound.src = src;
}

function SetVolume(value){
  var audio = document.getElementsByTagName('audio');
  max_volume = value/100;

  for (var i = audio.length - 1; i >= 0; i--) {
      audio[i].volume = max_volume;
  };

}