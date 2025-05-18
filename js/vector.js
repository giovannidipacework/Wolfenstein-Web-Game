function Vector(a,b){
	 if (arguments.length == 2){ /*Get X and Y*/
		this.x = a;
		this.y = b;
	 }
	 if (arguments.length == 1 && typeof b === 'undefined'){ /*Get Vector*/
		this.x = a.x;
		this.y = a.y;
	 }
}


Vector.prototype.add = function(vector2){
	var result = new Vector(this.x + vector2.x, this.y + vector2.y);
	return result;
}

Vector.prototype.sub = function(vector2){
	var result = new Vector(this.x - vector2.x, this.y - vector2.y);
	return result;
}

Vector.prototype.mult = function(int){
	var result = new Vector(this.x * int, this.y * int);
	return result;
}

Vector.prototype.dot = function(vector2){
	var result = (this.x * vector2.x) + (this.y + vector2.y);
	return result;
}

Vector.prototype.rotate = function(angle){
	var cs = Math.cos( Deg2Rad(angle) );
	var sn = Math.sin( Deg2Rad(angle) );

	var px = this.x * cs - this.y * sn; 
	var py = this.x * sn + this.y * cs;

	var result = new Vector(px, py);

	return result;
}

Vector.prototype.magnitude = function(){
	return Math.sqrt(this.x*this.x + this.y*this.y);
}

Vector.prototype.normalize = function(){
	if(this.magnitude() != 0)
		return this.mult(1/this.magnitude());
	else
		return this;
}

Vector.prototype.get_perpendicular = function(){
	var result = new Vector(this.y, -this.x);
	return result;
}

Vector.prototype.line_intersect = function(start , wall){
	/*https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection*/
	var x1 = wall.x1;
	var y1 = wall.y1;
	var x2 = wall.x2;
	var y2 = wall.y2;

	var x3 = start.x;
	var y3 = start.y;

	var x4 = start.add(this).x;
	var y4 = start.add(this).y;

	var den = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4);
	if(den == 0){
		return;
	}

	var t =  ((x1-x3)*(y3-y4) - (y1-y3)*(x3-x4))/den;
	var u =  -((x1-x2)*(y1-y3) - (y1-y2)*(x1-x3))/den;

	if(t>0 && t<1 && u>0){
		var point_of_intersection = new Vector(x1 + t*(x2-x1), y1 + t*(y2-y1));
		return point_of_intersection
	}else{
		return;
	}

}

Vector.prototype.angleBetween = function(vector2) {
	var angle = Math.atan2(vector2.y, vector2.x) - Math.atan2(this.y, this.x);

	if (angle < 0) { angle += 2 * Math.PI; }

	/*if (angle > Math.PI)        { angle -= 2 * Math.PI; }
	else if (angle <= -Math.PI) { angle += 2 * Math.PI; }*/

	return angle;
};

Vector.prototype.distance_from_line = function(wall) {
	var x=this.x; 	var y=this.y;
	var x1=wall.x1; var y1=wall.y1;
	var x2=wall.x2; var y2=wall.y2;

	  var A = x - x1;
	  var B = y - y1;
	  var C = x2 - x1;
	  var D = y2 - y1;

	  var dot = A * C + B * D;
	  var len_sq = C * C + D * D;
	  var param = -1;
	  if (len_sq != 0) //in case of 0 length line
	      param = dot / len_sq;

	  var xx, yy;

	  if (param < 0) {
	    xx = x1;
	    yy = y1;
	  }
	  else if (param > 1) {
	    xx = x2;
	    yy = y2;
	  }
	  else {
	    xx = x1 + param * C;
	    yy = y1 + param * D;
	  }

	  var dx = x - xx;
	  var dy = y - yy;
	  return Math.sqrt(dx * dx + dy * dy);

};


Vector.prototype.projection = function(vector2) {
	var numerator = this.dot(vector2);
	var denominator = vector2.magnitude()*vector2.magnitude();

	if(this.magnitude() != 0)
		return vector2.mult(numerator/denominator);
	else
		return new Vector(0,0);
};

Vector.prototype.lerp = function(vector2, t) {
	var a = (1 - t) * this.x + t * vector2.x;
	var b = (1 - t) * this.y + t * vector2.y;


	var result = new Vector(a,b);
	return result;
};

//------------------------------------------------------------------------------Utilita'
function Deg2Rad(degree){
	return degree * (Math.PI / 180);
}


function Rad2Deg(radians)
{
  return radians * (180/Math.PI);
}


function scale(num, in_min, in_max, out_min, out_max){
	/*https://stackoverflow.com/questions/10756313/javascript-jquery-map-a-range-of-numbers-to-another-range-of-numbers*/
	  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;

}

function lerp (start, end, amt){
  return (1-amt)*start+amt*end
}

function compareByDistance( a, b ) {
	if ( a.position.sub(player.position).magnitude() < b.position.sub(player.position).magnitude() ){
		return 1;
	}
	if ( a.position.sub(player.position).magnitude() > b.position.sub(player.position).magnitude() ){
		return -1;
	}
	return 0;
}

function getIndex(angle ) {
	var selected;
	if (angle >= 22.5 && angle < 67.5)
		selected = 7;
	else if (angle >= 67.5 && angle < 112.5)
		selected = 6;
	else if (angle >= 112.5 && angle < 157.5)
		selected = 5;
	else if (angle >= 157.5 && angle < 202.5)
		selected = 4;
	else if (angle >= 202.5 && angle < 247.5)
		selected = 3;
	else if (angle >= 247.5 && angle < 292.5)
		selected = 2;
	else if (angle >= 292.5 && angle < 337.5)
		selected = 1;
	else if (angle >= 337.5 || angle < 22.5)
		selected = 0;

	return selected;
}
