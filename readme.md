# xbmc-frontend
This is just a little project I started to play around with [backbone.js](https://backbonejs.org), [require.js](https://requirejs.org) and [handlebars](https://handlebarsjs.com) templating using [hbs](https://github.com/SlexAxton/require-handlebars-plugin) that should be totally optimized for production when built.

To use this, you need to run a frodo-ish version of XBMC (latest nightly should do), you have to go into `Settings->Services->Remote Control` and enable the first entry for running the websocket locally (XBMC+XBMC frontend on `127.0.0.1`), and both options if you run XBMC on another machine (i.e. connect through an actual IP address).

When you have xbmc-frontend up and running, go into the "Settings" tab and add your instance(s) to boot it up.

The XBMC RPC call API can be found at: http://wiki.xbmc.org/index.php?title=JSON-RPC_API/v5

# Building xbmc-frontend
You'll need node and npm installed in your path, then, just follow these steps:

```
$ cd xbmc-frontend
$ npm install
// mocha = unit tests
// lint = run JSHint on project
// requirejs = build project, output to `target/`
// watch = lint + mocha, watching for file changes
// run-build = lint + requirejs + server against `target/`
// default (or only `grunt`) = lint + requirejs
$ grunt [mocha|lint|requirejs|watch|run-build|default]
```

# Documentation
There's currently a bit of documentation inside the code, and you can also generate it by running `jsdoc` on the project root folder with parameters `-c jsdoc3.conf js/`.