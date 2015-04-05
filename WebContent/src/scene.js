var currentView;
var itemContainer;
var backgroundContainer;
var clickableContainer;
var globalContainer;
var currentItem;
var sliding = false;
var changeX = 0;
var changeY = 0;
var prevWidth;
var arrowContainers = [];
var items = [];
var sceneBackgrounds = [];
var clickables = [];
var currentBackground;
var nextBackground;
var sceneJson;
var itemJson;
var cutscenes;
var images = {};
var currentDialogs = {};

function initScene(sceneNumber, player) {
	initScene0();
}

function initScene0() {
	prevWidth = window.innerWidth;
	// TODO test audios
	    
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
	var i = 0;
	while (i < audio.length) {
		createjs.Sound.registerSound({id:audio[i].id, src:audio[i].src});
		i++;
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
    	// TODO foreach loop
        storeSceneBackgrounds(json);
        //TODO current background set as the first loaded,
        //     should be the default
        setCurrentBackground();
        // Designate movements for each background
        setupViews(sceneBackgrounds);
        setupBackgroundContainer();
    	// The container for clickables for this scene
        initClickables(json);
        // scene container contains background and clickables
        var sceneContainer = initSceneContainer();
    	
    	itemContainer = createItemContainer();

    	audioContainer = createAudioContainer();
    	
    	globalContainer = new createjs.Container();
    	globalContainer.addChild(sceneContainer);
		globalContainer.addChild(itemContainer);
		globalContainer.addChild(audioContainer);
		
    	stage.addChild(globalContainer);
    	
    	// Set up the arrows for this scene
    	setupNavigation(json);
    	    	
    	stage.update();
    });
	
	//TODO remove test code
		var circle = new createjs.Shape();
		circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 0.05*(window.innerWidth+window.innerHeight));
		circle.x = 0.2*window.innerWidth;
		circle.y = 0.2*window.innerWidth;
		circle.regX = circle.width / 2 | 0;
		circle.regY = circle.height / 2 | 0;
		
		var circleContainer = new createjs.Container();
		circleContainer.addChild(circle);
		
		var circle2 = new createjs.Shape();
		circle2.graphics.beginFill("green").drawCircle(0, 0, 20);
		circle2.x = 300;
		circle2.y = 300;
		circle2.regX = circle2.width/2 | 0;
		circle2.regY = circle2.height / 2 | 0;
		
		circle2.addEventListener("click", function(evt) {
		    var sound = createjs.Sound.play("living");
		    sound.setPosition(17000);
		    sound.setVolume(1);
		    player.addItem(new Item(0, "test item", "this is a test item", "src", "src"));
		})
		
		circleContainer.on("pressmove", function(evt) {
			evt.target.x = evt.stageX;
			evt.target.y = evt.stageY;
			stage.update();
		});
	
		stage.addChild(circleContainer);
		stage.addChild(circle2);

	createjs.Ticker.on("tick", tick);
		
	stage.update();
}

///////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////GAME 			            /////////////
////////////////////////////////////////////////
///////////////////////////////////////////////


function initSceneContainer() {
	var sceneContainer = new createjs.Container();
	sceneContainer.addChild(backgroundContainer);
	sceneContainer.addChild(clickableContainer);
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
	for (var i = 0; i<arrowContainers.length; i++) {
		globalContainer.removeChild(arrowContainers[i]);
	}

	arrowContainers = [];

	// For every direction for the current background, add an arrow
	for (var directions = 0; directions < currentBackground.movements.length; directions++) {
		var name = currentBackground.movements[directions].name;
		arrowContainers.push(drawArrow("green", name));
		arrowContainers[directions].addEventListener("click", moveInDirectionDelegate(name));
	}
	
	// Add those arrows to the scene
	for (var i = 0; i < arrowContainers.length; i++) {
		globalContainer.addChild(arrowContainers[i]);
	}
}

function handleLoad(event) {
}

function turnOnSwitch(object) {
	if (object.switchOn) {
		switches[object.switchOn] = true;
	}
}

