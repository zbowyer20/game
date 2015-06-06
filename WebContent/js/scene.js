var Scene = {
		assets: {},
		components: {"areas": {}, "dialogs" : {}},
		animation: {},
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
					return Loader.loadSceneAssets(self.assets[sceneId]);
				})
				.then(function(data) {
					var sceneId = self.getSceneId(sceneName);
					return Loader.loadSceneAssets(self.assets[sceneId]);
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
			return Loader.loadSceneAssets(this.assets[sceneId]);
		},
		
		nextScene: function(sceneName) {
			var self = this;
			self.loadScene(sceneName).then(function() {
				self.clear();
				self.populate(sceneName);
			});
		},
		
		clear: function() {
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
			     self.containers.globalLayer.addChild(ItemContainer.init().container);
			     self.containers.globalLayer.addChild(self.containers.navigationLayer);
			     self.containers.globalLayer.addChild(self.containers.dialogLayer);
			     self.containers.globalLayer.addChild(self.containers.audioContainer);
				 layers.sceneLayer.addChild(self.containers.globalLayer);
				 stage.update();
			 })
		},
		
		keyDown: function(e) {
			switch (e.keyCode) {
				case KEYCODES["LEFT"]:
					if (this.components.areas.current.getDestinationByDirection(DIRECTION_LEFT)) {
						this.moveInDirection(DIRECTION_LEFT);
					}
					break;
				case KEYCODES["RIGHT"]:
					if (this.components.areas.current.getDestinationByDirection(DIRECTION_RIGHT)) {
						this.moveInDirection(DIRECTION_RIGHT);
					}
					break;
				case KEYCODES["DOWN"]:
					if (this.components.areas.current.getDestinationByDirection(DIRECTION_BACK)) {
						this.moveInDirection(DIRECTION_BACK);
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
				}
			}
						
			return defaultArea;
			
		},
		
		initAreaContainer: function(defaultArea) {
			var container = new createjs.Container();
			container.name = "backgroundContainer";
			this.addClickablesToContainer(container, this.components.areas.current, 0);
			container.addChild(this.components.areas.current.getBackground());
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
			backgroundBit.x = stage.canvas.width * offStageMultiplier;
			
			var backgroundContainer = this.containers.areaLayer.getChildByName("backgroundContainer");
			
			var newContainer = new createjs.Container();
			//this.addClickablesToContainer(newContainer, area, offStageMultiplier);
			newContainer.addChild(backgroundBit);
						
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
								newContainer.removeChild(backgroundBit);
								newContainer.addChild(backgroundBit);
								self.components.areas["current"] = area;
								self.initNavigation();
							});
		},
		
//		var sceneJsonFile = "json/level" + sceneNumber + ".json";
//		// now we can load all our backgrounds
//	    $.getJSON(sceneJsonFile, function(json) {
//	        storeSceneBackgrounds(json);
//	        // Designate movements for each background
//	        setupBackgrounds();
//	        var backgroundContainer = setupBackgroundContainer();
//	        
//	    	// The container for clickables for this scene
//	        var clickableContainer = initClickables(json);
//	        
//	        // scene container contains background and clickables
//	        var sceneContainer = initSceneContainer(backgroundContainer, clickableContainer);
//	    	        
//	    	var itemContainer = createItemContainer();
//	    	audioContainer = Muter.init().icon;
//	    	globalContainer = new createjs.Container();
//	    	globalContainer.addChild(sceneContainer);
//	    	globalContainer.addChild(itemContainer);
//	    	globalContainer.addChild(audioContainer);
//			
//	    	layers.sceneLayer.addChild(globalContainer);
//	    	
//	    	addVeil();
//	    	
//	    	// Set up the arrows for this scene
//	    	setupNavigation(json);
//	    	stage.update();
//	    });
		
}

var currentView;

var arrowContainers = [];
var globalContainer;

var areas = {};
var items = {};
var clickables = {};
var cutscenes = {};
var dialogs = {};
var areaBackgrounds = {"current": null, "next": null};

