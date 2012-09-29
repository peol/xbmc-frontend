define([
	'jquery',
	'Backbone',
	'hbs!tmpl/overview'
], function($, Backbone, tmpl) {
	return (Backbone.View.extend({
		initialize: function() {
			this.model.on('change', this.render, this);
		},
		render: function() {
			this.$el.html(tmpl(this.model.toJSON()));
			console.log('[overview:view] rendered');
			return this;
		}
	}));
});