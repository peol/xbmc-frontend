/*global define*/
define([
	'Backbone',
	'lib/pubsub'
], function(Backbone, pubsub) {
	'use strict';

	return (Backbone.Model.extend({
		defaults: {
			label: 'New XBMC Instance',
			host: '127.0.0.1',
			port: 9090,
			isActive: false,
			isConnected: false
		},
		initialize: function() {
			pubsub.subscribe('connection:open', this.setConnected, this);
		},
		setConnected: function(evt) {
			this.set('isConnected', evt.uri === this.toString());
		},
		isConnected: function() {
			return this.get('isConnected');
		},
		toString: function() {
			return 'ws://' + this.get('host') + ':' + this.get('port') + '/jsonrpc';
		}
	}));
});