define([
	'jquery',
	'Backbone',
	'views/remoteTouchView',
	'views/remoteDesktopView'
], function($, Backbone, RemoteTouchView, RemoteDesktopView) {
	return (Backbone.View.extend({
		initialize: function() {
			this.subView = 'ontouchstart' in document ?
				new RemoteTouchView():
				new RemoteDesktopView();
		},
		render: function() {
			this.$el.html(this.subView.render().el);
			console.log('[remote:view] rendered');
			return this;
		}
	}));
});