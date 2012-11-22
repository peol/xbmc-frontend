/*global define*/
define([
	'jquery',
	'views/base',
	'collections/instances',
	'models/instance',
	'hbs!tmpl/instanceList'
], function($, BaseView, Instances, InstanceModel, tmpl) {
	'use strict';

	return (BaseView.extend(
		/** @lends InstanceListView.prototype */
		{

		/**
		 * Visualizes an interactive list of instances, used to
		 * manipulate which instances that are available and which
		 * one is active.
		 * 
		 * @name InstanceListView
		 * @augments BaseView
		 * @constructs
		 */

		/**
		 * Events bound on this view.
		 * 
		 * @type {Object}
		 * @property {String} click_.set-active Triggers the `_setActive` method
		 * @property {String} click_.remove Triggers the `_remove` method
		 */
		events: {
			'click .set-active': '_setActive',
			'click .remove': '_remove'
		},

		/**
		 * Set an instance as active through an event.
		 *
		 * @private
		 * 
		 * @param {Event} e The event object
		 */
		_setActive: function(e) {
			var index = $(e.target).closest('tr').index();
			Instances.setActive(index);
			this.render();
		},

		/**
		 * Removes an instance through an event.
		 *
		 * @private
		 * 
		 * @param {Event} e The event object
		 */
		_remove: function(e) {
			var index = $(e.target).closest('tr').index();
			Instances.remove(Instances.at(index));
			this.render();
		},

		/**
		 * Renders the instance list view.
		 */
		render: function() {
			this.$el.html(tmpl(Instances.toJSON()));
			window.console.log('[instanceList:view] rendered');
			return this;
		}
	}));
});