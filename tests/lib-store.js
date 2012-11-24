/*global define, describe, it, expect, before, afterEach*/
define([
	'lib/store'
], function(Store) {
	describe('Store', function() {
		var store;

		before(function() {
			store = new Store('test-prefix');
		});

		afterEach(function() {
			store.destroy();
		});

		describe('Error handling', function() {
			it('should throw an error if initialized without a prefix', function() {
				expect(Store).to['throw'](Error);
			});

			it('should throw an error if trying to set an undefined value', function() {
				expect(store.set).to['throw'](Error);
			});

			it('should throw an error if trying to get without a key', function() {
				expect(store.get).to['throw'](Error);
			});
		});

		it('should always return a new instance', function() {
			/*jslint newcap:true*/
			var _store = Store('foobar');
			/*jslint newcap:false*/
			expect(_store instanceof Store).to.equal(true);
		});

		it('should return the right type', function() {
			store.set('foo', { "foo": true });
			expect(store.get('foo')).to.be.an('object').and.have.property('foo', true);
		});

		it('should store a value using the defined prefix', function() {
			store.set('foo', 'bar');
			// note: '"bar"' because of JSON.stringify and we don't JSON.parse
			expect(localStorage.getItem('test-prefixfoo')).to.equal('"bar"');
		});

		it('should store all key-value pairs in an object', function() {
			store.set({ foo: true, bar: 'baz' });
			expect(store.get('foo')).equal(true);
			expect(store.get('bar')).equal('baz');
		});

		it('should override an already defined value', function() {
			store.set('foo', 'bar');
			store.set('foo', 'baz');
			expect(store.get('foo')).to.equal('baz');
		});
	});
});