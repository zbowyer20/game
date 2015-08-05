function Area(area) {
	this.background = {};
	this.movements = {};
	this.clickables = {};
	
	var self = this;

	this.initBackground = function(area) {
		this.setBackground(area.id);
		self.background.name = area.name;
		self.background.clickables = area.clickables;
		self.background.defaultBackground = area.defaultBackground;
	}
	
	this.getBackground = function() {
		return self.background;
	}

	this.setBackgroundVideo = function(video) {
		self.background.video = convertVideoToScaledBitmap(video, 0, MENU_HEIGHT, stage.canvas.width, stage.canvas.height - MENU_HEIGHT);;
	}
	
	this.setBackgroundImage = function(image) {
		self.background.image = convertImageToScaledBitmap(image, 0, MENU_HEIGHT, stage.canvas.width, stage.canvas.height - MENU_HEIGHT);
	}
	
	this.setBackground = function(id) {
		if (videos[id]) {
			this.setBackgroundVideo(videos[id]);
		}
		if (images[id]) {
			this.setBackgroundImage(images[id]);
		}
	}
	
	this.removeBackgroundVideo = function() {
		self.background.video = null;
	}
	
	this.removeBackgroundImage = function() {
		self.background.image = null;
	}
	
	this.clearBackground = function() {
		this.removeBackgroundVideo();
		this.removeBackgroundImage();
	}
	
	this.getDestinationByDirection = function(direction) {
		return self.movements[direction];
	}
	
	this.getMovements = function() {
		return self.movements;
	}

	this.setMovement = function(movement) {
		self.movements[movement.name] = movement.destination;
	}
	
	this.setMovements = function(movements) {
		if (!movements) {
			return false;
		}
		for (var i = 0; i < movements.length; i++) {
			self.setMovement(movements[i]);
		}
	}
	
	this.setClickables = function(clickables) {
		if (!clickables) {
			return false;
		}
		for (var i = 0; i < clickables.length; i++) {
			this.clickables[clickables[i].id] = new Clickable(clickables[i]).init();
		}
	}
	
	this.getClickables = function(visibleOnly) {
		if (!visibleOnly) {
			console.log(this.clickables);
			return this.clickables;
		}
		else {
			var clickables = {};
			for (var id in this.clickables) {
				if (this.clickables[id].shouldAddToStage()) {
					clickables[id] = this.clickables[id];
				}
			}
			return clickables;
		}
	}
		
	this.initBackground(area);
	this.setMovements(area.movements);
	this.setClickables(area.clickables);

	return this;
}