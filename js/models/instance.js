/*global define*/
define([
	'Backbone',
	'lib/pubsub'
], function(Backbone, pubsub) {
	'use strict';

	return (Backbone.Model.extend(
		/** @lends InstanceModel.prototype */
		{
		/**
		 * Default properties for an instance.
		 * 
		 * @type {Object}
		 * @property {String} label The description of the instance
		 * @property {String} host The hostname/IP address to the instance
		 * @property {Number} port The port the instance listens on
		 */
		defaults: {
			label: 'New XBMC Instance',
			host: '127.0.0.1',
			port: 9090,
			/** @private */
			isActive: false,
			/** @private */
			isConnected: false
		},

		/**
		 * Represents an XBMC instance.
		 *
		 * @name InstanceModel
		 * @augments BaseView
		 * @constructs
		 */
		initialize: function() {
			pubsub.subscribe('connection:open', this._setConnected, this);
			pubsub.subscribe('connection:close', this._setConnected, this);
		},

		/**
		 * Updates the instance's `isConnected` property depending on what
		 * the `connection:open` topic publishes as the active instance.
		 *
		 * @private
		 * 
		 * @param {Object} evt The PubSub data attached to the publish
		 */
		_setConnected: function(evt) {
			var isConn = false;
			if (evt.type !== 'close' && evt.uri === this.toString()) {
				isConn = true;
			}
			this.set('isConnected', isConn);
		},

		/**
		 * Checks whether the instance is currently connected.
		 * 
		 * @returns {Boolean} Whether the instance is connected
		 */
		isConnected: function() {
			return this.get('isConnected');
		},

		/**
		 * Get a string representation of the instance.
		 * 
		 * @returns {String} A string version of the instance, formatted
		 *                   as a websocket URI.
		 * 
		 * @example
		 * var inst = new Instance({ host: 'localhost', port: 4934 });
		 * inst.toString(); // => "ws://localhost:4934/jsonrpc"
		 */
		toString: function() {
			return 'ws://' + this.get('host') + ':' + this.get('port') + '/jsonrpc';
		}
	}));
});