/*global require*/
require.config({
	hbs: {
		disableI18n: true
	},
	paths: {
		'jquery': 'vendor/jquery/jquery',
		'Backbone': 'vendor/backbone/backbone',
		'lodash': 'vendor/lodash/lodash',
		'hbs': 'vendor/hbs/hbs',
		/* hbs deps (none except handlebars will be included in production): */
		'handlebars': 'vendor/hbs/Handlebars',
		'i18nprecompile': 'vendor/hbs/hbs/i18nprecompile',
		'text': 'vendor/requirejs/text',
		'underscore': 'vendor/hbs/hbs/underscore',
		'json2': 'vendor/hbs/hbs/json2'
	},
	shim: {
		'Backbone': {
			deps: ['lodash', 'jquery'],
			exports: 'Backbone'
		}
	}
});

require(['app']);