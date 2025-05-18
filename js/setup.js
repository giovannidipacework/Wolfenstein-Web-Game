var player;
var walls = new Array();
var sprites = new Array();
var camera;
var music;


var FRAME_COUNT=0;
var FRAME_PER_SECOND = 60;
var SCREEN_HEIGHT = 720;
var SCREEN_WIDTH = 1280;
var gameTimer;


function start(){
	
	player = new Player(0,0);

	camera = new Camera(document.getElementById('playground'));
	camera.setup(player);

	document.getElementById("game").style.width = SCREEN_WIDTH + "px";

	document.getElementById("menu").style.height = SCREEN_HEIGHT+ SCREEN_HEIGHT/4.55 + "px";
	document.getElementById("menu").style.width = SCREEN_WIDTH + "px";
	
	document.getElementById("playground").style.height = SCREEN_HEIGHT + "px";
	document.getElementById("playground").style.width = SCREEN_WIDTH + "px";

	window.addEventListener('keydown', player.controls ,false);
	window.addEventListener('keyup', player.controls ,false);

	document.getElementById("hud-conteiner").style.width = SCREEN_WIDTH + "px";
	document.getElementById("hud-conteiner").style.height = SCREEN_HEIGHT/4.55 + "px";

	levelList();


}


function clockFuction(){
	FRAME_COUNT++;

	if(FRAME_COUNT == 1){
		music = new sound("sounds/GetThemBeforeTheyGetYou.ogg");
		music.stop();
		music.play();
	}


	player.update(walls);

	for (var i = sprites.length - 1; i >= 0 && FRAME_COUNT%(5)==0; i--) {
		sprites[i].update(player, FRAME_COUNT);
	};

	camera.update(player,walls,sprites, FRAME_COUNT);

}
