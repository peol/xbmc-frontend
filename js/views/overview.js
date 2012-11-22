/*global define*/
define([
	'views/base',
	'hbs!tmpl/overview'
], function(BaseView, tmpl) {
	'use strict';

	return (BaseView.extend(
		/** @lends OverviewView.prototype */
		{

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

		/** Renders the overview view */
		render: function() {
			this.$el.html(tmpl(this.model.toJSON()));
			window.console.log('[overview:view] rendered');
			return this;
		}
	}));
});