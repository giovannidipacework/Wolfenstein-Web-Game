<?php
	
	session_start();
	require_once __DIR__ . "/../../dbConfig.php";
	require_once DIR_PHP . "/dbManager.php";
	
	global $wolfDb;

	$query ="";
    $type = $_GET['type'];

    switch ($type){		
    	case 'delete':
			$creatorId = $_SESSION['userId'];
			$creatorId = $wolfDb->sqlInjectionFilter($creatorId);

			$mapId = $_GET['mapId'];
			$mapId = $wolfDb->sqlInjectionFilter($mapId);

			$real_creatorId = getCreatorId($mapId);
			if($real_creatorId != $creatorId)
				return;

			getMapId();
			
			$query = 'DELETE FROM map WHERE mapId= \'' . $mapId . '\'';
			
			
			$query = $wolfDb->performQuery($query);
			$wolfDb->closeConnection();

		break;
		case 'map':
			$creatorId = $_SESSION['userId'];
			$creatorId = $wolfDb->sqlInjectionFilter($creatorId);

			$title = $_GET['title'];
			$title = $wolfDb->sqlInjectionFilter($title);

			$query = 'INSERT INTO map (creatorId,title,released) VALUES (\'' . $creatorId . '\',\''  . $title . '\',CURRENT_TIMESTAMP())';

			
			$query = $wolfDb->performQuery($query);
			$wolfDb->closeConnection();

			getMapId();

		break;
		case 'wall':
			$x1 = $_GET['x1'];
			$x1 = $wolfDb->sqlInjectionFilter($x1);
			$y1 = $_GET['y1'];
			$y1 = $wolfDb->sqlInjectionFilter($y1);
			$x2 = $_GET['x2'];
			$x2 = $wolfDb->sqlInjectionFilter($x2);
			$y2 = $_GET['y2'];
			$y2 = $wolfDb->sqlInjectionFilter($y2);
			$texture = $_GET['texture'];
			$texture = $wolfDb->sqlInjectionFilter($texture);

			$mapId = $_SESSION['mapId'];

			$query = 'INSERT INTO wall VALUES ( \'' . $mapId .'\',\'' . $x1 . '\',\''  . $y1 . '\',\'' . $x2 . '\',\''  . $y2 . '\', \' '  . $texture . ' \',3,null,null,null,null)';
			
			
			$query = $wolfDb->performQuery($query);
			$wolfDb->closeConnection();

		break;
		case 'wall-interactable':
			$x1 = $_GET['x1'];
			$x1 = $wolfDb->sqlInjectionFilter($x1);

			$y1 = $_GET['y1'];
			$y1 = $wolfDb->sqlInjectionFilter($y1);

			$x2 = $_GET['x2'];
			$x2 = $wolfDb->sqlInjectionFilter($x2);

			$y2 = $_GET['y2'];
			$y2 = $wolfDb->sqlInjectionFilter($y2);

			$texture = $_GET['texture'];
			$texture = $wolfDb->sqlInjectionFilter($texture);

			$key = $_GET['key'];
			$key = $wolfDb->sqlInjectionFilter($key);

			$x12 = $_GET['x12'];
			$x12 = $wolfDb->sqlInjectionFilter($x12);

			$y12 = $_GET['y12'];
			$y12 = $wolfDb->sqlInjectionFilter($y12);

			$x22 = $_GET['x22'];
			$x22 = $wolfDb->sqlInjectionFilter($x22);

			$y22 = $_GET['y22'];
			$y22 = $wolfDb->sqlInjectionFilter($y22);

			$mapId = $_SESSION['mapId'];

			$query = 'INSERT INTO wall VALUES ( \'' . $mapId .'\',\'' . $x1 . '\',\''  . $y1 . '\',\'' . $x2 . '\',\''  . $y2 . '\', \''  . $texture . ' \',\''  . $key . '\',\''  . $x12 . '\',\''  . $y12 . '\',\''  . $x22 . '\',\' '  . $y22 . '\')';
			
			
			$query = $wolfDb->performQuery($query);
			$wolfDb->closeConnection();

		break;
		case 'sprite':

			$x = $_GET['x'];
			$x = $wolfDb->sqlInjectionFilter($x);
			$y = $_GET['y'];
			$y = $wolfDb->sqlInjectionFilter($y);
			$sprite_type = $_GET['sprite_type'];
			$sprite_type = $wolfDb->sqlInjectionFilter($sprite_type);
			$texture = $_GET['texture'];
			$texture = $wolfDb->sqlInjectionFilter($texture);

			$mapId = $_SESSION['mapId'];

			$query = 'INSERT INTO sprite VALUES ( \'' . $mapId .'\',\'' . $x . '\',\''  . $y . '\',\''  . $sprite_type . '\',\''  . $texture . '\')';
			
			
			$query = $wolfDb->performQuery($query);
			$wolfDb->closeConnection();

		break;
		case 'player':

			$x = $_GET['x'];
			$x = $wolfDb->sqlInjectionFilter($x);
			$y = $_GET['y'];
			$y = $wolfDb->sqlInjectionFilter($y);

			$mapId = $_SESSION['mapId'];

			$query = 'INSERT INTO player_spawn VALUES (\'' . $mapId .'\',\'' . $x . '\',\''  . $y . '\')';

			
			$query = $wolfDb->performQuery($query);
			$wolfDb->closeConnection();
		break;
	}
	
	echo json_encode($query);

	return;


	function getMapId(){
		global $wolfDb;

		$id = "";
		$id = 'SELECT mapId FROM map WHERE creatorId=\''  . $_SESSION['userId'] . '\' ORDER BY released DESC LIMIT 1';
		$id = $wolfDb->performQuery($id);


		$rows_id = array();
		while($r = mysqli_fetch_assoc($id)) {
	    	$rows_id[] = $r;
		}
		
		$_SESSION['mapId'] = $rows_id[0]['mapId'];
	}	

	function getCreatorId($mapId){
		global $wolfDb;
		$query = 'SELECT creatorId FROM map WHERE mapId=\''  . $mapId . '\' ORDER BY released DESC';
		$query = $wolfDb->performQuery($query);
		$wolfDb->closeConnection();

		$rows = array();
		while($r = mysqli_fetch_assoc($query)) {
		    $rows[] = $r;
		}


		$result = ($rows[0]['creatorId']);
		if($result==null)
			return 0;
		return $result;
	}
?>