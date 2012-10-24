/*global module, require*/
module.exports = function(grunt) {
	var connect = require('connect');
	var path = require('path');

	grunt.registerTask('server', 'Run a static server', function() {
		var options;
		var target = this.args[0] || '';
		var tmp = grunt.config(['server', target]);

		if (typeof tmp === 'object') {
			grunt.verbose.writeln('Using "' + target + '" server.');
			options = tmp;
		} else {
			grunt.verbose.writeln('Using default server.');
			options = grunt.config('server');
		}

		var port = options.port || 8000;
		var base = path.resolve(options.base || '.');
		var middleware = [
			// Serve static files ('static' is a reserved keyword)
			connect['static'](base),
			// Make empty directories browsable. (overkill?)
			connect.directory(base)
		];

		// If --debug was specified, enable logging.
		if (grunt.option('debug')) {
			connect.logger.format('grunt', ('[D] server :method :url :status ' +
				':res[content-length] - :response-time ms').magenta);
			middleware.unshift(connect.logger('grunt'));
		}

		// Start server.
		grunt.log.writeln('Starting static web server on port ' + port + (target ? ', target "' + target + '"' : '' ) + '.');
		var connection = connect.apply(null, middleware).listen(port);

		if (options.async) {
			connection.on('close', this.async());
		}
	});
};