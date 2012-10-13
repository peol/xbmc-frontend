define([
	'views/base',
	'hbs!tmpl/remoteDesktop'
], function(BaseView, template) {
	'use strict';

	return (BaseView.extend({
		render: function() {
			this.$el.html(template());
			window.console.log('[remoteDesktop:view] rendered');
			return this;
		}
	}));
});