define([
	'lib/connection',
	'lib/pubsub'
], function(conn, pubsub) {

	/**
	 * `routeData` basically only take the initial data from
	 * the websocket and re-routes it depending on a few
	 * parameters. We do this because the XBMC websocket is
	 * not giving us all data we need, so we separate notifications
	 * (info pushed to us) from RPC call responses because the data.
	 * response is so different between them.
	 * @param {Object} data The data sent from socket.
	 */
	function routeData(data) {
		if (data.method) {
			routeNotification(data);
		} else {
			routeRPC(data);
		}
	}

	/**
	 * `routeNotification` parses any notifications from the socket.
	 * Depending on the type, we assume stuff is happening, even if the
	 * call might have been triggered in XBMC due to other things (e.g.)
	 * `Player.OnStop` might have been triggered, but XBMC never actually
	 * played anything.
	 * @event api:playerStarted A pubsub publish when XBMC player starts.
	 * @event api:playerStopped A pubsub publish when XBMC player stops.
	 * @event api:playerPaused A pubsub publish when XBMC player pauses.
	 * @param {Object} data The data sent from socket.
	 */
	function routeNotification(data) {
		var method = data.method;
		data = data.params.data;
		console.log('routeNotification', method, data);
		if (method === 'Player.OnPlay') {
			pubsub.publish('api:playerStarted');
			if (data.item.type === 'episode') {
				getEpisode(data.item.id);
			} else if (data.item.type === 'movie') {
				getMovie(data.item.id);
			}
		} else if (method === 'Player.OnStop') {
			pubsub.publish('api:playerStopped');
		} else if (method === 'Player.OnPaused') {
			pubsub.publish('api:playerPaused');
		}
	}

	/**
	 * `routeRPC` parses any RPC call responses from the socket.
	 * We try to normalize a few responses and propagate them through
	 * the client using dynamic pubsub publishes.
	 * @event api:{type} A pubsub publish where {type} can be either `episode` or `movie`.
	 * @param {Object} data The data sent from socket.
	 */
	function routeRPC(data) {
		data = data.result;
		console.log('routeRPC', data);
		['episode', 'movie'].forEach(function(t) {
			var details = data[t + 'details'];
			if (details) {
				details.thumbnail = decodeURIComponent(details.thumbnail.replace(/^image:\/\//, ''));
				pubsub.publish('api:' + t, details);
			}
		});
	}

	/**
	 * `getEpisode` handles a request to receive more data on a TV episode.
	 * @param {Number} id The tv episode ID in XBMC DB.
	 */
	function getEpisode(id) {
		var call = {
			method: 'VideoLibrary.GetEpisodeDetails',
			params: {
				episodeid: id,
				properties: [
					'title',
					'plot',
					'season',
					'episode',
					'showtitle',
					'thumbnail'
				]
			}
		};
		conn.send(call);
	}

	/**
	 * `getMovie` handles a request to receive more data on a movie.
	 * @param {Number} id The movie ID in XBMC DB.
	 */
	function getMovie(id) {
		var call = {
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
		};
		conn.send(call);
	}

	pubsub.subscribe('connection:received', routeData);
});