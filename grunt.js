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
			options: {
				appDir: './',
				baseUrl: 'js/',
				dir: './target',
				removeCombined: true,
				mainConfigFile: './js/main.js',
				useStrict: true,
				pragmasOnSave: {
					excludeHbsParser: true,
					excludeHbs: true,
					excludeAfterBuild: true
				},
				fileExclusionRegExp: new RegExp(
					// ignore node_modules, tasks, docs dirs
					"^(node_modules|tasks|docs)$" +
					// ignore r.js, grunt.js
					"|^(grunt|r)\\.js$" +
					// ignore .md files
					"|\\.md$" +
					// ignore .json files
					"|\\.json$" +
					// ignore .conf files
					"|\\.conf$" +
					// ignore .dotfiles
					"|^\\.",
					"i"
				),
				modules: [{
					name: "main"
				}]
			}
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
				unused: true,
				boss: true,
				eqnull: true,
				browser: true
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadTasks('tasks');
	grunt.registerTask('default', 'lint requirejs');
	grunt.registerTask('run', 'lint server watch');
	grunt.registerTask('run-build', 'default server:build');
};
