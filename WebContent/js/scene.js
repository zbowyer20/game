var Scene = {
		assets: {},
		components: {"areas": {}, "dialogs" : {}},
		puzzles: {},
		animation: {},
		videos: [],
		containers: {"globalLayer": null, "areaLayer": null, "navigationLayer": null, "dialogLayer": null},
		
		init: function(sceneName) {
			var self = this;
			stage.enableMouseOver(20);
			PopupHandler.init();
			ItemContainer.init();
			AnimationHandler.init();
			document.onkeydown = function(e) {
				self.keyDown(e);
			}
			Loader
				.loadManifest()
				.then(function(data) { 
					self.assets = data;
					var sceneId = self.getSceneId("global");
					return Loader.loadSceneAssets(self.assets[sceneId].nonVideo, true);
				})
				.then(function(data) {
					var sceneId = self.getSceneId("global");
					if (self.assets[sceneId].video.length > 0) {
						return Loader.loadSceneAssets(self.assets[sceneId].video, false);
					}
				})
				.then(function(data) {
					var sceneId = self.getSceneId(sceneName);
					return Loader.loadSceneAssets(self.assets[sceneId].nonVideo, true);
				})
				.then(function(data) {
					var sceneId = self.getSceneId(sceneName);
					if (self.assets[sceneId].video.length > 0) {
						return Loader.loadSceneAssets(self.assets[sceneId].video, false);
					}
				})
				.then(function(data) {
					return Loader.loadPuzzles();
				})
				.then(function(data) {
					PuzzleHandler.addPuzzles(data.puzzles);
				})
				.then(function(data) {
					// TODO file images dont work
					return Loader.loadFiles();
				})
				.then(function(data) {
					FileHandler.addFiles(data.files);
				})
				.then(function(data) {
					return Loader.loadItems();
				})
				.then(function(data) {
					ItemHandler.addItems(data.items);
					return Loader.loadCutscenes();
				})
				.done(function(data) {
					CutsceneHandler.addCutscenes(data.cutscenes);
					self.populate(sceneName);
				});
		},
		
		getSceneId: function(sceneName) {
			return "scene-" + sceneName;
		},
		
		loadGame: function() {
			console.log(images);
		},
		
		loadScene: function(sceneName) {
			var sceneId = this.getSceneId(sceneName);
			var self = this;
			Loader.loadSceneAssets(this.assets[sceneId].nonVideo, true).then(function(data) {
				return Loader.loadSceneAssets(self.assets[sceneId].video, false);
			});
		},
		
		// TODO fix this
		nextScene: function(sceneName) {
			var self = this;
			var sceneId = self.getSceneId(sceneName);
			Loader.loadSceneAssets(self.assets[sceneId].nonVideo, true).then(function(data) {
				if (self.assets[sceneId].video.length) {
					return Loader.loadSceneAssets(self.assets[sceneId].video, false);
				}
			}).then(function(data) {
				self.clear();
				self.populate(sceneName);
			});
		},
		
		clear: function() {
			for (var i in this.videos) {
				this.videos[i].image.pause();
			}
			this.videos = [];
			layers.sceneLayer.removeAllChildren();
		},
		
		populate: function(sceneName) {
			var self = this;
			$.when(Loader.loadLevel(sceneName))
			 .then(function(json) {
				 var containers = {};
				 self.containers.globalLayer = new createjs.Container();
				 self.containers.areaLayer = new createjs.Container();
				 self.containers.navigationLayer = new createjs.Container();
				 self.containers.dialogLayer = new createjs.Container();
			     self.containers.audioContainer = Muter.init().icon;

				 self.containers.areaLayer.addChild(self.setupAreas(json));
			     self.initNavigation();
			     
			     self.containers.globalLayer.addChild(self.containers.areaLayer);
			     if (json.UI) {
			    	 self.containers.globalLayer.addChild(ItemContainer.init().container);
				     self.containers.globalLayer.addChild(self.containers.audioContainer);
			     }
			     self.containers.globalLayer.addChild(self.containers.navigationLayer);
			     self.containers.globalLayer.addChild(self.containers.dialogLayer);

				 layers.sceneLayer.addChild(self.containers.globalLayer);
			     veil = new Veil();
				 layers.sceneLayer.addChild(veil.container);
				 
				 if (json.UI) {
					 initMenu();
				 }
				 
				 stage.update();
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
			return this.initAreaContainer();
		},
		
		/*
		* Store the received JSON backgrounds
		* @param json The backgrounds in json
		*/
		initAreas: function(json) {
			var defaultArea; 
			
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
		
		initAreaContainer: function(defaultArea) {
			var container = new createjs.Container();
			container.name = "backgroundContainer";
			this.addClickablesToContainer(container, this.components.areas.current, 0);
			var bg = this.components.areas.current.getBackground();
			container.addChild(bg.image);
			if (bg.video) {
				this.videos.push(bg.video);
				container.addChild(bg.video);
			}
			return container;
		},
		
		addClickablesToContainer: function(container, area, offStageMultiplier) {
			var clickables = area.getClickables(true);
			for (var id in clickables) {
				container.addChild(clickables[id].bitmap);
				clickables[id].bitmap.x = clickables[id].getPrimaryPosition().x + (stage.canvas.width * offStageMultiplier);
			}
		},
		
		removeClickableFromContainer: function(id) {
			var container = this.containers.areaLayer.getChildByName("backgroundContainer");
			var clickable = container.getChildByName(id);
			container.removeChild(clickable);
			stage.update();
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
			var arrow = drawArrow("red", movement);
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
		* @param newView the view we're moving to
		*/
		turn: function(next, movements) {
			this.turnToArea(next, movements);
			//updateClickables(movements);
			stage.update();
		},
		
		turnToArea: function(area, movements) {
			this.clearNavigation();
			var self = this;
			var backgroundBit = area.getBackground();
			var offStageMultiplier;
			if (movements) {
				offStageMultiplier = movements.x > 0 ? -1 : 1;
			}
			else {
				offStageMultiplier = 0;
			}
			backgroundBit.image.x = stage.canvas.width * offStageMultiplier;
			if (backgroundBit.video) {
				backgroundBit.video.x = stage.canvas.width * offStageMultiplier;
			}
			
			var backgroundContainer = this.containers.areaLayer.getChildByName("backgroundContainer");
			
			var newContainer = new createjs.Container();
			//this.addClickablesToContainer(newContainer, area, offStageMultiplier);
			newContainer.addChild(backgroundBit.image);
			if (backgroundBit.video) {
				newContainer.addChild(backgroundBit.video);
			}
			
			this.containers.areaLayer.addChild(newContainer);
			
			stage.update();
			
			// Start animation
			priority = FROZEN_PRIORITY;
			var topContainer = backgroundContainer.getChildAt(backgroundContainer.children.length - 1);
			backgroundContainer.removeAllChildren();
			backgroundContainer.addChild(topContainer);
			AnimationHandler.slideBackgrounds([backgroundContainer, newContainer], movements)
							.then(function() {
								self.containers.areaLayer.removeChild(backgroundContainer);
								newContainer.name = "backgroundContainer";
								self.addClickablesToContainer(newContainer, area, 0);
								newContainer.removeChild(backgroundBit.image);
								if (backgroundBit.video) {
									newContainer.removeChild(backgroundBit.video);
								}
								newContainer.addChild(backgroundBit.image);
								if (backgroundBit.video) {
									newContainer.addChild(backgroundBit.video);
								}
								self.components.areas["current"] = area;
								self.initNavigation();
							});
		},
		
}

//function isActiveItem(id) {
//	var heldItem = player.getHeldItem();
//	return (heldItem && heldItem.id == id);
//}

function checkPriority(targetPriority) {
	return priority <= targetPriority;
}