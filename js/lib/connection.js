/*global define*/
define([
	'lib/pubsub'
], function(pubsub) {
	'use strict';

	/**
	 * Creates a new connection, if URI is specified, it should
	 * bootstrap and open the websocket as well.
	 * @constructor
	 * @param {string} uri Optional URI, passed into Connection#create
	 */
	function Connection(uri) {
		this.sendQueue = [];
		if (uri) {
			this.create(uri);
		}
	}

	/**
	 * Connection#create is used to actually open up a connection, can
	 * be used separately to delay connection attempts (if no URI is sent
	 * to the constructor).
	 * @throws {error} If URI is missing
	 * @param {string} uri The URI to connect to
	 */
	Connection.prototype.create = function(uri) {
		if (!uri) {
			throw new Error('No URI sent to Connection#create');
		}
		this.uri = uri;
		this.socket = new WebSocket(this.uri);
		this.socket.onopen = this.onOpen.bind(this);
		this.socket.onerror = this.onError.bind(this);
		this.socket.onclose = this.onClose.bind(this);
		this.socket.onmessage = this.onMessage.bind(this);
		pubsub.subscribe('connection:transmit', this.onTransmit, this);
	};

	/**
	 * Connection#isActive is used to determine if the socket is open for
	 * business.
	 * @returns {bool} Whether the socket is open
	 */
	Connection.prototype.isActive = function() {
		return this.socket && this.socket.readyState === WebSocket.OPEN;
	};

	/**
	 * Connection#send is used to send JSON-RPC calls through the socket.
	 * @throws {error} If arguments are missing
	 * @triggers connection:send The stringified data that are being sent
	 * @param {string} id The unique ID to tie this request to the response
	 * @param {Object} data The data needed to do the JSON-RPC call
	 */
	Connection.prototype.send = function(id, data) {
		if (arguments.length !== 2) {
			throw new Error('Missing arguments in connection#send');
		}
		if (!this.isActive()) {
			this.sendQueue.push([id, data]);
			return;
		}
		data.jsonrpc = '2.0';
		data.id = id;
		if (typeof data !== 'string') {
			data = JSON.stringify(data);
		}
		this.publish('send', data);
		this.socket.send(data);
	};

	/**
	 * Connection#close is used to destroy the connection.
	 * @triggers connection:error If it failed to destroy the connection without issues
	 * @param {string} why An optional reason why it's closing
	 */
	Connection.prototype.close = function(/*why*/) {
		try {
			this.socket.close();
		} catch(err) {
			this.publish('error', err);
		}
		pubsub.unsubscribe('connection:transmit', this.onTransmit);
	};

	/**
	 * Connection#publish Can be used to emit a topic to the system from a
	 * specific connection.
	 * @param {string} topic The unprefixed topic to emit
	 * @param {object} The data to publish
	 * @triggers connection:<topic>
	 */
	Connection.prototype.publish = function(topic, data) {
		data = data || {};
		data.connection = this;
		window.console.log('[connection:' + topic + ']', data);
		pubsub.publish('connection:' + topic, data);
	};

	/**
	 * Connection#onOpen Triggered from the socket when it has been
	 * successfully opened.
	 * @triggers connection:open
	 * @private
	 */
	Connection.prototype.onOpen = function(evt) {
		evt.uri = this.uri;
		this.publish('open', evt);
		this.sendQueue.forEach(function(item) {
			this.send.apply(this, item);
		}.bind(this));
		this.sendQueue = [];
	};

	/**
	 * Connection#onOpen Triggered from the socket when an error has been
	 * noticed. Also triggered internally when the JSON-RPC response contains
	 * an error object.
	 * @triggers connection:error
	 * @private
	 */
	Connection.prototype.onError = function(evt) {
		this.publish('error', evt);
	};

	/**
	 * Connection#onClose Triggered from the socket when the socket has been
	 * closed.
	 * @triggers connection:close
	 * @private
	 */
	Connection.prototype.onClose = function(evt) {
		this.publish('close', evt);
	};

	/**
	 * Connection#onMessage Triggered from the socket when a message has been
	 * received. If an error object is sent with the data, it'll trigger
	 * Connection#onError.
	 * @triggers connection:data If no error object is found
	 * @private
	 */
	Connection.prototype.onMessage = function(evt) {
		var data = JSON.parse(evt.data || "{}");
		if (data.error) {
			this.onError(evt);
			return;
		}
		this.publish('data', data);
	};

	/**
	 * Connection#onTransmit Triggered from pubsub system when something wants to
	 * send data to the socket.
	 * @param {object} data Contains `id` and `data` keys that will be applied to Connection#send
	 */
	Connection.prototype.onTransmit = function(data) {
		this.send(data.id, data.data);
	};

	return Connection;
});