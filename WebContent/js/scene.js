var Scene = {
		components: {"areas": {}, "clickables" : {}, "dialogs" : {}},
		areas: {},
		animation: {},
		container: null,
		containers: {},
		
		init: function(sceneName) {
			var self = this;
			PopupHandler.init();
			ItemContainer.init();
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
		
		nextScene: function(sceneName) {
			this.clear();
			var sceneId = this.getSceneId(sceneName);
			return Loader.loadSceneAssets(sceneId);
		},
		
		clear: function() {
			layers.sceneLayer.removeAllChildren();
		},
		
		populate: function(sceneName) {
			var self = this;
			$.when(Loader.loadLevel(sceneName))
			 .then(function(json) {
				 var containers = {};
				 self.container = new createjs.Container();
				 self.container.addChild(self.setupAreas(json));
			     var clickableContainer = self.initClickables(json);
			     self.container.addChild(clickableContainer);
			     self.container.addChild(ItemContainer.init().container);
			     self.initNavigation();
			     
				 layers.sceneLayer.addChild(self.container);
				 stage.update();
			 })
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
			
			if (!this.areas) {
				this.areas = {};
			}
			// Load every scene (ie. background image)
			for (var i = 0; i < json.areas.length; i++) {
				this.areas[json.areas[i].name] = new Area(json.areas[i]);
				if (json.areas[i].defaultBackground) {
					defaultArea = this.areas[json.areas[i].name];
				}
			}
						
			return defaultArea;
			
		},
		
		initAreaContainer: function(defaultArea) {
			var container = new createjs.Container();
			container.name = "backgroundContainer";
			container.addChild(this.components.areas.current.getBackground());
			return container;
		},
		
		initClickables: function(json) {
			this.components.clickables = {};
			var clickableContainer = new createjs.Container();
			clickableContainer.name = CLICKABLE_CONTAINER_NAME;
			// TODO clickables are initialised for first scene
			var clickablesToAdd = this.addClickablesToArea(json.areas[0].clickables, 0);
			for (var i = 0; i < clickablesToAdd.length; i++) {
				clickableContainer.addChild(clickablesToAdd[i]);
			}
			return clickableContainer;
		},
		
		/*
		 * Add all clickables to the scene
		 * @param clickables The clickables to add
		 */
		addClickablesToArea: function(clickables) {
			clickablesInView = [];
			for (var i = 0; i < clickables.length; i++) {
				var clickable = clickables[i];
				if (this.clickableInView(clickable)) {
					clickablesInView.push(new Clickable(clickable).init());
				}
			}
			return clickablesInView;
		},

		clickableInView: function(clickable) {
			if (!this.components.clickables[clickable.id]) {
				this.components.clickables[clickable.id] = {"addToStage": true};
			}
			return this.components.clickables[clickable.id].addToStage;
		},
		
		initDialogs: function() {
			var self = this;
			$.each(this.components.dialogs, function(name, value) {
			    self.container.removeChild(value);
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
				this.container.removeChild(this.components.dialogs[position]);
				this.components.dialogs[position] = dialog;
			}
		},
		
		/*
		* Set up the arrows to appear for this scene
		* @param data Data, duh
		*/
		initNavigation: function() {
			// For every direction for the current background, add an arrow
			this.containers.navigation = this.createNavigation();
			
			// Add those arrows to the scene
			for (var i = 0; i < this.containers.navigation.length; i++) {
				this.container.addChild(this.containers.navigation[i]);
			}
						
			stage.update();
		},

		createNavigation: function() {
			var containers = [];
			var movements = this.components.areas.current.getMovements();
			for (var i = 0; i < movements.length; i++) {
				containers.push(this.createNavigationIcon(movements[i]));
			}
			return containers;
		},
		
		createNavigationIcon: function(movement) {
			var arrow = drawArrow("red", movement.name);
			//arrow.addEventListener("click", this.moveInDirectionDelegate(direction));
			return arrow;
		},
		
		clearNavigation: function() {
			for (var i = 0; i<this.containers.navigation.length; i++) {
				this.container.removeChild(this.containers.navigation[i]);
			}
			return true;
		}

		
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
			movementAnimation.changeX = (stage.canvas.width / (25 * DPR));
			movementAnimation.changeY = 0;
			break;
		case DIRECTION_RIGHT :
		movementAnimation.changeX = -1 *(stage.canvas.width / (25 * DPR));
		movementAnimation.changeY = 0;
		break;
	}
	return movementAnimation;
}

/*
* Return the particular view to pick when moving, based off of direction
* @param direction The direction we're moving in
* @returns The view to move to
*/
function getMovement(direction) {
	return currentView.getDestinationByDirection(direction);
}

/*
* Move in a particular direction from one scene to another
* @param direction The direction to move in
*/
function moveInDirection(direction) {
	if (checkPriority(NAVIGATION_PRIORITY)) {
		var movementAnimation = getMovementAnimation(direction);
		animationMovements.x = movementAnimation.changeX;
		animationMovements.y = movementAnimation.changeY;
		var movementMultiplier = animationMovements.x > 0 ? -1 : 1;
		turn(getMovement(direction), movementMultiplier);
	}
}

/*
* Closure stuff... I guess
*/
function moveInDirectionDelegate(direction) {
	return function() {
		moveInDirection(direction);
	}
}

/*
* Animation for a particular movement from one scene to another
* @param newView the view we're moving to
*/
function turn(newView, movementMultiplier) {
	var background = stage.getChildByName("backgroundContainer");
	updateBackground(background, newView);
	updateClickables(movementMultiplier);
	stage.update();
}

/*
* Change background when we're moving from one scene to another
* @param background The background for the stage
* @param view The view we're moving to
*/
function updateBackground(background, view) {
	var backgroundBit = view.getBackground();
	backgroundBit.x = animationMovements.x > 0 ? stage.canvas.width * (-1) : stage.canvas.width;
	backgroundBit.movements = view.getBackground().movements;
	backgroundBit.name = view.getBackground().name;
	var backgroundContainer = globalContainer.getChildByName("sceneContainer").getChildByName("backgroundContainer");
	backgroundContainer.addChild(backgroundBit);
	areaBackgrounds["next"] = backgroundBit;
	// Start animation
	priority = FROZEN_PRIORITY;
	animation.sliding = true;
	currentView = view;
}

///////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////      CLICKABLES 			/////////////
////////////////////////////////////////////////
///////////////////////////////////////////////

/*
 * Update clickables for this scene
 */
function updateClickables(movementMultiplier) {
		if (areas[areaBackgrounds["next"].name]) {
			var clickablesToAdd = addClickables(areas[areaBackgrounds["next"].name].clickables, movementMultiplier);
			var clickableContainer = globalContainer.getChildByName("sceneContainer").getChildByName("clickableContainer");
			for (var i = 0; i < clickablesToAdd.length; i++) {
				clickableContainer.addChild(clickablesToAdd[i]);
			}
		}
	stage.update();
}

function checkPriority(targetPriority) {
	return priority <= targetPriority;
}

/*
 * Animation stuff
 */
function tick(event) {
	// For moving direction
	// TODO this is a bit rubbish
	if (animation.sliding) {
		areaBackgrounds["current"].x += animationMovements.x;
		areaBackgrounds["next"].x += animationMovements.x;
		var clickableContainer = globalContainer.getChildByName("sceneContainer").getChildByName("clickableContainer");
		for (var i = 0; i < clickableContainer.children.length; i++) {
			var child = clickableContainer.getChildAt(i);
			child.x += animationMovements.x;
		}
		var finishAnimation = false;
		if (animationMovements.x < 0) {
			finishAnimation = areaBackgrounds["next"].x <= 0;
		}
		else {
			finishAnimation = areaBackgrounds["next"].x >= 0;
		}
		if (finishAnimation) {
			animation.sliding = false;
			priority = LOWEST_PRIORITY;
			areaBackgrounds["next"].x = 0;
			var backgroundContainer = globalContainer.getChildByName("sceneContainer").getChildByName("backgroundContainer");
			backgroundContainer.removeChild(areaBackgrounds["current"]);
			areaBackgrounds["current"] = areaBackgrounds["next"];
			var i = 0;
			while (i < clickableContainer.children.length) {
				var child = clickableContainer.getChildAt(i);
				if ((child.x < 0) || child.x >stage.canvas.width) {
					clickableContainer.removeChild(child);
					i--;
				}
				i++;
			}
		}
		stage.update();
	}
}