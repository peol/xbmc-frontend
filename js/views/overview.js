define([
	'views/base',
	'hbs!tmpl/overview'
], function(BaseView, tmpl) {
	'use strict';

	return (BaseView.extend({
		initialize: function() {
			this.$el.addClass('view-overview');
			this.model.on('change', this.render, this);
		},
		render: function() {
			this.$el.html(tmpl(this.model.toJSON()));
			window.console.log('[overview:view] rendered');
			return this;
		}
	}));
});