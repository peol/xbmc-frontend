define([
	'Backbone',
	'lodash',
	'router'
], function(Backbone, _, router) {
	var items = [
		{ label: 'Overview', view: 'overview' },
		{ label: 'Remote', view: 'remote' },
		{ label: 'Library', view: 'library' },
		{ label: 'Live TV', view: 'livetv' },
		{ label: 'Settings', view: 'settings' }
	];
	return (Backbone.Model.extend({
		defaults: {
			active: null,
			navItems: items
		},
		initialize: function() {
			router.on('all', function() {
				this.set({
					active: _.where(items, {
						view: Backbone.history.fragment
					})[0]
				});
			}, this);
			router.trigger('all');
		}
	}));
});