/*global define*/
define([
	'Backbone',
	'lodash'
], function(Backbone, _) {
	'use strict';

	/**
	 * The PubSub module is used to convey messages between modules without having any explicit
	 * dependencies between them. One module can subscribe to a topic by sending in a callback,
	 * and whenever the topic gets published (by i.e. another module), the callback is invoked
	 * and the published data sent as the first parameter.
	 * 
	 * @exports PubSub
	 * 
	 * @example
	 * // subscribe to the topic 'hello':
	 * pubsub.subscribe('hello', function(data) {
	 *	console.log('hello ' + data);
	 * });
	 * // publish the topic 'hello' with data 'world':
	 * pubsub.publish('hello', 'world');
	 * // => subscriber callback will output 'hello world'
	 */
	var pubsub = _.extend({}, Backbone.Events);

	/**
	 * Subscribe to a topic. Use this to be alerted whenever a topic gets published.
	 * 
	 * @function
	 * @memberOf module:PubSub
	 * 
	 * @throws {Error} If no topic is sent in
	 * @throws {Error} If no callback is sent in
	 * 
	 * @param {String} topic The topic to subscribe to
	 * @param {Function} callback The callback to invoke when topic gets published
	 * @param {Object} [scope] Define what `this` is in the callback
	 */
	pubsub.subscribe = function(topic, callback, scope) {
		if (typeof topic === 'undefined') {
			throw new Error('PubSub: Trying to subscribe without topic defined');
		}
		if (typeof callback === 'undefined') {
			throw new Error('PubSub: Trying to subscribe without a callback');
		}
		pubsub.on.call(pubsub, topic, callback, scope);
	};

	/**
	 * Unsubscribe from a topic. Use this to be remove an existing subscription.
	 * 
	 * @function
	 * @memberOf module:PubSub
	 *
	 * @throws {Error} If no topic is sent in
	 * 
	 * @param {String} topic The topic to unsubscribe from
	 * @param {Function} [callback] The callback used to subscribe, if omitted, all
	 *                              subscriptions to the topic will be removed
	 * @param {Object} [scope] The scope to unbind
	 */
	pubsub.unsubscribe = function(topic, callback, scope) {
		if (typeof topic === 'undefined') {
			throw new Error('PubSub: Trying to unsubscribe without topic defined');
		}
		pubsub.off.call(pubsub, topic, callback, scope);
	};

	/**
	 * Publish a topic. Use this to alert potential subscribers.
	 * 
	 * @function
	 * @memberOf module:PubSub
	 * 
	 * @throws {Error} If no topic is sent in
	 * 
	 * @param {String} topic The topic to publish on
	 * @param {Object} [data] Data attached to the publish
	 */
	pubsub.publish = function(topic, data) {
		if (typeof topic === 'undefined') {
			throw new Error('PubSub: Trying to publish without topic defined');
		}
		pubsub.trigger.call(pubsub, topic, data);
	};

	return pubsub;
});