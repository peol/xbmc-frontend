/*global define*/
define([
	'Backbone',
	'models/instance',
	'lib/store'
], function(Backbone, InstanceModel, Store) {
	'use strict';

	return new (Backbone.Collection.extend(
		/** @lends Instances.prototype */
		{

		model: InstanceModel,

		/**
		 * Internal storage used to read/write instances between sessions
		 * @type {Store}
		 */
		store: new Store('instances'),

		/**
		 * Collection of {@link Instance} models.
		 * Will read any data stored and creates new models from that data.
		 *
		 * @name Instances
		 * @augments Backbone.Collection
		 * @constructs
		 */
		initialize: function() {
			var self = this,
				insts = this.store.get('instances');
			if (insts) {
				insts.forEach(function(inst) {
					self.add(new InstanceModel(inst));
				});
			} else {
				this.save();
			}
			this.on('add remove change', this.save, this);
		},

		/**
		 * Set a specific instance as currently active. Only one instance
		 * can be active at a time.
		 * @param {Number} index The instance index to set to active
		 */
		setActive: function(index) {
			this.forEach(function(inst, i) {
				if (inst.get('isActive') && i !== index) {
					inst.set({ isActive: false }, { silent: true });
				} else if (i === index) {
					inst.set({ isActive: true }, { silent: true });
				}
			});
			this.save();
		},

		/**
		 * Get the currently active instance.
		 * @returns {Models.Instance} The current instance or null if none found
		 */
		getActive: function() {
			return this.where({ isActive: true })[0];
		},

		/**
		 * Save the current instance list to storage.
		 * @fires save
		 */
		save: function() {
			this.store.set('instances', this.toJSON());
			this.trigger('save');
		}
	}))();
});