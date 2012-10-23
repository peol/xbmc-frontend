/*global define*/
define([
], function() {
	'use strict';

	function Store(prefix) {
		this.prefix = prefix;
	}

	Store.prototype.set = function(key, value) {
		if (typeof value === 'undefined') {
			throw new Error('Trying to store a undefined value in Store#set');
		}
		localStorage.setItem(this.prefix + key, JSON.stringify(value));
	};

	Store.prototype.get = function(key) {
		return JSON.parse(localStorage.getItem(this.prefix + key));
	};

	Store.prototype.remove = function(key) {
		delete localStorage[this.prefix + key];
	};

	return Store;
});