define([
	'Backbone',
	'lib/pubsub',
	'lib/xbmcapi'
], function(Backbone, pubsub, api, tmplEpisode) {
	return (Backbone.Model.extend({
		defaults: {
			type: 'unknown',
			templateData: {}
		},
		initialize: function() {
			pubsub.subscribe('api:episode', this.episode, this);
			pubsub.subscribe('api:movie', this.movie, this);
			pubsub.subscribe('api:playerStopped', this.stop, this);
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