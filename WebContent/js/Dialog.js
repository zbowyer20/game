function Dialog() {
	var container;
	var image;
	var text;
	var name;
	
	/*
	 * Get the position of a cutscene dialog
	 * @param position the position in string
	 * @returns The coordinates for a position
	 */
	this.getCutscenePosition = function(position) {
//		switch (position) {
//			case "DIALOG_RIGHT":
//				return {x: stage.canvas.width - DIALOG_WIDTH - 100, y: MENU_HEIGHT + 50};
//				break;
//			case "DIALOG_LEFT":
//				return {x: 100, y: MENU_HEIGHT+50};
//				break;
//			case "DIALOG_CENTER":
//				return {x: stage.canvas.width / 2 - (DIALOG_WIDTH / 2), y: MENU_HEIGHT+50};
//				break;
//		}
		return {x: 10 * DPR, y: stage.canvas.height - DIALOG_IMAGE_HEIGHT + (70 * DPR)};
	}
	
	/*
	 * Get the image for a particular dialog
	 * @param character The character who's talking
	 * @param mood the mood they're in
	 * @returns Image the image for this particular dialog
	 */
	this.getCutsceneImage = function(character, mood) {
		if (mood != null) {
			return images[DIALOG_IMAGES[character + "-" + mood]];
		}
		// if we haven't specified a mood, return the default image for this character
		// probably neutral
		else {
			return images[DIALOG_IMAGES[character]];
		}
	}
	
	this.createImage = function(src) {
		if (src == null) {
			return null;
		}
		
		var thisImage = convertImageToScaledBitmap(src, 0, 0, DIALOG_IMAGE_WIDTH, DIALOG_IMAGE_HEIGHT);
		return thisImage;
	}
	
	this.createText = function(name) {
		var txtDimensions = {};
		txtDimensions.y = image == null ? stage.canvas.height - (320 * DPR) : (image.image.height * image.scaleY) * (9/16);
		if (image) {
			txtDimensions.x = image.image.width * image.scaleX;
		}
		else if (name) {
			txtDimensions.x = 320;
		}
		else {
			txtDimensions.x = 0;
		}
		txtDimensions.lineWidth = image == null ? stage.canvas.width - (20 * DPR) : stage.canvas.width - (image.image.width * image.scaleX * (2/3)) * DPR;
		
		var txt = createText("", "#FFFFFF", txtDimensions.x, txtDimensions.y, txtDimensions.lineWidth);
		
		return txt;
	}
	
	this.createName = function(name) {
		var txtDimensions = {};
		txtDimensions.y = stage.canvas.height - DIALOG_HEIGHT - (0.5 * DIALOG_NAME_HEIGHT) + (7 * DPR);
		txtDimensions.x = image == null ? 320 : (image.image.width * image.scaleX);

		var txt = createText(name, "#FFFFFF", txtDimensions.x, txtDimensions.y, stage.canvas.width - 805);
		
		return txt;
	}
	
	this.createBackground = function(name) {
		var container = new createjs.Container();
		var txtBackgroundX;
		var txtBackgroundWidth;
		
		if (name != null) {
			var calculatedImageWidth = image ? image.image.width * image.scaleX : 600;
			txtBackgroundX = calculatedImageWidth / 2;
			txtBackgroundWidth = stage.canvas.width - (calculatedImageWidth * (2/3));
			console.log(name);
			console.log(DIALOG_BACKGROUNDS[name]);
			var nameBackground = drawBorderedRectangle(txtBackgroundX, stage.canvas.height - DIALOG_HEIGHT - DIALOG_NAME_HEIGHT, 350 + (name.length * 40), DIALOG_NAME_HEIGHT, this.getBackgroundColour(name));
			container.addChild(nameBackground);
		}
		else {
			txtBackgroundX = DIALOG_SCRIPT_X;
			txtBackgroundWidth = stage.canvas.width + (10 * DPR);
		}
		
		var textBackground = drawBorderedRectangle(txtBackgroundX, stage.canvas.height - DIALOG_HEIGHT, txtBackgroundWidth, DIALOG_HEIGHT, this.getBackgroundColour(name));
		container.addChild(textBackground);
		return container;
	}
	
	this.getBackgroundColour = function(name) {
		return name ? {background: DIALOG_BACKGROUNDS[name.toUpperCase()] || "rgba(0, 0, 0, 0.5)"} : {};
	}
	
	this.createSpeech = function(dialog) {
		var position = this.getCutscenePosition(dialog.position);
		var dialogImage = this.getCutsceneImage(dialog.character, dialog.mood);
		var charName = dialog.name || CHARACTER_NAMES[dialog.character];
		
		container = new createjs.Container();
		image = this.createImage(dialogImage);
		var background = this.createBackground(charName);
		text = this.createText(charName);
		name = this.createName(charName);
		container.addChild(background);
		container.addChild(image);
		container.addChild(text);
		container.addChild(name);
		container.x = position.x;
		container.y = position.y;
		this.text = text;
		this.image = image;
		this.container = container;
		return this;
	}
	
	return this;
}