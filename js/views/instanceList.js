/*global define*/
define([
	'jquery',
	'views/base',
	'collections/instances',
	'models/instance',
	'hbs!tmpl/instanceList'
], function($, BaseView, Instances, InstanceModel, tmpl) {
	'use strict';

	return (BaseView.extend({
		events: {
			'click .set-active': 'setActive',
			'click .remove': 'remove'
		},
		setActive: function(e) {
			var index = $(e.target).closest('li').index();
			Instances.setActive(index);
			this.render();
		},
		remove: function(e) {
			var index = $(e.target).closest('li').index();
			Instances.remove(Instances.at(index));
			this.render();
		},
		render: function() {
			this.$el.html(tmpl(Instances.toJSON()));
			window.console.log('[instanceList:view] rendered');
			return this;
		}
	}));
});