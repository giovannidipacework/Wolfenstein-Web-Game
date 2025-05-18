<?php
	require_once __DIR__ . "/dbConfig.php";
	session_start();
    include DIR_PHP . "sessionUtil.php";

    
    if (!isLogged()){
    	header('Location: ./index.php');
    	exit;
    }	
?>

<!-- 
game.php se passato al validatore HTML tramite HTML Extractor presenta molti errori, questo è dato dal fatto che il validatore
quando incontra doppie virgolette contenenti uno / interpreta come fosse un nuovo elemento HTML
Per passare questo file al validatore è necessario copiare il codice dai DevTools di Chrome (F12) e copiare premendo con il dedstro sull'elemento
<html> e poi "Copy->Copy Element", l'unico errore rimasto sarà l'assenza di un <!doctype> presente invece in cime al file
Questo avviene perchè a differenza dell'estrattore copiando da i DevTools le doppie virgolette vengono copiate come &quot;
 -->

<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8"> 
    	<meta name = "author" content = "PWEB">
    	<meta name = "keywords" content = "game">
   	 	<link rel="shortcut icon" type="image/x-icon" href="./css/img/favicon.ico" />
		<script src="./js/ajax/menu.js"></script>
		<script src="./js/ajax/scoreUpload.js"></script>
		<script src="./js/ajax/levelUpload.js"></script>
		<script src="./js/ajax/ajaxManager.js"></script>
		<script src="./js/ajax/levelLoader.js"></script>
		<script src="./js/vector.js"></script>
		<script src="./js/sound.js"></script>
		<script src="./js/player.js"></script>
		<script src="./js/wall.js"></script>
		<script src="./js/camera.js"></script>
		<script src="./js/sprite.js"></script>
		<script src="./js/setup.js"></script>
		<link rel="stylesheet" href="./css/style.css" type="text/css" media="screen">
		<link rel="stylesheet" href="./css/game.css" type="text/css" media="screen">
		<title>Wolfestein3D</title>

	</head>
	<body onload='start()'>
		

		<div id='navbar'>

			<div id="LevelSelect" onclick="if(walls.length>0){player.gameover('death'); }">
					<a href="#">Level Select</a>
			</div>

			<div id="map_creator" >
				<a href="./mapCreator.php">
						<span>Map Creator</span>
				</a>
			</div>

			<div>
				<span>Volume</span>
				<input id="vol-control" type="range" min="0" max="100" step="1" oninput="SetVolume(this.value)" onchange="SetVolume(this.value)"></input>
			</div>

			<div id="sign_out" >
				<a href="./php/logout.php">
						<span>Sign out</span>
				</a>
			</div>

		</div>


		<div id="game">
			<div id="menu"></div>

			<div id="playground" > </div>

			<div id="hud-conteiner">
				<div id="level" class="hud">
					<p>LEVEL</p>
					<p></p>
				</div>
				<div id="score" class="hud">
					<p>SCORE</p>
					<p></p>
				</div>
				<div id="lives" class="hud">
					<p>LIVES</p>
					<p></p>
				</div>
				<div id="player_face" class="hud" style=" background-image: url('./img/blaz.png'); background-repeat: no-repeat; background-size:300%; background-position:50% 0%;">
				</div>
				<div id="health" class="hud">
					<p>HEALTH</p>
					<p></p>
				</div>
				<div id="ammo" class="hud">
					<p>AMMO</p>
					<p></p>
				</div>
				<div id="key" class="hud">
					<div></div>
					<div></div>
				</div>
				<div id="weapon_slot" class="hud">
				</div>
			</div>
		</div>

	</body>
</html>