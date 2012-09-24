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
			}
			this.on('add', this.updateModels);
			this.on('remove', this.updateModels);
		},
		updateModels: function() {
			if (this.length === 1 || !this.where({ isActive: true }).length && this.length > 0) {
				this.at(0).set('isActive', true);
				this.save();
			}
		},
		save: function() {
			this.localStorage.set('instances', this.toJSON());
		}
	}));
});