/*global define*/
define([
	'jquery',
	'views/base',
	'hbs!tmpl/toolbar'
], function($, BaseView, tmpl) {
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
			this.model.on('change', this.render, this);
		},

		/** Renders the toolbar view */
		render: function() {
			this.$el.html(tmpl(this.model.toJSON()));
			window.console.log('[toolbar:view] rendered');
			return this;
		}
	}));
});