# XBMC frontend
This is just a little project to play around with [backbone.js](https://backbonejs.org), [require.js](https://requirejs.org) and [handlebars](https://handlebarsjs.com) templating using [hbs](https://github.com/SlexAxton/require-handlebars-plugin) that should be totally optimized for production when built. Currently there's no `r.js` config present.

To use this, you need to run a frodo-ish version of XBMC (latest nightly should do) and then change the connection URL in `app.js`.

The XBMC RPC call API can be found at: http://wiki.xbmc.org/index.php?title=JSON-RPC_API/v5
