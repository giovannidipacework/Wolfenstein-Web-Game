function Camera(div) {
	this.div = div;

	this.distance_buffer = new Array();
	this.width = (SCREEN_WIDTH/player.number_of_rays)-0.01;
	this.weapon = document.createElement("DIV");

	this.offset=0;
}

Camera.prototype.setup = function(player){

	this.weapon.setAttribute("ID", "WEAPON");
	this.weapon.style.height = SCREEN_HEIGHT/2 + "px";
	this.weapon.style.width = SCREEN_HEIGHT/2 + "px";
	this.weapon.style.marginLeft = SCREEN_WIDTH/2-(SCREEN_HEIGHT/2)/2 + "px";
	this.weapon.style.marginRight = SCREEN_WIDTH/2-(SCREEN_HEIGHT/2)/2 + "px";
  	this.weapon.style.backgroundImage = "url('img/animation/gun/" + player.weapon + ".png')";
	this.div.appendChild(this.weapon);

	for (var i = player.number_of_rays-1; i >= 0; i--) {

		var column = document.createElement("DIV");
		column.setAttribute("ID", "COLUMN"+i);
		column.setAttribute("CLASS", "COLUMN");
		column.style.height = SCREEN_HEIGHT + "px";
		column.style.width = this.width + "px";


		this.div.appendChild(column);
	}
}

Camera.prototype.update = function(player, walls,sprites, frame_count) {
	this.drawWalls(player, walls);
	this.drawSprites(player, sprites);
	this.drawWeapon(player,frame_count,sprites);
};


Camera.prototype.drawWeapon = function(player,frame_count,sprites) {

	var url = 'url(img/animation/gun/' + player.weapon + '.png)'
  	this.weapon.style.backgroundImage = url;

  	if(player.shoot){
  		player.shooting = true;
  	}

  	if(player.shooting){
  		this.offset = (this.offset+player.firerate) ;

  		if(this.offset >= 4){
  			player.weapon_sound.play();
  			player.apply_damage(sprites);
  			player.shooting = false;
  			this.offset=0
  		}

  	}else{
  		this.offset = 0;
  	}


  	this.weapon.style.backgroundPosition = "0% " + (Math.floor(this.offset)*(100/4)) + "%";
};


Camera.prototype.drawWalls = function(player, walls){

	for (var i = player.rays.length - 1; i >= 0; i--) {

		var closest_point = new Vector(1000000,10000000);
		var selected;

		for (var j = walls.length - 1; j >= 0; j--) {

			var point = player.rays[i].line_intersect(player.position, walls[j]);

			if(point != null){

				var distance = player.position.sub(point);
				distance = distance.magnitude();

				var record = player.position.sub(closest_point);
				record = record.magnitude();

				if( distance < record){
					closest_point = point;
					selected = j;
				}
			}
		}

		/*----------------------------------------------------MOD DIV*/
		var column = document.getElementById("COLUMN" + i);
		var distance = player.position.sub(closest_point);

		this.distance_buffer[player.rays.length - i] = distance.magnitude();

		var color = scale(distance.magnitude(), 0 , SCREEN_HEIGHT , 0 , 1 );

		if(selected != null){

			column.style.backgroundImage = 'linear-gradient( rgba(0,0,0,' + color + '), rgba(0,0,0,' + color + ') ) ,'  + walls[selected].texture ;

			{ //calcolo shift delle texture
				var delta;

				if( walls[selected].whatSideOfLine(player.position) > 0 )
					delta = closest_point.sub( new Vector(walls[selected].x1,walls[selected].y1)  );
				else
					delta = closest_point.sub( new Vector(walls[selected].x2,walls[selected].y2)  );

				var result = (delta.magnitude()/16)	;
				result = result - Math.floor(result) ; //parte decimale del risultato
				result = Math.floor(result * 100); //risultato in percentualew
			}

			column.style.backgroundPosition = result + "% 0%";

		}

		var size = (SCREEN_HEIGHT*player.fov)/distance.magnitude();

		
		if(size/this.width >= 127){
			size=this.width*127-1;
		}

		column.style.height = size + "px";


		column.style.marginTop =((SCREEN_HEIGHT-size)/2)   + "px";
		column.style.marginBottom = ((SCREEN_HEIGHT-size)/2)  + "px";
		/*------------------------------------------------------------*/

	}

}



Camera.prototype.drawSprites = function(player, sprites) {

	for (var i = sprites.length - 1; i >= 0; i--) {

		var eliminate = document.getElementById("SPRITES"+i);

		if(eliminate != null){
			eliminate.parentNode.removeChild(eliminate);
		}

		if(sprites[i].delete){
			sprites[i].sound.play();
			sprites.splice(i,1);
		}
	}


	sprites = sprites.sort(compareByDistance);


	for (var i = sprites.length - 1; i >= 0; i--) {

		var distance = sprites[i].position.sub(player.position);
		var size = SCREEN_HEIGHT*player.fov/distance.magnitude();
		
		var angle = player.direction.angleBetween( distance ); //angolo tra player e posizione relativa al player
		var selected = -1;
		
		if( angle >= 0  && angle <= Deg2Rad(player.fov)/2 ){
			selected = Math.floor( scale(angle , 0, Deg2Rad(player.fov)/2, player.number_of_rays/2, player.number_of_rays ) );
		}

		if( angle >= 2*Math.PI - Deg2Rad(player.fov/2) && angle <= 2*Math.PI ){
			selected = Math.floor( scale(angle , 2*Math.PI - Deg2Rad(player.fov/2),  2*Math.PI, 0, player.number_of_rays/2 ) );
		}


		if( selected!=-1 && distance.magnitude() < this.distance_buffer[selected] ){
			
			var column = document.createElement("DIV");
			column.setAttribute("ID", "SPRITES"+i);
			column.setAttribute("CLASS", "SPRITES");

			column.style.height = size + "px";
			column.style.width = size + "px";

			column.style.marginTop = ((SCREEN_HEIGHT-size)/2) + "px";
			column.style.marginBottom = ((SCREEN_HEIGHT-size)/2)  + "px";

			column.style.left = selected*(SCREEN_WIDTH/player.number_of_rays) - size/2 + "px";

			column.style.backgroundImage = sprites[i].texture;
			column.style.backgroundPosition = "0% "+ (Math.floor(sprites[i].offset)*sprites[i].texture_shift) +"%";

			this.div.insertBefore(column, this.div.firstChild);
		}

	}
}