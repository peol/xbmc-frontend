/*global define*/
define([
	'lib/xbmcapi-namespace',
	'lib/pubsub'
], function(ns, pubsub) {
	/**
	 * Methods for retrieving data for specific library items. Used in XBMC-API to
	 * ease the common calls to get data needed to render a "now playing" scene specific
	 * to a media type.
	 *
	 * @exports XBMC-API-media
	 */
	var media = {
		/**
		 * Retrieves information about a specific TV episode in the library.
		 * 
		 * @fires api:episode Distributes data to the system about a TV episode
		 * 
		 * @param {Number} id The library ID
		 */
		episode: function(id) {
			ns.send('VideoLibrary.GetEpisodeDetails', {
				episodeid: id,
				properties: [
					'title',
					'showtitle',
					'plot',
					'season',
					'episode',
					'thumbnail'
				]
			}).done(function(data) {
				pubsub.publish('api:episode', ns.scrub(data.result.episodedetails));
			});
		},

		/**
		 * Retrieves information about a specific movie in the library.
		 * 
		 * @fires api:movie Distributes data to the system about a movie
		 * 
		 * @param {Number} id The library ID
		 */
		movie: function(id) {
			ns.send('VideoLibrary.GetMovieDetails', {
				movieid: id,
				properties: [
					'title',
					'year',
					'plotoutline',
					'plot',
					'thumbnail'
				]
			}).done(function(data) {
				pubsub.publish('api:movie', ns.scrub(data.result.moviedetails));
			});
		}
	};
	return media;
});