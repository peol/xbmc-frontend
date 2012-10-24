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
			files: ['grunt.js', 'js/!(vendor)/**.js', 'js/*.js']
		},
		watch: {
			files: '<config:lint.files>',
			tasks: 'lint'
		},
		server: {
			build: {
				base: './target/',
				async: true
			}
		},
		requirejs: {
			appDir: './',
			baseUrl: 'js/',
			dir: './target',
			removeCombined: true,
			mainConfigFile: './js/main.js',
			useStrict: true,
			fileExclusionRegExp: new RegExp(
				// ignore node_modules, tasks dirs
				"^(node_modules|tasks)$" +
				// ignore r.js, grunt.js
				"|^(grunt|r)\\.js$" +
				// ignore .md files
				"|\\.md$" +
				// ignore .json files
				"|\\.json$" +
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
			}
		},
		uglify: {}
	});

	grunt.loadNpmTasks('grunt-requirejs');
	grunt.loadTasks('tasks');
	grunt.registerTask('default', 'lint requirejs');
	grunt.registerTask('run', 'lint server watch');
	grunt.registerTask('run-build', 'default server:build');
};
