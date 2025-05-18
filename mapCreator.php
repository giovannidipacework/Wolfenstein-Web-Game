<?php
	require_once __DIR__ . "/dbConfig.php";
	session_start();
    include DIR_PHP . "sessionUtil.php";

    
    if (!isLogged()){
    	header('Location: ./index.php');
    	exit;
    }	
?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8"> 
    	<meta name = "author" content = "PWEB">
    	<meta name = "keywords" content = "game">
   	 	<link rel="shortcut icon" type="image/x-icon" href="./css/img/favicon.ico" />
		<script src="./js/vector.js"></script>
		<script src="./js/sound.js"></script>
		<script src="./js/map.js"></script>
		<script src="./js/ajax/ajaxManager.js"></script>
		<script src="./js/ajax/levelUpload.js"></script>
		<script src="./js/ajax/levelLoader.js"></script>
		<script src="./js/ajax/menu.js"></script>
		<script src="./js/wall.js"></script>
		<script src="./js/player.js"></script>
		<script src="./js/sprite.js"></script>
		<link rel="stylesheet" href="./css/mapCreator.css" type="text/css" media="screen">
		<link rel="stylesheet" href="./css/style.css" type="text/css" media="screen">
		<title>Map</title>

	</head>		

	<?php
		$exist = isset($_GET['mapId']);
		if($exist)
			$mapId = $_GET['mapId'];
		else
			$mapId ='null';

		echo '<body onload=StartMap(\'' . $mapId . '\')>';
	?>

		<div class='navbar'>

			<div id="game_link" >
				<a href="./game.php">
						<span>Game</span>
				</a>
			</div>

			<div id="sign_out" >
				<a href="./php/logout.php">
						<span>Sign out</span>
				</a>
			</div>
		</div>


		<div class="navbar">
			<div>
				<span onclick="Set('player')">Player</span>
			</div>

			<div>
				<span onclick="Set('enemy')">Enemy</span>
			</div>

			<div class="dropdown">
				<span>Wall</span>
				<div id="wall" class="dropdown-content">
					<div onClick=Set('interactive',0,2)><span>Interact</span></div>
					<div onClick=Set('interactive',0,0)><span>Interact Key1</span></div>
					<div onClick=Set('interactive',0,1)><span>Interact Key2</span></div>
				</div>

			</div>

			<div class="dropdown">
				<span>Prop</span>
				<div id="prop" class="dropdown-content">
				</div>
			</div>

			<div class="dropdown">
				<span>Pickup</span>
				<div id="pickup" class="dropdown-content">
				</div>
			</div>

			<div>
				<span onclick="Set('delete')">Delete</span>
			</div>

			<div>
				<input type="text" placeholder="title" id="title">
				<input type="button" value="SaveMap" onclick="Upload()">
			</div>

		</div>

		<div id='game'></div>
		<canvas id="minimap" width=700 height=700>
		</canvas>


	</body>
</html>