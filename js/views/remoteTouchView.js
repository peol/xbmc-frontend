define([
	'views/base'
], function(BaseView) {
	'use strict';

	return (BaseView.extend({
		render: function() {
			window.console.log('[remoteTouch:view] rendered');
			return this;
		}
	}));
});