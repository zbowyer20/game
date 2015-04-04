var viewer = function() {
	var view;

	this.createView = function(thisBackground) {
		view = {
				background: thisBackground
		};
	}
	
	this.createView = function(thisBackground, thisLeft, thisRight) {
		view = {
			background:thisBackground,
			left: thisLeft,
			right: thisRight	
		};
	}

	this.getBackground = function() {
		return view.background;
	}

	this.getLeft = function() {
		return view.left;
	}

	this.getRight = function() {
		return view.right;
	}

	this.setLeft = function(left) {
		view.left = left;
	}

	this.setRight = function(right) {
		view.right = right;
	}
}