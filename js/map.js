
var walls = new Array();
var walls_texture = 0;
var sprites = new Array();
var player;
var map;

var img_dimension=45;
var handler;
var found;
var mapID;
var event;

function StartMap(get_level){

	if(get_level=='null')
		mapID=null;
	else
		mapID = get_level;

	if(mapID!=null){
		levelLoader(mapID,true);
	}

	for (var i = 25; i >= 0; i--) {
		var img = document.createElement("IMG");
		img.setAttribute("class","IMG");
		img.src = "img/texture/" + i +".png";
    	img.setAttribute('onclick', "Set('wall',"+i+");"); // for FF
		img.alt = "texture"+i;
		document.getElementById("wall").appendChild(img);
	};

	for (var i = 24; i >= 0; i--) {
		var img = document.createElement("IMG");
		img.setAttribute("class","IMG");
		img.src = "img/sprites/prop.png";
    	img.setAttribute('onclick',"Set('prop',"+i+");"); // for FF
		img.alt = "texture"+i;
		img.style.objectPosition = '100% ' + (100/24)*i + '%';
		document.getElementById("prop").appendChild(img);
	};

	for (var i = 14; i >= 0; i--) {
		var img = document.createElement("IMG");
		img.setAttribute("class","IMG");
		img.src = "img/sprites/pickUp.png";
    	img.setAttribute('onclick',"Set('pickup',"+i+");"); // for FF
		img.alt = "texture"+i;
		img.style.objectPosition = '100% ' + (100/14)*i + '%';
		document.getElementById("pickup").appendChild(img);
	};

	var canvas = document.getElementById('minimap');
	map = new Map(canvas); ;
	handler = function(event){map.SetWalls(event,walls);} ;
	map.canvas.addEventListener('click', handler , false);

	gameTimer = setInterval(clockFuction, 1000/10);

}

function Upload(){

	var error = validLevel();
	if(error!=null){
		alert(error);
		return;
	}

	if(mapID!=null){
		levelUpload('delete',mapID);
	}

	var title = document.getElementById('title').value;
	if(title=="")
		title="no Title";
	levelUpload("map", title);

	for (var i = walls.length - 1; i >= 0; i--) {
		if(walls[i].interactable)
			levelUpload("wall-interactable",walls[i]);
		else
			levelUpload("wall",walls[i]);
	};

	for (var i = sprites.length - 1; i >= 0; i--) {
		levelUpload("sprite",sprites[i]);
	};

	levelUpload("player",player);
	
	alert("map uploaded");
}

function UploadElementes(){

}

function Map(canvas){
	this.canvas = canvas;
	this.left = canvas.offsetLeft;
	this.top= canvas.offsetTop;
	this.context = this.canvas.getContext('2d');

	this.max_error = 20;

	this.mouse_X1 = null; this.mouse_Y1 = null;
	this.mouse_X2 = null; this.mouse_Y2 = null;

	this.toggle = true;
}


Map.prototype.clear = function() {
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};


Map.prototype.drawWalls = function(walls){
	if( walls.length >0){
		for (var i = walls.length - 1; i >= 0; i--) {


			this.context.beginPath();
			this.context.moveTo(walls[i].x1, walls[i].y1);

			this.context.lineTo(walls[i].x2, walls[i].y2);
			this.context.lineWidth = 15;
			this.context.strokeStyle = 'RGB(255,255,255)';
			this.context.stroke();

			this.context.lineTo(walls[i].x2, walls[i].y2);
			this.context.lineWidth = 10;
			var img = new Image();
			img.src = "./img/texture/" + walls[i].offset + ".png";
			this.context.strokeStyle = this.context.createPattern(img, 'repeat');
			this.context.stroke();


			if(walls[i].interactable && walls[i].x12 != undefined){
				this.context.beginPath();
				this.context.moveTo(walls[i].x12, walls[i].y12);
				this.context.lineTo(walls[i].x22, walls[i].y22);
				this.context.lineWidth = 10;
				this.context.strokeStyle = 'RGBA(0,255,0,.5)';
				this.context.stroke();
			}

		}
	}
}

