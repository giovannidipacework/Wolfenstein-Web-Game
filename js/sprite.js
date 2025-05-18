function Sprite(x,y,type,offset) {
	
	this.start_position = new Vector(x,y);
	this.position = this.start_position;
	this.distance_from_player;

	this.texture;
	this.offset = offset;
	this.texture_shift;

	this.img = new Image();

	this.type = this.define(type);

}

Sprite.prototype.define = function(type) {

	switch(type){

		case "enemy":
			this.texture = "url(img/animation/guard/idle.png)";
			this.shoot_sound = new sound("sounds/pistol.wav");
			this.sound = new sound("sounds/EnemyDeath.wav");
			this.direction = new Vector(1,0);
			this.step_of_movement = 10;
			this.fov = 90;
			this.health = 5;
			this.score = 100;
			this.state = "idle";
			this.countown =0;
			this.img.src = './img/enemy.png';
		break;

		case "prop":
			this.texture = "url(img/sprites/prop.png)";
			this.texture_shift = (100/24);	//max 25
			this.img.src = './img/prop.png';
		break;

		case "pickup":
			this.texture = "url(img/sprites/pickUp.png)";
			this.texture_shift = (100/14);	//max 15
			this.img.src = "./img/prop.png";
			switch(this.offset){
				case 0:
					this.sound =  new sound("sounds/Pickup.wav");
					this.key1 = true;
				break;
				case 1:
					this.sound =  new sound("sounds/Pickup.wav");
					this.key2 = true;
				break;
				case 2:
					this.sound =  new sound("sounds/Pickup.wav");
					this.health = 100;
				break;
				case 3:
					this.sound =  new sound("sounds/Food.wav");
					this.health = 4;
				break;
				case 4:
					this.sound =  new sound("sounds/Food.wav");
					this.health = 10;
				break;
				case 5:
					this.sound =  new sound("sounds/Health.wav");
					this.health = 25;
				break;
				case 6:
					this.sound =  new sound("sounds/Ammo.wav");
					this.ammo = 6;
				break;
				case 7:
					this.sound =  new sound("sounds/Pickup.wav");
					this.weapon = "rifle";
				break;
				case 8:
					this.sound =  new sound("sounds/Pickup.wav");
					this.weapon = "minigun";
				break;
				case 9:
					this.sound =  new sound("sounds/Pickup.wav");
					this.score = 100;
				break;
				case 10:
					this.sound =  new sound("sounds/Pickup.wav");
					this.score = 500;
				break;
				case 11:
					this.sound =  new sound("sounds/Pickup.wav");
					this.score = 1000;
				break;
				case 12:
					this.sound =  new sound("sounds/Pickup.wav");
					this.score = 5000;
				break;
				case 13:
					this.sound =  new sound("sounds/Health.wav");
					this.lives = 1;
				break;
				case 14:
					this.sound =  new sound("sounds/Food.wav");
					this.health = 1;
				break;
			}
		break;
	}

	return type;
};

Sprite.prototype.update = function(player , frame_count) {
	this.distance_from_player = player.position.sub( this.position );

	if(this.type == "enemy"){
		this.enemy_ai_update(player);
		this.enemy_sprite_update(player,frame_count);
	}
	if(this.type == "pickup"){
		this.pickup_update(player);
	}
};

Sprite.prototype.enemy_sprite_update = function(player,frame_count) {

	switch ( this.state ){
		case "idle":
			this.texture = "url('img/animation/guard/idle.png')";
			this.offset = ( this.enemy_sprite_rotation_update(player) );
			this.texture_shift = 100/7;
		break;
		case "searching":
			this.texture = "url('img/animation/guard/run" + (frame_count%4+1) + ".png')";
			this.offset = ( this.enemy_sprite_rotation_update(player) );
			this.texture_shift = 100/7;
		break;
		case "stoping_search":
			this.texture = "url('img/animation/guard/idle.png')";
			this.offset = ( this.enemy_sprite_rotation_update(player) );
			this.texture_shift = 100/7;
		break;
		case "return_idle":
			this.texture = "url('img/animation/guard/run" + (frame_count%4+1) + ".png')";
			this.offset = ( this.enemy_sprite_rotation_update(player) );
			this.texture_shift = 100/7;
		break;
		case "alert":
			this.texture = "url('img/animation/guard/firing.png')";
			this.offset = 0;
			this.texture_shift = 100/7;
		break;
		case "shoot":
			this.texture = "url('img/animation/guard/firing.png')";

			this.offset += 0.25;
			this.offset = this.offset%3;
			this.texture_shift = 100/2;

			if(this.offset== 1.5){
				player.health -= 2 + Math.floor( Math.random()*2 );
				this.shoot_sound.play();
			}

		break;
		case "dead":
			this.texture = "url('img/animation/guard/death.png')";

			this.offset += 0.5;

			if(this.offset > 4.9){
				this.delete = true;
				player.score += this.score;
				sprites.push(new Sprite(this.position.x,this.position.y, "pickup",6));
			}

			this.offset = this.offset%5;
			this.texture_shift = 100/4;


		break;
	}

};

