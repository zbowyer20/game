var AnimationHandler = {
		deferred: {},
		animations: {"sliding": null},
		
		init: function() {
			var self = this;
			createjs.Ticker.setFPS(45);
			createjs.Ticker.addEventListener("tick", function() {
				self.tick();
			});
		},

		slideBackgrounds: function(movers, movements) {
			this.deferred = $.Deferred();
			var self = this;

			priority = FROZEN_PRIORITY;

			stage.update();
			this.animations.sliding = {"movers": movers, "movements": movements};
			return this.deferred.promise();
		},
		
		slideBackgroundsAnimation: function() {
			var movers = this.animations.sliding.movers;
			var movements = this.animations.sliding.movements;
			for (var i = 0; i < movers.length; i++) {
				for (var j = 0; j < movers[i].children.length; j++) {
					movers[i].children[j].x += movements.x;
					movers[i].children[j].y += movements.y;
					stage.update();
				}
			}
			if ((movers[0].children[0].x <= 0 - (stage.canvas.width)) || (movers[0].children[0].x >= (stage.canvas.width * 2 / DPR))) {
				this.finishAnimation();
			}
		},
		
		// TODO finishes all animation
		finishAnimation: function() {
			this.animations.sliding = null;
			priority = LOWEST_PRIORITY;
			this.deferred.resolve("animation complete");
		},
		
		tick: function() {
			if (this.animations.sliding) {
				this.slideBackgroundsAnimation();
			}
		}
		
}