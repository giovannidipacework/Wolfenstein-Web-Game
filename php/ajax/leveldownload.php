<?php
	
	session_start();
	require_once __DIR__ . "/../../dbConfig.php";
	require_once DIR_PHP . "/dbManager.php";
	
	global $wolfDb;


	$search = $_GET['search'];
	$search = $wolfDb->sqlInjectionFilter($search);

	//GET MAP ID-----------------------------------------------
	$id = "";
	$id = 'SELECT mapId FROM MAP WHERE mapId ="' . $search . '" LIMIT 1';
	$id = $wolfDb->performQuery($id);


	$rows_id = array();
	while($r = mysqli_fetch_assoc($id)) {
    	$rows_id[] = $r;
	}
	
	$_SESSION['mapId'] = $rows_id[0]['mapId'];
    //----------------------------------------------------------


    //GET MAP TITLE-----------------------------------------------
	$title = "";
	$title = 'SELECT title FROM MAP WHERE mapId =  \' ' . $rows_id[0]['mapId'] . ' \' LIMIT 1';
	$title = $wolfDb->performQuery($title);

	$rows_title = array();
	while($r = mysqli_fetch_assoc($title)) {
    	$rows_title[] = $r;
	}
    //----------------------------------------------------------


    //GET WALLS-------------------------------------------------
	$walls = "";
	$walls = 'SELECT * FROM WALL WHERE mapId =  \' ' . $rows_id[0]['mapId'] . ' \' ';
	$walls = $wolfDb->performQuery($walls);

	$rows_walls = array();
	while($r = mysqli_fetch_assoc($walls)) {
    	$rows_walls[] = $r;
	}
    //----------------------------------------------------------


    //GET SPRITES-----------------------------------------------
	$sprites = "";
	$sprites = 'SELECT * FROM SPRITE WHERE mapId =  \' ' . $rows_id[0]['mapId']  . ' \' ';
	$sprites = $wolfDb->performQuery($sprites);

	$rows_sprites = array();
	while($r = mysqli_fetch_assoc($sprites)) {
    	$rows_sprites[] = $r;
	}
    //----------------------------------------------------------


    //GET PLAYER SPAWN-----------------------------------------------
	$player_spawn = "";
	$player_spawn = 'SELECT * FROM player_spawn WHERE mapId =  \' ' . $rows_id[0]['mapId']  . ' \' ';
	$player_spawn = $wolfDb->performQuery($player_spawn);

	$rows_player_spawn = array();
	while($r = mysqli_fetch_assoc($player_spawn)) {
    	$rows_player_spawn[] = $r;
	}
    //----------------------------------------------------------

	$_SESSION['mapId'] = $rows_id[0]['mapId'];

	$wolfDb->closeConnection();

	$data = array();

	$data['title'] = $rows_title;
	$data['walls'] = $rows_walls;
	$data['sprites'] = $rows_sprites;
	$data['player_spawn'] = $rows_player_spawn;


	echo json_encode($data);

	return;
?>