define([
	'Backbone'
], function(Backbone) {
	return (Backbone.Model.extend({
		defaults: {
			label: 'New XBMC Instance',
			host: '127.0.0.1',
			port: 9090,
			isActive: false
		},
		toString: function() {
			return this.get('host') + ':' + this.get('port');
		}
	}));
});