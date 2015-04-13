var AudioManager = {
		
		init: function() {
			createjs.Sound.alternateExtensions = ["mp3"];
			return this;
		},
		
		loadManifest: function(manifest) {
			var self = this;
			try {
				manifest.forEach(function(file) {
					self.registerSound(file);
				});
			}
			catch (e) {
			}
		},
		
		registerSound: function(file) {
			createjs.Sound.registerSound({"id": file.id, "src" :file.src});
		},
		
		play: function(audio) {
			try {
				if (audio.type == "MUSIC") {
					this.stop();
				}
				var sound = createjs.Sound.play(audio.id);
				this.setPosition(sound, audio.position).setVolume(sound, audio.volume);
			}
			catch (e) {
			}
		},
		
		stop: function() {
			createjs.Sound.stop();
		},
		
		setPosition: function(audio, position) {
			try {
				audio.setPosition(position);
			}
			catch (e) {
				audio.setPosition(0);
			}
			finally {
				return this;
			}
		},
		
		setVolume: function(audio, volume) {
			try {
				audio.setVolume(volume);
			}
			catch (e) {
				audio.setVolume(1);
			}
			finally {
				return this;
			}
		},
		
		mute: function() {
			createjs.Sound.setMute(true);
		},
		
		unmute: function() {
			createjs.Sound.setMute(false);
		},
		
		getMute: function() {
			return createjs.Sound.getMute();
		}
		
}