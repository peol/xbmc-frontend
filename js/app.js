define([
	'views/toolbar',
	'models/toolbar',
	'views/nowPlaying',
	'models/nowPlaying'
], function(ToolbarView, ToolbarModel, NowPlayingView, NowPlayingModel) {
	(new ToolbarView({ model: new ToolbarModel() })).render();
	(new NowPlayingView({ model: new NowPlayingModel() })).render();
});