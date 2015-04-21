var AnimationHandler = {
		
		init: function() {
			createjs.Ticker.setFPS(45);
		},

		slideBackgrounds: function(movers, movements) {
			var self = this;

			priority = FROZEN_PRIORITY;

			stage.update();
			console.log(movers);
			console.log(movements);
			createjs.Ticker.addEventListener("tick", function() {
				self.slideBackgroundsAnimation(movements, movers);
			});
		},
		
		slideBackgroundsAnimation: function(movements, movers) {
			for (var i = 0; i < movers.length; i++) {
				for (var j = 0; j < movers[i].children.length; j++) {
					movers[i].children[j].x += movements.x;
					movers[i].children[j].y += movements.y;
					stage.update();
				}
			}
			console.log(movers[0].children[0].x)
			if ((movers[0].children[0].x <= 0 - (stage.canvas.width)) || (movers[0].children[0].x >= (stage.canvas.width * 2 / DPR))) {
				console.log('got here');
//				Scene.components.areas.next.getBackground().x = 0;
//				Scene.components.areas.current = Scene.components.areas.next;
//				Scene.components.areas.next = null;
//				stage.update();
				this.finishAnimation();
			}
		},
		
		// TODO finishes all animation
		finishAnimation: function() {
			console.log('finish him');
			createjs.Ticker.reset();
			priority = LOWEST_PRIORITY;
		}
		
}