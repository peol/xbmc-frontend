define([
	'jquery',
	'Backbone',
	'hbs!tmpl/toolbar'
], function($, Backbone, tmpl) {
	'use strict';

	return (Backbone.View.extend({
		el: $('#toolbar'),
		initialize: function() {
			this.model.on('change', this.render, this);
		},
		render: function() {
			this.$el.html(tmpl(this.model.toJSON()));
			window.console.log('[toolbar:view] rendered');
			return this;
		}
	}));
});