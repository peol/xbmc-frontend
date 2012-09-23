define([
	'Backbone',
	'lodash'
], function(Backbone, _) {
	var pubsub = _.extend({}, Backbone.Events);
	return {
		subscribe: pubsub.on,
		unsubscribe: pubsub.off,
		publish: pubsub.trigger
	};
});