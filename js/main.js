require.config({
	hbs: {
		disableI18n: true
	},
	paths: {
		"jquery": "components/jquery/jquery",
		"BackboneLib": "components/backbone/backbone",
		"lodash": "components/lodash/lodash",
		"text": "components/text/text",
		/* hbs (underscore, i18n, json2 will not be included in production) */
		"hbs": "components/hbs/hbs",
		"handlebars": "components/hbs/Handlebars",
		"underscore": "components/hbs/hbs/underscore",
		"i18nprecompile": "components/hbs/hbs/i18nprecompile",
		"json2": "components/hbs/hbs/json2"
		/* /hbs */
	},
	shim: {
		"BackboneLib": ["lodash", "jquery"]
	}
});

define('Backbone', ['BackboneLib'], function($) {
	return Backbone.noConflict();
});

require(['app']);