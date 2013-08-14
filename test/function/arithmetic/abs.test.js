// test abs
var assert = require('assert');
var math = require('../../../index.js');

describe('abs', function () {

  it('should be parsed correctly', function () {
    assert.equal(math.eval('abs(-4.2)'), 4.2);
  });

  it('should return the abs value of a number', function () {
    assert.equal(math.abs(-4.2), 4.2);
    assert.equal(math.abs(-3.5), 3.5);
    assert.equal(math.abs(100), 100);
    assert.equal(math.abs(0), 0);
  });

  it('should return the modulus of a complex number', function () {
    assert.equal(math.abs(math.complex(3, -4)), 5);
  });

  it('should return the absolute value of all elements in a matrix', function () {
    var a1 = math.abs(math.matrix([1,-2,3]));
    assert.ok(a1 instanceof math.type.Matrix);
    assert.deepEqual(a1.size(), [3]);
    assert.deepEqual(a1.valueOf(), [1,2,3]);
    a1 = math.abs(math.range(-2,3));
    assert.ok(Array.isArray(a1));
    assert.deepEqual(a1.length, 5);
    assert.deepEqual(a1, [2,1,0,1,2])
  });

  it('should throw an error with a measurment unit', function () {
    assert.throws(function () {
      math.abs(math.unit(5, 'km'));
    });
  });

  it('should throw an error with a string', function () {
    assert.throws(function () {
      math.abs('a string');
    });
  });

});
