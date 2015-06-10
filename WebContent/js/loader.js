var Loader = {
		
		loadManifest: function() {
			return $.getJSON("json/manifest.json");
		},
		
		loadSceneAssets: function(assets) {
			Loader.loadAudio(assets.audio);
			if (assets.video) {
				return Loader.loadAssets(assets.images.concat(assets.video));
			}
			else {
				return Loader.loadAssets(assets.images);
			}
		},
		
		loadAssets: function(manifest) {
			var deferred = $.Deferred();
			var loadQueue = new createjs.LoadQueue(false);
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
		
		loadAudio: function(manifest) {
			AudioManager.init().loadManifest(manifest);
		},
		
		loadLevel: function(sceneNumber) {
			var sceneJsonFile = "json/level" + sceneNumber + ".json";
			// now we can load all our backgrounds
			return $.getJSON(sceneJsonFile);
		},
		
		loadCutscenes: function() {
			return $.getJSON("json/cutscenes.json");
		},
		
		loadItems: function() {
			return $.getJSON("json/items.json");
		},
		
		loadFiles: function() {
			return $.getJSON("json/files.json");
		}
		
}