/*global define*/
define([
	'Backbone',
	'lib/pubsub',
	'lodash'
], function(Backbone, pubsub, _) {
	'use strict';

	return (Backbone.View.extend({
		setModel: function(model) {
			this._unbindModel();
			this.model = model;
			if (_.isFunction(this.render)) {
				this.render();
			}
		},
		_unbindModel: function() {
			if (this.model) {
				this.model.off(null, null, this);
			}
		},
		destroy: function() {
			this._unbindModel();
			pubsub.unsubscribe(null, null, this);
			this.remove();
		}
	}));
});