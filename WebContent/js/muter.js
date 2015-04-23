var Muter = {
	init: function() {
		this.icon = this.createMuterIcon();
		return this;
	},

	createMuterIcon: function() {
		var self = this;
		
		var icon = AudioManager.getMute() ? images["sound-off"] : images["sound-on"];
		
		var position = {"x": stage.canvas.width - SPEAKER_WIDTH - (10 * DPR), "y": MENU_HEIGHT + (10 * DPR)};
		var icon = convertImageToScaledBitmap(icon, position.x, position.y, SPEAKER_WIDTH, SPEAKER_HEIGHT);
		icon.addEventListener("click", function() {
			self.onclick(self);
		});
		return icon;
	},
	
	onclick: function(self) {
		if (checkPriority(MUTE_PRIORITY)) {
			if (AudioManager.getMute()) {
				self.unmute(self);
			}
			else {
				self.mute(self);
			}
		}
	},
	
	mute: function(self) {
		AudioManager.mute();
		self.icon.image = images["sound-off"];
		stage.update();
	},
	
	unmute: function(self) {
		AudioManager.unmute();
		self.icon.image = images["sound-on"];
		stage.update();
	}
		
}