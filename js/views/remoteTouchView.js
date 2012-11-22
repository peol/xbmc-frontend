/*global define*/
define([
	'views/base'
], function(BaseView) {
	'use strict';

	return (BaseView.extend(
		/** @lends RemoteTouchView.prototype */
		{

		/**
		 * View that enables a user with a touch device to remotely interact
		 * with the XBMC instance by using intuitive gestures.
		 * 
		 * @name RemoteTouchView
		 * @augments BaseView
		 * @constructs
		 */
		initialize: function() {
			this.$el.addClass('view-remote-touch');
		},

		/** Renders the remote touch view */
		render: function() {
			window.console.log('[remoteTouch:view] rendered');
			return this;
		}
	}));
});