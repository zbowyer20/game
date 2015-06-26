var EventManager = {
		playEvent: function(json, deferred) {
			var event;
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
			}
			if (event) {
				AudioManager.play(event.audio);
				return event.playResult();
			}
		}
}