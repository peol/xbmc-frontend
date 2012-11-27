/*global define*/
define([
	'lib/xbmcapi-namespace',
	'lib/pubsub'
], function(ns, pubsub) {
	/**
	 * XBMC-API's specific handlers for common API calls.
	 *
	 * @exports XBMC-API-handlers
	 */ 
	var handlers = {
		/**
		 * Handles the Player.GetPlayers result. If a player is found, it'll
		 * poll for more information through XBMC-API.playerItem.
		 * 
		 * @param {Object} data The response data
		 */
		players: function(data) {
			var playerId = (data.result && data.result.length && data.result[0] ||
				data.player || {}).playerid;
				if (playerId) {
					ns.send('Player.GetItem', { playerid: playerId }).done(handlers.playerItem);
				}
		},

		/**
		 * Handles the Player.GetItem result. It'll convey messages to the system
		 * on what type of media that is playing, defaulting to video. If it detects
		 * a library item, it'll poll the instance for more specific data depending
		 * on the type of media that is playing.
		 *
		 * @fires api:video Fired if no item ID is found in the response
		 * 
		 * @param {Object} data The response data
		 */
		playerItem: function(data) {
			if (!data.result.item.id) {
				// no id, we assume it's not a lib item
				pubsub.publish('api:video', data.result.item);
			} else {
				data = data.result.item;
				var fn = ns.media[data.type];
				if (fn) {
					fn(data.id);
				} else {
					window.console.log('Unhandled played item:', data);
				}
			}
		}
	};

	return handlers;
});