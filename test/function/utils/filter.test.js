var assert = require('assert'),
    error = require('../../../lib/error/index'),
    math = require('../../../index');

describe('filter', function() {

  it('should filter an array with a filter function', function() {
    function isPositive (x) {
      return x > 0;
    }
    assert.deepEqual(math.filter([6, -2, -1, 4, 3], isPositive), [6, 4, 3]);
  });

  it('should filter a Matrix with a filter function', function() {
    function isPositive (x) {
      return x > 0;
    }
    assert.deepEqual(math.filter(math.matrix([6, -2, -1, 4, 3]), isPositive), math.matrix([6, 4, 3]));
  });

  it('should filter an array with a regexp', function() {
    assert.deepEqual(math.filter(["23", "foo", "100", "55", "bar"], /[0-9]+/), ["23", "100", "55"]);
  });


  it('should filter a Matrix with a regexp', function() {
    assert.deepEqual(math.filter(math.matrix(["23", "foo", "100", "55", "bar"]), /[0-9]+/), math.matrix(["23", "100", "55"]));
  });

  it('should throw an error if called with a multi dimensional matrix', function() {
    function isPositive (x) {
      return x > 0;
    }
    assert.throws(function() { math.filter(math.matrix([[6, -2],[-1, 4]]), isPositive) }, /Only one dimensional matrices supported/);
  });

  it('should throw an error if called with unsupported type', function() {
    assert.throws(function() { math.filter(2, /regexp/) });
    assert.throws(function() { math.filter('string', /regexp/) });
    assert.throws(function() { math.filter([], 'string') });
    assert.throws(function() { math.filter([], {}) });
  });

  it('should throw an error if called with invalid number of arguments', function() {
    assert.throws(function() { math.filter([], /reg/, 'foo') });
    assert.throws(function() { math.filter([]) });
  });

  it('should LaTeX filter', function () {
    var expression = math.parse('filter(1,test)');
    assert.equal(expression.toTex(), '\\mathrm{filter}\\left(1,\\mathrm{test}\\right)');
  });

});
