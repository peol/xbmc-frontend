/*global define*/
define([
	'jquery',
	'views/base',
	'hbs!tmpl/nowPlaying',
	'hbs!tmpl/nowPlayingVideo',
	'hbs!tmpl/nowPlayingEpisode',
	'hbs!tmpl/nowPlayingMovie'
], function($, BaseView, tmpl, tmplVideo, tmplEpisode, tmplMovie) {
	'use strict';

	return (BaseView.extend(
		/** @lends NowPlayingView.prototype */
		{

		/** The element used to render this view */
		el: $('#nowPlaying'),

		/**
		 * List of renderers this view can use.
		 * @type {Object}
		 */
		renderers: {
			video: tmplVideo,
			episode: tmplEpisode,
			movie: tmplMovie
		},

		/**
		 * Visualizes what's currently playing on the active instance.
		 * 
		 * @name NowPlayingView
		 * @augments BaseView
		 * @constructs
		 */
		initialize: function() {
			this.model.on('change', this.render, this);
		},

		/** Render the now playing view */
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