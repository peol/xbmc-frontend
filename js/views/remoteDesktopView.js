define([
	'jquery',
	'Backbone'
], function($, Backbone) {
	'use strict';

	return (Backbone.View.extend({
		render: function() {
			window.console.log('[remoteDesktop:view] rendered');
			return this;
		}
	}));
});