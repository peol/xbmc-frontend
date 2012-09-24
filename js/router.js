define([
	'jquery',
	'Backbone',
	'lib/pubsub',
	'views/overview',
	'views/remote',
	'views/settings',
	'views/unknown',
	'models/settings'
], function($, Backbone, pubsub, OverviewView, RemoteView, SettingsView, UnknownView, SettingsModel) {
	var AppRouter = Backbone.Router.extend({
			routes: {
				// the overview view
				'overview': 'overview',
				// the remote view
				'remote': 'remote',
				// the settings view
				'settings': 'settings',
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
			settings: function() {
				(new SettingsView({ model: new SettingsModel() })).render();
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