function validToPlay(object) {
	if (object.requires == null) {
		return true;
	}
	var i = 0;
	while (i < object.requires.length) {
		if (object.requires[i].type == "switch") {
			if (!switches[object.requires[i].id]) {
				return false;
			}
		}
		else {
			if (object.requires[i].type == "item") {
				if (object.requires[i].activeItem) {
					if ((!currentItem) || (currentItem.id != object.requires[i].id)) {
						return false;
					}
				}
				else if (!player.hasItem(object.requires[i].id)) {
					return false;
				}
			}
		}
		i++;
	}
	return true;
}

function createAudioContainer() {
	var bg = images["sound-on"];
	var thisBackground = new createjs.Bitmap(bg);
	thisBackground.scaleX = SPEAKER_WIDTH / bg.width;
	thisBackground.scaleY = SPEAKER_HEIGHT / bg.height;
	thisBackground.y = MENU_HEIGHT + 10;
	thisBackground.x = stage.canvas.width - SPEAKER_WIDTH - 10;
	
	thisBackground.addEventListener("click", function() {
		if (checkPriority(MUTE_PRIORITY)) {
			if (createjs.Sound.getMute()) {
				createjs.Sound.setMute(false);
				thisBackground.image = images["sound-on"];
			}
			else {
				createjs.Sound.setMute(true);
				thisBackground.image = images["sound-off"];
			}
		}
	});
	
	return thisBackground;
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
	var sceneNumber = 0;
	sceneJson = json;
	// Load every scene (ie. background image)
	while (sceneNumber < json.scenes.length) {
		var scene = json.scenes[sceneNumber];
		sceneBackgrounds.push(setupBackground(scene));
		sceneNumber++;
	}
}

function setupBackground(scene) {
	var bg = images[scene.id];
	var thisBackground = new createjs.Bitmap(bg);
	thisBackground.scaleX = stage.canvas.width / bg.width;
	thisBackground.scaleY = (stage.canvas.height - MENU_HEIGHT) / bg.height;
	thisBackground.y = MENU_HEIGHT;
	thisBackground.name = scene.name;
	thisBackground.movements = scene.movements;
	
	return thisBackground;
}

function setCurrentBackground() {
	currentBackground = sceneBackgrounds[0];
}

