// test bitAnd
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    //bignumber = math.bignumber,
    bitAnd = math.bitAnd;

describe('bitAnd', function () {

  it('should bitwise and two numbers', function () {
    assert.equal(bitAnd(53, 131), 1);
    assert.equal(bitAnd(2, 3), 2);
    assert.equal(bitAnd(-2, 3), 2);
    assert.equal(bitAnd(2, -3), 0);
    assert.equal(bitAnd(-5, -3), -7);
  });

  it('should bitwise and booleans', function () {
    assert.equal(bitAnd(true, true), 1);
    assert.equal(bitAnd(true, false), 0);
    assert.equal(bitAnd(false, true), 0);
    assert.equal(bitAnd(false, false), 0);
  });

  it('should bitwise and numbers and null', function () {
    assert.equal(math.bitAnd(null, null), 0);
    assert.equal(math.bitAnd(null, 1), 0);
    assert.equal(math.bitAnd(1, null), 0);
  });

  it('should bitwise and mixed numbers and booleans', function () {
    assert.equal(bitAnd(1, true), 1);
    assert.equal(bitAnd(1, false), 0);
    assert.equal(bitAnd(true, 1), 1);
    assert.equal(bitAnd(false, 1), 0);
  });

/*it('should bitwise and bignumbers', function () {
    assert.deepEqual(bitAnd(bignumber(1), bignumber(2)), bignumber(0));
    assert.deepEqual(bitAnd(bignumber('-1.0e+31'), bignumber('-1.0e+32')), bignumber('-1.0127339798528531708e+32'));
    assert.deepEqual(bitAnd(bignumber('1.0e+31'), bignumber('1.0e+32')), bignumber('8.726602014714682918e+30'));
    assert.deepEqual(bitAnd(bignumber('-1.0e+31'), bignumber('1.0e+32')), bignumber('9.1273397985285317082e+31'));
    assert.deepEqual(bitAnd(bignumber('1.0e+31'), bignumber('-1.0e+32')), bignumber('1.273397985285317082e+30'));
  });

  it('should bitwise and mixed numbers and bignumbers', function () {
    assert.deepEqual(bitAnd(bignumber(1), 2), bignumber(0));
    assert.deepEqual(bitAnd(1, bignumber(2)), bignumber(0));
    assert.deepEqual(bitAnd(bignumber(7), 9), bignumber(1));
    assert.deepEqual(bitAnd(7, bignumber(9)), bignumber(1));
  });

  it('should bitwise and mixed booleans and bignumbers', function () {
    assert.deepEqual(bitAnd(bignumber(1), true), bignumber(1));
    assert.deepEqual(bitAnd(bignumber(1), false), bignumber(0));
    assert.deepEqual(bitAnd(false, bignumber(3)), bignumber(0));
    assert.deepEqual(bitAnd(true, bignumber(3)), bignumber(1));
  });*/

  it('should throw an error if used with a unit', function() {
    assert.throws(function () {bitAnd(math.unit('5cm'), 2)}, error.UnsupportedTypeError);
    assert.throws(function () {bitAnd(2, math.unit('5cm'))}, error.UnsupportedTypeError);
    assert.throws(function () {bitAnd(math.unit('2cm'), math.unit('5cm'))}, error.UnsupportedTypeError);
  });

  it('should bitwise and two ints, even in string format', function () {
    assert.equal(bitAnd('120', '86'), 80);
    assert.equal(bitAnd('86', 120), 80);
    assert.equal(bitAnd('-120', '-86'), -120);
    assert.equal(bitAnd(-120, '-86'), -120);
    assert.equal(bitAnd(-120, '-86e2'), -8696);
  });

  it('should bitwise and strings and matrices element wise', function () {
    assert.deepEqual(bitAnd('42', ['1', 12, '31']), [0, 8, 10]);
    assert.deepEqual(bitAnd(['1', 12, '31'], '42'), [0, 8, 10]);

    assert.deepEqual(bitAnd('42', math.matrix(['1', 12, '31'])), math.matrix([0, 8, 10]));
    assert.deepEqual(bitAnd(math.matrix(['1', 12, '31']), '42'), math.matrix([0, 8, 10]));
  });

  it('should bitwise and matrices correctly', function () {
    var a2 = math.matrix([[1,2],[3,4]]);
    var a3 = math.matrix([[5,6],[7,8]]);
    var a4 = bitAnd(a2, a3);
    assert.ok(a4 instanceof math.type.Matrix);
    assert.deepEqual(a4.size(), [2,2]);
    assert.deepEqual(a4.valueOf(), [[1,2],[3,0]]);
    var a5 = math.pow(a2, 2);
    assert.ok(a5 instanceof math.type.Matrix);
    assert.deepEqual(a5.size(), [2,2]);
    assert.deepEqual(a5.valueOf(), [[7,10],[15,22]]);
  });

  it('should bitwise and a scalar and a matrix correctly', function () {
    assert.deepEqual(bitAnd(12, math.matrix([3,9])), math.matrix([0,8]));
    assert.deepEqual(bitAnd(math.matrix([3,9]), 12), math.matrix([0,8]));
  });

  it('should bitwise and a scalar and an array correctly', function () {
    assert.deepEqual(bitAnd(12, [3,9]), [0,8]);
    assert.deepEqual(bitAnd([3,9], 12), [0,8]);
  });

  it('should bitwise and a matrix and an array correctly', function () {
    var a = [6,4,28];
    var b = math.matrix([13,92,101]);
    var c = bitAnd(a, b);

    assert.ok(c instanceof math.type.Matrix);
    assert.deepEqual(c, math.matrix([4,4,4]));
  });

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () {bitAnd(1)}, error.ArgumentsError);
    assert.throws(function () {bitAnd(1, 2, 3)}, error.ArgumentsError);
  });

});
