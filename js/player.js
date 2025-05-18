function Player(x,y){
	this.position = new Vector(x,y);

	this.health = 100;
	this.ammo = 10;
	this.score = 0;
	this.lives = 3;
	this.keys = [null,null];


	this.weapon = 'pistol';
	this.firerate;
	this.range;
	this.weapon_sound = new sound("sounds/" + this.weapon + ".wav");

	this.step_of_rotation = 4;
	this.step_of_movement = 1.5;
	this.direction = new Vector(1,0);
	this.movement = new Vector(0,0);

	this.fov = 45;
	this.number_of_rays = 180;

	this.rays;

	this.up= false; this.down= false; this.left= false; this.right= false;
	this.turnLeft= false; this.turnRight= false;
	this.interact = false;
	this.shoot= false;

	this.img = new Image();
	this.img.src = "img/player.png";
	this.shift = 0;

}



Player.prototype.controls = function(ev){
	//console.log(ev);
	var key = ev.key;
	var type = ev.type;


	if(type == "keydown"){
		switch(key){
			case 'w':
				player.up = true;
				break;
			case 's':
				player.down = true;
				break;
			case 'a':
				player.left = true;
				break;
			case 'd':
				player.right = true;
				break;
			case 'e':
				player.interact = true;
				break;
			case 'ArrowLeft':
				player.turnRight = true;
				break;
			case 'ArrowRight':
				player.turnLeft = true;
				break;
			case 'ArrowUp':
				player.shoot = true;
				break;
		}
	}

	if(type == "keyup"){
		switch(key){
			case 'w':
				player.up = false;
				break;
			case 's':
				player.down = false;
				break;
			case 'a':
				player.left = false;
				break;
			case 'd':
				player.right = false;
				break;
			case 'e':
				player.interact = false;
				break;
			case 'ArrowLeft':
				player.turnRight = false;
				break;
			case 'ArrowRight':
				player.turnLeft = false;
				break;
			case 'ArrowUp':
				player.shoot = false;
				break;
		}
	}

}



Player.prototype.update = function(walls){
	this.rays = this.raycast();
	this.hud_update();

	//HUD CONTROLS----------------------------
	if(this.health > 100)
		this.health = 100;
	if(this.health <= 0 || this.lives <=0)
		this.death();

	if(this.ammo > 99)
		this.ammo = 99;
	if(this.ammo > 0 && this.weapon == 'knife'){
		this.weapon = 'pistol';
		this.weapon_sound.change("sounds/" + this.weapon + ".wav");
	}
	if(this.ammo <= 0 && this.weapon != 'knife'){
		this.ammo=0;
		this.weapon = "knife";
		this.weapon_sound.change("sounds/" + this.weapon + ".wav");
	}

	if(this.lives > 99)
		this.lives = 99;

	if(this.score > 999999)
		this.score = 999999;


	//WEAPON SWICH----------------------------
	switch(this.weapon){
		case 'knife':
			this.firerate = 0.4;
			this.range = 45;
		break;
		case 'pistol':
			this.firerate = 0.2;
			this.range = 150;
		break;
		case 'rifle':
			this.firerate = 0.4;
			this.range = 200;
		break;
		case 'minigun':
			this.firerate = 0.75;
			this.range = 200;
		break;

	}


	//MOVEMENT CONTROLS------------------------
	if(this.up)
		this.movement = this.movement.add( this.direction );
	if(this.down)
		this.movement = this.movement.sub( this.direction );
	if(this.left)
		this.movement = this.movement.add( this.direction.get_perpendicular() );
	if(this.right)
		this.movement = this.movement.sub( this.direction.get_perpendicular() );
	if(this.turnRight)
		this.direction = this.direction.rotate( -this.step_of_rotation);
	if(this.turnLeft)
		this.direction = this.direction.rotate( this.step_of_rotation);


	//COLLISION DETECTION----------------
	var collision_force = this.collide(walls);
	this.movement = this.movement.normalize();
	this.movement = this.movement.add(collision_force);
	this.movement = this.movement.mult(this.step_of_movement);
	this.position = this.position.add(this.movement);


	this.movement = new Vector(0,0);
}

