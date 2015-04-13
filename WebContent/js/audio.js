var AudioManager = {
		
		init: function() {
			createjs.Sound.alternateExtensions = ["mp3"];
			return this;
		},
		
		loadManifest: function(manifest) {
			self = this;
			manifest.forEach(function(file) {
					self.registerSound(file);
			});
		},
		
		registerSound: function(file) {
			createjs.Sound.registerSound({"id": file.id, "src" :file.src});
		},
		
		play: function(audio) {
			console.log('reached');
			try {
				if (audio.type == "MUSIC") {
					this.stop();
				}
				var sound = createjs.Sound.play(audio.id);
				this.setPosition(sound, audio.position).setVolume(sound, audio.volume);
			}
			catch (e) {
				this.stop();
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
		}
		
}