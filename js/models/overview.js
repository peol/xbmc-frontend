/*global define*/
define([
	'Backbone',
	'collections/instances'
], function(Backbone, Instances) {
	'use strict';

	return (Backbone.Model.extend(
		/** @lends OverviewModel.prototype */
		{

		/**
		 * The default properties for an overview model.
		 * All current properties are private to this model.
		 *
		 * @type {Object}
		 */
		defaults: {
			/** @private */
			instance: null,
			/** @private */
			isActive: false
		},

		/**
		 * Represents an overview.
		 *
		 * @name OverviewModel
		 * @augments Backbone.Model
		 * @constructs
		 */
		initialize: function() {
			this.update();
			Instances.on('save', this.update, this);
		},

		/**
		 * Updates the model's values from the {@link Instances}.getActive() method.
		 */
		update: function() {
			var inst = Instances.getActive();
			if (inst) {
				this.set({
					isActive: inst.isConnected(),
					instance: inst.toJSON()
				});
			}
		}
	}));
});