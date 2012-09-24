define([
	'jquery',
	'Backbone',
	'hbs!tmpl/unknown'
], function($, Backbone, tmpl) {
	return (Backbone.View.extend({
		el: $('#stage'),
		render: function() {
			this.$el.html(tmpl({ route: Backbone.history.fragment }));
			console.log('[unknown:view] rendered');
			return this;
		}
	}));
});