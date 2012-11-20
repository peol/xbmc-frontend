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
	 * @param {String} prefix The store prefix to use, a unique identifier
	 */
	var Store = function(prefix) {
		this.prefix = prefix;
	};

	/**
	 * Save a value to storage.
	 *
	 * @throws {Error} If no value are sent in
	 * 
	 * @param {String} key The key to store the data to
	 * @param {Object} value The data to store
	 */
	Store.prototype.set = function(key, value) {
		if (typeof value === 'undefined') {
			throw new Error('Trying to store a undefined value in Store#set');
		}
		localStorage.setItem(this.prefix + key, JSON.stringify(value));
	};

	/**
	 * Get a value from storage.
	 * @param {String} key The key storing the data
	 * @returns {Object} The data stored, or undefined if non-existant
	 */
	Store.prototype.get = function(key) {
		return JSON.parse(localStorage.getItem(this.prefix + key));
	};

	/**
	 * Remove data from storage.
	 * @param {String} key The key to remove
	 */
	Store.prototype.remove = function(key) {
		delete localStorage[this.prefix + key];
	};

	return Store;
});