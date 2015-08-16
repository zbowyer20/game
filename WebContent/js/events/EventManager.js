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
				case "MULTIPLE":
					event = new EventMultiple(json, deferred);
					break;
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
				case "REMOVED_ITEM": 
					event = new EventRemovedItem(json, deferred);
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

var EventMultiple = function(event, deferred) {
	var def = deferred;
	
	this.playResult = function() {
		for (var i = 0; i < event.events.length; i++) {
			if (event.events[i].finisher) {
				ret = EventManager.playEvent(event.events[i], def);
			}
			else {
				EventManager.playEvent(event.events[i], $.Deferred());
			}
		}
	}
}