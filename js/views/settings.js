define([
	'jquery',
	'Backbone',
	'models/instance',
	'views/newInstance',
	'views/instanceList'/*,
	'hbs!tmpl/settings'*/
], function($, Backbone, InstanceModel, NewInstanceView, InstanceListView, tmpl) {
	return (Backbone.View.extend({
		initialize: function() {
			this.instView = new NewInstanceView();
			this.listView = new InstanceListView();
			this.instView.on('saved', this.listView.render, this.listView);
		},
		render: function() {
			this.$el.empty()
				.append(this.instView.render().el)
				.append(this.listView.render().el);
			console.log('[settings:view] rendered');
			return this;
		}
	}));
});