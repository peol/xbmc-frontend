define([
	'Backbone',
	'lodash'
], function(Backbone, _) {
	var pubsub = _.extend({}, Backbone.Events);
	// map .on, .off and .trigger to a pubsub interface so we can switch
	// the pubsub implementation whenever we want:
	pubsub.subscribe = pubsub.on;
	pubsub.unsubscribe = pubsub.off;
	pubsub.publish = pubsub.trigger;
	return pubsub;
});