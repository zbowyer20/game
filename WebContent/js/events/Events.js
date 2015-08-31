function EventAudio(event, deferred) {
	var audio;
	var def;
	
	audio = event.audio;
	def = deferred;
	
	this.playResult = function() {
		if (audio.stop) {
			AudioManager.stop();
		}
		else {
			AudioManager.play(audio);
		}
		def.resolve('complete');
	}
		
	return this;
}

function EventCutscene(event, deferred) {
	var cutscene;
	var def;
		
	cutscene = CutsceneHandler.findCutscene(event.id);
	def = deferred;
	
	this.playResult = function() {
		ItemContainer.hide();
		var parameters = event.parameters ? this.loadParameters(event.parameters) : null;
		CutsceneHandler.initCutscene(cutscene, parameters).then(function() {
			ItemContainer.show();
			def.resolve('complete');
		});
	}
		
	this.loadParameters = function(parameters) {
		var params = [];
		for (var i = 0; i < parameters.length; i++) {
			params = this.loadParameter(params, parameters[i]);
		}
		return params;
	}
	
	this.loadParameter = function(parameters, parameter) {
		switch (parameter.type) {
			case "SINGLE": 
				return parameters.push(parameter.value);
				break;
			case "PUZZLE-STATE":
				var puzzleState = PuzzleHandler.getPuzzle(parameter.id).getState();
				for (var opts in puzzleState) {
					parameters.push(puzzleState[opts]);
				}
				return parameters;
				break;
		}
	}
	
	return this;
}

function EventGainedFile(event, deferred) {
	var file;
	var def;
			
	file = FileHandler.files[event.id];
	def = deferred;
	
	this.playResult = function() {
		player.addFile(file);
		PopupHandler.addFile(file).display().then(function() {
			deferred.resolve('complete');
		})
	}
		
	return this;
}

function EventGainedItem(event, deferred) {
	var item;
	var def;
			
	item = ItemHandler.items[event.id];
	def = deferred;
	
	this.playResult = function() {
		player.addItem(item);
		ItemContainer.update(player.getHeldItem());
		AudioManager.play(event.audio);
		PopupHandler.addItem(item).display().then(function() {
			deferred.resolve('complete');
		})
	}
		
	return this;
}

function EventMultiple(event, deferred) {
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

function EventMove(event, deferred) {
	var destination;
	var def;
		
	destination = event.destination;
	def = deferred;
	
	this.playResult = function() {
		Scene.turn(Scene.components.areas[destination], false);
		deferred.resolve('complete');
	}
		
	return this;
}

function EventPuzzleAttempt(event, deferred) {
	var puzzle;
	var def;
		
	puzzle = PuzzleHandler.getPuzzle(event.puzzleID);
	def = deferred;
	
	this.playResult = function() {
		console.log('att');
		puzzle.update(event.effect);
		if (puzzle.solved()) {
			console.log('solved');
			new Clickable().loadClickableClickResult(puzzle.solvedEvent).then(function() {
				def.resolve('complete');
			});
			
		}
		else {
			console.log('not solved');
			def.resolve('complete');

		}
	}
		
	return this;
}

function EventRemovedItem(event, deferred) {
	var item;
	var def;
			
	item = ItemHandler.items[event.id];
	def = deferred;
	
	this.playResult = function() {
		player.removeItem(item);
		ItemContainer.update(player.getHeldItem());
		AudioManager.play(event.audio);
		deferred.resolve('complete');
	}
		
	return this;
}

function EventSceneChange(event, deferred) {
	var id;
	var def;
		
	id = event.id;
	def = deferred;
	
	this.playResult = function() {
		Scene.nextScene(id);
		def.resolve('complete');
	}
		
	return this;
}

function EventUpdateBackground(event, deferred) {
	var area;
	var def;
	
	area = Scene.components.areas[event.id];
	def = deferred;
	
	this.playResult = function() {
		console.log('updating background');
		if (area) {
			area.clearBackground();
			area.setBackground(event.newId);
		}
		else {
			console.error('Area could not be found')
		}
		def.resolve('complete');
	}
		
	return this;
}

function EventVideo(event, deferred) {
	var video;
	var def;
	
	video = event.video;
	def = deferred;
	
	this.playResult = function() {
		var vid = convertVideoToScaledBitmap(videos[event.id], 0, MENU_HEIGHT, stage.canvas.width, stage.canvas.height - MENU_HEIGHT);
		Scene.containers.videoLayer.addChild(vid);
		vid.image.onended = function() {
			vid.image.pause();
			Scene.containers.videoLayer.removeChild(vid);
			def.resolve('complete');
		};
	}
		
	return this;
}