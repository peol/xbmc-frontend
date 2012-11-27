/*global define*/
define([
	'lib/xbmcapi-namespace',
	'lib/xbmcapi-handlers',
	'lib/pubsub'
], function(ns, handlers, pubsub) {
	/**
	 * Methods that handles incoming notifications from the XBMC instance and publishes them
	 * to the system so that it can react accordingly.
	 *
	 * @exports XBMC-API-notifications
	 */
	var notifications = {
		/**
		 * Delegation method used for all incoming notifications. This will parse the name
		 * of the notification and try to call the method that can handle that notification.
		 * 
		 * @param {Object} data The notification data
		 */
		delegate: function(data) {
			var type = data.method.split('.On')[1].toLowerCase(),
				fn = ns.notifications[type];
			if (fn) {
				fn(data.params.data);
			}
		},

		/**
		 * Handles Player.OnPlay notifications.
		 * 
		 * @param {Object} data The OnPlay data
		 */
		play: function(data) {
			handlers.players(data);
		},

		/**
		 * Handles Player.OnStopped notifications.
		 * 
		 * @fires api:playerStopped when the player has stopped playing an item
		 */
		stop: function() {
			pubsub.publish('api:playerStopped');
		}
	};
	return notifications;
});