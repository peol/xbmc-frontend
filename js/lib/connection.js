/*global define*/
define([
	'jquery',
	'lib/pubsub'
], function($, pubsub) {
	'use strict';

	/**
	 * Creates a new connection, if URI is specified, it should
	 * bootstrap and open the websocket as well.
	 *
	 * @exports Connection
	 * 
	 * @param {String} [uri] URI, passed into Connection#create
	 */
	var Connection = function(uri) {
		this.sendQueue = [];
		this.deferreds = {};
		if (uri) {
			this.uri = uri;
			this.create();
		}
	};

	Connection._expando = 0;
	Connection.generateId = function() {
		return '__id' + (++Connection._expando);
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
		if (!uri && !this.uri) {
			throw new Error('No URI sent to Connection#create');
		}
		this.uri = uri || this.uri;
		this.socket = new WebSocket(this.uri);
		this.socket.onopen = this.onOpen.bind(this);
		this.socket.onerror = this.onError.bind(this);
		this.socket.onclose = this.onClose.bind(this);
		this.socket.onmessage = this.onMessage.bind(this);
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
	 * @throws {Error} If arguments are not equal to 1
	 * @fires connection:send The stringified data that are being sent
	 * 
	 * @param {Object} data The data needed to do the JSON-RPC call
	 *
	 * @returns {$.Deferred} A promise that will be resolved/rejected once the
	 *                       instance has answered our call
	 */
	Connection.prototype.send = function(data) {
		if (arguments.length !== 1) {
			throw new Error('Connection: Unknown arguments');
		}
		var id = data.id = data.id || Connection.generateId(),
			dfd = this.deferreds[id] = this.deferreds[id] || $.Deferred();
		if (!this.isActive()) {
			this.sendQueue.push(data);
		} else {
			data.jsonrpc = '2.0';
			this.publish('send', $.extend(true, {}, data));
			data = JSON.stringify(data);
			this.socket.send(data);
		}
		return dfd.promise();
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
		setTimeout(function() {
			this.sendQueue.forEach(function(item) {
				this.send(item);
			}, this);
			this.sendQueue = [];

		}.bind(this), 500);
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
	 * This will resolve (or reject if any errors are found) the deferreds that's been attached
	 * to this call. If none is found, it'll just silently do nothing.
	 * 
	 * @private
	 * @fires connection:data Data attached to the response
	 * @fires connection:notification Data attached to the notification
	 */
	Connection.prototype.onMessage = function(evt) {
		var data = JSON.parse(evt.data || "{}"),
			id = data && data.id,
			dfd = this.deferreds[id];
		delete this.deferreds[id];
		if (data.error) {
			this.onError(evt);
			if (dfd) {
				dfd.reject(data);
			}
			return;
		}
		if (data.method && data.method.indexOf('.On') > -1 ) {
			this.publish('notification', data);
		} else {
			this.publish('data', data);
		}
		if (dfd) {
			dfd.resolve(data);
		}
	};

	return Connection;
});