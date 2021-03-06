var Loader = {
		loadManifest: function() {
			return $.getJSON("json/manifest.json");
		},
		
		loadSceneAssets: function(manifest, soundEnabled) {
			var deferred = $.Deferred();
			var loadQueue = new createjs.LoadQueue(false);
			if (soundEnabled) {
				loadQueue.installPlugin(createjs.Sound);
			}
			loadQueue.addEventListener("fileload", handleFileLoad);
		    loadQueue.addEventListener("complete", handleComplete);
		    		    
			loadQueue.loadManifest(manifest);
	    
			loadQueue.addEventListener("progress", handleProgress);
	    
			
		    function handleFileLoad(evt) {
		        if (evt.item.type == "image") { 
		        	images[evt.item.id] = evt.result;
		        }
		        if (evt.item.type == "video") { 
		        	videos[evt.item.id] = evt.result;
		        	if (evt.item.loop) { videos[evt.item.id].loop = true };
		        }
		        if (evt.item.type == "sound") {
		        	// no need to store sound
		        }
		    }
	    
		    function handleComplete() {
		    	deferred.resolve(images);
		    }
		    
		    function handleProgress() {
		    	stage.update();
		    }
		    
		    return deferred.promise();
		},
		
		loadLevel: function(sceneNumber) {
			var sceneJsonFile = "json/level" + sceneNumber + ".json";
			// now we can load all our backgrounds
			return $.getJSON(sceneJsonFile);
		},
		
		loadContent: function() {
			return $.when(
					$.getJSON("json/cutscenes.json"),
					$.getJSON("json/items.json"),
					$.getJSON("json/files.json"),
					$.getJSON("json/puzzles.json")
			);
		},
		
		loadCutscenes: function() {
			return $.getJSON("json/cutscenes.json");
		},
		
		loadItems: function() {
			return $.getJSON("json/items.json");
		},
		
		loadFiles: function() {
			return $.getJSON("json/files.json");
		},
		
		loadPuzzles: function() {
			return $.getJSON("json/puzzles.json");
		}
}