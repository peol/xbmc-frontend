define([
	'jquery',
	'Backbone',
	'hbs!tmpl/toolbar'
], function($, Backbone, tmpl) {
	return (Backbone.View.extend({
		el: $('#toolbar'),
		initialize: function() {
			this.model.on('change', this.render, this);
		},
		render: function() {
			this.$el.html(tmpl(this.model.toJSON()));
			console.log('[toolbar:view] rendered');
			return this;
		}
	}));
});