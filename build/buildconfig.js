({
	appDir: '../',
	baseUrl: 'js/',
	dir: '../target',
	mainConfigFile: '../js/main.js',
	fileExclusionRegExp: /^examples|test|demo|vendor|build|dist|^r\.js$|.+?(\.|-)min\.js$/i,
	modules: [{
		name: "main"
	}]
})