Player.prototype.collide = function(walls) {
	var minimum =10;
	var index = 0;
	var total_force = new Vector(0,0);

	for (var i = walls.length - 1; i >= 0; i--) {

		var distance = this.position.distance_from_line(walls[i]);

		if(distance<minimum){
			var position = walls[i].whatSideOfLine(this.position);

			var wall_force = ((walls[i].get_perpendicular()).mult(position)).normalize();
			total_force = total_force.add( wall_force );
		}

		if(distance<minimum+5)
			walls[i].interact(this.interact, this.keys);
	}

	return total_force;
};

Player.prototype.raycast = function(){
	var temp = new Array();

	var angle = this.fov/this.number_of_rays;

	for (var i = 0; i < this.number_of_rays; i++) {

		var temp_ray = this.direction.rotate(this.fov/2 - angle*i);
		var ray = new Vector( temp_ray );
		temp.push(ray);
	}

	return temp;
}

Player.prototype.apply_damage = function(){
	for (var i = sprites.length - 1; i >= 0; i--) {
		if(sprites[i].type == "enemy"){
			var angle = Rad2Deg( player.direction.angleBetween(sprites[i].position.sub(player.position)) );
			if(  (angle < 10 || angle > 350) && sprites[i].distance_from_player.magnitude()<=this.range)
				sprites[i].get_damaged();
		}
	};
	if(player.weapon != 'knife')
		player.ammo--;
}

Player.prototype.hud_update = function() {
	document.getElementById("score").children[1].innerHTML = this.score;
	document.getElementById("ammo").children[1].innerHTML = this.ammo;
	document.getElementById("health").children[1].innerHTML = this.health;
	document.getElementById("lives").children[1].innerHTML = this.lives;
	document.getElementById("level").children[1].innerHTML = level;

	var weapon_image = "url(img/hud/" + this.weapon + "_hud.png)";
	var weapon_hud = document.getElementById("weapon_slot");
	weapon_hud.style.backgroundImage = weapon_image;
	weapon_hud.style.backgroundSize = "100% 100%";
	weapon_hud.style.backgroundRepeat= "no-repeat";

	var key_hud = document.getElementById("key");
	if(this.keys[0]){
		var key1_image = "url('img/hud/key1.png')";
		key_hud.children[0].style.backgroundImage = key1_image;
		key_hud.children[0].style.backgroundSize = "90% 100%";
		key_hud.children[0].style.backgroundRepeat= "no-repeat";
	}else{
		key_hud.children[0].style.backgroundImage = null;
	}

	if(this.keys[1]){
		var key2_image = "url('img/hud/key2.png')";
		key_hud.children[1].style.backgroundImage = key2_image;
		key_hud.children[1].style.backgroundSize = "90% 100%";
		key_hud.children[1].style.backgroundRepeat= "no-repeat";
	}else{
		key_hud.children[1].style.backgroundImage = null;
	}

	this.shift = (this.shift+0.01)%3;
	var player_face = document.getElementById('player_face');
	var damaged = Math.floor(scale(this.health,0,100,7,0));
	player_face.style.backgroundPosition = (Math.floor(this.shift)*50) +'% '+ (damaged*(100/6)) +'%';
	
};

Player.prototype.death = function() {
	if(this.lives >= 0){
		this.lives--;
		this.health=100;
	}
	else{
		player.gameover("death");
	}
};

Player.prototype.reset = function() {	
	this.health = 100;
	this.ammo = 10;
	this.score = 0;
	this.lives = 3;
	this.keys = [null,null];
	this.weapon = 'pistol';

	this.direction = new Vector(1,0);

	this.up= false; this.down= false; this.left= false; this.right= false;
	this.turnLeft= false; this.turnRight= false;
	this.interact = false;
	this.shoot= false;

}


Player.prototype.gameover = function(cause) {

	document.getElementById("menu").style.display = "none";

	scoreUpload(document.getElementById('score').children[1].innerHTML);
	setTimeout(levelList(),5000);

	switch(cause){
		case "death":
			console.log(cause);
			walls=[];
			sprites=[];
			music.stop();
			player.reset();
			clearInterval(gameTimer);
			document.getElementById("menu").style.display = "initial";

		break;
		case "win":
			console.log(cause);
			walls=[];
			sprites=[];
			music.stop();
			player.reset();
			clearInterval(gameTimer);
			document.getElementById("menu").style.display = "initial";
		break;
	}
}