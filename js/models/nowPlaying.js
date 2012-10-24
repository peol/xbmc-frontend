/*global define*/
define([
	'Backbone',
	'lib/pubsub'
], function(Backbone, pubsub) {
	'use strict';

	return (Backbone.Model.extend({
		defaults: {
			type: 'none',
			templateData: {}
		},
		initialize: function() {
			pubsub.subscribe('api:video', this.video, this);
			pubsub.subscribe('api:episode', this.episode, this);
			pubsub.subscribe('api:movie', this.movie, this);
			pubsub.subscribe('api:playerStopped', this.stop, this);
		},
		video: function(data) {
			this.set({ type: 'video', templateData: data });
		},
		episode: function(data) {
			this.set({ type: 'episode', templateData: data });
		},
		movie: function(data) {
			this.set({ type: 'movie', templateData: data });
		},
		stop: function() {
			this.set({ type: 'none', templateData: {} });
		}
	}));
});