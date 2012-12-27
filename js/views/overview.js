/*global define*/
define([
	'views/base',
	'lib/xbmcapi',
	'hbs!tmpl/overview'
], function(BaseView, api, tmpl) {
	'use strict';

	return (BaseView.extend(
		/** @lends OverviewView.prototype */
		{

		/** Events for the overview view */
		events: {
			'click .retry': '_retry'
		},

		/**
		 * Visualizes an overview on what's going on. Showing
		 * connection status and so on.
		 * 
		 * @name OverviewView
		 * @augments BaseView
		 * @constructs
		 */
		initialize: function() {
			this.$el.addClass('view-overview');
			this.model.on('change', this.render, this);
		},

		/**
		 * Event handler for the retry link when the instance is disconnected.
		 *
		 * @private
		 */
		_retry: function() {
			api.connect();
		},

		/** Renders the overview view */
		render: function() {
			this.$el.html(tmpl(this.model.toJSON()));
			window.console.log('[overview:view] rendered');
			return this;
		}
	}));
});