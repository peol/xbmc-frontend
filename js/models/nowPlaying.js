/*global define*/
define([
	'models/base',
	'lib/pubsub'
], function(BaseModel, pubsub) {
	'use strict';

	return (BaseModel.extend(
		/** @lends NowPlayingModel.prototype */
		{

		/**
		 * The default properties for a now playing model.
		 * All current properties are private to this model.
		 *
		 * @type {Object}
		 */
		defaults: {
			/** @private */
			type: 'none',
			/** @private */
			templateData: {}
		},

		/**
		 * Represents all Now Playing scenes. This hooks into the XBMC API topics
		 * related to videos, episodes, movies.
		 * 
		 * @name NowPlayingModel
		 * @augments Backbone.Model
		 * @constructs
		 */
		initialize: function() {
			pubsub.subscribe('api:video', this._video, this);
			pubsub.subscribe('api:episode', this._episode, this);
			pubsub.subscribe('api:movie', this._movie, this);
			pubsub.subscribe('api:playerStopped', this._stop, this);
		},

		/**
		 * Sets the model to video type and updates the template data.
		 *
		 * @private
		 * 
		 * @param {Object} data Data for a video
		 */
		_video: function(data) {
			this.set({ type: 'video', templateData: data });
		},

		/**
		 * Sets the model to episode type and updates the template data.
		 *
		 * @private
		 * 
		 * @param {Object} data Data for an episode
		 */
		_episode: function(data) {
			this.set({ type: 'episode', templateData: data });
		},

		/**
		 * Sets the model to movie type and updates the template data.
		 * 
		 * @private
		 * 
		 * @param {Object} data Data for a movie
		 */
		_movie: function(data) {
			this.set({ type: 'movie', templateData: data });
		},

		/**
		 * Called when the API says the XBMC instance has stopped playing
		 * media.
		 * 
		 * @private
		 */
		_stop: function() {
			this.set({ type: 'none', templateData: {} });
		}
	}));
});