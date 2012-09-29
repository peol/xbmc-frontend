define([
	'jquery',
	'Backbone',
	'lib/pubsub',
	'views/overview',
	'views/remote',
	'views/settings',
	'views/unknown',
	'models/overview',
	'models/settings'
], function($, Backbone, pubsub, OverviewView, RemoteView, SettingsView, UnknownView, OverviewModel, SettingsModel) {
	var stage = $('#stage'),
		switchView = function(model) {
			stage.html(model.el);
		},
		AppRouter = Backbone.Router.extend({
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
				switchView((new OverviewView({ model: new OverviewModel() })).render());
			},
			remote: function() {
				switchView((new RemoteView()).render());
			},
			settings: function() {
				switchView((new SettingsView({ model: new SettingsModel() })).render());
			},
			unknown: function() {
				switchView((new UnknownView()).render());
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