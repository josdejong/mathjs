// test error messages for deprecated functions
var assert = require('assert'),
    math = require('../index'),
    number = require('../lib/utils/number');

describe('deprecated stuff', function() {

  it ('should throw an error when using deprecated function assignment', function () {
    assert.throws(function () {
      new math.parse('function f(x) = x^2');
    }, /Deprecated keyword "function"/);
  });

});
