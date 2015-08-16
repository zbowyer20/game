var Scene = {
		assets: {},
		components: {areas: {}, dialogs : {}},
		puzzles: {},
		animation: {},
		videos: [],
		containers: {
			globalLayer: null, 
			areaLayer: null, 
			navigationLayer: null, 
			videoLayer: null,
			dialogLayer: null,
			topLayer: null
		},
		
		init: function(sceneName) {
			var self = this;
			document.onkeydown = function(e) {
				self.keyDown(e);
			}
			Loader.loadManifest()
				.then(function(data) { 
					self.assets = data;
					return $.when(self.loadScene("global"), self.loadScene(sceneName));
				})
				.then(function() {
					$.when(Loader.loadContent()).done(function(cutscenes, items, files, puzzles) {
						PuzzleHandler.addPuzzles(puzzles[0].puzzles);
						FileHandler.addFiles(files[0].files);
						ItemHandler.addItems(items[0].items);
						CutsceneHandler.addCutscenes(cutscenes[0].cutscenes);
						self.populate(sceneName);
					})
				});
		},
		
		getSceneId: function(sceneName) {
			return "scene-" + sceneName;
		},
		
		loadScene: function(sceneName) {
			var sceneId = this.getSceneId(sceneName);
			var self = this;
			if ((self.assets[sceneId].video.length) == 0) {
				return Loader.loadSceneAssets(this.assets[sceneId].nonVideo, true);
			}
			else {
				return $.when(Loader.loadSceneAssets(this.assets[sceneId].nonVideo, true), Loader.loadSceneAssets(self.assets[sceneId].video, false));
			}
		},
		
		nextScene: function(sceneName) {
			var self = this;
			$.when(self.loadScene(sceneName)).done(function() {
				self.clear().populate(sceneName);
			});
		},
		
		clear: function() {
			for (var i in this.videos) {
				this.videos[i].image.pause();
			}
			this.videos = [];
			layers.sceneLayer.removeAllChildren();
			return this;
		},
		
		populate: function(sceneName) {
			var self = this;
			Loader.loadLevel(sceneName)
			 .then(function(json) {
				 for (var container in self.containers) {
					 self.containers[container] = new createjs.Container()
				 }
			     self.containers.audioContainer = Muter.init().icon;
			     self.containers.globalLayer.addChild(self.containers.areaLayer);
			     if (json.UI) {
			    	 self.containers.globalLayer.addChild(ItemContainer.init().container);
				     self.containers.globalLayer.addChild(self.containers.audioContainer);
			     }
			     self.containers.globalLayer.addChild(self.containers.navigationLayer);
			     self.containers.globalLayer.addChild(self.containers.videoLayer);
			     self.containers.globalLayer.addChild(self.containers.dialogLayer);
			     self.containers.globalLayer.addChild(self.containers.topLayer);
				 layers.sceneLayer.addChild(self.containers.globalLayer);
			     veil = new Veil();
				 layers.sceneLayer.addChild(veil.container);
				 if (json.UI) initMenu();		
				 self.containers.areaLayer.addChild(self.setupAreas(json));
			     self.initNavigation();
			 })
		},
		
		keyDown: function(e) {
			switch (e.keyCode) {
				case KEYCODES["LEFT"]:
					if (checkPriority(NAVIGATION_PRIORITY)) {
						if (this.components.areas.current.getDestinationByDirection(DIRECTION_LEFT)) {
							this.moveInDirection(DIRECTION_LEFT);
						}
					}
					break;
				case KEYCODES["RIGHT"]:
					if (checkPriority(NAVIGATION_PRIORITY)) {
						if (this.components.areas.current.getDestinationByDirection(DIRECTION_RIGHT)) {
							this.moveInDirection(DIRECTION_RIGHT);
						}
					}
					break;
				case KEYCODES["DOWN"]:
					if (checkPriority(NAVIGATION_PRIORITY)) {
						if (this.components.areas.current.getDestinationByDirection(DIRECTION_BACK)) {
							this.moveInDirection(DIRECTION_BACK);
						}
					}
					break;
			}		
		},
		
		setupAreas: function(json) {
			this.components.areas.current = this.initAreas(json);
			return this.initAreaContainer(this.components.areas.current, true);
		},
		
		/*
		* Store the received JSON backgrounds
		* @param json The backgrounds in json
		*/
		initAreas: function(json) {
			var defaultArea; 
			var self = this;
			
			if (!this.components.areas) {
				this.components.areas = {};
			}
			// Load every scene (ie. background image)
			for (var i = 0; i < json.areas.length; i++) {
				this.components.areas[json.areas[i].name] = new Area(json.areas[i]);
				if (json.areas[i].defaultBackground) {
					defaultArea = this.components.areas[json.areas[i].name];
					 if (json.areas[i].arrive) {
						new Clickable("").loadClickableClickResult(json.areas[i].arrive);
					 }
				}
			}
			
			return defaultArea;
			
		},
		
		initAreaContainer: function(area, includeClickables) {
			var container = new createjs.Container();
			container.name = "backgroundContainer";
			var layers = [new createjs.Container(), new createjs.Container(), new createjs.Container()];
			for (var i = 0; i < layers.length; i++) {
				container.addChild(layers[i]);
			}
			if (includeClickables) this.addClickablesToContainer(layers, area, 0);
			var bg = area.getBackground();
			layers[1].addChild(bg.image);
			layers[1].name = "bg";
			if (bg.video) {
				this.videos.push(bg.video);
				layers[1].addChild(bg.video);
			}
			return container;
		},
		
		addClickablesToContainer: function(layers, area, offStageMultiplier) {
			var clickables = area.getClickables(true);
			for (var id in clickables) {
				if (clickables[id].text) {
					layers[2].addChild(clickables[id].text);
				}
				layers[clickables[id].layer].addChild(clickables[id].bitmap);
				clickables[id].bitmap.x = clickables[id].getPrimaryPosition().x + (stage.canvas.width * offStageMultiplier);
			}
		},
		
		removeClickableFromContainer: function(id) {
			var container = this.containers.areaLayer.getChildByName("backgroundContainer");
			for (var i = 0; i < container.children.length; i++) {
				var child = container.getChildAt(i);
				var clickable = child.getChildByName(id);
				if (clickable != null) {
					child.removeChild(clickable);
				}
			}
		},
		
		initDialogs: function() {
			var self = this;
			$.each(this.components.dialogs, function(name, value) {
			    self.containers.dialogLayer.removeChild(value);
			});
			this.components.dialogs = {};
			return true;
		},
		
		/*
		 * Update a dialog in a particular space
		 * If there's already a dialog in this position, we replace it
		 * @param position The dialog position to update
		 * @param newDialog The new dialog to put there
		 */
		updateDialogPosition: function(position, dialog) {
			// nothing there so we add a new one
			if (this.components.dialogs[position] == null) {
				this.components.dialogs[position] = dialog;
			}
			else {
				// get rid of the old dialog
				this.containers.dialogLayer.removeChild(this.components.dialogs[position]);
				this.components.dialogs[position] = dialog;
			}
		},
		
		/*
		* Set up the arrows to appear for this scene
		* @param data Data, duh
		*/
		initNavigation: function() {
			// For every direction for the current background, add an arrow
			var navigation = this.createNavigation();
			// Add those arrows to the scene
			for (var i = 0; i < navigation.length; i++) {
				this.containers.navigationLayer.addChild(navigation[i]);
			}					
			stage.update();
		},

		createNavigation: function() {
			var containers = [];
			var movements = this.components.areas.current.getMovements();
			for (var movement in movements) {
				containers.push(this.createNavigationIcon(movement));
			}
			return containers;
		},
		
		createNavigationIcon: function(movement) {
			var arrow = drawArrow("rgba(0,0,0,0.5)", "white", movement);
			arrow.addEventListener("click", this.moveInDirectionDelegate(movement));
			return arrow;
		},
		
		clearNavigation: function() {
			this.containers.navigationLayer.removeAllChildren();
			return true;
		},
		
		/*
		* Move in a particular direction from one scene to another
		* @param direction The direction to move in
		*/
		moveInDirection: function(direction) {
			if (checkPriority(NAVIGATION_PRIORITY)) {
				var movementAnimation = this.getMovementAnimation(direction);
				this.turn(this.getMovement(direction), movementAnimation);
			}
		},

		/*
		* Closure stuff... I guess
		*/
		moveInDirectionDelegate: function(direction) {
			var self = this;
			return function() {
				self.moveInDirection(direction);
			}
		},
		
		/*
		* Get the movement animation when moving in a particular direction
		* @param direction The direction to move in
		* @returns The x/y coordinations
		*/
		getMovementAnimation: function(direction) {
			var movementAnimation = {};
			switch (direction) {
				case DIRECTION_LEFT :
					movementAnimation.x = (stage.canvas.width / (4 * DPR));
					movementAnimation.y = 0;
					break;
				case DIRECTION_RIGHT :
					movementAnimation.x = -1 *(stage.canvas.width / (4 * DPR));
					movementAnimation.y = 0;
					break;
				case DIRECTION_BACK :
					movementAnimation = false;
					break;
			}
			return movementAnimation;
		},

		/*
		* Return the particular view to pick when moving, based off of direction
		* @param direction The direction we're moving in
		* @returns The view to move to
		*/
		getMovement: function(direction) {
			return this.components.areas[this.components.areas.current.getDestinationByDirection(direction)];
		},
		
		/*
		* Animation for a particular movement from one scene to another
		* @param area the area we're moving to
		* @param movements how we're moving there
		*/
		turn: function(area, movements) {
			this.clearNavigation();
			var self = this;
			// get the background of the area we're turning to
			var backgroundBit = area.getBackground();
			var offStageMultiplier;
			// if animating movement, put the area to a side
			if (movements) {
				offStageMultiplier = movements.x > 0 ? -1 : 1;
			}
			else {
				// otherwise we can jump right to it
				offStageMultiplier = 0;
			}
			backgroundBit.image.x = stage.canvas.width * offStageMultiplier;
			if (backgroundBit.video) {
				backgroundBit.video.x = stage.canvas.width * offStageMultiplier;
			}			
			var newContainer = this.initAreaContainer(area, false);
			var newContainerBg = newContainer.getChildByName("bg");
			this.containers.areaLayer.addChild(newContainer);
			stage.update();
			// Start animation
			priority = FROZEN_PRIORITY;
			var backgroundContainer = this.containers.areaLayer.getChildByName("backgroundContainer");
			var topContainer = backgroundContainer.getChildByName("bg");
			// discard all hidden clickables from the container
			// we only need to move the background itself
			backgroundContainer.removeAllChildren();
			backgroundContainer.addChild(topContainer);
			AnimationHandler.slideBackgrounds([backgroundContainer, newContainerBg], movements)
							.then(function() {
								self.containers.areaLayer.removeChild(backgroundContainer);
								// now set up the new area
								newContainer.name = "backgroundContainer";
								self.addClickablesToContainer(newContainer.children, area, 0);
								self.components.areas["current"] = area;
								self.initNavigation();
							});
		},
		
}

function checkPriority(targetPriority) {
	return priority <= targetPriority;
}