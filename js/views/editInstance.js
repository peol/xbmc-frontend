/*global define*/
define([
	'jquery',
	'views/base',
	'collections/instances',
	'models/instance',
	'hbs!tmpl/editInstance'
], function($, BaseView, Instances, InstanceModel, tmpl) {
	'use strict';

	return (BaseView.extend({
		events: {
			'click button': 'save'
		},
		save: function() {
			var inst = this.model,
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
			this.trigger('saved');
			this.model = new InstanceModel();
			this.render();
		},
		render: function() {
			this.$el.html(tmpl(this.model.toJSON()));
			window.console.log('[editInstance:view] rendered');
			return this;
		}
	}));
});