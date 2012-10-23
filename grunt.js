/*global module:false*/
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: '<json:package.json>',
		meta: {
			banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
				' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
		},
		lint: {
			files: ['grunt.js', 'js/!(vendor)/*.js']
		},
		watch: {
			files: '<config:lint.files>',
			tasks: 'lint'
		},
		requirejs: {
			appDir: './',
			baseUrl: 'js/',
			dir: './target',
			removeCombined: true,
			mainConfigFile: './js/main.js',
			fileExclusionRegExp: new RegExp(
				// ignore build dir
				"build" +
				// ignore r.js
				"|^r\\.js§" +
				// ignore .md files
				"|\\.md$" +
				// ignore .dotfiles
				"|^\\.",
				"i"
			),
			modules: [{
				name: "main"
			}]
		},
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				browser: true
			},
			globals: {
				jQuery: true
			}
		},
		uglify: {}
	});

	grunt.loadNpmTasks('grunt-requirejs');

	// Default task.
	grunt.registerTask('default', 'lint requirejs');

};
