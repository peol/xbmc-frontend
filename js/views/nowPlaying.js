define([
	'jquery',
	'views/base',
	'hbs!tmpl/nowPlaying',
	'hbs!tmpl/nowPlayingVideo',
	'hbs!tmpl/nowPlayingEpisode',
	'hbs!tmpl/nowPlayingMovie'
], function($, BaseView, tmpl, tmplVideo, tmplEpisode, tmplMovie) {
	'use strict';

	return (BaseView.extend({
		el: $('#nowPlaying'),
		initialize: function() {
			this.model.on('change', this.render, this);
		},
		renderers: {
			video: tmplVideo,
			episode: tmplEpisode,
			movie: tmplMovie
		},
		render: function() {
			var model = this.model.toJSON(),
				renderer = this.renderers[model.type],
				html = renderer ? renderer(model.templateData) : tmpl({});
			this.$el.html(html);
			window.console.log('[nowPlaying:view] rendered');
			return this;
		}
	}));
});