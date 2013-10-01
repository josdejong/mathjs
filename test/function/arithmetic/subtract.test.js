// test subtract
var assert = require('assert');
var math = require('../../../index.js'),
    subtract = math.subtract;

describe('subtract', function() {

  it('should subtract two numbers correctly', function() {
    assert.deepEqual(subtract(4, 2), 2);
    assert.deepEqual(subtract(4, -4), 8);
    assert.deepEqual(subtract(-4, -4), 0);
    assert.deepEqual(subtract(-4, 4), -8);
    assert.deepEqual(subtract(2, 4), -2);
    assert.deepEqual(subtract(3, 0), 3);
    assert.deepEqual(subtract(0, 3), -3);
    assert.deepEqual(subtract(0, 3), -3);
    assert.deepEqual(subtract(0, 3), -3);
  });

  it('should subtract booleans', function() {
    assert.equal(subtract(true, true), 0);
    assert.equal(subtract(true, false), 1);
    assert.equal(subtract(false, true), -1);
    assert.equal(subtract(false, false), 0);
  });

  it('should subtract mixed numbers and booleans', function() {
    assert.equal(subtract(2, true), 1);
    assert.equal(subtract(2, false), 2);
    assert.equal(subtract(true, 2), -1);
    assert.equal(subtract(false, 2), -2);
  });

  it('should subtract two complex numbers correctly', function() {
    assert.equal(subtract(math.complex(3, 2), math.complex(8, 4)), '-5 - 2i');
    assert.equal(subtract(math.complex(6, 3), math.complex(-2, -2)), '8 + 5i');
    assert.equal(subtract(math.complex(3, 4), 10), '-7 + 4i');
    assert.equal(subtract(math.complex(3, 4), -2), '5 + 4i');
    assert.equal(subtract(math.complex(-3, -4), 10), '-13 - 4i');
    assert.equal(subtract(10, math.complex(3, 4)), '7 - 4i');
    assert.equal(subtract(10, math.i), '10 - i');
    assert.equal(subtract(0, math.i), '-i');
    assert.equal(subtract(10, math.complex(0, 1)), '10 - i');
  });

  it('should subtract two quantities of the same unit', function() {
    assert.equal(subtract(math.unit(5, 'km'), math.unit(100, 'mile')).toString(), '-155.93 km');
  });

  it('should throw an error if subtracting two quantities of different units', function() {
    assert.throws(function () {
      subtract(math.unit(5, 'km'), math.unit(100, 'gram'));
    });
  });

  it('should throw an error when used with a string', function() {
    assert.throws(function () {subtract('hello ', 'world'); });
    assert.throws(function () {subtract('str', 123)});
    assert.throws(function () {subtract(123, 'str')});
  });

  it('should perform element-wise subtraction of two matrices', function() {
    var a2 = math.matrix([[1,2],[3,4]]);
    var a3 = math.matrix([[5,6],[7,8]]);
    var a6 = subtract(a2, a3);
    assert.ok(a6 instanceof math.type.Matrix);
    assert.deepEqual(a6.size(), [2,2]);
    assert.deepEqual(a6.valueOf(), [[-4,-4],[-4,-4]]);
  });

});
