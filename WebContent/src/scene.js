var currentView;
var currentBackground;

var arrowContainers = [];
var globalContainer;

var sceneBackgrounds = {};

var items = [];
var clickables = [];
var cutscenes = {};
var currentDialogs = {};
var loadingText = false;

var sliding = false;
var animation = {"x": 0, "y": 0};
var nextBackground;

var sceneJson;
var itemJson;

var images = {};

var veil;

function initScene() {
	initScene0();
}

function initScene0() {	    
	// Retrieve the JSON data for this particular scene	
	$.getJSON("json/manifest.json", function(json) {
		loadImages(json.images);
		loadAudio(json.audio);
	});
		
}

/*
 * Load all our image and audio files before showing the game
 */
function loadImages(manifest) {
	var loader = new createjs.LoadQueue(false);
	loader.addEventListener("fileload", handleFileLoad);
    loader.addEventListener("complete", handleComplete);
    
    loader.loadManifest(manifest);
    
    loader.addEventListener("progress", handleProgress);
    
    function handleFileLoad(evt) {
        if (evt.item.type == "image") { 
        	images[evt.item.id] = evt.result; 
        }
    }
    
    function handleComplete() {
    	// now we can load the game
    	loadGame();
        stage.update();
    }
    
    function handleProgress() {
    	stage.update();
    }
}

function loadAudio(audio) {
	createjs.Sound.alternateExtensions = ["mp3"];
	for (i = 0; i < audio.length; i++) {
		createjs.Sound.registerSound({id:audio[i].id, src:audio[i].src});
	}
}

function handleFileLoad(evt) {
    console.log('loaded');
}

function loadGame() {
	// picking up our cutscenes via JSON
	$.getJSON("json/cutscenes.json", function(json) {
		storeCutscenes(json.cutscenes);
	});
	
	// let's load all our items too
	$.getJSON("json/items.json", function(json) {
		//TODO foreach loop can be used here
		storeItems(json.items);
	});
	
	
	// now we can load all our backgrounds
	// TODO redo for all scenes
    $.getJSON("json/level0.json", function(json) {
        storeSceneBackgrounds(json);
        // Designate movements for each background
        setupBackgrounds();
        var backgroundContainer = setupBackgroundContainer();
        
    	// The container for clickables for this scene
        var clickableContainer = initClickables(json);
        
        // scene container contains background and clickables
        var sceneContainer = initSceneContainer(backgroundContainer, clickableContainer);
    	
    	var itemContainer = createItemContainer();

    	audioContainer = createAudioContainer();
    	
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

	createjs.Ticker.on("tick", tick);
		
	stage.update();
}

///////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////          GAME 			/////////////
////////////////////////////////////////////////
///////////////////////////////////////////////


function initSceneContainer(backgroundContainer, clickableContainer) {
	var sceneContainer = new createjs.Container();
	sceneContainer.addChild(backgroundContainer)
	sceneContainer.addChild(clickableContainer);
	
	sceneContainer.name = "sceneContainer";
	return sceneContainer
}

/*
* Fetch an image by its id
* @param id The id of the image
* @returns Image the image corresponding to this ID
*/
function getImageById(id) {
	return images[id];
}


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
		for (var directions = 0; directions < currentBackground.movements.length; directions++) {
			arrowContainers.push(createNavigationArrow(directions));
		}
		return true;
	}

	function createNavigationArrow(direction) {
		var name = currentBackground.movements[direction].name;
		var arrow = drawArrow("green", name);
		arrow.addEventListener("click", moveInDirectionDelegate(name));
		return arrow;
	}
}

function handleLoad(event) {
}

function turnOnSwitch(object) {
	if (object.switchOn) {
		switches[object.switchOn] = true;
	}
}

function requiresSwitch(object) {
	return object.requires != null;
}

function switchIsOn(id) {
	return switches[id];
}

function isActiveItem(id) {
	var heldItem = player.getHeldItem();
	return (heldItem && heldItem.id == id);
}

function checkRequirement(requirement) {
	switch (requirement.type) {
		case "switch":
			return switchIsOn(requirement.id);
			break;
		case "item":
			if (requirement.activeItem) {
				return isActiveItem(requirement.id);
			}
			else {
				return player.hasItem(requirement.id);
			}
			break;
	}
}

