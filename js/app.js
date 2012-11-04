/*global define*/
define([
	'lib/connection',
	'lib/xbmcapi',
	'views/toolbar',
	'models/toolbar',
	'views/nowPlaying',
	'models/nowPlaying',
	'collections/instances',
	'router'
], function(Connection, api, ToolbarView, ToolbarModel, NowPlayingView, NowPlayingModel, Instances) {
	'use strict';

	// toolbar and now playing views are only instansiated once in the app's
	// life cycle:
	(new ToolbarView({ model: new ToolbarModel() })).render();
	(new NowPlayingView({ model: new NowPlayingModel() })).render();

	var currentInstance, currentConnection;

	// whenever an instance model is created/modified/removed, we'll check
	// if it has been set to active:
	function connect() {
		var newInstance = Instances.getActive();
		if (newInstance && currentInstance !== newInstance) {
			currentInstance = newInstance;
			if (currentConnection) {
				currentConnection.close("switch");
			}
			currentConnection = new Connection(newInstance.toString());
			api.setConnection(currentConnection);
		}
	}
	Instances.on('save', connect);
	connect();
});