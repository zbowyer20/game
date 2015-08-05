var EventManager = {
		playEvent: function(json, deferred) {
			var event;
			GameUtils.incrementPlayedCount(json.id);
			GameUtils.setSwitch(json.switchOn, true);
			if (json.plays) {
				for (var i = 0; i < json.plays.length; i++) {
					var playEvent = json.plays[i];
					if (playEvent.number == GameUtils.getPlayedCount(json.id)) {
						GameUtils.setSwitch(playEvent.switchOn, true);
					}
				}
			}
			switch (json.type) {
				case "CUTSCENE":
					event = new EventCutscene(json, deferred);
					break;
				case "SCENE_CHANGE":
					event = new EventSceneChange(json, deferred);
					break;
				case "MOVE":
					event = new EventMove(json, deferred);
					break;
				case "GAINED_FILE":
					event = new EventGainedFile(json, deferred);
					break;
				case "GAINED_ITEM":
					event = new EventGainedItem(json, deferred);
					break;
				case "AUDIO":
					event = new EventAudio(json, deferred);
					break;
				case "PUZZLE_ATTEMPT":
					event = new EventPuzzleAttempt(json, deferred);
					break;
				case "VIDEO":
					event = new EventVideo(json, deferred);
					break;
				case "UPDATE_BACKGROUND":
					event = new EventUpdateBackground(json, deferred);
					break;
			}
			if (event) {
				AudioManager.play(event.audio);
				return event.playResult();
			}
		}
}