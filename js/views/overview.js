define([
	'jquery',
	'Backbone',
	'hbs!tmpl/overview'
], function($, Backbone, tmpl) {
	return (Backbone.View.extend({
		el: $('#stage'),
		render: function() {
			this.$el.html(tmpl());
			console.log('[overview:view] rendered');
			return this;
		}
	}));
});