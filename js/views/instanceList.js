define([
	'jquery',
	'Backbone',
	'collections/instances',
	'models/instance',
	'hbs!tmpl/instanceList'
], function($, Backbone, Instances, InstanceModel, tmpl) {
	return (Backbone.View.extend({
		el: $('<div/>'),
		events: {
			'click .set-active': 'setActive',
			'click .remove': 'remove'
		},
		setActive: function(e) {
			var index = $(e.target).closest('li').index();
			Instances.forEach(function(inst, i) {
				if (inst.get('isActive') && i !== index) {
					inst.set('isActive', false);
				} else if (i === index) {
					inst.set('isActive', true);
				}
			});
			Instances.save();
			this.render();
		},
		remove: function(e) {
			var index = $(e.target).closest('li').index();
			Instances.remove(Instances.at(index));
			this.render();
		},
		render: function(insts) {
			this.$el.html(tmpl(Instances.toJSON()));
			console.log('[instanceList:view] rendered');
			return this;
		}
	}));
});