var assert = require('assert'),
    BigNumber = require('bignumber.js'),
    mathjs = require('../../../index'),
    math = mathjs(),
    bignumber = math.bignumber;

describe('bignumber', function() {

  it('should create a bignumber', function() {
    // no arguments
    var n = bignumber();
    assert.ok(n instanceof BigNumber);
    assert.equal(n.valueOf(), '0');

    // from number
    var a = bignumber(0.1);
    assert.ok(a instanceof BigNumber);
    assert.equal(a.valueOf(), '0.1');

    // from string
    var b = bignumber('0.1');
    assert.ok(b instanceof BigNumber);
    assert.equal(b.valueOf(), '0.1');

    // from boolean
    var c = bignumber(true);
    assert.ok(c instanceof BigNumber);
    assert.equal(c.valueOf(), '1');

    // from array
    var d = bignumber([0.1, 0.2, '0.3']);
    assert.ok(Array.isArray(d));
    assert.equal(d.length, 3);
    assert.ok(d[0] instanceof BigNumber);
    assert.ok(d[1] instanceof BigNumber);
    assert.ok(d[2] instanceof BigNumber);
    assert.equal(d[0].valueOf(), '0.1');
    assert.equal(d[1].valueOf(), '0.2');
    assert.equal(d[2].valueOf(), '0.3');

    // from matrix
    var e = bignumber(math.matrix([0.1, 0.2]));
    assert.ok(e instanceof math.type.Matrix);
    assert.deepEqual(e.size(), [2]);
    assert.ok(e.get([0]) instanceof BigNumber);
    assert.ok(e.get([1]) instanceof BigNumber);
    assert.equal(e.get([0]).valueOf(), '0.1');
    assert.equal(e.get([1]).valueOf(), '0.2');

    // really big
    var f = bignumber('1.2e500');
    assert.equal(f.valueOf(), '1.2e+500');
  });

  it('should apply precision setting to bignumbers', function() {
    var math = mathjs({
      decimals: 32
    });

    var a = math.bignumber(1).dividedBy(3);
    assert.equal(a.toString(), '0.33333333333333333333333333333333')

    // restore default precision
    math.config({
      decimals: 20
    });
  });
});