({
	appDir: '../',
	baseUrl: 'js/',
	dir: '../target',
	removeCombined: true,
	mainConfigFile: '../js/main.js',
	fileExclusionRegExp: /examples|test|demo|vendor|build|docs|dist|^r\.js$|(\.|-)min\.js$/i,
	modules: [{
		name: "main"
	}]
})