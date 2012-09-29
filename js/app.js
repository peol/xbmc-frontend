define([
	'lib/connection',
	'views/toolbar',
	'models/toolbar',
	'views/nowPlaying',
	'models/nowPlaying',
	'collections/instances',
	'lib/pubsub',
	'router'
], function(Connection, ToolbarView, ToolbarModel, NowPlayingView, NowPlayingModel, Instances, pubsub) {
	(new ToolbarView({ model: new ToolbarModel() })).render();
	(new NowPlayingView({ model: new NowPlayingModel() })).render();

	var currentInstance, currentConnection;
	function connect() {
		var newInstance = Instances.getActive();
		if (newInstance && currentInstance !== newInstance) {
			currentInstance = newInstance;
			if (currentConnection) {
				currentConnection.close("switch");
			}
			currentConnection = new Connection(newInstance.toString());
		}
	}
	Instances.on('save', connect);
	connect();
});