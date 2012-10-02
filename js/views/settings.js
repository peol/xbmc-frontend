define([
	'views/base',
	'models/instance',
	'views/newInstance',
	'views/instanceList'
], function(BaseView, InstanceModel, NewInstanceView, InstanceListView) {
	'use strict';

	return (BaseView.extend({
		initialize: function() {
			this.instView = new NewInstanceView();
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