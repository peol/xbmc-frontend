/*global define, describe, it, expect, afterEach, sinon*/
define([
	'lib/pubsub'
], function(pubsub) {
	afterEach(function() {
		pubsub.unsubscribe('test');
	});

	describe('PubSub', function() {
		it('should expose `subscribe`, `unsubscribe`, and `publish` methods', function() {
			expect(pubsub.subscribe).to.be.an('function');
			expect(pubsub.unsubscribe).to.be.an('function');
			expect(pubsub.publish).to.be.an('function');
		});

		it('should throw error if no topic and/or callback is defined when subscribing', function() {
			expect(function() { pubsub.subscribe(); }).to['throw'](Error);
			expect(function() { pubsub.subscribe('foo'); }).to['throw'](Error);
		});

		it('should trigger all subscriptions on publish', function() {
			var spy = sinon.spy();
			pubsub.subscribe('test', spy);
			pubsub.subscribe('test', spy);
			pubsub.publish('test', 'foo');
			expect(spy.callCount).to.equal(2);
		});

		it('should call a subscriber with the defined scope', function() {
			var self = this,
				sub = function() {
					expect(this).to.be.equal(self);
				},
				spy = sinon.spy(sub);
			pubsub.subscribe('test', spy, self);
			pubsub.publish('test', 'foo');
			expect(spy.callCount).to.equal(1);
		});

		it('should call a subscriber with the published data', function() {
			pubsub.subscribe('test', function(data) {
				expect(data).to.be.an('object').and.have.property('foo', true);
			});
			pubsub.publish('test', { foo: true });
		});

		it('should unsubscribe only a specific callback', function() {
			var spy1 = sinon.spy(),
				spy2 = sinon.spy();
			pubsub.subscribe('test', spy1);
			pubsub.subscribe('test', spy2);
			pubsub.publish('test', 'foo');
			pubsub.unsubscribe('test', spy1);
			pubsub.publish('test', 'foo');
			expect(spy1.callCount).to.equal(1);
			expect(spy2.callCount).to.equal(2);
		});
	});
});