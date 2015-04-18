var CutsceneHandler = {
		cutscenes: {},
		
		addCutscenes: function(cutscenes) {
			for (var id in cutscenes) {
				this.cutscenes[id] = cutscenes[id];
			}
			console.log(this.cutscenes);
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
			var deferred = $.Deferred();
			priority = cutscene != null ? CUTSCENE_PRIORITY: 0;
			Scene.animation.loadingText = true;
			this.play(cutscene, current, deferred);
			return deferred.promise();
			//var speech = this.dialog(cutscene.scene[0]);
			// when the user presses space, we play the next dialog
			//dialogKeyPress(cutscene, 0);
			//showText(speech.text, cutscene.scene[0].text, 0);
		},
		
		play: function(cutscene, current, deferred) {
			// more to play in the cutscene?
			if (cutscene.scene[current] != null) {
				var speech = dialog(cutscene.scene[current]);
				this.showText(speech.text, cutscene.scene[current].text, 0)
				// play the next dialog on space
				this.dialogKeyPress(cutscene, current+1, deferred);
			}
			// cutscene is done
			else {
				// remove all the dialogs from the stage
				initializeDialogs();
				priority = 0;
				stage.update();
				clickEvent.index++;
				deferred.resolve('cutscene complete');
			}
		},
		
		/*
		 * Create the dialog box for a cutscene
		 * @param dialog The dialog to play
		 */
		dialog: function(dialog) {
			var container = new Dialog().createSpeech(dialog);
			this.updateDialogPosition(dialog.position, container.container);
			Scene.container.addChild(container.container);
			stage.update();
			
			//AudioManager.play(dialog.audio);
			
			return container;
		},
		
		// TODO should go in Dialog
		showText: function(target, text, index) {
			if (index <= text.length) {
				updateText(target, text, index);
				stage.update();
				setTimeout(function() {
					showText(target, text, index+1);
				}, textSpeed);
			}
			else {
				animation.loadingText = false;
			}
		}
		
}