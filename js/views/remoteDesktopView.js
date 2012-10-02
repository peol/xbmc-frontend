define([
	'views/base'
], function(BaseView) {
	'use strict';

	return (BaseView.extend({
		render: function() {
			window.console.log('[remoteDesktop:view] rendered');
			return this;
		}
	}));
});