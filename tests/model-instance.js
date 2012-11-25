/*global define, describe, it, expect, sinon*/
define([
	'models/instance',
	'lib/pubsub'
], function(InstanceModel, pubsub) {
	describe('Model - Instance', function() {
		it('should create a websocket (XBMC)-compatible string when stringified', function() {
			var model = new InstanceModel({ host: '0.0.0.0', port: 1000 });
			expect(model.toString()).to.equal('ws://0.0.0.0:1000/jsonrpc');
			expect(model + '').to.equal('ws://0.0.0.0:1000/jsonrpc');
		});

		it('should set itself as connected when signalled', function() {
			var spy = sinon.spy(InstanceModel.prototype, '_setConnected'),
				model = new InstanceModel({ host: '0.0.0.0', port: 1000 });
			pubsub.publish('connection:open', { uri: model.toString() });
			expect(model.get('isConnected')).to.equal(true);
			expect(spy.callCount).to.equal(1);
			spy.restore();
		});
	});
});