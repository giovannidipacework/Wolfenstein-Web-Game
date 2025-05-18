<?php
	require_once __DIR__ . "/../dbConfig.php";
    require_once DIR_PHP . "dbManager.php";
    require_once DIR_PHP . "sessionUtil.php";
 
	$username = $_POST['username'];
	$password = $_POST['password'];
	
	$errorMessage = login($username, $password);
	if($errorMessage === null)
		header('location: ./../game.php');
	else
		header('location: ./../index.php?errorMessage=' . $errorMessage );


	function login($username, $password){   
		if ($username != null && $password != null){
			$userId = authenticate($username, $password);
    		if ($userId > 0){
    			session_start();
    			setSession($username, $userId);
    			return null;
    		}

    	} else
    		return 'You should insert something';
    	
    	return 'Username and password not valid.';
	}
	
	function authenticate ($username, $password){   
		global $wolfDb;
		$username = $wolfDb->sqlInjectionFilter($username);
		$password = $wolfDb->sqlInjectionFilter($password);

		$queryText = "select * from user where username='" . $username . "' AND password='" . $password . "'";

		$result = $wolfDb->performQuery($queryText);
		$numRow = mysqli_num_rows($result);
		if ($numRow != 1)
			return -1;
		
		$wolfDb->closeConnection();
		$userRow = $result->fetch_assoc();
		$wolfDb->closeConnection();
		return $userRow['userId'];
	}

?>