Sprite.prototype.enemy_sprite_rotation_update = function(player){

	var player_angle = Rad2Deg( player.direction.angleBetween( this.distance_from_player ) );
	var sprite_angle = Rad2Deg( this.direction.angleBetween( player.direction ) );

	return selected = ( getIndex(player_angle) + getIndex(sprite_angle) ) % 8;

};

Sprite.prototype.enemy_ai_update = function(player) {

	var angle_from_player = Rad2Deg( this.direction.angleBetween(this.distance_from_player) );

	var closest_point = new Vector(1000000,10000000);
	for (var j = walls.length - 1; j >= 0; j--) {

		var point = this.direction.line_intersect(this.position, walls[j]);

		if(point != null){

			var distance = this.position.sub(point);
			distance = distance.magnitude();

			var record = this.position.sub(closest_point);
			record = record.magnitude();

			if( distance < record){
				closest_point = point;
			}
		}
	}

	if(this.health <= 0){
		this.state = "dead";
	}

	switch(this.state){
		case "idle":

			if( this.player_in_sight(angle_from_player,closest_point) )
			{
				this.state = "alert";
			}

		break;

		
		case "alert":

			this.step_of_movement = 10;

			if(this.player_in_sight(angle_from_player,closest_point) )
			{

				this.direction = this.direction.lerp(this.distance_from_player.normalize() , 0.9 );
				this.direction = this.direction.normalize();
			
				if(this.distance_from_player.magnitude() > 150)
				{
					this.state = "searching";
					this.last_player_position = player.position;
				}
	
				if(angle_from_player < 15 || angle_from_player > 345){
					this.state = "shoot";
				}
			}

			else
			{
				this.last_player_position = player.position;
				this.state = "searching";
			}

		break;


		case "searching":
			this.step_of_movement = 4;

			this.position = this.position.add(( ((this.last_player_position.sub(this.position)).normalize()) ).mult(this.step_of_movement));
			this.direction = (this.last_player_position.sub(this.position)).normalize() ;

			if(  this.player_in_sight(angle_from_player,closest_point) )
			{
				this.state = "alert";
			}

			if(this.position.sub(this.last_player_position).magnitude() < 5){
				this.countown = 2.5*12;
				this.state = "stoping_search";
			}
		break;

		case "stoping_search":
			this.countown -= 1;
			this.direction = this.direction.lerp(this.direction.get_perpendicular() , 0.1 );
			this.direction = this.direction.normalize();
			if(  this.player_in_sight(angle_from_player,closest_point) )
			{
				this.state = "alert";
			}
			if(this.countown <=0)
				this.state = "return_idle";
		break;

		case "return_idle":

			if(  this.player_in_sight(angle_from_player,closest_point) )
			{
				this.state = "alert";
			}

			if( (this.position.sub(this.start_position)).magnitude() > 5 )
			{
				this.position = this.position.add(( ((this.start_position.sub(this.position)).normalize()) ).mult(this.step_of_movement));
				this.direction = (this.start_position.sub(this.position)).normalize() ;
			}else{
				this.state = "idle";
			}

		break;

		case "shoot":
			if( (angle_from_player > 15 && angle_from_player < 345) ||
				!this.player_in_sight(angle_from_player,closest_point))
				this.state = "alert";
		break;

	}
};

Sprite.prototype.player_in_sight = function(angle_from_player,closest_point){

	return (( angle_from_player >=0 && angle_from_player<=this.fov/2 ) || (angle_from_player >=360-(this.fov/2) && angle_from_player<=360))
	&& this.distance_from_player.magnitude() < (this.position.sub(closest_point)).magnitude()
	&& this.distance_from_player.magnitude() < 200;

};

Sprite.prototype.get_damaged = function() {
	this.health -= 1;
	this.state = "alert";
};

Sprite.prototype.pickup_update = function(player) {
	if(this.distance_from_player.magnitude() < 25){
		if(this.health != null){
			player.health += this.health;
		}
		if(this.ammo != null){
			player.ammo += this.ammo;
		}
		if(this.score != null){
			player.score += this.score;
		}
		if(this.lives != null){
			player.lives += this.lives;
		}
		if(this.weapon != null){
			player.weapon = this.weapon;
			player.weapon_sound.change("sounds/" + this.weapon + ".wav");
		}
		if(this.key1 != null){
			player.keys = [this.key1,player.keys[1]];
		}
		if(this.key2 != null){
			player.keys = [player.keys[0],this.key2];
		}
		this.delete = true;
	}
};