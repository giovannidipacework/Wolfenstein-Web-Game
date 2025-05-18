<?php
	
	session_start();
	require_once __DIR__ . "/../../dbConfig.php";
	require_once DIR_PHP . "/dbManager.php";
	
	global $wolfDb;

	$query ="";
	$creatorId = $_SESSION['userId'];

	$query = 'SELECT map.mapId,map.title,map.released,user.username,user_score.score,max_score.max, if(map.creatorId = \'' . $creatorId . '\' ,true,false) as can_delete'
			. ' FROM map'
			. ' INNER JOIN user on(map.creatorId=user.userId)'
			. ' LEFT OUTER JOIN user_score on (map.mapId=user_score.mapId and user_score.userId= \'' . $creatorId . '\')'
			. ' LEFT OUTER JOIN (select mapId,max(score) as max from user_score group by mapId) as max_score on (map.mapId=max_score.mapId)';

	$query = $wolfDb->performQuery($query);
	$wolfDb->closeConnection();

	$rows = array();
	while($r = mysqli_fetch_assoc($query)) {
    	$rows[] = $r;
	}

	echo json_encode($rows);

	return;
?>