var clickEvent = {"clickable": null, "events": null, "index": 0};

var animation = {"sliding": false, "loadingText": false};
var animationMovements = {"x": 0, "y": 0};

var veil;

function handleFileLoad(evt) {
    console.log('loaded');
}

function loadGame(sceneNumber) {
	// picking up our cutscenes via JSON
	$.getJSON("json/cutscenes.json", function(json) {
		storeCutscenes(json.cutscenes);
	});
	
	// let's load all our items too
	$.getJSON("json/items.json", function(json) {
		//TODO foreach loop can be used here
		storeItems(json.items);
	});
	
	loadSceneByNumber(sceneNumber);

	createjs.Ticker.on("tick", tick);
	createjs.Ticker.setFPS(45);
		
	stage.update();
}

function loadSceneByNumber(sceneNumber) {
	var sceneJsonFile = "json/level" + sceneNumber + ".json";
	// now we can load all our backgrounds
    $.getJSON(sceneJsonFile, function(json) {
        storeSceneBackgrounds(json);
        // Designate movements for each background
        setupBackgrounds();
        var backgroundContainer = setupBackgroundContainer();
        
    	// The container for clickables for this scene
        var clickableContainer = initClickables(json);
        
        // scene container contains background and clickables
        var sceneContainer = initSceneContainer(backgroundContainer, clickableContainer);
    	        
    	var itemContainer = createItemContainer();
    	audioContainer = Muter.init().icon;
    	globalContainer = new createjs.Container();
    	globalContainer.addChild(sceneContainer);
    	globalContainer.addChild(itemContainer);
    	globalContainer.addChild(audioContainer);
    	
    	layers.sceneLayer.addChild(globalContainer);
    	
    	addVeil();
    	
    	// Set up the arrows for this scene
    	setupNavigation(json);
    	stage.update();
    });
}

///////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////          GAME 			/////////////
////////////////////////////////////////////////
///////////////////////////////////////////////


/*
* Set up the arrows to appear for this scene
* @param data Data, duh
*/
function setupNavigation(data) {
	// Remove all that arrow shit from before
	removeNavigation();

	// For every direction for the current background, add an arrow
	createNavigation();
	
	// Add those arrows to the scene
	for (var i = 0; i < arrowContainers.length; i++) {
		globalContainer.addChild(arrowContainers[i]);
	}
	
	function removeNavigation() {
		for (var i = 0; i<arrowContainers.length; i++) {
			globalContainer.removeChild(arrowContainers[i]);
		}
		return true;
	}

	function createNavigation() {
		arrowContainers = [];
		for (var movements in currentView.getMovements()) {
			arrowContainers.push(createNavigationArrow(movements));
		}
		return true;
	}

	function createNavigationArrow(direction) {
		var arrow = drawArrow("green", direction);
		arrow.addEventListener("click", moveInDirectionDelegate(direction));
		return arrow;
	}
}

function handleLoad(event) {
}

function isActiveItem(id) {
	var heldItem = player.getHeldItem();
	return (heldItem && heldItem.id == id);
}

function addVeil() {
	veil = new Veil();
	layers.sceneLayer.addChild(veil.container);
}

///////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////			VIEWS 			/////////////
////////////////////////////////////////////////
///////////////////////////////////////////////

/*
* Get the movement animation when moving in a particular direction
* @param direction The direction to move in
* @returns The x/y coordinations
*/
function getMovementAnimation(direction) {
	var movementAnimation = {};
	switch (direction) {
		case DIRECTION_LEFT :
			movementAnimation.changeX = (stage.canvas.width / (20000 * DPR));
			movementAnimation.changeY = 0;
			break;
		case DIRECTION_RIGHT :
			movementAnimation.changeX = -1 *(stage.canvas.width / (20000 * DPR));
			movementAnimation.changeY = 0;
			break;
	}
	return movementAnimation;
}

function checkPriority(targetPriority) {
	return priority <= targetPriority;
}