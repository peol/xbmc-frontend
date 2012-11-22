/*global define*/
define([
	'Backbone',
	'lodash',
	'lib/pubsub'
], function(Backbone, _, pubsub) {
	'use strict';

	return (Backbone.Model.extend(
		/** @lends ToolbarModel.prototype */
		{

		/**
		 * The default properties for a toolbar model.
		 * All current properties are private to this model.
		 *
		 * @type {Object}
		 */
		defaults: {
			active: null,
			navItems: []
		},

		/**
		 * Represents the toolbar.
		 *
		 * @name ToolbarModel
		 * @augments Backbone.model
		 * @constructs
		 */
		initialize: function() {
			pubsub.subscribe('router:viewchange', this.viewChanged, this);
			this.viewChanged(Backbone.history.fragment);
		},

		/**
		 * When the "head" view changes, this model will update the navigation
		 * items and set the new view as active. This method will automatically
		 * run when the system says the view has changed.
		 * 
		 * @param {String} view The new active view
		 */
		viewChanged: function(view) {
			var items = this.get('navItems'),
				viewObj = _.where(items, { view: view })[0] || { label: 'Unknown' };
			items.forEach(function(item) {
				item.isActive = view === item.view;
			});
			this.set({
				active: viewObj
			});
		}
	}));
});