<?php
	
	session_start();
	require_once __DIR__ . "/../../dbConfig.php";
	require_once DIR_PHP . "/dbManager.php";
	
	global $wolfDb;

	$query ="";
    $score = $_GET['score'];
	$creatorId = $_SESSION['userId'];
	$mapId = $_SESSION['mapId'];

	$query = 'INSERT INTO user_score VALUES (\'' . $creatorId . '\',\''  . $mapId . '\',\''  . $score . '\') ON DUPLICATE KEY UPDATE score=\''  . $score . '\'';

	$query = $wolfDb->performQuery($query);
	$wolfDb->closeConnection();
	echo json_encode($query);

	return;


?>