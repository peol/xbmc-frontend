define([
	'Backbone',
	'lib/pubsub'
], function(Backbone, pubsub) {
	'use strict';

	return (Backbone.View.extend({
		destroy: function() {
			if (this.model) {
				this.model.off(null, null, this);
			}
			pubsub.unsubscribe(null, null, this);
			this.$el.remove();
		}
	}));
});