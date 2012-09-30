define([
	'Backbone',
	'models/instance',
	'lib/store'
], function(Backbone, InstanceModel, Store) {
	return new (Backbone.Collection.extend({
		model: InstanceModel,
		localStorage: new Store('instances'),
		initialize: function() {
			var self = this,
				insts = this.localStorage.get('instances');
			if (insts) {
				insts.forEach(function(inst) {
					self.add(new InstanceModel(inst));
				});
			} else {
				this.save();
			}
			this.on('add remove change', this.updateModels);
		},
		setActive: function(index) {
			this.forEach(function(inst, i) {
				if (inst.get('isActive') && i !== index) {
					inst.set({ isActive: false }, { silent: true });
				} else if (i === index) {
					inst.set({ isActive: true }, { silent: true });
				}
			});
			this.save();
		},
		getActive: function() {
			return this.where({ isActive: true })[0];
		},
		updateModels: function() {
			if (this.length === 1 || !this.where({ isActive: true }).length && this.length > 0) {
				this.at(0).set('isActive', true);
			}
			this.save();
		},
		save: function() {
			this.localStorage.set('instances', this.toJSON());
			this.trigger('save');
		}
	}))();
});