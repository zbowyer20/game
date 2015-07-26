var CutsceneHandler = {
		cutscenes: {},
		
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
			this.play(cutscene, 0, null, parameters);
			return this.deferred.promise();
		},
		
		play: function(cutscene, current, deferred, parameters) {
			// more to play in the cutscene?
			if (cutscene.scene[current] != null) {
				var speech = this.dialog(cutscene.scene[current]);
				var txt = $.extend(true, [], cutscene.scene[current].text);
				var text = parameters != null ? this.prepareText(txt, parameters) : txt;
				this.showText(speech.text, text, 0, 0)
				// play the next dialog on space
				this.dialogKeyPress(cutscene, current+1, deferred);
			}
			// cutscene is done
			else {
				// remove all the dialogs from the stage
				Scene.initDialogs();
				priority = 0;
				stage.update();
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
			if (text[segmentIndex] && (text[segmentIndex].message.length > index) && (Scene.animation.loadingText)) {
				var self = this;
				this.updateText(target, text[segmentIndex].message.substring(index, index+1));
				stage.update();
				setTimeout(function() {
					self.showText(target, text, segmentIndex, index+1);
				}, self.getTextSpeed(text[segmentIndex].speed));
			}
			else {
				if ((segmentIndex < text.length) && (Scene.animation.loadingText)) {
					this.showText(target, text, segmentIndex + 1, 0)
				}
				else {
					Scene.animation.loadingText = false;
					this.updateText(target, text);
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
		
		dialogKeyPress: function(cutscene, current, deferred) {
			var self = this;
			document.onkeypress = function(e) {
				if (e.keyCode == KEYCODES["SPACE"]) {
					if (Scene.animation.loadingText) {
						if (!cutscene.scene[current-1].unskippable) {
							Scene.animation.loadingText = false;
						}
					}
					else {
						Scene.animation.loadingText = true;
						self.play(cutscene, current, deferred);
					}
				}
			}
		}
		
}