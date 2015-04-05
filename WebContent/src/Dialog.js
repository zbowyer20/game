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
		return {x: 10, y: stage.canvas.height - DIALOG_IMAGE_HEIGHT + 70};
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
		var img = src;
		var thisImage = new createjs.Bitmap(img);
		thisImage.scaleX = (DIALOG_WIDTH) /img.width;
		thisImage.scaleY = (DIALOG_IMAGE_HEIGHT) / img.height;
		thisImage.y = 0;
			
		return thisImage;
	}
	
	this.createText = function() {
		var txt = new createjs.Text("", "20px Arial", "#ffffff");
		txt.textBaseline = "alphabetic";
		txt.y = image == null ? stage.canvas.height - 320 : (image.image.height * image.scaleY) * (9/16);
		txt.x = image == null? 0 : (image.image.width * image.scaleX);
		txt.lineWidth = image == null ? stage.canvas.width - 20 : stage.canvas.width - 425;
		
		return txt;
	}
	
	this.createName = function(name) {
		var txt = new createjs.Text(name, "20px Arial", "#ffffff");
		txt.textBaseline = "alphabetic";
		txt.y = image == null ? 0 : (image.image.height * image.scaleY) * (15/32);
		txt.x = image == null? 0 : (image.image.width * image.scaleX);
		txt.lineWidth = stage.canvas.width - 805;
		
		return txt;
	}
	
	this.createBackground = function(includeName) {
		var container = new createjs.Container();
		if (includeName) {
			var nameBackground = drawBorderedRectangle(stage.canvas.width - 600, 50, 180, stage.canvas.height - 400, "#FFFFFF");
			container.addChild(nameBackground);
		}
		var txtBackgroundX;
		var txtBackgroundWidth;
		var txtBackgroundHeight;
		if (image == null) {
			txtBackgroundX = -15;
			txtBackgroundWidth = stage.canvas.width + 10;
			txtBackgroundHeight = 190;
		}
		else {
			txtBackgroundX = 180;
			txtBackgroundWidth = stage.canvas.width - 220;
			txtBackgroundHeight = 170;
		}
		var textBackground = drawBorderedRectangle(txtBackgroundWidth, txtBackgroundHeight, txtBackgroundX, stage.canvas.height - 350, "#FFFFFF");
		container.addChild(textBackground);
		return container;
	}
	
	this.createSpeech = function(dialog) {
		var position = this.getCutscenePosition(dialog.position);
		var dialogImage = this.getCutsceneImage(dialog.character, dialog.mood);
		var charName = CHARACTER_NAMES[dialog.character];
		
		container = new createjs.Container();
		image = this.createImage(dialogImage);
		var background = this.createBackground(charName != null);
		text = this.createText();
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