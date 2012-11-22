/*global define*/
define([
	'jquery',
	'views/base',
	'models/instance',
	'views/editInstance',
	'views/instanceList',
	'collections/instances'
], function($, BaseView, InstanceModel, EditInstanceView, InstanceListView, Instances) {
	'use strict';

	return (BaseView.extend(
		/** @lends SettingsView.prototype */
		{

		/**
		 * Events bound on this view.
		 * 
		 * @type {Object}
		 * @property {String} click_.edit Triggers the `_edit` method
		 */
		events: {
			'click .edit': '_edit'
		},

		/**
		 * Event that, when triggered, loads the clicked instance in the edit
		 * instance view.
		 *
		 * @private
		 * 
		 * @param {Event} e The event object
		 */
		_edit: function(e) {
			var index = $(e.target).closest('tr').index();
			this.instView.setModel(Instances.at(index));
		},

		/**
		 * View that wires up a settings page where the user can manage their
		 * XBMC instances.
		 * 
		 * @name SettingsView
		 * @augments BaseView
		 * @constructs
		 */
		initialize: function() {
			this.instView = new EditInstanceView({ model: new InstanceModel() });
			this.listView = new InstanceListView();
			this.instView.on('saved', this.listView.render, this.listView);
		},

		/** Renders the settings view */
		render: function() {
			this.$el.empty()
				.append(this.instView.render().el)
				.append(this.listView.render().el);
			window.console.log('[settings:view] rendered');
			return this;
		}
	}));
});