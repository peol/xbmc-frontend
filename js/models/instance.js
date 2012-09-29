define([
	'Backbone',
	'lib/pubsub'
], function(Backbone, pubsub) {
	return (Backbone.Model.extend({
		defaults: {
			label: 'New XBMC Instance',
			host: '127.0.0.1',
			port: 9090,
			isActive: false
		},
		initialize: function() {
			pubsub.subscribe('connection:open', this.setConnected, this);
		},
		setConnected: function(uri) {
			this._isConnected = uri === this.toString();
		},
		isConnected: function() {
			return this._isConnected;
		},
		toString: function() {
			return 'ws://' + this.get('host') + ':' + this.get('port') + '/jsonrpc';
		}
	}));
});