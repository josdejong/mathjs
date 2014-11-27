// test bitXor
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    //bignumber = math.bignumber,
    bitXor = math.bitXor;

describe('bitXor', function () {

  it('should xor two numbers', function () {
    assert.equal(bitXor(53, 131), 182);
    assert.equal(bitXor(2, 3), 1);
    assert.equal(bitXor(-2, 3), -3);
    assert.equal(bitXor(2, -3), -1);
    assert.equal(bitXor(-5, -3), 6);
  });

  it('should xor booleans', function () {
    assert.equal(bitXor(true, true), 0);
    assert.equal(bitXor(true, false), 1);
    assert.equal(bitXor(false, true), 1);
    assert.equal(bitXor(false, false), 0);
  });

  it('should xor numbers and null', function () {
    assert.equal(math.bitXor(null, null), 0);
    assert.equal(math.bitXor(null, 1), 1);
    assert.equal(math.bitXor(1, null), 1);
  });

  it('should xor mixed numbers and booleans', function () {
    assert.equal(bitXor(0, true), 1);
    assert.equal(bitXor(0, false), 0);
    assert.equal(bitXor(true, 0), 1);
    assert.equal(bitXor(false, 0), 0);
    assert.equal(bitXor(true, 1), 0);
    assert.equal(bitXor(false, 1), 1);
  });

  it('should throw an error if used with a unit', function() {
    assert.throws(function () {bitXor(math.unit('5cm'), 2)}, error.UnsupportedTypeError);
    assert.throws(function () {bitXor(2, math.unit('5cm'))}, error.UnsupportedTypeError);
    assert.throws(function () {bitXor(math.unit('2cm'), math.unit('5cm'))}, error.UnsupportedTypeError);
  });

  it('should xor two ints, even in string format', function () {
    assert.equal(bitXor('120', '86'), 46);
    assert.equal(bitXor('86', 120), 46);
    assert.equal(bitXor('-120', '-86'), 34);
    assert.equal(bitXor(-120, '-86'), 34);
  });

  it('should xor strings and matrices element wise', function () {
    assert.deepEqual(bitXor('42', ['1', 12, '31']), [43, 38, 53]);
    assert.deepEqual(bitXor(['1', 12, '31'], '42'), [43, 38, 53]);

    assert.deepEqual(bitXor('42', math.matrix(['1', 12, '31'])), math.matrix([43, 38, 53]));
    assert.deepEqual(bitXor(math.matrix(['1', 12, '31']), '42'), math.matrix([43, 38, 53]));
  });

  it('should xor matrices correctly', function () {
    var a2 = math.matrix([[1,2],[3,4]]);
    var a3 = math.matrix([[5,6],[7,8]]);
    var a4 = bitXor(a2, a3);
    assert.ok(a4 instanceof math.type.Matrix);
    assert.deepEqual(a4.size(), [2,2]);
    assert.deepEqual(a4.valueOf(), [[4,4],[4,12]]);
    var a5 = math.pow(a2, 2);
    assert.ok(a5 instanceof math.type.Matrix);
    assert.deepEqual(a5.size(), [2,2]);
    assert.deepEqual(a5.valueOf(), [[7,10],[15,22]]);
  });

  it('should xor a scalar and a matrix correctly', function () {
    assert.deepEqual(bitXor(12, math.matrix([3,9])), math.matrix([15,5]));
    assert.deepEqual(bitXor(math.matrix([3,9]), 12), math.matrix([15,5]));
  });

  it('should xor a scalar and an array correctly', function () {
    assert.deepEqual(bitXor(12, [3,9]), [15,5]);
    assert.deepEqual(bitXor([3,9], 12), [15,5]);
  });

  it('should xor a matrix and an array correctly', function () {
    var a = [6,4,28];
    var b = math.matrix([13,92,101]);
    var c = bitXor(a, b);

    assert.ok(c instanceof math.type.Matrix);
    assert.deepEqual(c, math.matrix([11,88,121]));
  });

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () {bitXor(1)}, error.ArgumentsError);
    assert.throws(function () {bitXor(1, 2, 3)}, error.ArgumentsError);
  });

});
