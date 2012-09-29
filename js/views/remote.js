define([
	'jquery',
	'Backbone',
	'hbs!tmpl/remote'
], function($, Backbone, tmpl) {
	return (Backbone.View.extend({
		render: function() {
			this.$el.html(tmpl());
			console.log('[remote:view] rendered');
			return this;
		}
	}));
});