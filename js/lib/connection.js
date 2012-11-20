/*global define*/
define([
	'lib/pubsub'
], function(pubsub) {
	'use strict';

	/**
	 * Creates a new connection, if URI is specified, it should
	 * bootstrap and open the websocket as well.
	 *
	 * @exports Connection
	 * 
	 * @param {String} uri (optional) URI, passed into Connection#create
	 */
	var Connection = function(uri) {
		this.sendQueue = [];
		if (uri) {
			this.create(uri);
		}
	};

	/**
	 * Used to actually open up a connection, can be used separately to delay connection
	 * attempts (if no URI is sent to the constructor).
	 * 
	 * @throws {Error} If URI is missing
	 * 
	 * @param {String} uri The URI to connect to
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
	 * Used to determine if the socket is open for business.
	 * 
	 * @returns {Boolean} Whether the socket is open
	 */
	Connection.prototype.isActive = function() {
		return this.socket && this.socket.readyState === WebSocket.OPEN;
	};

	/**
	 * Used to send JSON-RPC calls through the socket.
	 * 
	 * @throws {Error} If arguments are missing
	 * @fires connection:send The stringified data that are being sent
	 * 
	 * @param {String} id The unique ID to tie this request to the response
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
	 * Used to destroy the connection, effectively kills the websocket.
	 * 
	 * @fires connection:error If it failed to destroy the connection without issues
	 */
	Connection.prototype.close = function() {
		try {
			this.socket.close();
		} catch(err) {
			this.publish('error', err);
		}
		pubsub.unsubscribe('connection:transmit', this.onTransmit);
	};

	/**
	 * Can be used to emit a topic to the system from a specific connection.
	 * 
	 * @fires connection:<topic>
	 * 
	 * @param {String} topic The unprefixed topic to emit
	 * @param {Object} data The data to publish
	 */
	Connection.prototype.publish = function(topic, data) {
		data = data || {};
		data.connection = this;
		window.console.log('[connection:' + topic + ']', data);
		pubsub.publish('connection:' + topic, data);
	};

	/**
	 * Triggered from the socket when it has been successfully opened.
	 * 
	 * @private
	 * @fires connection:open
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
	 * Triggered from the socket when an error has occurred. Reused by @see Connection#onClose
	 * if it can't close properly. Also triggered internally when the JSON-RPC response contains
	 * an error object.
	 * 
	 * @private
	 * @fires connection:error
	 */
	Connection.prototype.onError = function(evt) {
		this.publish('error', evt);
	};

	/**
	 * Triggered from the socket when the socket has been closed.
	 * 
	 * @private
	 * @fires connection:close
	 */
	Connection.prototype.onClose = function(evt) {
		this.publish('close', evt);
	};

	/**
	 * Triggered from the socket when a message has been received. If an error object is sent
	 * with the data, it'll trigger {@link Connection#onError}.
	 * 
	 * @private
	 * @fires connection:data If no error object is found
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
	 * Triggered from pubsub system when something wants to send data to the socket.
	 * 
	 * @private
	 * 
	 * @param {object} data Contains `id` and `data` keys that will be applied to Connection#send
	 */
	Connection.prototype.onTransmit = function(data) {
		this.send(data.id, data.data);
	};

	return Connection;
});