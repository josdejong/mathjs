var assert = require('assert');
var math = require('../../index');


describe('BigNumber', function () {

  it('toJSON', function () {
    assert.deepEqual(new math.type.BigNumber(5).toJSON(), {'mathjs': 'BigNumber', value: '5'});
  });

  it('fromJSON', function () {
    var b = math.type.BigNumber.fromJSON({value: '5'});
    assert.ok(b instanceof math.type.BigNumber);
    assert.strictEqual(b.toString(), '5');
    assert.deepEqual(b, new math.type.BigNumber(5));
  });

});