function validToPlay(object) {
	if (!requiresSwitch(object)) {
		return true;
	}
	for (var i = 0; i < object.requires.length; i++) {
		if (!checkRequirement(object.requires[i])) {
			return false;
		}
	}
	return true;
}

function createAudioContainer() {
	var audioSwitch = convertImageToScaledBitmap(images["sound-on"], stage.canvas.width - SPEAKER_WIDTH - 10, MENU_HEIGHT + 10, SPEAKER_WIDTH, SPEAKER_HEIGHT);
	
	audioSwitch.addEventListener("click", function() {
		clickMuter();
	});
	
	function clickMuter() {
		if (checkPriority(MUTE_PRIORITY)) {
			if (createjs.Sound.getMute()) {
				unmute();
			}
			else {
				mute();
			}
			stage.update();
		}
	}
	
	function mute() {
		createjs.Sound.setMute(true);
		audioSwitch.image = images["sound-off"];
	}
	
	function unmute() {
		createjs.Sound.setMute(false);
		audioSwitch.image = images["sound-on"];
	}
	
	return audioSwitch;
}

function playAudio(json) {
	if (json.audio != null) {
		createjs.Sound.stop();
		var sound = createjs.Sound.play(json.audio.id);
		if (json.audio.position != null) {
			sound.setPosition(json.audio.position);
		}
		if (json.audio.volume != null) {
		    sound.setVolume(json.audio.volume);
		}
	}
}

function addVeil() {
	veil = new Veil();
	layers.sceneLayer.addChild(veil.container);
}

///////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////	BACKGROUNDS 			/////////////
////////////////////////////////////////////////
///////////////////////////////////////////////

/*
* Store the received JSON backgrounds
* @param json The backgrounds in json
*/
function storeSceneBackgrounds(json) {
	sceneJson = json;
	// Load every scene (ie. background image)
	for (var sceneNumber = 0; sceneNumber < json.scenes.length; sceneNumber++) {
		var scene = json.scenes[sceneNumber];
		sceneBackgrounds[scene.name] = setupBackground(scene);
	}
}

function setupBackground(scene) {
	var background = convertImageToScaledBitmap(images[scene.id], 0, MENU_HEIGHT, stage.canvas.width, stage.canvas.height - MENU_HEIGHT);
	background.name = scene.name;
	background.movements = scene.movements;
	background.defaultBackground = scene.defaultBackground;
	
	return background;
}

function setupBackgroundContainer() {
	var backgroundContainer = new createjs.Container();
	backgroundContainer.name = "backgroundContainer";
	backgroundContainer.addChild(currentView.getBackground());
	return backgroundContainer;
}

///////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////			VIEWS 			/////////////
////////////////////////////////////////////////
///////////////////////////////////////////////


/*
* Designate which scene arrows for the backgrounds will point to
* @param backgrounds The set of backgrounds for this scene
*/
function setupBackgrounds() {
	var views = {};
		
	// Create a separate view for each background
	for (var backgroundName in sceneBackgrounds) {
		views[backgroundName] = new Background(sceneBackgrounds[backgroundName]);
		if (sceneBackgrounds[backgroundName].defaultBackground) {
			currentView = views[backgroundName];
			currentBackground = views[backgroundName].getBackground();
		}
	}
	
	for (var backgroundName in sceneBackgrounds) {
		var background = sceneBackgrounds[backgroundName];
		for (var i = 0; i < background.movements.length; i++) {
			views[backgroundName].setMovement({"direction":background.movements[i].name, "destination": views[background.movements[i].destination]});
		}
	}
		
	return views;
}

