// test divide
var assert = require('assert'),
    math = require('../../../index'),
    error = require('../../../lib/error/index'),
    approx = require('../../../tools/approx'),
    divide = math.divide,
    bignumber = math.bignumber,
    complex = math.complex;

describe('divide', function() {
  it('should divide two numbers', function() {
    assert.equal(divide(4, 2), 2);
    assert.equal(divide(-4, 2), -2);
    assert.equal(divide(4, -2), -2);
    assert.equal(divide(-4, -2), 2);
    assert.equal(divide(4, 0), Infinity);
    assert.equal(divide(-4, 0), -Infinity);
    assert.equal(divide(0, -5), 0);
    assert.ok(isNaN(divide(0, 0)));
  });

  it('should divide booleans', function() {
    assert.equal(divide(true, true), 1);
    assert.equal(divide(true, false), Infinity);
    assert.equal(divide(false, true), 0);
    assert.ok(isNaN(divide(false, false)));
  });

  it('should divide numbers and null', function () {
    assert.equal(divide(1, null), Infinity);
    assert.equal(divide(null, 1), 0);
    assert(isNaN(divide(null, null)));
  });

  it('should divide mixed numbers and booleans', function() {
    assert.equal(divide(2, true), 2);
    assert.equal(divide(2, false), Infinity);
    approx.equal(divide(true, 2), 0.5);
    assert.equal(divide(false, 2), 0);
  });

  it('should divide bignumbers', function() {
    assert.deepEqual(divide(bignumber(0.3), bignumber(0.2)), bignumber(1.5));
    assert.deepEqual(divide(bignumber('2.6e5000'), bignumber('2')), bignumber('1.3e5000'));
  });

  it('should divide mixed numbers and bignumbers', function() {
    assert.deepEqual(divide(bignumber(0.3), 0.2), bignumber(1.5));
    assert.deepEqual(divide(0.3, bignumber(0.2)), bignumber(1.5));
    assert.deepEqual(divide(bignumber('2.6e5000'), 2), bignumber('1.3e5000'));

    approx.equal(divide(1/3, bignumber(2)), 0.166666666666667);
    approx.equal(divide(bignumber(1), 1/3), 3);
  });

  it('should divide mixed booleans and bignumbers', function() {
    assert.deepEqual(divide(bignumber(0.3), true), bignumber(0.3));
    assert.deepEqual(divide(bignumber(0.3), false), bignumber(Infinity));
    assert.deepEqual(divide(false, bignumber('2')), bignumber(0));
    assert.deepEqual(divide(true, bignumber('2')), bignumber(0.5));
  });

  it('should divide two complex numbers', function() {
    approx.deepEqual(divide(complex('2+3i'), 2), complex('1+1.5i'));
    approx.deepEqual(divide(complex('2+3i'), complex('4i')), complex('0.75 - 0.5i'));
    approx.deepEqual(divide(complex('2i'), complex('4i')), complex('0.5'));
    approx.deepEqual(divide(4, complex('1+2i')), complex('0.8 - 1.6i'));
    approx.deepEqual(divide(math.i, 0), complex(0, Infinity));
    approx.deepEqual(divide(complex(0,1), 0), complex(0, Infinity));
    approx.deepEqual(divide(complex(1,0), 0), complex(Infinity, 0));
    approx.deepEqual(divide(complex(0,1), complex(0,0)), complex(0, Infinity));
    approx.deepEqual(divide(complex(1,1), complex(0,0)), complex(Infinity, Infinity));
    approx.deepEqual(divide(complex(1,-1), complex(0,0)), complex(Infinity, -Infinity));
    approx.deepEqual(divide(complex(-1,1), complex(0,0)), complex(-Infinity, Infinity));
    approx.deepEqual(divide(complex(1,1), complex(0,1)), complex(1, -1));
    approx.deepEqual(divide(complex(1,1), complex(1,0)), complex(1, 1));

    approx.deepEqual(divide(complex(2, 3), complex(4, 5)), complex('0.5609756097560976 + 0.0487804878048781i'));
    approx.deepEqual(divide(complex(2, 3), complex(4, -5)), complex('-0.170731707317073 + 0.536585365853659i'));
    approx.deepEqual(divide(complex(2, 3), complex(-4, 5)), complex('0.170731707317073 - 0.536585365853659i'));
    approx.deepEqual(divide(complex(2, 3), complex(-4, -5)), complex('-0.5609756097560976 - 0.0487804878048781i'));
    approx.deepEqual(divide(complex(2, -3), complex(4, 5)), complex('-0.170731707317073 - 0.536585365853659i'));
    approx.deepEqual(divide(complex(2, -3), complex(4, -5)), complex('0.5609756097560976 - 0.0487804878048781i'));
    approx.deepEqual(divide(complex(2, -3), complex(-4, 5)), complex('-0.5609756097560976 + 0.0487804878048781i'));
    approx.deepEqual(divide(complex(2, -3), complex(-4, -5)), complex('0.170731707317073 + 0.536585365853659i'));
    approx.deepEqual(divide(complex(-2, 3), complex(4, 5)), complex('0.170731707317073 + 0.536585365853659i'));
    approx.deepEqual(divide(complex(-2, 3), complex(4, -5)), complex('-0.5609756097560976 + 0.0487804878048781i'));
    approx.deepEqual(divide(complex(-2, 3), complex(-4, 5)), complex('0.5609756097560976 - 0.0487804878048781i'));
    approx.deepEqual(divide(complex(-2, 3), complex(-4, -5)), complex('-0.170731707317073 - 0.536585365853659i'));
    approx.deepEqual(divide(complex(-2, -3), complex(4, 5)), complex('-0.5609756097560976 - 0.0487804878048781i'));
    approx.deepEqual(divide(complex(-2, -3), complex(4, -5)), complex('0.170731707317073 - 0.536585365853659i'));
    approx.deepEqual(divide(complex(-2, -3), complex(-4, 5)), complex('-0.170731707317073 + 0.536585365853659i'));
    approx.deepEqual(divide(complex(-2, -3), complex(-4, -5)), complex('0.5609756097560976 + 0.0487804878048781i'));
  });

  it('should divide mixed complex numbers and numbers', function() {
    assert.deepEqual(divide(math.complex(6, -4), 2), math.complex(3, -2));
    assert.deepEqual(divide(1, math.complex(2, 4)), math.complex(0.1, -0.2));
  });

  it('should divide mixed complex numbers and bignumbers', function() {
    assert.deepEqual(divide(math.complex(6, -4), bignumber(2)), math.complex(3, -2));
    assert.deepEqual(divide(bignumber(1), math.complex(2, 4)), math.complex(0.1, -0.2));
  });

  it('should divide units by a number', function() {
    assert.equal(divide(math.unit('5 m'), 10).toString(), '500 mm');
  });

  it('should divide valueless units by a number', function() {
    assert.equal(divide(math.unit('m'), 2).toString(), '500 mm');
  });

  it('should divide units by a big number', function() {
    assert.equal(divide(math.unit('5 m'), bignumber(10)).toString(), '500 mm');
  });

  it('should divide each elements in a matrix by a number', function() {
    assert.deepEqual(divide([2,4,6], 2), [1,2,3]);
    a  = math.matrix([[1,2],[3,4]]);
    assert.deepEqual(divide(a, 2), math.matrix([[0.5,1],[1.5,2]]));
    assert.deepEqual(divide(a.valueOf(), 2), [[0.5,1],[1.5,2]]);
    assert.deepEqual(divide([], 2), []);
    assert.deepEqual(divide([], 2), []);
  }); 

  it('should divide 1 over a matrix (matrix inverse)', function() {
    approx.deepEqual(divide(1, [
      [ 1, 4,  7],
      [ 3, 0,  5],
      [-1, 9, 11]
    ]), [
      [ 5.625, -2.375, -2.5],
      [ 4.75,  -2.25,  -2],
      [-3.375,  1.625,  1.5]
    ]);
  });

  it('should perform matrix division', function() {
    a = math.matrix([[1,2],[3,4]]);
    b = math.matrix([[5,6],[7,8]]);
    assert.deepEqual(divide(a, b), math.matrix([[3,-2], [2,-1]]));
  });

  it('should divide a matrix by a matrix containing a scalar', function() {
    assert.throws(function () {divide(a, [[1]])});
  });

  it('should throw an error if dividing a number by a unit', function() {
    assert.throws(function () {divide(10, math.unit('5 m')).toString()});
  });

  it('should throw an error if dividing a unit by a non-number', function() {
    assert.throws(function () {divide(math.unit('5 m'), math.unit('5cm')).toString()});
  });

  it('should throw an error if there\'s wrong number of arguments', function() {
    assert.throws(function () {divide(2,3,4); });
    assert.throws(function () {divide(2); });
  });

  it('should LaTeX divide', function () {
    var expression = math.parse('divide(1,2)');
    assert.equal(expression.toTex(), '\\frac{1}{2}');
  });

});
