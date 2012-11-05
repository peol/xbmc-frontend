/*global define*/
define([
	'jquery',
	'views/base',
	'models/instance',
	'views/editInstance',
	'views/instanceList',
	'collections/instances'
], function($, BaseView, InstanceModel, EditInstanceView, InstanceListView, Instances) {
	'use strict';

	return (BaseView.extend({
		events: {
			'click .edit': 'edit'
		},
		initialize: function() {
			this.instView = new EditInstanceView({ model: new InstanceModel() });
			this.listView = new InstanceListView();
			this.instView.on('saved', this.listView.render, this.listView);
		},
		edit: function(e) {
			var index = $(e.target).closest('tr').index();
			this.instView.setModel(Instances.at(index));
		},
		render: function() {
			this.$el.empty()
				.append(this.instView.render().el)
				.append(this.listView.render().el);
			window.console.log('[settings:view] rendered');
			return this;
		}
	}));
});