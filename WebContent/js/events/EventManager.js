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
			event.playResult();
			return deferred;
		}
	},

	/*
	 * Get the most relevant event to play
	 * Through priority, switches, etc
	 * @param events The events in JSON
	 * @returns The events that should be played
	 */
	getRelevantEvents: function(events) {
		if (events == null) {
			return null;
		}
		var results = [];
		for (var i = 0; i < events.length; i++) {
			results = this.mostRelevantOf(results, events[i]);
		}
		return results;
	},
		
	mostRelevantOf: function(current, compare) {
		if (current.length == 0 || (compare.priority >= current[0].priority)) {
			if (GameUtils.validToPlay(compare)) {
				if (current.length > 0 && compare.priority == current[0].priority) {
					current.push(compare);
				}
				else {
					var result = [];
					result.push(compare);
					return result;
				}
			}
		}
		return current;
	},
	
	playRelevantEvents: function(events) {
		console.log(events);
		var events = this.getRelevantEvents(events);
		var deferred = $.Deferred();
		this.playEvents(events, deferred);
		return deferred.promise();
	},
	
	playEvents: function(events, def) {
		console.log(events);
		if (events.length > 0) {
			var self = this;
			var evDef = $.Deferred();
			this.playEvent(events[0], evDef).then(function() {
				events.shift();
				self.playEvents(events, def);
			});
		}
		else {
			def.resolve('complete');
			return true;
		}
	}
}