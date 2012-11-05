/*global define*/
define([
	'Backbone',
	'collections/instances'
], function(Backbone, Instances) {
	'use strict';

	return (Backbone.Model.extend({
		defaults: {
			instance: null,
			isActive: false
		},
		initialize: function() {
			this.update();
			Instances.on('save', this.update, this);
		},
		update: function() {
			var inst = Instances.getActive();
			if (inst) {
				this.set({
					isActive: inst.isConnected(),
					instance: inst.toJSON()
				});
			}
		}
	}));
});