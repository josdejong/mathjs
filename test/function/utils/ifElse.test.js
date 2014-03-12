// test format
var assert = require('assert'),
    math = require('../../../index')();

describe('ifElse', function() {

  it('should evaluate to true', function() {
    assert.equal(math.ifElse(true, 1, 0), 1);
    assert.equal(math.ifElse(1, 1, 0), 1);
    assert.equal(math.ifElse({}, 1, 0), 1);
    assert.equal(math.ifElse(1 > 0, 1, 0), 1);
    assert.equal(math.ifElse('foo' == 'foo', 1, 0), 1);
    assert.equal(math.ifElse(10 == 10, 1, 0), 1);
    assert.equal(math.ifElse(5 == 2 + 3, 1, 0), 1);
    assert.equal(math.ifElse(true, 'foo', 'bar'), 'foo');
    assert.equal(math.ifElse(1, 'foo', 'bar'), 'foo');
    assert.equal(math.ifElse({}, 'foo', 'bar'), 'foo');
    assert.equal(math.ifElse(1 > 0, 'foo', 'bar'), 'foo');
    assert.equal(math.ifElse('foo' == 'foo', 'foo', 'bar'), 'foo');
    assert.equal(math.ifElse(10 == 10, 'foo', 'bar'), 'foo');
    assert.equal(math.ifElse(5 == 2 + 3, 'foo', 'bar'), 'foo');
  });

  it('should evaluate to false', function() {
    assert.equal(math.ifElse(false, 1, 0), 0);
    assert.equal(math.ifElse(0, 1, 0), 0);
    assert.equal(math.ifElse(null, 1, 0), 0);
    assert.equal(math.ifElse(0 > 1, 1, 0), 0);
    assert.equal(math.ifElse('foo' != 'foo', 1, 0), 0);
    assert.equal(math.ifElse(10 != 10, 1, 0), 0);
    assert.equal(math.ifElse(5 != 2 + 3, 1, 0), 0);
    assert.equal(math.ifElse(false, 'foo', 'bar'), 'bar');
    assert.equal(math.ifElse(0, 'foo', 'bar'), 'bar');
    assert.equal(math.ifElse(null, 'foo', 'bar'), 'bar');
    assert.equal(math.ifElse(0 > 1, 'foo', 'bar'), 'bar');
    assert.equal(math.ifElse('foo' != 'foo', 'foo', 'bar'), 'bar');
    assert.equal(math.ifElse(10 != 10, 'foo', 'bar'), 'bar');
    assert.equal(math.ifElse(5 != 2 + 3, 'foo', 'bar'), 'bar');
  });

  it('should throw an error if called with invalid number of arguments', function() {
    assert.throws(function() { math.ifElse(true); });
    assert.throws(function() { math.ifElse(true, true); });
    assert.throws(function() { math.ifElse(true, true, true, true); });
  });

});
