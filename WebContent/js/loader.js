var Loader = {
		
		loadManifest: function() {
			return $.getJSON("json/manifest.json");
		},
		
		loadAssets: function(imageManifest, audioManifest) {
			var self = this;
			return new Promise(function(resolve, reject) {
				self.loadImages(imageManifest)
//					.then(function() {
//						self.loadAudio(audioManifest);
//					})
					.then(function() {
						console.log('successful');
						resolve("successful");
					})
			});
		},
		
		loadImages: function(manifest) {
			return new Promise(function(resolve, reject) {
				var loadQueue = new createjs.LoadQueue(false);
				loadQueue.addEventListener("fileload", handleFileLoad);
		        loadQueue.addEventListener("complete", handleComplete);
				
				loadQueue.loadManifest(manifest);
		    
				loadQueue.addEventListener("progress", handleProgress);
		    
			    function handleFileLoad(evt) {
			        if (evt.item.type == "image") { 
			        	images[evt.item.id] = evt.result;
			        	console.log('loaded');
			        }
			    }
		    
			    function handleComplete() {
			    	console.log('resolved');
			    	resolve(images);
			    }
			    
			    function handleProgress() {
			    	stage.update();
			    }
			});
		},
		
		loadAudio: function(manifest) {
			AudioManager.init().loadManifest(manifest);
		}
		
}