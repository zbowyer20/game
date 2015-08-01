var GameUtils = {
		playedCount: {},
		switches: {},
		
		validToPlay: function(object) {
			if (!this.requiresSwitch(object) && (!this.hasMaximumPlayCount(object))) {
				return true;
			}
			if (this.requiresSwitch(object)) {
				for (var i = 0; i < object.requires.length; i++) {
					if (!this.checkRequirement(object.requires[i])) {
						return false;
					}
				}
			}
			return !this.exceedsPlayCount(object);
		},
		
		setSwitch: function(id, on) {
			this.switches[id] = on;
		},

		requiresSwitch: function(object) {
			return object.requires != null;
		},
		
		hasMaximumPlayCount: function(object) {
			return object.maxPlays != null;
		},
		
		switchIsOn: function(id) {
			return this.switches[id];
		},

		incrementPlayedCount: function(id) {
			if (!this.playedCount[id]) {
				this.playedCount[id] = 1;
			}
			else {
				this.playedCount[id]++;
			}
		},
		
		getPlayedCount: function(id) {
			return this.playedCount[id];
		},
		
		exceedsPlayCount: function(object) {
			if (!object.maxPlays) {
				return false;
			}
			return object.maxPlays <= this.getPlayedCount(object.id);
		},
		
		// TODO should be moved to ItemHandler
		isActiveItem: function(id) {
			var heldItem = player.getHeldItem();
			return (heldItem && heldItem.id == id);
		},

		checkRequirement: function(requirement) {
			switch (requirement.type) {
				case "SWITCH":
					return this.switchIsOn(requirement.id);
					break;
				case "ITEM":
					// TODO ItemHandler
					if (requirement.activeItem) {
						return this.isActiveItem(requirement.id);
					}
					else {
						return player.hasItem(requirement.id);
					}
					break;
			}
		}
}