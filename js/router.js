define([
	'jquery',
	'Backbone',
	'lib/pubsub',
	'views/remote',
	'views/unknown',
	'views/overview'
], function($, Backbone, pubsub, RemoteView, UnknownView, OverviewView) {
	var AppRouter = Backbone.Router.extend({
			routes: {
				// the overview view
				'overview': 'overview',
				// the remote view
				'remote': 'remote',
				// default view
				'': 'def',
				// unknown route
				'*action': 'unknown'
			},
			overview: function() {
				(new OverviewView()).render();
			},
			remote: function() {
				(new RemoteView()).render();
			},
			unknown: function() {
				(new UnknownView()).render();
			},
			def: function() {
				location.hash = 'overview';
			}
		}),
		router = new AppRouter();

		router.on('all', function() {
			pubsub.publish('router:viewchange', Backbone.history.fragment);
		});

    Backbone.history.start();
    return router;
});