function setupBackgroundContainer() {
	backgroundContainer = new createjs.Container();
	backgroundContainer.name = "backgroundContainer";
	backgroundContainer.addChild(currentView.getBackground());
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
function setupViews(backgrounds){
	var views = [];
	
	// Create a separate view for each background
	for (var i = 0; i < backgrounds.length; i++) {
		views.push(new viewer());
		views[i].createView(backgrounds[i]);
	}

	// Add movements to each background
	for (var i = 0; i < views.length; i++) {
		var thisBG = views[i].getBackground();
		// The directions the user can move to from this scene
		var directions = [];
		// Save each destination for this scene
		// TODO only supports LEFT and RIGHT
		for (var k = 0; k < thisBG.movements.length; k++) {
			if (thisBG.movements[k].name == DIRECTION_LEFT) {
				directions.push({name: DIRECTION_LEFT, destination: thisBG.movements[k].destination});
			}
			if (thisBG.movements[k].name == DIRECTION_RIGHT) {				
				directions.push({name: DIRECTION_RIGHT, destination: thisBG.movements[k].destination});
			}
		}
		// Loop through all the other views, checking which can be moved to
		// TODO only supports LEFT and RIGHT
		var j;
		for (j = 0; j < views.length; j++) {
		// Get the other view
			var compareBG = views[j].getBackground();
			// Check through all the original scene's directions, checking if
			// the checked background matches those directions' destination
			for (var k = 0; k < directions.length; k++) {
				if (compareBG.name == directions[k].destination) {
					switch (directions[k].name) {
						case DIRECTION_LEFT:
							views[i].setLeft(views[j]);
							break;
						case DIRECTION_RIGHT:
							views[i].setRight(views[j]);
							break;
					}
				}
			}
		}
	}

	currentView = views[0];

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
	switch (direction) {
		case DIRECTION_LEFT :
			return currentView.getLeft();
			break;
		case DIRECTION_RIGHT :
			return currentView.getRight();
			break;
	}
}

/*
* Move in a particular direction from one scene to another
* @param direction The direction to move in
*/
function moveInDirection(direction) {
	if (checkPriority(NAVIGATION_PRIORITY)) {
		var movementAnimation = getMovementAnimation(direction);
		changeX = movementAnimation.changeX;
		changeY = movementAnimation.changeY;
		var movementMultiplier = changeX > 0 ? -1 : 1;
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
	backgroundBit.x = changeX > 0 ? stage.canvas.width * (-1) : stage.canvas.width;
	backgroundBit.movements = view.getBackground().movements;
	backgroundBit.name = view.getBackground().name;
	backgroundContainer.addChild(backgroundBit);
	nextBackground = backgroundBit;
	// Start animation
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
	cutscenes = json;
}

function getCutsceneToPlay(cutscenes) {
	if (cutscenes == null) {
		return null;
	}
	var i = 0;
	var bestCutscene = null;
	while (i < cutscenes.length) {
		if ((bestCutscene == null) || (cutscenes[i].priority >= bestCutscene.priority)) {
			if (validToPlay(cutscenes[i])) {
				bestCutscene = cutscenes[i];
			}
			else {
				console.log('not valid');
			}
		}
		i++;
	}
	return bestCutscene;
}

/*
 * Locate a cutscene based on its id
 * @param cutsceneId the cutscene's ID
 * @returns Object the JSON object of this cutscene
 * TODO array this shit up, let's get some O(1) in there
 */
function findCutscene(cutsceneId) {
	if (cutsceneId != null) {
		var cutsceneIndex = 0;
		var foundCutscene = false;
		var thisCutscene;
		while ((cutsceneIndex < cutscenes.length) && (!foundCutscene)) {
			if (cutscenes[cutsceneIndex].id == cutsceneId) {
				foundCutscene = true;
				thisCutscene = cutscenes[cutsceneIndex];
			}
			else {
				cutsceneIndex++;
			}
		}
		if (foundCutscene) {
			return thisCutscene;
		}
		return null;
	}
	else {
		alert('no cutscene');
		return null;
	}
}

/*
 * Play a cutscene
 * @param cutscene The cutscene to play
 */
function playCutscene(cutscene) {
	priority = cutscene != null ? CUTSCENE_PRIORITY: 0;
	var current = 0;
	var speech = createCutsceneDialog(cutscene.scene[current]);
	// when the user presses space, we play the next dialog
	document.onkeypress = function(e) {
		if (e.keyCode == 32) {
			playNextDialog(cutscene, current);
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
		createCutsceneDialog(cutscene.scene[current]);
		// play the next dialog on space
		// TODO function!
		document.onkeypress = function(e) {
			if (e.keyCode == 32) {
				if (checkPriority(CUTSCENE_PRIORITY)) {
					playNextDialog(cutscene, current);
				}
			}
		}
	}
	// cutscene is done
	else {
		// remove all the dialogs from the stage
		$.each(currentDialogs, function(name, value) {
		    globalContainer.removeChild(value);
		});
		currentDialogs = {};
		document.onkeypress = null;
		priority = 0;
		stage.update();
	}
}

/*
 * Create the dialog box for a cutscene
 * @param dialog The dialog to play
 */
function createCutsceneDialog(dialog) {
	var position = getCutscenePosition(dialog.position);
	var image = getCutsceneImage(dialog.character, dialog.mood);
	var charName = CHARACTER_NAMES[dialog.character]
	var txtContainer = new Dialog().createSpeech(position, image, dialog.text, charName);
	updateDialogPosition(dialog.position, txtContainer.container);
	globalContainer.addChild(txtContainer.container);
	stage.update();
	
	if (dialog.audio != null) {
		createjs.Sound.stop();
		var sound = createjs.Sound.play(dialog.audio.id);
		if (dialog.audio.position != null) {
			sound.setPosition(dialog.audio.position);
		}
		if (dialog.audio.volume != null) {
		    sound.setVolume(dialog.audio.volume);
		}
	}
}

/*
 * Get the position of a cutscene dialog
 * @param position the position in string
 * @returns The coordinates for a position
 */
function getCutscenePosition(position) {
//	switch (position) {
//		case "DIALOG_RIGHT":
//			return {x: stage.canvas.width - DIALOG_WIDTH - 100, y: MENU_HEIGHT + 50};
//			break;
//		case "DIALOG_LEFT":
//			return {x: 100, y: MENU_HEIGHT+50};
//			break;
//		case "DIALOG_CENTER":
//			return {x: stage.canvas.width / 2 - (DIALOG_WIDTH / 2), y: MENU_HEIGHT+50};
//			break;
//	}
	return {x: 10, y: stage.canvas.height - DIALOG_IMAGE_HEIGHT + 70};
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

/*
 * Get the image for a particular dialog
 * @param character The character who's talking
 * @param mood the mood they're in
 * @returns Image the image for this particular dialog
 */
function getCutsceneImage(character, mood) {
	if (mood != null) {
		return images[DIALOG_IMAGES[character + "-" + mood]];
	}
	// if we haven't specified a mood, return the default image for this character
	// probably neutral
	else {
		return images[DIALOG_IMAGES[character]];
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
	var itemNumber = 0;
	while (itemNumber < json.length) {
		var itemJson = json[itemNumber];
		var item = new Item(itemJson.id, itemJson.name, itemJson.description, images[itemJson.id]);
		items.push(item);
		itemNumber++;
	}
}

function createItemContainer() {
	var border = drawBorderedRectangle(ITEM_CONTAINER_WIDTH, ITEM_CONTAINER_HEIGHT, 20, stage.canvas.height - 80, "#FFFFFF");
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
		if (checkPriority(MENU_PRIORITY) && (currentItem != null)) {
			var i = 0;
			var itemToUpdate;
			while (i < player.getInventory().length) {
				if (player.getInventory()[i].id == currentItem.id) {
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
				updateItemContainer(itemToUpdate);
			}
		}
		
	})
	return container;
}

function updateItemContainer(item) {
	itemContainer.removeChildAt(1);
	currentItem = item;
	var itemWidth = 50;
	var itemHeight = 50;
	
	var bg = item.inventoryImage;
	var backgroundBit = new createjs.Bitmap(bg);
	backgroundBit.scaleX = itemWidth / bg.width;
	backgroundBit.scaleY = itemHeight / bg.height;
	backgroundBit.x = 25;
	backgroundBit.y = stage.canvas.height - 75;
		
	itemContainer.addChild(backgroundBit);
	stage.update();
}

///////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////      CLICKABLES 			/////////////
////////////////////////////////////////////////
///////////////////////////////////////////////


function initClickables(json) {
	clickableContainer = new createjs.Container();
	addClickables(json.scenes[0].clickables, 0);
}

/*
 * Add all clickables to the scene
 * @param clickables The clickables to add
 */
function addClickables(theseClickables, movementMultiplier) {
	var clickableIndex = 0;
	while (clickableIndex < theseClickables.length) {
		var clickable = theseClickables[clickableIndex];
		if (addClickableToStage(clickable)) {
			clickableContainer.addChild(createClickable(clickable, movementMultiplier));
		}
		clickableIndex++;
	}
}

function addClickableToStage(clickable) {
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
	var clickableBit = new createjs.Bitmap(clickableImage);
	clickableBit.scaleX = clickable.dimensions.width / clickableImage.width;
	clickableBit.scaleY = clickable.dimensions.height / clickableImage.height;
	clickableBit.x = clickable.location.x + (canvas.width*multiplier);
	clickableBit.y = clickable.location.y;
	
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
			alert(clickable.message);
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
			var cutscene = getCutsceneToPlay(clickable.cutscenes);
			if (cutscene != null) {
				playCutscene(findCutscene(cutscene.id));
				turnOnSwitch(cutscene);
			}
			if (foundItem) {
				player.addItem(thisItem);
				updateItemContainer(thisItem);
			}
		}
	})
	
	return clickableBit;
}

/*
 * Update clickables for this scene
 */
function updateClickables(movementMultiplier) {
	var index = 0;
	while (index < sceneJson.scenes.length) {
		if (nextBackground.name == sceneJson.scenes[index].name) {
			addClickables(sceneJson.scenes[index].clickables, movementMultiplier);
		}
		index++;
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
		currentBackground.x += changeX;
		nextBackground.x += changeX;
		var i = 0;
		while (i < clickableContainer.children.length) {
			var child = clickableContainer.getChildAt(i);
			child.x += changeX;
			i++;
		}
		var finishAnimation = false;
		if (changeX < 0) {
			finishAnimation = nextBackground.x <= 0;
		}
		else {
			finishAnimation = nextBackground.x >= 0;
		}
		if (finishAnimation) {
			sliding = false;
			nextBackground.x = 0;
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
	stage.update();
}