


function shuffle(array, seed){
	var rng = new RNG(seed);
	
	var end = array.length - 1;
	var i;
	var temp;
	while(end > 0){
		i = Math.round(rng.unit() * (end-1));
		temp = array[end];
		array[end] = array[i];
		array[i] = temp;
		end--;
	}
}

function PerlinNoise(seed){
	this.seed = seed;
	this.permutation = new Array(256);
	this.p = new Array(512);
	for(var i = 0; i < 256; i++){
		this.permutation[i] = i;
	}
	shuffle(this.permutation, seed);
	for(var i = 0; i < 256; i++){
		this.p[i] = this.p[i+256] = this.permutation[i];
	}
}

PerlinNoise.prototype = {
	
	noise : function(x, y, z){
		var X = Math.floor(x) & 255;
		var Y = Math.floor(y) & 255;
		var Z = Math.floor(z) & 255;
		
		x -= Math.floor(x);
		y -= Math.floor(y);
		z -= Math.floor(z);
		
		var u = this.fade(x);
		var v = this.fade(y);
		var w = this.fade(z);
		
		var A = this.p[X]+Y, AA = this.p[A]+Z, AB = this.p[A+1]+Z,
			B = this.p[X+1]+Y, BA = this.p[B]+Z, BB = this.p[B+1]+Z;
		
		var result = this.lerp(w, this.lerp(v, this.lerp(u, this.grad(this.p[AA], x, y, z), this.grad(this.p[BA], x-1, y, z)),
											   this.lerp(u, this.grad(this.p[AB], x, y-1, z), this.grad(this.p[BB], x-1, y-1, z))),
								  this.lerp(v, this.lerp(u, this.grad(this.p[AA+1], x, y, z-1), this.grad(this.p[BA+1], x-1, y, z-1)),
											   this.lerp(u, this.grad(this.p[AB+1], x, y-1, z-1), this.grad(this.p[BB+1], x-1, y-1, z-1))));
		
		return result;
	},
	
	lerp : function(t, a, b){
		return a + t * (b - a);
	},
	
	fade : function(t){
		return t * t * t * (t * (t * 6 - 15) + 10);
	},
	
	grad : function(hash, x, y, z){
		var h = hash & 15;
		
		switch (h){
		case 0:
			return x+y;
		case 1:
			return x-y;
		case 2:
			return -x+y;
		case 3:
			return -x-y;
		case 4:
			return x+z;
		case 5:
			return x-z;
		case 6:
			return -x+z;
		case 7:
			return -x-z;
		case 8:
			return y+z;
		case 9:
			return y-z;
		case 10:
			return -y+z;
		case 11:
			return -y-z;
		case 12:
			return x+y;
		case 13:
			return x-y;
		case 14:
			return -x+y;
		case 15:
			return -x-y;
		}
	}
	
}