var AudioManager = {
		
		play: function(audio) {
			try {
				if (audio.type == "MUSIC") {
					this.stop();
				}
				var sound = createjs.Sound.play(audio.id);
				this.setPosition(sound, audio.position).setVolume(sound, audio.volume);
			}
			catch (e) {
				console.log(e.message);
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