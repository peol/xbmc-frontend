/*global define*/
define([
], function() {
	'use strict';

	/**
	 * Creates a new generic store. Can be used to store arbitrary data in
	 * localStorage.
	 *
	 * @uses localStorage
	 * @exports Store
	 * 
	 * @throws {Error} If no prefix is sent in
	 * 
	 * @param {String} prefix The store prefix to use, a unique identifier
	 */
	var Store = function(prefix) {
		if (!(this instanceof Store)) {
			return new Store(prefix);
		}
		if (typeof prefix === 'undefined') {
			throw new Error('Store: Trying to create a store without a prefix');
		}
		this.prefix = prefix;
	};

	/**
	 * Save a value to storage.
	 *
	 * @throws {Error} If no key is sent in
	 * @throws {Error} If no value is sent in
	 * 
	 * @param {String|Object} key The key to store the data to, or an object with key-value pairs
	 * @param {Object} value The data to store, ignored if `key` is an object
	 */
	Store.prototype.set = function(key, value) {
		var _store = this;
		if (typeof key === 'undefined') {
			throw new Error('Store: Trying to set something without passing a key');
		}
		if (typeof key === 'object') {
			Object.keys(key).forEach(function(k) {
				_store.set(k, key[k]);
			});
			return;
		}
		if (typeof value === 'undefined') {
			throw new Error('Store: Trying to store an undefined value');
		}
		localStorage.setItem(this.prefix + key, JSON.stringify(value));
	};

	/**
	 * Get a value from storage.
	 *
	 * @throws {Error} If no key is sent in
	 * 
	 * @param {String} key The key storing the data
	 * 
	 * @returns {Object} The data stored, or undefined if non-existant
	 */
	Store.prototype.get = function(key) {
		if (typeof key === 'undefined') {
			throw new Error('Store: Trying to get something without passing a key');
		}
		return JSON.parse(localStorage.getItem(this.prefix + key));
	};

	/**
	 * Remove data from storage.
	 * 
	 * @param {String} key The key to remove
	 */
	Store.prototype.remove = function(key) {
		delete localStorage[this.prefix + key];
	};

	/**
	 * Destroys the Store, removing all stored values in local storage.
	 */
	Store.prototype.destroy = function() {
		for (var key in localStorage) {
			if (key.indexOf(this.prefix) === 0) {
				delete localStorage[key];
			}
		}
	};

	return Store;
});