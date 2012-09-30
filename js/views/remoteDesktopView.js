define([
	'jquery',
	'Backbone'
], function($, Backbone) {
	return (Backbone.View.extend({
		render: function() {
			console.log('[remoteDesktop:view] rendered');
			return this;
		}
	}));
});