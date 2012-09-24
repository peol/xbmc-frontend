define([
	'Backbone',
	'collections/instances'
], function(Backbone, InstancesCollection) {
	return (Backbone.Model.extend({
		defaults: {
			instances: new InstancesCollection()
		}
	}));
});