/*global define*/
define([
	'Backbone',
	'views/base',
	'hbs!tmpl/unknown'
], function(Backbone, BaseView, tmpl) {
	'use strict';

	return (BaseView.extend(
		/** @lends UnknownView.prototype */
		{

		/**
		 * View that is used when the user tries to navigate to
		 * a route that doesn't exist.
		 * 
		 * @name UnknownView
		 * @augments BaseView
		 * @constructs
		 */

		/** Renders the unknown view */
		render: function() {
			this.$el.html(tmpl({ route: Backbone.history.fragment }));
			window.console.log('[unknown:view] rendered');
			return this;
		}
	}));
});