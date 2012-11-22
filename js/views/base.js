/*global define*/
define([
	'Backbone',
	'lib/pubsub',
	'lodash'
], function(Backbone, pubsub, _) {
	'use strict';

	return (Backbone.View.extend(
		/** @lends BaseView.prototype */
		{

		/**
		 * BaseView is a view used throughout this project to add some additional
		 * sugar to the normal Backbone views.
		 * 
		 * @name BaseView
		 * @class
		 */

		/**
		 * Unbinds any events on the current model (if any).
		 * 
		 * @private
		 */
		_unbindModel: function() {
			if (this.model) {
				this.model.off(null, null, this);
			}
		},

		/**
		 * When a view needs to switch models (not sure if this is really
		 * 'allowed', but anywho...), they can use this method to clean up
		 * the old model and it'll also re-render the view.
		 * 
		 * @param {Backbone.Model} model The model to switch to
		 */
		setModel: function(model) {
			this._unbindModel();
			this.model = model;
			if (_.isFunction(this.render)) {
				this.render();
			}
		},

		/**
		 * Destroy/teardown for a view. This can be used to properly
		 * clean up a view when it is no longer needed.
		 */
		destroy: function() {
			this._unbindModel();
			pubsub.unsubscribe(null, null, this);
			this.remove();
		}
	}));
});