// test error messages for deprecated functions
var assert = require('assert'),
    math = require('../index'),
    number = require('../lib/util/number');

describe('deprecated stuff', function() {

  it ('should throw an error when using deprecated setting number.defaultType', function () {
    assert.throws(function () {
      math.create({
        number: {
          defaultType: 'number'
        }
      })
    }, /is deprecated/);
  });

  it ('should throw an error when using deprecated setting number.precision', function () {
    assert.throws(function () {
      math.create({
        number: {
          precision: 14
        }
      })
    }, /is deprecated/);
  });

  it ('should throw an error when using deprecated setting decimals', function () {
    assert.throws(function () {
      math.create({
        decimals: 100
      })
    }, /is deprecated/);
  });

  it ('should throw an error when using deprecated setting matrix.defaultType', function () {
    assert.throws(function () {
      math.create({
        matrix: {
          defaultType: 'array'
        }
      })
    }, /is deprecated/);
  });

  it ('should throw an error when using deprecated setting matrix.default', function () {
    assert.throws(function () {
      math.create({
        matrix: {
          'default': 'array'
        }
      })
    }, /is deprecated/);
  });

  it ('should throw an error when using deprecated Node.eval', function () {
    assert.throws(function () {
      new math.expression.node.Node().eval();
    }, /is deprecated/);
  });

  it ('should throw an error when using deprecated function assignment', function () {
    assert.throws(function () {
      new math.parse('function f(x) = x^2');
    }, /Deprecated keyword "function"/);
  });

  it ('should throw an error when using deprecated function ifElse', function () {
    assert.throws(function () {
      new math.ifElse(true, 1, 0);
    }, /is deprecated/);
  });

});
