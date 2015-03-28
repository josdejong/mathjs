var assert = require('assert');
var math = require('../../index');
var BigNumber = math.type.BigNumber;


describe('BigNumber', function () {

  it('toJSON', function () {
    assert.deepEqual(new BigNumber(5).toJSON(), {'mathjs': 'BigNumber', value: '5'});
  });

  it('fromJSON', function () {
    var b = BigNumber.fromJSON({value: '5'});
    assert.ok(b instanceof BigNumber);
    assert.strictEqual(b.toString(), '5');
    assert.deepEqual(b, new BigNumber(5));
  });

});
