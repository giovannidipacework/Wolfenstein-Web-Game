<?php
	require_once __DIR__ . "/../dbConfig.php";
    require_once DIR_PHP . "dbManager.php";
    require_once DIR_PHP . "sessionUtil.php";
 
	$username = $_POST['username'];
	$email = $_POST['email'];
	$password = $_POST['password'];
	
	$errorMessage = signin($username, $password,$email);
	if($errorMessage === null)
		header('location: ./../game.php');
	else
		header('location: ./../index.php?errorMessage=' . $errorMessage );


	function signin($username, $password,$email){   
		if ($username != null && $password != null && $email != null){
			$numRow = alreadyRegisterd($email);
    		if ($numRow == 0){
    			register($username, $password, $email);
    			$userId = authenticate($username, $password);
    			session_start();
    			setSession($username, $userId);
    			return ;
    		}else{
    			return 'Email already used';
    		}

    	} else
    		return 'You should insert something';
    	
    	return 'Username,mail or password not valid.';
	}
	
	function alreadyRegisterd ($email){   
		global $wolfDb;
		$email = $wolfDb->sqlInjectionFilter($email);

		$queryText = "select * from user where email='" . $email . "'";

		$result = $wolfDb->performQuery($queryText);
		$numRow = mysqli_num_rows($result);
		
		$wolfDb->closeConnection();
		return $numRow;
	}

	function register ($username, $password, $email){   
		global $wolfDb;
		$username = $wolfDb->sqlInjectionFilter($username);
		$password = $wolfDb->sqlInjectionFilter($password);
		$email = $wolfDb->sqlInjectionFilter($email);

		$queryText = 'INSERT INTO user (username,email,password) VALUES (\'' . $username . '\',\'' . $email . '\',\'' . $password . '\')';

		$result = $wolfDb->performQuery($queryText);
		
		$wolfDb->closeConnection();
		$queryText;
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