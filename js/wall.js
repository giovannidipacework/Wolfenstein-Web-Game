function Wall(x1, y1, x2, y2, texture) {

	this.x1 = x1;
	this.y1 = y1;

	this.x2 = x2;
	this.y2 = y2;
	
	this.interactable = false;

	this.offset = texture;
	this.texture = this.getTexture(texture);

}

Wall.prototype.set_interaction = function(key, x12,y12,x22,y22) {
	this.interactable =true;
	this.required_key=key;

	if(x12!=undefined){
		this.x12 = x12;
		this.y12 = y12;

		this.x22 = x22;
		this.y22 = y22;
		this.amount = 0 ;

		this.sound = new sound("sounds/door.wav");
	}

};

Wall.prototype.length = function(){
	var delta_x = (this.x1-this.x2)*(this.x1-this.x2);
	var delta_y =  (this.y1-this.y2)*(this.y1-this.y2);

	var result = Math.sqrt(delta_x + delta_y);
	return result;
}

Wall.prototype.whatSideOfLine = function(point) {
	//https://stackoverflow.com/questions/1560492/how-to-tell-whether-a-point-is-to-the-right-or-left-side-of-a-line
	var result = Math.sign((this.x2 - this.x1) * (point.y - this.y1) - (this.y2 - this.y1) * (point.x - this.x1));
	return result;
	//It is 0 on the line, and +1 on one side, -1 on the other side.
}

Wall.prototype.get_perpendicular = function() {
	vector1 = new Vector(this.x1, this.y1);
	Vector2 = new Vector(this.x2, this.y2);

	result = (vector1.sub(Vector2)).get_perpendicular();

	return result.normalize();
};

Wall.prototype.interact = function(input,keys){

	var got_key;
	if(this.required_key == 2)
		got_key=true;
	else{
		if(this.required_key == 0)
			got_key=keys[0];
		if(this.required_key == 1)
			got_key=keys[1];
	}


	if(this.interactable && input && got_key)
	{
		if(this.x1!=undefined){
			if(this.amount == 0)
				this.sound.play();
			if(this.amount < 1)
				this.amount += 0.00005;
			this.x1 = lerp(this.x1, this.x12, this.amount);
			this.y1 = lerp(this.y1, this.y12, this.amount);
			this.x2 = lerp(this.x2, this.x22, this.amount);
			this.y2 = lerp(this.y2, this.y22, this.amount);
		}

		if(this.goal){
			player.gameover("win");
		}

	}
};


Wall.prototype.getTexture = function(index) {
	if(index == 12){
		this.goal = true;
		this.set_interaction(1,this.x1,this.y1,this.x2,this.y2);
	}if(index == 13){
		this.goal = true;
		this.set_interaction(0,this.x1,this.y1,this.x2,this.y2);
	}

	return "url(img/texture/" + index + ".png)";
}