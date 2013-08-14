// test fix
var assert = require('assert'),
    approx = require('../../../tools/approx.js'),
    math = require('../../../index.js'),
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    range = math.range,
    fix = math.fix;

describe('fix ???', function() {

  it('should be parsed correctly', function() {
    assert.equal(math.eval('fix(1.3)'), 1);
    assert.equal(math.eval('fix(1.8)'), 1);
  });

  it('', function() {
    approx.equal(fix(0), 0);
    approx.equal(fix(1), 1);
    approx.equal(fix(1.3), 1);
    approx.equal(fix(1.8), 1);
    approx.equal(fix(2), 2);
    approx.equal(fix(-1), -1);
    approx.equal(fix(-1.3), -1);
    approx.equal(fix(-1.8), -1);
    approx.equal(fix(-2), -2);
    approx.equal(fix(-2.1), -2);
    approx.deepEqual(fix(math.pi), 3);
  });

  it('should', function() {
    // complex
    approx.deepEqual(fix(complex(0, 0)), complex(0, 0));
    approx.deepEqual(fix(complex(1.3, 1.8)), complex(1, 1));
    approx.deepEqual(fix(math.i), complex(0, 1));
    approx.deepEqual(fix(complex(-1.3, -1.8)), complex(-1, -1));
  });

  it('should', function() {
    // unit
    assert.throws(function () {fix(unit('5cm'))}, TypeError, 'Function fix(unit) not supported');
  });

  it('should', function() {
    // string
    assert.throws(function () {fix('hello world')}, TypeError, 'Function fix(string) not supported');
  });

  it('should', function() {
    // matrix, array, range
    approx.deepEqual(fix([1.2, 3.4, 5.6, 7.8, 10.0]), [1, 3, 5, 7, 10]);
    approx.deepEqual(fix(matrix([1.2, 3.4, 5.6, 7.8, 10.0])), matrix([1, 3, 5, 7, 10]));
    approx.deepEqual(fix(range(1.2, 11, 2.2)), [1, 3, 5, 7, 10]);
  });

});