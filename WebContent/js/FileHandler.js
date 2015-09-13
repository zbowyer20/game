var FileHandler = {
		files: {},
		
		addFiles: function(files) {
			for (var i = 0; i < files.length; i++) {
				this.files[files[i].id] = new File(files[0].id, files[i].name, files[i].text, images[files[i].id], images[files[i].img]);
			}
		}
}