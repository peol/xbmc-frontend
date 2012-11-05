/*global define*/
define([
	'views/base',
	'views/remoteTouchView',
	'views/remoteDesktopView'
], function(BaseView, RemoteTouchView, RemoteDesktopView) {
	'use strict';

	return (BaseView.extend({
		initialize: function() {
			this.subView = ('ontouchstart' in document) ?
				new RemoteTouchView():
				new RemoteDesktopView();
		},
		render: function() {
			this.$el.html(this.subView.render().el);
			window.console.log('[remote:view] rendered');
			return this;
		},
		destroy: function() {
			this.subView.destroy();
			BaseView.prototype.destroy.apply(this, arguments);
		}
	}));
});