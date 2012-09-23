define([
	'Backbone',
	'lodash',
	'lib/pubsub'
], function(Backbone, _, pubsub) {
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
			pubsub.subscribe('router:viewchange', this.viewChanged, this);
			this.viewChanged(Backbone.history.fragment);
		},
		viewChanged: function(view) {
			var viewObj = _.where(items, { view: view });
			viewObj = viewObj.length ? viewObj : [{ label: 'Unknown' }];
			items.forEach(function(item) {
				item.classes = item.view === viewObj[0].view ? 'selected' : null;
			});
			this.set({
				active: viewObj[0]
			});
		}
	}));
});