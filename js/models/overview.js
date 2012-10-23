/*global define*/
define([
	'Backbone',
	'collections/instances',
	'lib/pubsub'
], function(Backbone, Instances, pubsub) {
	'use strict';

	return (Backbone.Model.extend({
		defaults: {
			instance: null,
			isActive: false
		},
		initialize: function() {
			this.update();
			pubsub.subscribe('all', this.update, this);
		},
		update: function(evtName) {
			if (evtName && evtName.indexOf('connection:') !== 0) {
				return;
			}
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