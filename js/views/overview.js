define([
	'jquery',
	'Backbone',
	'hbs!tmpl/overview'
], function($, Backbone, tmpl) {
	'use strict';

	return (Backbone.View.extend({
		initialize: function() {
			this.model.on('change', this.render, this);
		},
		render: function() {
			this.$el.html(tmpl(this.model.toJSON()));
			window.console.log('[overview:view] rendered');
			return this;
		}
	}));
});