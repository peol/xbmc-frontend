/*global define*/
define([
	'jquery',
	'lib/xbmcapi-namespace',
	'lib/xbmcapi-handlers',
	'lib/xbmcapi-media',
	'lib/xbmcapi-notifications',
	'lib/pubsub'
], function($, ns, handlers, media, notifications, pubsub) {
	'use strict';

	/**
	 * The xbmcapi module is used to interact with the XBMC API. It requires that a connection
	 * has been set before usage. It contains a few shortcut methods to send instructions, but
	 * the core thing is that it conveys messages to the system when notifications are sent from
	 * the XBMC instance. It does also respond to those and automatically fetches more information
	 * about items being played etc.
	 * 
	 * @exports XBMC-API
	 * 
	 * @example
	 * api.message('Hello there', 'Optional title');
	 * // => will show a notification on the lower right on the XBMC instance
	 */
	var api = ns,
		_connection,
		_queue = [];
	api.handlers = handlers;
	api.media = media;
	api.notifications = notifications;

	/**
	 * Sets the connection that will be used to communicate with the XBMC instance.
	 * Only one connection can be enabled at the time. 
	 * 
	 * @param {module:Connection} connection The connection to attach to
	 */
	api.setConnection = function(connection) {
		if (_connection) {
			_connection.close();
		}
		_connection = connection;
		_queue.forEach(function(item) {
			api.send(item.method, item.params, item.dfd);
		});
		_queue = [];
		api.initialize();
	};

	/**
	 * Initialize a new connection. Asks for initial data so that we can notify the system
	 * on what's currently playing etc.
	 */
	api.initialize = function() {
		api.send('Player.GetActivePlayers').done(api.handlers.players);
	};

	/**
	 * Send data using the {@link module:Connection} instance.
	 * 
	 * @param {String} method The XBMC JSON-RPI method name
	 * @param {Object} [params] The parameters for the method call
	 *
	 * @returns {$.Deferred} A deferred promise object that'll be resolved/rejected when the
	 *                       instance has given us an answer, see the jQuery API documentation
	 *                       on how to use a deferred
	 */
	api.send = function(method, params, dfd) {
		if (typeof params === 'undefined') {
			params = {};
		}
		var data = { method: method, params: params },
			connDfd;
		if (!_connection) {
			data.dfd = $.Deferred();
			_queue.push(data);
			return data.dfd.promise();
		}
		connDfd = _connection.send(data);
		if (dfd) {
			connDfd.pipe(dfd.resolve);
		}
		return connDfd;
	};

	/**
	 * Scrub (clean) any data before sharing it with the rest of the system. This can be used
	 * to URL-decode properties, format dates etc.
	 * 
	 * @param {Object} data The object to scrub
	 * @returns {Object} The same object, scrubbed
	 */
	api.scrub = function(data) {
		if (data.thumbnail) {
			data.thumbnail = decodeURIComponent(data.thumbnail.replace(/^image:\/\/|\/$/ig, ''));
		}
		return data;
	};

	/**
	 * Send a notification/message to the XBMC instance, shown in the lower right.
	 * 
	 * @param {String} message The message to display
	 * @param {String} [title] Title of the notification box, defaults to 'xbmc-frontend'
	 * @param {Number} [displayTime] How long to display it in milliseconds, defaults to 6000ms
	 */
	api.message = function(message, title, displayTime) {
		api.send('GUI.ShowNotification', {
			title: title || 'xbmc-frontend',
			message: message || '',
			displaytime: displayTime || 6000
		});
	};

	/**
	 * Connect to the web socket, mainly used to connect after being disconnected.
	 */
	api.connect = function() {
		if (_connection) {
			if (_connection.isActive()) {
				_connection.close();
			}
			_connection.create();
		}
	};

	pubsub.subscribe('connection:open', function() {
		api.message('Attached to XBMC instance.');
	});
	pubsub.subscribe('connection:notification', api.notifications.delegate);

	return api;
});