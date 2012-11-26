/*global define*/
define([
	'jquery',
	'views/base',
	'hbs!tmpl/toolbar',
	'lib/pubsub'
], function($, BaseView, tmpl, pubsub) {
	'use strict';

	return (BaseView.extend(
		/** @lends ToolbarView.prototype */
		{

		/** The element used to render this view */
		el: $('#toolbar'),

		/**
		 * Visualizes what toolbar menu alternatives and which one's
		 * active.
		 * 
		 * @name ToolbarView
		 * @augments BaseView
		 * @constructs
		 */
		initialize: function() {
			pubsub.subscribe('router:viewchange', this.render, this);
		},

		/** Renders the toolbar view */
		render: function() {
			this.$el.html(tmpl(this.model.toJSON()));
			window.console.log('[toolbar:view] rendered');
			return this;
		}
	}));
});