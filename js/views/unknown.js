define([
	'jquery',
	'Backbone',
	'hbs!tmpl/unknown'
], function($, Backbone, tmpl) {
	return (Backbone.View.extend({
		render: function() {
			this.$el.html(tmpl({ route: Backbone.history.fragment }));
			console.log('[unknown:view] rendered');
			return this;
		}
	}));
});