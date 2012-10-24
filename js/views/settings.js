/*global define*/
define([
	'views/base',
	'models/instance',
	'views/editInstance',
	'views/instanceList'
], function(BaseView, InstanceModel, EditInstanceView, InstanceListView) {
	'use strict';

	return (BaseView.extend({
		initialize: function() {
			this.instView = new EditInstanceView();
			this.listView = new InstanceListView();
			this.instView.on('saved', this.listView.render, this.listView);
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