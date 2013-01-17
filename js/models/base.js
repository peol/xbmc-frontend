/*global define*/
define([
	'jquery',
	'Backbone',
	'lib/xbmcapi'
], function($, Backbone, api) {
	'use strict';

	var BaseModel = (Backbone.Model.extend(
		/** @lends BaseModel.prototype */
		{
		/**
		 * Override Backbone's default sync method to enable loading data
		 * from an XBMC instance. By using options defined on the model
		 * definition it can automatically map data from the XBMC instance
		 * to the model.
		 * 
		 * @param {String} type The CRUD type (create, read, update, delete)
		 * @param {Dynamic|BaseModel} model The model instance to sync
		 * @returns {$.Deferred} A promise of an updated model
		 */
		sync: function(type, model/*, options*/) {
			var dfd = $.Deferred();
			if (type !== 'read') {
				// we only handle read operations
				return;
			}
			api.send('VideoLibrary.GetEpisodeDetails', {
				episodeid: this.id,
				properties: [
					'showtitle'
				]
			}).done(function(data) {
				model.set(data.result.episodedetails);
				dfd.resolve(model);
			});
			return dfd.promise();
		}
	}));

	/**
	 * Internal static model cache used to keep track on model instances.
	 *
	 * @private
	 * @type {Object}
	 */
	BaseModel._cache = {};

	/**
	 * Static method for fetching a specific model from a remote end-point.
	 * 
	 * @param {Number} id A unique Id on the end-point, in most cases this is the
	 *                 XBMC library Id.
	 * @returns {$.Deferred} A promise of a model
	 */
	BaseModel.fetch = function(id) {
		var model = this._cache[id] || new this.prototype.constructor({ id: id });
		return model.fetch();
	};

	return BaseModel;
});