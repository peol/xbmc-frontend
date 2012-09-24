define([
	'jquery',
	'Backbone',
	'collections/instances',
	'models/instance',
	'hbs!tmpl/newInstance'
], function($, Backbone, InstancesCollection, InstanceModel, tmpl) {
	return (Backbone.View.extend({
		el: $('<div/>'),
		events: {
			'click button': 'save'
		},
		save: function() {
			var coll = new InstancesCollection(),
				inst = new InstanceModel(),
				label = this.$el.find('.label').val(),
				host = this.$el.find('.host').val(),
				port = +this.$el.find('.port').val();

			if (label) {
				inst.set('label', label);
			}

			if (host) {
				inst.set('host', host);
			}

			if (!isNaN(port) && port !== 0) {
				inst.set('port', port);
			}

			coll.add(inst).save();
			this.$el.find('input').val('');
			this.trigger('saved');
		},
		render: function() {
			this.$el.html(tmpl((new InstanceModel()).toJSON()));
			console.log('[newInstance:view] rendered');
			return this;
		}
	}));
});