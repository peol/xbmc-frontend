/*global define*/
define([
	'Backbone',
	'views/base',
	'hbs!tmpl/unknown'
], function(Backbone, BaseView, tmpl) {
	'use strict';

	return (BaseView.extend({
		render: function() {
			this.$el.html(tmpl({ route: Backbone.history.fragment }));
			window.console.log('[unknown:view] rendered');
			return this;
		}
	}));
});