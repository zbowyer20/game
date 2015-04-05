function Dialog() {
	var container;
	var image;
	var text;
	var name;
	
	this.createImage = function(src) {
		var img = src;
		var thisImage = new createjs.Bitmap(img);
		thisImage.scaleX = (DIALOG_WIDTH) /img.width;
		thisImage.scaleY = (DIALOG_IMAGE_HEIGHT) / img.height;
		thisImage.y = 0;
			
		return thisImage;
	}
	
	this.createText = function(src) {
		console.log(src);
		var txt = new createjs.Text(src, "20px Arial", "#ffffff");
		txt.textBaseline = "alphabetic";
		txt.y = image == null ? 0 : (image.image.height * image.scaleY) * (9/16);
		txt.x = image == null? 0 : (image.image.width * image.scaleX);
		txt.lineWidth = stage.canvas.width - 425;
		
		return txt;
	}
	
	this.createName = function(name) {
		var txt = new createjs.Text(name, "20px Arial", "#ffffff");
		txt.textBaseline = "alphabetic";
		txt.y = image == null ? 0 : (image.image.height * image.scaleY) * (15/32);
		txt.x = image == null? 0 : (image.image.width * image.scaleX);
		txt.lineWidth = stage.canvas.width - 425;
		
		return txt;
	}
	
	this.createBackground = function() {
		var container = new createjs.Container();
		var nameBackground = drawBorderedRectangle(stage.canvas.width - 600, 50, 180, stage.canvas.height - 400, "#FFFFFF");
		var textBackground = drawBorderedRectangle(stage.canvas.width - 220, 170, 180, stage.canvas.height - 350, "#FFFFFF");
		container.addChild(nameBackground);
		container.addChild(textBackground);
		return container;
	}
	
	this.createSpeech = function(placement, imageSrc, textSrc) {
		container = new createjs.Container();
		var background = this.createBackground();
		image = this.createImage(imageSrc);
		text = this.createText(textSrc);
		name = this.createName("Albert");
		container.addChild(background);
		container.addChild(image);
		container.addChild(text);
		container.addChild(name);
		container.x = placement.x;
		container.y = placement.y;
		this.text = text;
		this.image = image;
		this.container = container;
		return this;
	}
	
	return this;
}