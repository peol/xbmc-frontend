define([
	'jquery',
	'Backbone'
], function($, Backbone) {
	return (Backbone.View.extend({
		render: function() {
			console.log('[remoteTouch:view] rendered');
			return this;
		}
	}));
});