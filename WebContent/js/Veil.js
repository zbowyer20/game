function Veil() {
	this.state = {"opening": false, "closing": false};
	this.container = createVeil();
	
	var self = this;
	
	this.open = function() {
		self.state.opening = true;
		self.state.closing = false;
	}
	
	this.close = function() {
		self.state.opening = false;
		self.state.closing = true;
	}
	
	/*
	 * Create a veil over the entire stage
	 * @returns The container containing the veil
	 */
	function createVeil() {
		var veilContainer = new createjs.Container();
		
		var graphics = new createjs.Graphics().beginFill(VEIL_COLOUR).drawRect(0, 0, stage.canvas.width, stage.canvas.height);
		var shape = new createjs.Shape(graphics);
		
		veilContainer.addChild(shape);
		veilContainer.alpha = 0;
		
		return veilContainer;
	}
	
	function lowerVeil(transparencyAnimationDistance) {
		if (self.container.alpha < VEIL_TRANSPARENCY) {
			self.container.alpha += transparencyAnimationDistance;
		}
		else {
			self.container.alpha = VEIL_TRANSPARENCY;
			self.state.opening = false;
		}
		stage.update();
	}
	
	function raiseVeil(transparencyAnimationDistance) {
		if (self.container.alpha > 0) {
			self.container.alpha -= transparencyAnimationDistance;
		}
		else {
			self.container.alpha = 0;
			self.state.closing = false;
		}
		stage.update();
	}
	
	/*
	 * Tick tick ticker
	 * Check if the veil transparency needs to be animated
	 */
	function animateVeil(event) {
		if (!event.paused) {
			var transparencyAnimationDistance = (event.delta / 1000) * VEIL_ANIMATION_OPACITY_PER_SECOND;
			if (self.state.opening) {
				lowerVeil(transparencyAnimationDistance);
			}
			else if (self.state.closing) {
				raiseVeil(transparencyAnimationDistance);
			}
		}
	}
	
	createjs.Ticker.addEventListener("tick", animateVeil);
	
	return this;
}