Map.prototype.drawSprites = function(sprites) {
	if( sprites.length >0){
		for (var i = sprites.length - 1; i >= 0; i--) {
			this.context.save();
			this.context.translate(sprites[i].position.x, sprites[i].position.y);

			/*
			if(sprites[i].type == "enemy"){
				this.context.beginPath();
				this.context.moveTo(0,0);
				this.context.lineTo(sprites[i].direction.x * 100, sprites[i].direction.y * 100);
				this.context.lineWidth = 2;
				this.context.strokeStyle = '#ffffff';
				this.context.stroke();
			}*/

			this.context.drawImage(sprites[i].img, -img_dimension/2,-img_dimension/2, img_dimension,img_dimension );
			
			this.context.restore();
		}
	}
}



Map.prototype.drawPlayer = function(player){

	if(player == null)
		return;

	this.context.save();

	this.context.translate(player.position.x ,player.position.y);

	/*{
		//Debug direction
		this.context.beginPath();
		this.context.moveTo(0,0);
		this.context.lineTo(player.direction.x * 100, player.direction.y * 100);
		this.context.lineWidth = 2;
		this.context.strokeStyle = '#ffffff';
		this.context.stroke();

		//Debug FOV
		for (var i = player.rays.length - 1; i >= 0; i--) {
			this.context.beginPath();
			this.context.moveTo(0,0);
			this.context.lineTo(player.rays[i].x * 100, player.rays[i].y * 100);
			this.context.lineWidth = 2;
			this.context.strokeStyle = '#ffffff';
			this.context.stroke();
		};
	}*/

	var rotation = Math.atan2(player.direction.y, player.direction.x);

	this.context.rotate(rotation);
	this.context.drawImage(player.img, -img_dimension/2,-img_dimension/2, img_dimension,img_dimension );

	this.context.restore();
}


Map.prototype.SetWalls = function(event,walls,texture,interact,key){
		//Get the wall start and the wall end alternatly
		if(this.toggle){
			this.mouse_X1 = event.clientX - this.left;
			this.mouse_Y1 = event.clientY - this.top;
		}
		else{
			this.mouse_X2 = event.clientX - this.left;
			this.mouse_Y2 = event.clientY - this.top;
		}

		for (var i = walls.length - 1; i >= 0; i--) {

			//Calculate the distance between the mouse click and the i-th wall start-end
			var x1_error = event.clientX - this.left -	walls[i].x1;
			var y1_error = event.clientY - this.top -	walls[i].y1;

			var x2_error = event.clientX - this.left -	walls[i].x2;
			var y2_error = event.clientY - this.top -	walls[i].y2;

			//Check if the distance between the mouse click and the i-th wall start il less then MAX_ERROR
			if( Math.abs(x1_error) <= this.max_error && Math.abs(y1_error) <= this.max_error)
			{
				//Replace the right value
				if(this.toggle){
					this.mouse_X1 = walls[i].x1;
					this.mouse_Y1 = walls[i].y1;
				}
				else{
					this.mouse_X2 = walls[i].x1;
					this.mouse_Y2 = walls[i].y1;
				}
			}
			//Check if the distance between the mouse click and the i-th wall end il less then MAX_ERROR
			if( Math.abs(x2_error) <= this.max_error && Math.abs(y2_error) <= this.max_error)
			{
				//Replace the right value
				if(this.toggle){
					this.mouse_X1 = walls[i].x2;
					this.mouse_Y1 = walls[i].y2;
				}
				else{
					this.mouse_X2 = walls[i].x2;
					this.mouse_Y2 = walls[i].y2;
				}
			}



		}

		if( !this.toggle ){

			if(interact){
				switch(key){
					case 0:
						walls[walls.length-1].set_interaction(key,this.mouse_X1, this.mouse_Y1, this.mouse_X2, this.mouse_Y2);
						console.log(key);
					break;
					case 1:
						walls[walls.length-1].set_interaction(key,this.mouse_X1, this.mouse_Y1, this.mouse_X2, this.mouse_Y2);
						console.log(key);
					break;
					case 2:
						walls[walls.length-1].set_interaction(2,this.mouse_X1, this.mouse_Y1, this.mouse_X2, this.mouse_Y2);
						console.log(key);
					break;
				}
			}
			else{
				if(texture==undefined)
					texture=0;
				var wall = new Wall(this.mouse_X1, this.mouse_Y1, this.mouse_X2, this.mouse_Y2 , texture );
				walls.push(wall);
			}
		}

		this.toggle = !this.toggle;
};

