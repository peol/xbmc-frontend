define([
	'lib/pubsub'
], function(pubsub) {
	var timeout = 3000,
		retry = 30000,
		socket,
		cachedUrl,
		pendingTimer,
		sendQueue = [];

	/**
	 * `create` sets up a new socket and binds relevant internal callbacks.
	 * A pending timer is also started and will trigger a `close` on the socket
	 * if no response has been received within `timeout` milliseconds.
	 * @event connection:created A pubsub publish to notify that a connection try has started.
	 */
	function create(url) {
		close();
		cachedUrl = url;
		socket = new WebSocket('ws://' + url);
		socket.onopen = open;
		socket.onerror = error;
		socket.onclose = close;
		socket.onmessage = receive;
		pubsub.publish('connection:created', {
			url: url
		});
		pendingTimer = setTimeout(close, timeout);
	}

	/**
	 * `clearPending` clears the (potentially) pending connection timeout.
	 * @returns {Bool} Whether a pending timer was cleared.
	 */
	function clearPending() {
		if (pendingTimer) {
			pendingTimer = clearTimeout(pendingTimer);
			return true;
		}
		return false;
	}

	/**
	 * `isActive` checks if the current websocket is connected and
	 * ready for sending/receiving data.
	 * @returns {Bool} Whether the socket is open and error-free.
	 */
	function isActive() {
		return socket && socket.readyState === WebSocket.OPEN;
	}

	/**
	 * `open` is triggered by the socket whenever the connection is established.
	 * Starts by sending any queued up calls and then notifying the client that
	 * the connection is ready for prime time.
	 * @event connection:opened A pubsub publish that the connection is ready.
	 */
	function open(evt) {
		clearPending();
		sendQueue.forEach(function(data) {
			send.apply(this, data);
		});
		sendQueue = [];
		pubsub.publish('connection:opened', {
			url: cachedUrl
		});
	}

	/**
	 * `error` is triggered both by the socket itself and by internal methods in this module.
	 * An example of internal triggering is when the JSON data received from the socket is malformed.
	 * @event connection:error A pubsub publish to notify the client that we received errors from the socket.
	 */
	function error(evt) {
		pubsub.publish('connection:error', {
			url: cachedUrl,
			closed: !isActive(),
			message: evt.message || evt.data
		});
	}

	/**
	 * `close` is triggered from the socket, we handle this as an error in the client.
	 */
	function close(evt) {
		clearPending();
		if (!evt) {
			if (socket) {
				try {
					socket.close();
				} catch(err) {}
			}
			return;
		} else {
			if (!isActive() && retry && !pendingTimer) {
				pendingTimer = setTimeout(function() {
					create(cachedUrl);
				}, retry);
			}
		}
		pubsub.publish('connection:closed', {
			url: cachedUrl
		});
	}

	/**
	 * `receive` is triggered from the socket whenever data has been sent to us.
	 * If the data is malformed, or we got an error from XBMC, it'll trigger the
	 * `error` callback above.
	 * @event connection:received A pubsub publish with the data (if it was successfully parsed).
	 */
	function receive(evt) {
		var data = JSON.parse(evt.data);
		if (data.error) {
			error(data.error);
			return;
		}
		pubsub.publish('connection:received', data);
	}

	/**
	 * `send` is a publically exposed method to send raw data through the socket.
	 * If the socket isn't ready for sending/receiving yet, we queue the call for later.
	 * @event connection:sent A pubsub publish to notify the client that some data has been sent.
	 */
	function send(id, data) {
		if (arguments.length !== 2) {
			throw new Error('Missing arguments in connection#send');
		}

		if (!isActive()) {
			sendQueue.push([id, data]);
			return;
		}
		data.jsonrpc = '2.0';
		data.id = id;
		pubsub.publish('connection:sent', data);
		data = JSON.stringify(data);
		socket.send(data);
	}

	['created', 'opened', 'received', 'sent', 'error', 'closed'].forEach(function(method) {
		pubsub.subscribe('connection:' + method, function(data) { console.log(method, data); });
	});

	return {
		create: create,
		send: send,
		isActive: isActive
	};
});