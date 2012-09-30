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
			stage.html(model.render().el);
		},
		AppRouter = Backbone.Router.extend({
			routes: {
				'overview': 'overview',
				'remote': 'remote',
				'settings': 'settings',
				// default view
				'': 'def',
				// unknown route
				'*action': 'unknown'
			},
			overview: function() {
				switchView(new OverviewView({ model: new OverviewModel() }));
			},
			remote: function() {
				switchView(new RemoteView());
			},
			settings: function() {
				switchView(new SettingsView({ model: new SettingsModel() }));
			},
			unknown: function() {
				switchView(new UnknownView());
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