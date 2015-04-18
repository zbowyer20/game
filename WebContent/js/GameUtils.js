var GameUtils = {
		switches: {},
		
		// TODO move to CutsceneHandler?
		validToPlay: function(object) {
			if (!requiresSwitch(object)) {
				return true;
			}
			for (var i = 0; i < object.requires.length; i++) {
				if (!checkRequirement(object.requires[i])) {
					return false;
				}
			}
			return true;
		},

		requiresSwitch: function(object) {
			return object.requires != null;
		},
		
		switchIsOn: function(id) {
			return switches[id];
		},

		// TODO should be moved to ItemHandler
		isActiveItem: function(id) {
			var heldItem = player.getHeldItem();
			return (heldItem && heldItem.id == id);
		},

		checkRequirement: function(requirement) {
			switch (requirement.type) {
				case "SWITCH":
					return switchIsOn(requirement.id);
					break;
				case "ITEM":
					// TODO ItemHandler
					if (requirement.activeItem) {
						return isActiveItem(requirement.id);
					}
					else {
						return player.hasItem(requirement.id);
					}
					break;
			}
		}
}