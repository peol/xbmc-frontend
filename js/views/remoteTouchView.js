define([
	'jquery',
	'Backbone'
], function($, Backbone) {
	'use strict';

	return (Backbone.View.extend({
		render: function() {
			window.console.log('[remoteTouch:view] rendered');
			return this;
		}
	}));
});