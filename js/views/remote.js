/*global define*/
define([
	'views/base',
	'views/remoteTouchView',
	'views/remoteDesktopView'
], function(BaseView, RemoteTouchView, RemoteDesktopView) {
	'use strict';

	return (BaseView.extend(
		/** @lends RemoteView.prototype */
		{

		/**
		 * View that let's the user control the XBMC instance
		 * remotely. It will create a sub view for either desktop
		 * or touch depending on the device that does the actual
		 * interaction bits.
		 * 
		 * @name RemoteView
		 * @augments BaseView
		 * @constructs
		 */
		initialize: function() {
			this.subView = ('ontouchstart' in document) ?
				new RemoteTouchView():
				new RemoteDesktopView();
		},

		/** Renders the remote view and its subview */
		render: function() {
			this.$el.html(this.subView.render().el);
			window.console.log('[remote:view] rendered');
			return this;
		},

		/** Destroys the remote view and its subview */
		destroy: function() {
			this.subView.destroy();
			BaseView.prototype.destroy.apply(this, arguments);
		}
	}));
});