define([
	'jquery',
	'views/base',
	'collections/instances',
	'models/instance',
	'hbs!tmpl/newInstance'
], function($, BaseView, Instances, InstanceModel, tmpl) {
	'use strict';

	return (BaseView.extend({
		events: {
			'click button': 'save'
		},
		save: function() {
			var inst = new InstanceModel(),
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

			Instances.add(inst);
			this.$el.find('input').val('');
			this.trigger('saved');
		},
		render: function() {
			this.$el.html(tmpl((new InstanceModel()).toJSON()));
			window.console.log('[newInstance:view] rendered');
			return this;
		}
	}));
});