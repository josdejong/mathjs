// test error messages for deprecated functions
var assert = require('assert'),
    math = require('../index'),
    number = require('../lib/util/number');

describe('deprecated stuff', function() {

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

});
