define([
	'jquery',
	'Backbone',
	'hbs!tmpl/unknown'
], function($, Backbone, tmpl) {
	'use strict';

	return (Backbone.View.extend({
		render: function() {
			this.$el.html(tmpl({ route: Backbone.history.fragment }));
			window.console.log('[unknown:view] rendered');
			return this;
		}
	}));
});