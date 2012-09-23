define([
	'jquery',
	'Backbone',
	'hbs!tmpl/nowPlaying',
	'hbs!tmpl/nowPlayingEpisode',
	'hbs!tmpl/nowPlayingMovie'
], function($, Backbone, tmpl, tmplEpisode, tmplMovie) {
	return (Backbone.View.extend({
		el: $('#nowPlaying'),
		initialize: function() {
			this.model.on('change', this.render, this);
		},
		renderers: {
			episode: tmplEpisode,
			movie: tmplMovie
		},
		render: function() {
			var model = this.model.toJSON(),
				renderer = this.renderers[model.type],
				html = renderer ? renderer(model.templateData) : tmpl({});
			this.$el.html(html);
			console.log('[nowPlaying:view] rendered');
		}
	}));
});