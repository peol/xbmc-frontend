define([
	'jquery',
	'Backbone',
	'hbs!tmpl/remote'
], function($, Backbone, tmpl) {
	return (Backbone.View.extend({
		el: $('#stage'),
		render: function() {
			this.$el.html(tmpl());
			console.log('[remote:view] rendered');
		}
	}));
});