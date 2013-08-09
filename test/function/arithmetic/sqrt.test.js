// test sqrt
var assert = require('assert'),
    approx = require('../../../tools/approx.js'),
    math = require('../../../src/index.js');

describe('sqrt', function() {

  it('should be parsed correctly', function() {
    assert.equal(math.eval('sqrt(25)'), 5);
  });

  it('should return the square root of a number', function() {
    assert.equal(math.sqrt(25), 5);
    assert.equal(math.sqrt(-4), '2i');
    assert.equal(math.sqrt(0), '');
  });

  it('should return the square root of a complex number', function() {
    assert.equal(math.sqrt(math.complex(3, -4)), '2 - i');
  });

  it('should throw an error when used with a unit', function() {
    assert.throws(function () {
      math.sqrt(math.unit(5, 'km'));
    });
  });

  it('should throw an error when used with a string', function() {
    assert.throws(function () {
      math.sqrt('a string');
    });
  });

  it('should return the square root of each element of a matrix', function() {
    assert.deepEqual(math.sqrt([4,9,16,25]), [2,3,4,5]);
    assert.deepEqual(math.sqrt([[4,9],[16,25]]), [[2,3],[4,5]]);
    assert.deepEqual(math.sqrt(math.matrix([[4,9],[16,25]])), math.matrix([[2,3],[4,5]]));
    approx.deepEqual(math.sqrt(math.range('4:2:8')), [2, 2.44948974278318, 2.82842712474619]);
  });

});