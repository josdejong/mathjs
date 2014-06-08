// test format
var assert = require('assert'),
    error = require('../../../lib/error/index'),
    math = require('../../../index')(),
    ifElse = math.ifElse;

describe('ifElse', function() {

  it('should evaluate boolean conditions', function() {
    assert.equal(ifElse(true, 1, 0), 1);
    assert.equal(ifElse(false, 1, 0), 0);
  });

  it('should evaluate number conditions', function() {
    assert.equal(ifElse(1, 1, 0), 1);
    assert.equal(ifElse(4, 1, 0), 1);
    assert.equal(ifElse(-1, 1, 0), 1);
    assert.equal(ifElse(0, 1, 0), 0);
  });

  it('should evaluate bignumber conditions', function() {
    assert.equal(ifElse(math.bignumber(1), 1, 0), 1);
    assert.equal(ifElse(math.bignumber(4), 1, 0), 1);
    assert.equal(ifElse(math.bignumber(-1), 1, 0), 1);
    assert.equal(ifElse(math.bignumber(0), 1, 0), 0);
  });

  it('should evaluate complex number conditions', function() {
    assert.equal(ifElse(math.complex(2, 3), 1, 0), 1);
    assert.equal(ifElse(math.complex(2, 0), 1, 0), 1);
    assert.equal(ifElse(math.complex(0, 3), 1, 0), 1);
    assert.equal(ifElse(math.complex(0, 0), 1, 0), 0);
  });

  it('should evaluate string conditions', function() {
    assert.equal(ifElse('hello', 1, 0), 1);
    assert.equal(ifElse('', 1, 0), 0);
  });

  it('should evaluate unit conditions', function() {
    assert.equal(ifElse(math.unit('5cm'), 1, 0), 1);
    assert.equal(ifElse(math.unit('0 inch'), 1, 0), 0);
  });

  it('should evaluate null conditions', function() {
    assert.equal(ifElse(null, 1, 0), 0);
  });

  it('should evaluate undefined conditions', function() {
    assert.equal(ifElse(undefined, 1, 0), 0);
  });

  it('should throw an error if called with invalid number of arguments', function() {
    assert.throws(function() { ifElse(true); });
    assert.throws(function() { ifElse(true, true); });
    assert.throws(function() { ifElse(true, true, true, true); });
  });

  it('should throw an error if called with invalid type of arguments', function() {
    assert.throws(function() { ifElse([], 1, 0); }, math.type.UnsupportedTypeError);
    assert.throws(function() { ifElse(math.matrix(), 1, 0); }, math.type.UnsupportedTypeError);
    assert.throws(function() { ifElse(new Date(), 1, 0); }, math.type.UnsupportedTypeError);
    assert.throws(function() { ifElse(/regexp/, 1, 0); }, math.type.UnsupportedTypeError);
  });

});
