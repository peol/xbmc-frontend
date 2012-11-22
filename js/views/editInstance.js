/*global define*/
define([
	'jquery',
	'views/base',
	'collections/instances',
	'models/instance',
	'hbs!tmpl/editInstance'
], function($, BaseView, Instances, InstanceModel, tmpl) {
	'use strict';

	return (BaseView.extend(
		/** @lends EditInstanceView.prototype */
		{

		/**
		 * Visualizes a form for adding/editing a specific instance.
		 * 
		 * @name EditInstanceView
		 * @augments BaseView
		 * @constructs
		 */

		/**
		 * Events bound on this view.
		 * 
		 * @type {Object}
		 * @property {String} click_button Triggers the `save` method
		 */
		events: {
			'click button': '_save'
		},

		/**
		 * Maps user-exposed data back to the instance model.
		 * Triggers a re-render and sets the current model to a new,
		 * empty {@link InstanceModel}.
		 *
		 * @private
		 * 
		 * @fires saved
		 */
		_save: function() {
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

		/**
		 * Renders the edit instance view.
		 */
		render: function() {
			this.$el.html(tmpl(this.model.toJSON()));
			window.console.log('[editInstance:view] rendered');
			return this;
		}
	}));
});