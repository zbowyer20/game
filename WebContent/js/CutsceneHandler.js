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
		 * Get the most relevant cutscene to play
		 * Through priority, switches, etc
		 * @param cutscenes The cutscenes in JSON
		 * @returns The cutscene that should be played
		 */
		cutsceneToPlay: function(cutscenes) {
			if (cutscenes == null) {
				return null;
			}
			var bestCutscenes = [];
			for (var i = 0; i < cutscenes.length; i++) {
				bestCutscenes = this.mostRelevantOf(bestCutscenes, cutscenes[i]);
			}
			return bestCutscenes;
		},
		
		mostRelevantOf: function(current, compare) {
			if (current.length == 0 || (compare.priority >= current[0].priority)) {
				if (GameUtils.validToPlay(compare)) {
					if (current.length > 0 && possible.priority == current[0].priority) {
						current.push(possible);
					}
					else {
						var result = [];
						result.push(possible);
						return result;
					}
				}
			}
			return current;
		},
		
		/*
		 * Play a cutscene
		 * @param cutscene The cutscene to play
		 */
		initCutscene: function(cutscene) {
			this.deferred = $.Deferred();
			priority = cutscene != null ? CUTSCENE_PRIORITY: 0;
			Scene.animation.loadingText = true;
			this.play(cutscene, 0);
			return this.deferred.promise();
		},
		
		play: function(cutscene, current, deferred) {
			// more to play in the cutscene?
			if (cutscene.scene[current] != null) {
				var speech = this.dialog(cutscene.scene[current]);
				this.showText(speech.text, cutscene.scene[current].text, 0)
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
			Scene.updateDialogPosition(dialog.position, container.container);
			Scene.containers.dialogLayer.addChild(container.container);
			stage.update();
			
			AudioManager.play(dialog.audio);
			
			return container;
		},
		
		// TODO should go in Dialog
		showText: function(target, text, index) {
			if (index <= text.length) {
				var self = this;
				this.updateText(target, text, index);
				stage.update();
				setTimeout(function() {
					self.showText(target, text, index+1);
				}, textSpeed);
			}
			else {
				Scene.animation.loadingText = false;
			}
		},
		

		updateText: function(target, text, index) {
			if (!Scene.animation.loadingText) {
				index = text.length;
			}
			target.text = text.substring(0, index);
		},
		
		dialogKeyPress: function(cutscene, current, deferred) {
			var self = this;
			document.onkeypress = function(e) {
				if (e.keyCode == 32) {
					if (Scene.animation.loadingText) {
						Scene.animation.loadingText = false;
					}
					else {
						Scene.animation.loadingText = true;
						self.play(cutscene, current, deferred);
					}
				}
			}
		}
		
}