var CutsceneHandler = {
		cutscenes: {},
		currentlyPlaying: {
			"scene": null,
			"index": 0
		},
		
		addCutscenes: function(cutscenes) {
			for (var id in cutscenes) {
				this.cutscenes[id] = cutscenes[id];
			}
		},
		
		findCutscene: function(id) {
			return this.cutscenes[id];
		},
		
		/*
		 * Play a cutscene
		 * @param cutscene The cutscene to play
		 */
		initCutscene: function(cutscene, parameters) {
			this.deferred = $.Deferred();
			priority = cutscene != null ? CUTSCENE_PRIORITY: 0;
			Scene.animation.loadingText = true;
			this.currentlyPlaying["scene"] = cutscene;
			this.currentlyPlaying["index"] = 0;
			this.play(null, parameters);
			return this.deferred.promise();
		},
		
		play: function(deferred, parameters) {
			// more to play in the cutscene?
			var cutscene = this.currentlyPlaying["scene"];
			var current = this.currentlyPlaying["index"];
			if (cutscene.scene[current] != null) {
				var speech = this.dialog(cutscene.scene[current]);
				var txt = $.extend(true, [], cutscene.scene[current].text);
				var text = parameters != null ? this.prepareText(txt, parameters) : txt;
				this.showText(speech.text, text, 0, 0)
				// play the next dialog on space
				this.currentlyPlaying["index"]++;
				this.dialogKeyPress(deferred);
			}
			// cutscene is done
			else {
				// remove all the dialogs from the stage
				Scene.initDialogs();
				priority = 0;
				stage.update();
				cutscene = null;
				current = 0;
				this.deferred.resolve('cutscene complete');
			}
		},
		
		/*
		 * Create the dialog box for a cutscene
		 * @param dialog The dialog to play
		 */
		dialog: function(dialog) {
			var container = new Dialog().createSpeech(dialog);
			if (!dialog.position) {
				dialog.position = DIALOG_POSITION_DEFAULT;
			}
			Scene.updateDialogPosition(dialog.position, container.container);
			Scene.containers.dialogLayer.addChild(container.container);
			stage.update();
			
			if (dialog.audio) {
				AudioManager.play(dialog.audio);
			}
			
			return container;
		},
		
		// TODO should go in Dialog
		showText: function(target, text, segmentIndex, index) {
			var self = this;
			if (text[segmentIndex] && (text[segmentIndex].message.length > index) && (Scene.animation.loadingText)) {
				if (index == 0 && text[segmentIndex].audio) {
					AudioManager.play(text[segmentIndex].audio);
				}
				this.updateText(target, text[segmentIndex].message.substring(index, index+1));
				stage.update();
				var timeout = text[segmentIndex].time ? this.getTextSpeedByTime(text[segmentIndex].time, text[segmentIndex].message.length) : this.getTextSpeed(text[segmentIndex].speed);
				console.log(timeout);
				setTimeout(function() {
					self.showText(target, text, segmentIndex, index+1);
				}, timeout);
			}
			else {
				if ((segmentIndex < text.length) && (Scene.animation.loadingText)) {
					this.showText(target, text, segmentIndex + 1, 0)
				}
				else {
					Scene.animation.loadingText = false;
					this.updateText(target, text);
					if (this.currentlyPlaying['scene'].unskippable) {
						Scene.animation.loadingText = true;
						setTimeout(function() {
							self.play();
						}, 1000);
					}
				}
			}
		},
		

		updateText: function(target, text) {
			if (!Scene.animation.loadingText) {
				target.text = "";
				for (var i = 0; i < text.length; i++) {
					target.text += text[i].message;
				}
				stage.update();
			}
			else {
				target.text += text;
			}
		},
		
		prepareText: function(text, parameters) {
			for (var i = 0; i < text.length; i++) {
				for (var j = 0; j < parameters.length; j++) {
					text[i].message = text[i].message.replace("{" + j + "}", parameters[j]);
				}
			}
			return text;
		},
		
		getTextSpeed: function(speed) {
			if (!speed) {
				return DIALOG_TEXT_SPEED["DEFAULT"];
			}
			return DIALOG_TEXT_SPEED[speed];
		},
		
		getTextSpeedByTime: function(time, characters) {
			return ((time * 1000) / characters);
		},
		
		dialogKeyPress: function(deferred) {
			var self = this;
			document.onkeypress = function(e) {
				if (e.keyCode == KEYCODES["SPACE"]) {
					var cutscene = self.currentlyPlaying["scene"];
					var current = self.currentlyPlaying["index"];
					if (Scene.animation.loadingText) {
						if (!cutscene.unskippable && !cutscene.scene[current-1].unskippable) {
							Scene.animation.loadingText = false;
						}
					}
					else {
						Scene.animation.loadingText = true;
						self.play(deferred);
					}
				}
			}
		}
		
}