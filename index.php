<?php
	session_start();
	require_once __DIR__ . "/dbConfig.php";
    include DIR_PHP . "sessionUtil.php";

    if (isLogged()){
		    header('Location: ./game.php');
		    exit;
    }	
?>
<!DOCTYPE html>
<html >
	<head>
		<meta charset="utf-8"> 
    	<meta name = "author" content = "PWEB">
    	<meta name = "keywords" content = "game">
   	 	<link rel="shortcut icon" type="image/x-icon" href="./css/img/favicon.ico" />
		<link rel="stylesheet" href="./css/style.css" type="text/css" media="screen">
		<link rel="stylesheet" href="./css/index.css" type="text/css" media="screen">
		<title>Login</title>
	</head>
	<body>
		<section id="sign_in_content">
			<div id="login_form">
				<form name="login" action="./php/login.php" method="post">
					<div id="username_login" class="form_field">
						<label>Username</label>
						<input type="text" placeholder="Username" name="username" size="20" required autofocus>
					</div>
					<div id="password_login" class="form_field">
						<label>Password</label>
						<input type="password" placeholder="Password" name="password" required>
					</div>	
					<input type="submit" value="Log In" class="form_field">
				</form>

				<br>

				<form name="signin" action="./php/signin.php" method="post">
					<div id="username_signin" class="form_field">
						<label>Username</label>
						<input type="text" placeholder="Username" name="username" required>
					</div>
					<div id="password_signin" class="form_field">
						<label>Password</label>
						<input type="password" placeholder="Password" name="password" required>
					</div>
					<div id="email_signin" class="form_field">
						<label>Email</label>
						<input type="email" placeholder="Email" name="email" required>
					</div>	
					<input type="submit" value="Sign In" class="form_field">
					<?php
						if (isset($_GET['errorMessage'])){
							echo '<div class="sign_in_error">';
							echo '<span>' . $_GET['errorMessage'] . '</span>';
							echo '</div>';
						}
					?>
				</form>

			</div>
		</section>
		<footer id="sign_in_footer">
			<div class="legal_form">
				<a href="./manuale.html" target="_blank">Manuale</a>
			</div>
		</footer>
	</body>
</html>
