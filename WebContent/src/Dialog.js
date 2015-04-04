function Dialog() {
	var container;
	var image;
	var text;
	
	this.createImage = function(src) {
		var img = src;
		var thisImage = new createjs.Bitmap(img);
		thisImage.scaleX = (DIALOG_WIDTH) /img.width;
		thisImage.scaleY = (DIALOG_IMAGE_HEIGHT) / img.height;
		thisImage.y = 0;
			
		return thisImage;
	}
	
	this.createText = function(src) {
		var txt = new createjs.Text(src, "20px Arial", "#ffffff");
		txt.textBaseline = "alphabetic";
		txt.y = image == null ? 0 : (image.image.height * image.scaleY) * (5/8);
		txt.x = image == null? 0 : (image.image.width * image.scaleX);
		txt.lineWidth = DIALOG_WIDTH;
		
		return txt;
	}
	
	this.createBackground = function() {
		return drawBorderedRectangle(stage.canvas.width - 220, 170, 180, stage.canvas.height - 350, "#FFFFFF");		
	}
	
	this.createSpeech = function(placement, imageSrc, textSrc) {
		container = new createjs.Container();
		var background = this.createBackground();
		image = this.createImage(imageSrc);
		text = this.createText(textSrc);
		container.addChild(background);
		container.addChild(image);
		container.addChild(text);
		container.x = placement.x;
		container.y = placement.y;
		this.text = text;
		this.image = image;
		this.container = container;
		return this;
	}
	
	return this;
}