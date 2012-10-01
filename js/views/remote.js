define([
	'jquery',
	'Backbone',
	'views/remoteTouchView',
	'views/remoteDesktopView'
], function($, Backbone, RemoteTouchView, RemoteDesktopView) {
	'use strict';

	return (Backbone.View.extend({
		initialize: function() {
			this.subView = 'ontouchstart' in document ?
				new RemoteTouchView():
				new RemoteDesktopView();
		},
		render: function() {
			this.$el.html(this.subView.render().el);
			window.console.log('[remote:view] rendered');
			return this;
		}
	}));
});