/*
* Get the movement animation when moving in a particular direction
* @param direction The direction to move in
* @returns The x/y coordinations
*/
function getMovementAnimation(direction) {
	var movementAnimation = {};
	switch (direction) {
		case DIRECTION_LEFT :
			movementAnimation.changeX = stage.canvas.width / 25;
			movementAnimation.changeY = 0;
			break;
		case DIRECTION_RIGHT :
		movementAnimation.changeX = -1 * (stage.canvas.width / 25);
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
		animation.x = movementAnimation.changeX;
		animation.y = movementAnimation.changeY;
		var movementMultiplier = animation.x > 0 ? -1 : 1;
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
	backgroundBit.x = animation.x > 0 ? stage.canvas.width * (-1) : stage.canvas.width;
	backgroundBit.movements = view.getBackground().movements;
	backgroundBit.name = view.getBackground().name;
	var backgroundContainer = globalContainer.getChildByName("sceneContainer").getChildByName("backgroundContainer");
	backgroundContainer.addChild(backgroundBit);
	nextBackground = backgroundBit;
	// Start animation
	priority = FROZEN_PRIORITY;
	sliding = true;
	currentView = view;
}

///////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////		CUTSCENES			/////////////
////////////////////////////////////////////////
///////////////////////////////////////////////

/*
 * Store the received JSON cutscenes
 * @param json The cutscenes in json
 */
function storeCutscenes(json) {
	for (var i = 0; i < json.length; i++) {
		cutscenes[json[i].id] = json[i];
	}
}

/*
 * Get the most relevant cutscene to play
 * Through priority, switches, etc
 * @param cutscenes The cutscenes in JSON
 * @returns The cutscene that should be played
 */
function getCutsceneToPlay(cutscenes) {
	if (cutscenes == null) {
		return null;
	}
	var bestCutscene = null;
	for (var i = 0; i < cutscenes.length; i++) {
		bestCutscene = mostRelevantCutscene(bestCutscene, cutscenes[i]);
	}
	return bestCutscene;
}

function mostRelevantCutscene(currentCutscene, possibleCutscene) {
	if (currentCutscene == null || (possibleCutscene.priority >= currentCutscene.priority)) {
		if (validToPlay(possibleCutscene)) {
			return possibleCutscene;
		}
	}
	return currentCutscene;
}

/*
 * Locate a cutscene based on its id
 * @param cutsceneId the cutscene's ID
 * @returns Object the JSON object of this cutscene
 */
function findCutscene(cutsceneId) {
	if (cutsceneId != null) {
		return cutscenes[cutsceneId];
	}
	else {
		alert('no cutscene');
		return null;
	}
}

function showText(target, text, index) {
	if (index <= text.length) {
		updateText(target, text, index);
		stage.update();
		setTimeout(function() {
			showText(target, text, index+1);
		}, textSpeed);
	}
	else {
		loadingText = false;
	}
}

function updateText(target, text, index) {
	if (!loadingText) {
		index = text.length;
	}
	target.text = text.substring(0, index);
}

function loadClickableCutscene(clickable) {
	var cutscene = getCutsceneToPlay(clickable.cutscenes);
	if (cutscene != null) {
		playCutscene(findCutscene(cutscene.id));
		turnOnSwitch(cutscene);
	}
}

/*
 * Play a cutscene
 * @param cutscene The cutscene to play
 */
function playCutscene(cutscene) {
	priority = cutscene != null ? CUTSCENE_PRIORITY: 0;
	var current = 0;
	loadingText = true;
	var speech = createCutsceneDialog(cutscene.scene[current]);
	// when the user presses space, we play the next dialog
	dialogKeyPress(cutscene, current);
	showText(speech.text, cutscene.scene[current].text, 0);
}

function dialogKeyPress(cutscene, current) {
	document.onkeypress = function(e) {
		if (e.keyCode == 32) {
			if (loadingText) {
				loadingText = false;
			}
			else {
				loadingText = true;
				playNextDialog(cutscene, current);
			}
		}
	}
}

/*
 * Play the next dialog in a cutscene
 * @param cutscene The cutscene we're playing
 * @param current The currect cutscene we're playing
 */
function playNextDialog(cutscene, current) {
	current++;
	// more to play in the cutscene?
	if (cutscene.scene[current] != null) {
		var speech = createCutsceneDialog(cutscene.scene[current]);
		// play the next dialog on space
		dialogKeyPress(cutscene, current);
		showText(speech.text, cutscene.scene[current].text, 0)
	}
	// cutscene is done
	else {
		// remove all the dialogs from the stage
		initializeDialogs();
		document.onkeypress = null;
		priority = 0;
		stage.update();
	}
}

function initializeDialogs() {
	$.each(currentDialogs, function(name, value) {
	    globalContainer.removeChild(value);
	});
	currentDialogs = {};
	return true;
}

/*
 * Create the dialog box for a cutscene
 * @param dialog The dialog to play
 */
function createCutsceneDialog(dialog) {
	var txtContainer = new Dialog().createSpeech(dialog);
	updateDialogPosition(dialog.position, txtContainer.container);
	globalContainer.addChild(txtContainer.container);
	stage.update();
	
	playAudio(dialog);
	
	return txtContainer;
}

/*
 * Update a dialog in a particular space
 * If there's already a dialog in this position, we replace it
 * @param position The dialog position to update
 * @param newDialog The new dialog to put there
 */
function updateDialogPosition(position, newDialog) {
	// nothing there so we add a new one
	if (currentDialogs[position] == null) {
		currentDialogs[position] = newDialog;
	}
	else {
		// get rid of the old dialog
		globalContainer.removeChild(currentDialogs[position]);
		currentDialogs[position] = newDialog;
	}
}

///////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////          ITEMS 			/////////////
////////////////////////////////////////////////
///////////////////////////////////////////////

/*
 * Store the received JSON items
 * @param json The items in json
 */
function storeItems(json) {
	for (var itemNumber = 0; itemNumber < json.length; itemNumber++) {
		var itemJson = json[itemNumber];
		var item = new Item(itemJson.id, itemJson.name, itemJson.description, images[itemJson.id]);
		items.push(item);
	}
}

function createItemContainer() {
	var border = drawBorderedRectangle(20, stage.canvas.height - 80, ITEM_CONTAINER_WIDTH, ITEM_CONTAINER_HEIGHT, "#FFFFFF");
	var container = new createjs.Container();
	
	container.addChild(border);
	
	// without a hit area, the user clicking a transparent part of the image
	// won't work
	var hit = new createjs.Shape();
	hit.graphics.beginFill("#000").drawRect(0,0,ITEM_CONTAINER_WIDTH,ITEM_CONTAINER_HEIGHT);
	hit.x = 20;
	hit.y = stage.canvas.height - 80;
	container.hitArea = hit;
	
	container.addEventListener("click", function() {
		clickItemContainer();
	});
	
	container.name = "itemContainer";
	
	return container;
}

function clickItemContainer() {
	if (checkPriority(MENU_PRIORITY) && (player.getHeldItem() != null)) {
		var i = 0;
		var itemToUpdate;
		var heldItem = player.getHeldItem();
		while (i < player.getInventory().length) {
			if (player.getInventory()[i].id == heldItem.id) {
				if ((i - 1) >= 0) {
					itemToUpdate = player.getInventory()[i-1];
				}
				else {
					itemToUpdate = player.getInventory()[player.getInventory().length-1];
				}
				i = player.getInventory().length;
			}
			else {
				i++;
			}
		}
		if (itemToUpdate != null) {
			player.setHeldItem(itemToUpdate);
			updateItemContainer();
		}
	}
}

function updateItemContainer() {
	var itemContainer = globalContainer.getChildByName("itemContainer")
	itemContainer.removeChildAt(1);
	var item = player.getHeldItem();

	var itemContainerImage = convertImageToScaledBitmap(item.inventoryImage, 25, stage.canvas.height - 75, ITEM_CONTAINER_ITEM_WIDTH, ITEM_CONTAINER_ITEM_HEIGHT);
		
	itemContainer.addChild(itemContainerImage);
	stage.update();
}

///////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////      CLICKABLES 			/////////////
////////////////////////////////////////////////
///////////////////////////////////////////////


function initClickables(json) {
	var clickableContainer = new createjs.Container();
	clickableContainer.name = "clickableContainer";
	var clickablesToAdd = addClickables(json.scenes[0].clickables, 0);
	console.log(clickablesToAdd);
	for (var i = 0; i < clickablesToAdd.length; i++) {
		clickableContainer.addChild(clickablesToAdd[i]);
	}
	return clickableContainer;
}

/*
 * Add all clickables to the scene
 * @param clickables The clickables to add
 */
function addClickables(theseClickables, movementMultiplier) {
	var clickablesHere = [];
	for (var clickableIndex = 0; clickableIndex < theseClickables.length; clickableIndex++) {
		var clickable = theseClickables[clickableIndex];
		if (shouldAddClickableToStage(clickable)) {
			clickablesHere.push(createClickable(clickable, movementMultiplier));
		}
	}
	return clickablesHere;
}

function shouldAddClickableToStage(clickable) {
	if (clickables[clickable.id] == null) {
		clickables[clickable.id] = {};
		clickables[clickable.id].addToStage = true;
	}
	return clickables[clickable.id].addToStage;
}

/*
 * Create a clickable based off of JSON object
 * @param clickable The clickable object
 * @returns The clickable
 */
function createClickable(clickable, movementMultiplier) {
	switch (clickable.type) {
		case CLICKABLE_EXAMINE :
			return createExamineClickable(clickable, movementMultiplier);
			break;
		case CLICKABLE_ITEM :
			return createItemClickable(clickable, movementMultiplier);
			break;
	}
}

/*
 * Create a clickable image
 * @param clickable The JSON object for the clickable
 * @param multiplier The number of screen widths away this clickable is
 * 					-1 for clickable to the left
 * 					0 for clickable onscreen
 * 					1 for clickable to the right
 * @returns Bitmap The bitmap of the image
 */
function createClickableImage(clickable, multiplier) {
	var clickableImage = getImageById(clickable.id);
	
	var clickableBit = convertImageToScaledBitmap(clickableImage, clickable.location.x + (stage.canvas.width*multiplier), clickable.location.y, clickable.dimensions.width, clickable.dimensions.height);
	return clickableBit;
}

/*
 * Create an "Examine" clickable
 * @param clickable The JSON object for this clickable
 * @returns Bitmap The clickable
 */
function createExamineClickable(clickable, movementMultiplier) {
	clickableBit = createClickableImage(clickable, movementMultiplier);
	clickableBit.addEventListener("click", function() {
		if (checkPriority(ITEM_PRIORITY)) {
			loadClickableCutscene(clickable);
		}
	});
	
	return clickableBit;
}

/*
 * Create an "Item" clickable
 * ie. once clicked, the user will get something in their inventory
 * @param clickable The JSON object for this clickable
 * @returns Bitmap the clickable
 */
function createItemClickable(clickable, movementMultiplier) {
	var clickableBit = createClickableImage(clickable, movementMultiplier);
	
	clickableBit.addEventListener("click", function() {
		if (checkPriority(ITEM_PRIORITY)) {
			if (!clickable.persist) {
				clickables[clickable.id].addToStage = false;
				var clickableContainer = globalContainer.getChildByName("sceneContainer").getChildByName("clickableContainer");
				clickableContainer.removeChild(clickableBit);
				stage.update();
			}
			var itemNumber = 0;
			var foundItem = false;
			var thisItem;
			while ((itemNumber < items.length) && (!foundItem)) {
				if (items[itemNumber].id == clickable.id) {
					thisItem = items[itemNumber];
					foundItem = true;
				}
				else {
					itemNumber++;
				}
			}
			loadClickableCutscene(clickable);
			if (foundItem) {
				player.addItem(thisItem);
				updateItemContainer();
			}		
		}
	})
	
	return clickableBit;
}

/*
 * Update clickables for this scene
 */
function updateClickables(movementMultiplier) {
	for (var index = 0; index < sceneJson.scenes.length; index++) {
		if (nextBackground.name == sceneJson.scenes[index].name) {
			var clickablesToAdd = addClickables(sceneJson.scenes[index].clickables, movementMultiplier);
			var clickableContainer = globalContainer.getChildByName("sceneContainer").getChildByName("clickableContainer");
			for (var i = 0; i < clickablesToAdd.length; i++) {
				clickableContainer.addChild(clickablesToAdd[i]);
			}
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
	if (sliding) {
		currentBackground.x += animation.x;
		nextBackground.x += animation.x;
		var clickableContainer = globalContainer.getChildByName("sceneContainer").getChildByName("clickableContainer");
		for (var i = 0; i < clickableContainer.children.length; i++) {
			var child = clickableContainer.getChildAt(i);
			child.x += animation.x;
		}
		var finishAnimation = false;
		if (animation.x < 0) {
			finishAnimation = nextBackground.x <= 0;
		}
		else {
			finishAnimation = nextBackground.x >= 0;
		}
		if (finishAnimation) {
			sliding = false;
			priority = LOWEST_PRIORITY;
			nextBackground.x = 0;
			var backgroundContainer = globalContainer.getChildByName("sceneContainer").getChildByName("backgroundContainer");
			backgroundContainer.removeChild(currentBackground);
			currentBackground = nextBackground;
			var i = 0;
			while (i < clickableContainer.children.length) {
				var child = clickableContainer.getChildAt(i);
				if ((child.x < 0) || child.x > stage.canvas.width) {
					clickableContainer.removeChild(child);
					i--;
				}
				i++;
			}
		}
		stage.update();
	}
	//stage.update();
}