// test square
var assert = require('assert'),
    math = require('../../../src/index.js'),
    unit = math.unit,
    matrix = math.matrix,
    range = math.range,
    square = math.square;

describe('square', function() {

  it('should be parsed correctly', function() {
    assert.equal(math.eval('square(4)'), 16);
  });

  it('should return the square of a number', function() {
    assert.equal(square(4), 16);
    assert.equal(square(-2), 4);
    assert.equal(square(0), 0);
  });

  it('should throw an error if used with wrong number of arguments', function() {
    assert.throws(function () {square()}, SyntaxError, 'Wrong number of arguments in function square (0 provided, 1 expected)');
    assert.throws(function () {square(1, 2)}, SyntaxError, 'Wrong number of arguments in function square (2 provided, 1 expected)');
  });

  it('should return the square of a complex number', function() {
    assert.deepEqual(square(math.complex('2i')), -4);
    assert.deepEqual(square(math.complex('2+3i')), math.complex('-5+12i'));
    assert.deepEqual(square(math.complex('2')), 4);
  });

  it('should throw an error when used with a unit', function() {
    assert.throws(function () {square(unit('5cm'))});
  });

  it('should throw an error when used with a string', function() {
    assert.throws(function () {square('text')});
  });

  it('should return the square of each element in a matrix', function() {
    assert.deepEqual(square([2,3,4,5]), [4,9,16,25]);
    assert.deepEqual(square(range(2,6)), [4,9,16,25]);
    assert.deepEqual(square(matrix([2,3,4,5])), matrix([4,9,16,25]));
    assert.deepEqual(square(matrix([[1,2],[3,4]])), matrix([[1,4],[9,16]]));
  });

});