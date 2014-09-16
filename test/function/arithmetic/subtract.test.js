// test subtract
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    bignumber = math.bignumber,
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

  it('should subtract numbers and null', function () {
    assert.equal(subtract(1, null), 1);
    assert.equal(subtract(null, 1), -1);
  });

  it('should subtract bignumbers', function() {
    assert.deepEqual(subtract(bignumber(0.3), bignumber(0.2)), bignumber(0.1));
    assert.deepEqual(subtract(bignumber('2.3e5001'), bignumber('3e5000')), bignumber('2e5001'));
    assert.deepEqual(subtract(bignumber('1e19'), bignumber('1')), bignumber('9999999999999999999'));
  });

  it('should subtract mixed numbers and bignumbers', function() {
    assert.deepEqual(subtract(bignumber(0.3), 0.2), bignumber(0.1));
    assert.deepEqual(subtract(0.3, bignumber(0.2)), bignumber(0.1));

    approx.equal(subtract(1/3, bignumber(1).div(3)), 0);
    approx.equal(subtract(bignumber(1).div(3), 1/3), 0);
  });

  it('should subtract mixed booleans and bignumbers', function() {
    assert.deepEqual(subtract(bignumber(1.1), true), bignumber(0.1));
    assert.deepEqual(subtract(bignumber(1.1), false), bignumber(1.1));
    assert.deepEqual(subtract(false, bignumber(0.2)), bignumber(-0.2));
    assert.deepEqual(subtract(true, bignumber(0.2)), bignumber(0.8));
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

  it('should subtract mixed complex numbers and big numbers', function() {
    assert.equal(subtract(math.complex(3, 4), math.bignumber(10)), '-7 + 4i');
    assert.equal(subtract(math.bignumber(10), math.complex(3, 4)), '7 - 4i');
  });

  it('should subtract two quantities of the same unit', function() {
    approx.deepEqual(subtract(math.unit(5, 'km'), math.unit(100, 'mile')), math.unit(-155.93, 'km'));
  });

  it('should throw an error if subtracting two quantities of different units', function() {
    assert.throws(function () {
      subtract(math.unit(5, 'km'), math.unit(100, 'gram'));
    });
  });

  it('should throw an error when one of the two units has undefined value', function() {
    assert.throws(function () {
      subtract(math.unit('km'), math.unit('5gram'));
    }, /Parameter x contains a unit with undefined value/);
    assert.throws(function () {
      subtract(math.unit('5 km'), math.unit('gram'));
    }, /Parameter y contains a unit with undefined value/);
  });

  it('should throw an error if subtracting numbers from units', function() {
    assert.throws(function () { subtract(math.unit(5, 'km'), 2); }, TypeError);
    assert.throws(function () { subtract(2, math.unit(5, 'km')); }, TypeError);
  });

  it('should throw an error if subtracting numbers from units', function() {
    assert.throws(function () { subtract(math.unit(5, 'km'), bignumber(2)); }, TypeError);
    assert.throws(function () { subtract(bignumber(2), math.unit(5, 'km')); }, TypeError);
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

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {subtract(1)}, error.ArgumentsError);
    assert.throws(function () {subtract(1, 2, 3)}, error.ArgumentsError);
  });

});
