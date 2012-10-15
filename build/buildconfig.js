({
	appDir: '../',
	baseUrl: 'js/',
	dir: '../target',
	removeCombined: true,
	mainConfigFile: '../js/main.js',
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
})