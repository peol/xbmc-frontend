define([
	'lib/connection',
	'views/toolbar',
	'models/toolbar',
	'views/nowPlaying',
	'models/nowPlaying',
	'collections/instances',
	'lib/pubsub',
	'router'
], function(conn, ToolbarView, ToolbarModel, NowPlayingView, NowPlayingModel, Instances, pubsub) {
	(new ToolbarView({ model: new ToolbarModel() })).render();
	(new NowPlayingView({ model: new NowPlayingModel() })).render();
	var currentInstance;

	function connect() {
		var newInstance = Instances.getActive().toString();
		if (currentInstance !== newInstance) {
			currentInstance = newInstance;
			conn.create(newInstance);
		}
	}

	Instances.on('save', connect);
	connect();
});