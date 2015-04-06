function Background() {
	var background;
	var left;
	var right;
	
	this.createBackground = function(thisBackground) {
		background = thisBackground;
		return this;
	}
	
	this.createBackground = function(thisBackground, thisLeft, thisRight) {
		background = thisBackground;
		left = thisLeft;
		right = thisRight;
	}

	this.getBackground = function() {
		return background;
	}

	this.getLeft = function() {
		return this.left;
	}

	this.getRight = function() {
		return this.right;
	}

	this.setLeft = function(left) {
		this.left = left;
	}

	this.setRight = function(right) {
		this.right = right;
	}
}