define([
	'views/base'
], function(BaseView) {
	'use strict';

	return (BaseView.extend({
		initialize: function() {
			this.$el.addClass('view-remote-touch');
		},
		render: function() {
			window.console.log('[remoteTouch:view] rendered');
			return this;
		}
	}));
});