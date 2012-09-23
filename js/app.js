define([
	'lib/connection',
	'views/toolbar',
	'models/toolbar',
	'views/nowPlaying',
	'models/nowPlaying',
	'router'
], function(conn, ToolbarView, ToolbarModel, NowPlayingView, NowPlayingModel) {
	(new ToolbarView({ model: new ToolbarModel() })).render();
	(new NowPlayingView({ model: new NowPlayingModel() })).render();
	conn.create('192.168.1.3:9090');
});