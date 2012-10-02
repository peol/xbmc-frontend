define([
	'jquery',
	'views/base',
	'hbs!tmpl/toolbar'
], function($, BaseView, tmpl) {
	'use strict';

	return (BaseView.extend({
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