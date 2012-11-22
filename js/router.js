/*global define*/
define([
	'jquery',
	'Backbone',
	'lodash',
	'lib/pubsub',
	'views/overview',
	'views/remote',
	'views/settings',
	'views/unknown',
	'models/overview'
], function($, Backbone, _, pubsub, OverviewView, RemoteView, SettingsView, UnknownView, OverviewModel) {
	'use strict';

	var oldView = null,
		stage = $('#stage'),
		switchView = function(view) {
			if (oldView && _.isFunction(oldView.destroy)) {
				oldView.destroy();
			}
			oldView = view;
			stage.html(view.render().el);
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
				switchView(new SettingsView());
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