var assert = require('assert'),
    math = require('../index')(),
    approx = require('../tools/approx');

describe('constants', function() {

  it('should have PI', function() {
    approx.equal(math.pi, 3.14159265358979);
    approx.equal(math.sin(math.pi / 2), 1);
    approx.equal(math.PI, math.pi);
    approx.equal(math.eval('pi'), 3.14159265358979);
  });

  it('should have tau', function() {
    approx.equal(math.tau, 6.28318530717959);
    approx.equal(math.eval('tau'), 6.28318530717959);
  });

  it('should have euler constant', function() {
    approx.equal(math.e, 2.71828182845905);
    approx.equal(math.eval('e'), 2.71828182845905);
    assert.equal(math.round(math.add(1,math.pow(math.e, math.multiply(math.pi, math.i))), 5), 0);
    assert.equal(math.round(math.eval('1+e^(pi*i)'), 5), 0);
  });

  it('should have i', function() {
    assert.equal(math.i.re, 0);
    assert.equal(math.i.im, 1);
    assert.deepEqual(math.i, math.complex(0,1));
    assert.deepEqual(math.sqrt(-1), math.i);
    assert.deepEqual(math.eval('i'), math.complex(0, 1));
  });

  it('should have true and false', function() {
    assert.strictEqual(math.true, true);
    assert.strictEqual(math.false, false);
    assert.strictEqual(math.eval('true'), true);
    assert.strictEqual(math.eval('false'), false);
  });

  it('should have Infinity', function() {
    assert.strictEqual(math.Infinity, Infinity);
  });

  it('should have NaN', function() {
    assert.ok(isNaN(math.NaN));
  });

});