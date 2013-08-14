// test floor
var assert = require('assert'),
    approx = require('../../../tools/approx.js'),
    math = require('../../../index.js'),
    complex = math.complex,
    matrix = math.matrix,
    unit = math.unit,
    range = math.range,
    floor = math.floor;

describe('floor', function() {

  it('should be parsed correctly', function() {
    assert.equal(math.eval('floor(1.3)'), 1);
    assert.equal(math.eval('floor(1.8)'), 1);
  });

  it('should floor numbers correctly', function() {
    approx.equal(floor(0), 0);
    approx.equal(floor(1), 1);
    approx.equal(floor(1.3), 1);
    approx.equal(floor(1.8), 1);
    approx.equal(floor(2), 2);
    approx.equal(floor(-1), -1);
    approx.equal(floor(-1.3), -2);
    approx.equal(floor(-1.8), -2);
    approx.equal(floor(-2), -2);
    approx.equal(floor(-2.1), -3);
    approx.deepEqual(floor(math.pi), 3);
  });

  it('should floor complex numbers correctly', function() {
    approx.deepEqual(floor(complex(0, 0)), complex(0, 0));
    approx.deepEqual(floor(complex(1.3, 1.8)), complex(1, 1));
    approx.deepEqual(floor(math.i), complex(0, 1));
    approx.deepEqual(floor(complex(-1.3, -1.8)), complex(-2, -2));
  });

  it('should throw an error with a unit', function() {
    assert.throws(function () {floor(unit('5cm'))}, TypeError, 'Function floor(unit) not supported');
  });

  it('should throw an error with a string', function() {
    assert.throws(function () {floor('hello world')}, TypeError, 'Function floor(string) not supported');
  });

  it('should floor all elements in a matrix', function() {
    approx.deepEqual(floor([1.2, 3.4, 5.6, 7.8, 10.0]), [1, 3, 5, 7, 10]);
    approx.deepEqual(floor(matrix([1.2, 3.4, 5.6, 7.8, 10.0])), matrix([1, 3, 5, 7, 10]));
    approx.deepEqual(floor(range(1.2, 11, 2.2)), [1, 3, 5, 7, 10]);
  });

});