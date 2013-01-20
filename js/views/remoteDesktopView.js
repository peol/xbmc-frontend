/*global define*/
define([
	'jquery',
	'views/base',
	'lodash',
	'lib/xbmcapi',
	'lib/pubsub',
	'hbs!tmpl/remoteDesktop'
], function($, BaseView, _, api, pubsub, template) {
	'use strict';

	function send(method, params) {
		api.send(method, params);
	}

	function execAction(action) {
		send('Input.ExecuteAction', { action: action });
	}

	function curry(method, params) {
		return function() {
			send(method, params);
		};
	}

	var body = $(document.body),
		cache = [],
		// globalActions are actions that are always available to the user,
		// key codes are from the keydown event
		globalActions = {
			// enter/return
			13: curry('Input.Select'),
			// escape
			27: curry('Input.Back'),
			// left arrow
			37: curry('Input.Left'),
			// up arrow
			38: curry('Input.Up'),
			// right arrow
			39: curry('Input.Right'),
			// down arrow
			40: curry('Input.Down'),
			// x
			88: curry('Player.Stop', { playerid: 1 })
		},
		// actions that are available to the user in most gui cases,
		// key codes are from the keydown event
		actions = {
			// backspace
			8: curry('Input.Back'),
			// c
			67: curry('Input.ContextMenu'),
			// +
			187: function() { execAction('volumeup'); },
			// -
			189: function() { execAction('volumedown'); }
		},
		// inputActions are specific to when the user tries to input text,
		// key codes are from the keypress event
		inputActions = {
			// backspace
			8: function() { execAction('backspace'); }
		};

	$.extend(inputActions, globalActions);
	$.extend(actions, globalActions);

	return (BaseView.extend(
		/** @lends RemoteDesktopView.prototype */
		{

		/**
		 * View that enables a user with keyboard to remotely interact
		 * with the XBMC instance by using default XBMC keyboard mappings.
		 * 
		 * @name RemoteDesktopView
		 * @augments BaseView
		 * @constructs
		 */
		initialize: function() {
			var self = this;
			body.on('keydown.remote keypress.remote', this._keyPress.bind(this));
			pubsub.subscribe('connection:data', this._toggleInputMode, this);
				// because of synching, we need to make sure the user isn't currently
				// having a virtual keyboard up when we're initializing
				// 10103 is the window id for the virtual keyboard.
			api.send('GUI.GetProperties', { properties: ['currentwindow'] }).done(function(data) {
				self.inputFocused = data.result.currentwindow.id === 10103;
			});
		},

		/**
		 * Handles any key-related events and fires calls to the XBMC
		 * instance if the key's are matching any mappings for the current
		 * state on the instance.
		 *
		 * @private
		 * 
		 * @param {Event} e The event object
		 */
		_keyPress: function(e) {
			var action = this.inputFocused ?
				inputActions[e.which]:
				actions[e.which];

			if (e.ctrlKey) {
				// let ctrl stuff be
				return;
			}
			else if (e.type === 'keydown' && _.isFunction(action)) {
				e.preventDefault();
				action();
				if (e.which === 8 && this.inputFocused) {
					// deleting text
					cache.pop();
				}
			} else if (this.inputFocused && e.type === 'keypress') {
				// send raw text
				// TODO: For every API call to SendText, XBMC replaces all previous
				//       text in the input area, we need to always send the full text entered

				if (e.which !== 13) {
					cache.push(String.fromCharCode(e.which));
					api.send('Input.SendText', {
						text: cache.join(''),
						done: false
					});
				} else {
					api.send('Input.SendText', {
						text: cache.join(''),
						done: true
					});
				}
			}
		},

		/**
		 * Toggles the internal input mode. When the XBMC instance
		 * opens up a dialog that requires input, this view will change
		 * key mappings to allow the user to send text.
		 *
		 * @private
		 * 
		 * @param {Object} data The data from the connection:data subscription
		 */
		_toggleInputMode: function(data) {
			if (!this.inputFocused && data.method === 'Input.OnInputRequested') {
				this.inputFocused = true;
				cache = [];
			}else if (this.inputFocused && data.method === 'Input.OnInputFinished') {
				this.inputFocused = false;
				cache = [];
			}
		},

		/** Renders the remote desktop view */
		render: function() {
			this.$el.html(template());
			window.console.log('[remoteDesktop:view] rendered');
			return this;
		},

		/** Destroys the remote desktop view */
		destroy: function() {
			body.off('.remote');
			BaseView.prototype.destroy.apply(this, arguments);
		}
	}));
});