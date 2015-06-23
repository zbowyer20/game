var Event = {
		playEvent: function(json, deferred) {
			var event;
			switch (json.type) {
				case "CUTSCENE":
					event = new EventCutscene(json, deferred).playResult();
					break;
			}
			if (event) {
				return event.playResult();
			}
		}
}