define([
	'jquery',
	'Backbone',
	'collections/instances',
	'models/instance',
	'hbs!tmpl/instanceList'
], function($, Backbone, InstancesCollection, InstanceModel, tmpl) {
	return (Backbone.View.extend({
		el: $('<div/>'),
		events: {
			'click .set-active': 'setActive',
			'click .remove': 'remove'
		},
		setActive: function(e) {
			var index = $(e.target).closest('li').index(),
				coll = new InstancesCollection();
			coll.forEach(function(inst, i) {
				if (inst.get('isActive') && i !== index) {
					inst.set('isActive', false);
				} else if (i === index) {
					inst.set('isActive', true);
				}
			});
			coll.save();
			this.render();
		},
		remove: function(e) {
			var index = $(e.target).closest('li').index(),
				coll = new InstancesCollection();
			coll.remove(coll.at(index)).save();
			this.render();
		},
		render: function(insts) {
			this.$el.html(tmpl((new InstancesCollection()).toJSON()));
			console.log('[instanceList:view] rendered');
			return this;
		}
	}));
});