Map.prototype.SetPlayer = function(event) {
	var x = event.clientX - this.left;
	var y = event.clientY - this.top;

	if(player != null){
		player.position.x = x;
		player.position.y = y;
	}
	else
		player = new Player(x,y);

};

Map.prototype.SetSprite = function(event, type, texture) {
	var x = event.clientX - this.left;
	var y = event.clientY - this.top;

	var sprite = new Sprite(x,y,type,texture);
	sprites.push(sprite);
};

Map.prototype.Delete = function() {
	var x = event.clientX - this.left;
	var y = event.clientY - this.top;
	var click = new Vector(x,y);


	if(player!=null){
		var distance = player.position.sub(click);
		if(distance.magnitude() <= this.max_error)
				player=null;
	}

	for (var i = sprites.length - 1; i >= 0; i--) {
		var distance = sprites[i].position.sub(click);
		if(distance.magnitude() <= this.max_error)
			sprites.splice(i,1);
	};

	for (var i = walls.length - 1; i >= 0; i--) {
		var wall_1 = new Vector(walls[i].x1,walls[i].y1);
		var wall_2 = new Vector(walls[i].x2,walls[i].y2);

		var distance_1 = wall_1.sub(click);
		if(distance_1.magnitude() <= this.max_error)
			walls.splice(i,1);

		var distance_2 = wall_2.sub(click);
		if(distance_2.magnitude() <= this.max_error)
			walls.splice(i,1);
	};


};


function Set(what,texture,key){
	map.canvas.removeEventListener('click', handler);

	switch(what){

		case 'wall':
			handler = function(event){map.SetWalls(event,walls,texture,false);} ;
		break;
		case "interactive":
			if(walls.length>0)
				handler = function(event){map.SetWalls(event,walls,0,true,key);} ;
			else
				handler = function(event){map.SetWalls(event,walls,0,false);} ;
		break;
		case 'player':
			handler = function(event){map.SetPlayer(event);} ;
		break;
		case 'prop':
			handler = function(event){map.SetSprite(event,"prop",texture);} ;
		break;
		case 'pickup':
			handler = function(event){map.SetSprite(event,"pickup",texture);} ;
		break;
		case 'enemy':
			handler = function(event){map.SetSprite(event,"enemy",0);} ;
		break;
		case 'delete':
			handler = function(event){map.Delete(event);} ;
		break;
	}
	map.canvas.addEventListener('click', handler , false);
	console.log(what);
}


function validLevel() {
	if(player==null){
		return("missing player");
	}
	
	var found = false;
	for (var i = walls.length - 1; i >= 0; i--) {

		if(walls[i].offset==12 || walls[i].offset==13){

			for (var j = sprites.length - 1; j >= 0; j--) {
					if(sprites[j].offset == 0 && walls[i].offset==13){
						found = true;
					}if(sprites[j].offset == 1 && walls[i].offset==12){
						found = true;
					}
			};

			if(!found){
				return"missing correct key, add the correct key";
			}
		}

	};

	if(!found){
		return"missing goal, add wall 12 or 13";
	}

	return null;

}


function clockFuction(){
	map.clear();


	map.drawWalls(walls);
	map.drawSprites(sprites);
	map.drawPlayer(player);
}

