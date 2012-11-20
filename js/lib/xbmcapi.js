/*global define*/
define([
	'lib/pubsub'
], function(pubsub) {
	'use strict';

	// TODO: Rewrite this module, it's crap

	var
	_connection,
	/**
	 * Built-in handlers for common JSON-RPC calls/notifications, each key corresponds
	 * to the method name in the API.
	 */
	handlers = {
		/**
		 * If any players are active, we need to get additional information
		 * about what it's playing.
		 * @param {Object} data Data received from the socket/XBMC.
		 */
		'Player.GetActivePlayers': function(data) {
			var playerId = data.result.length && data.result[0].playerid;
			if (playerId) {
				getPlayerData(playerId);
			}
		},
		/**
		 * When we get data of the currently played item, we fork the data
		 * either directly to the client (if it's not a library item) or
		 * request additional information of the library item.
		 * @event api:playerStopped A pubsub publish to notify that some media is playing on XBMC (only triggered if the item isn't in the library).
		 * @param {Object} data Data received from the socket/XBMC.
		 */
		'Player.GetItem': function(data) {
			if (!data.result.item.id) {
				// no id, we assume it's not a lib item
				pubsub.publish('api:video', data.result.item);
			} else {
				handlers['Player.OnPlay']({ params: { data: { item: data.result.item } } });
			}
		},
		/**
		 * Whenever the user plays an item, we check if we have a getter method for that
		 * type (and triggers the getter if it exist).
		 * @param {Object} data Data received from the socket/XBMC.
		 */
		'Player.OnPlay': function(data) {
			data = data.params.data.item;
			var id = data.id,
				getter = getters[data.type];
			if (id && getter) {
				getter(id);
			} else {
				getPlayers();
			}
		},
		/**
		 * Propagate playback stopped to the client.
		 * @event api:playerStopped A pubsub publish to notify that the XBMC player has stopped.
		 * @param {Object} data Data received from the socket/XBMC.
		 */
		'Player.OnStop': function(/*data*/) {
			pubsub.publish('api:playerStopped');
		},
		/**
		 * Propagate tv episode details to the client.
		 * @event api:episode A pubsub publish to the client, with tv episode data.
		 * @param {Object} data Data received from the socket/XBMC.
		 */
		'VideoLibrary.GetEpisodeDetails': function(data) {
			pubsub.publish('api:episode', scrubData(data.result.episodedetails));
		},
		/**
		 * Propagate movie details to the client.
		 * @event api:movie A pubsub publish to the client, with movie data.
		 * @param {Object} data Data received from the socket/XBMC.
		 */
		'VideoLibrary.GetMovieDetails': function(data) {
			pubsub.publish('api:movie', scrubData(data.result.moviedetails));
		}
	},
	getters = {
		/**
		 * Getter method for tv episode details.
		 * @param {Number} id The tv episode library ID.
		 */
		episode: function(id) {
			send('VideoLibrary.GetEpisodeDetails', {
				method: 'VideoLibrary.GetEpisodeDetails',
				params: {
					episodeid: id,
					properties: [
						'title',
						'showtitle',
						'plot',
						'season',
						'episode',
						'thumbnail'
					]
				}
			});
		},
		/**
		 * Getter method for movie details.
		 * @param {Number} id The movie library ID.
		 */
		movie: function(id) {
			send('VideoLibrary.GetMovieDetails', {
				method: 'VideoLibrary.GetMovieDetails',
				params: {
					movieid: id,
					properties: [
						'title',
						'year',
						'plotoutline',
						'plot',
						'thumbnail'
					]
				}
			});
		}
	};

	/**
	 * Only works as a proxy against Connection#send but can be expanded to handle
	 * API-internal stuff before sending.
	 * @param {Dynamic} id A unique ID used to tie request with response.
	 * @param {Object} data Data to be sent to the socket/XBMC.
	 */
	function send(id, data) {
		if (!_connection) {
			throw new Error("No connection set in xbmcapi");
		}
		_connection.send(id, data);
	}

	/**
	 * `routeData` handles initial incoming data. If there's a handler for this response,
	 * it'll fork the data to it, otherwise will try to handle it through
	 * `unhandledMethod`.
	 * @param {Object} data Data received from the socket/XBMC.
	 */
	function routeData(data) {
		if (handlers[data.id || data.method]) {
			handlers[data.id || data.method](data);
		} else {
			unhandledMethod(data);
		}
	}

	/**
	 * When called, it's the last resort to do something with the data. We send
	 * the raw data to the client if anything would like to do something with it.
	 * @event api:unhandled A pubsub publish to the client, with raw unhandled data.
	 * @param {Object} data Data received from the socket/XBMC.
	 */
	function unhandledMethod(data) {
		pubsub.publish('api:unhandled', data);
	}

	/**
	 * `getPlayers` requests data on any active players.
	 */
	function getPlayers() {
		send('Player.GetActivePlayers', { method: 'Player.GetActivePlayers' });
	}

	/**
	 * `getPlayerData` requests data on a specific player.
	 * @param {Number} playerId The XBMC player ID.
	 */
	function getPlayerData(playerId) {
		send('Player.GetItem', {
			method: 'Player.GetItem',
			params: {
				playerid: playerId,
				properties: ['title', 'file', 'duration']
			}
		});
	}

	/**
	 * `setConnection` sets the currently active connection we're working against.
	 * @param {Connection} connection The new connection
	 */
	function setConnection(connection) {
		_connection = connection;
		// retrieve initial data
		getPlayers();
	}

	/**
	 * `sendNotification` can be used to broadcast GUI notifications on the XBMC
	 * instance.
	 * @param {string} title Optional title on the message
	 * @param {string} message The message to broadcast
	 * @param {number} displayTime The number of milliseconds to show the message
	 */
	function sendNotification(title, message, displayTime) {
		send('GUI.ShowNotification', {
			method: 'GUI.ShowNotification',
			params: {
				title: title || 'xbmc-frontend',
				message: message || '',
				displaytime: displayTime || 6000
			}
		});
	}

	/**
	 * `sayHello` just notifies XBMC that we have connected to it.
	 */
	function sayHello() {
		sendNotification(null, 'Web interface connected');
	}

	/**
	 * `scrubData` tries to fix data properties not ready for output yet.
	 * @param {Object} data The data to be scrubbed.
	 * @returns {Object} The scrubbed data.
	 */
	function scrubData(data) {
		if (data.thumbnail) {
			data.thumbnail = decodeURIComponent(data.thumbnail.replace(/^image:\/\/|\/$/ig, ''));
		}
		return data;
	}

	pubsub.subscribe('connection:open', sayHello);
	pubsub.subscribe('connection:data', routeData);

	return {
		setConnection: setConnection,
		sendNotification: sendNotification,
		send: send
	};
});