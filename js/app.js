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

	var items = [
		{ label: 'Overview', view: 'overview' },
		{ label: 'Remote', view: 'remote' },
		{ label: 'Settings', view: 'settings' }
	], oldInstance;

	// toolbar and now playing views are only instansiated once in the app's
	// life cycle:
	(new ToolbarView({ model: new ToolbarModel({ navItems: items }) })).render();
	(new NowPlayingView({ model: new NowPlayingModel() })).render();

	// whenever an instance model is created/modified/removed, we'll check
	// if it has been set to active:
	function connect() {
		var newInstance = Instances.getActive();
		if (newInstance !== oldInstance) {
			api.setConnection(new Connection(newInstance.toString()));
			oldInstance = newInstance;
		}
	}
	Instances.on('save', connect);
	connect();
});