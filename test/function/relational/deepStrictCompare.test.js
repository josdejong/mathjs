// test deepStrictCompare
var assert = require('assert'),
    math = require('../../../index'),
    bignumber = math.bignumber,
    complex = math.complex,
    matrix = math.matrix,
    sparse = math.sparse,
    unit = math.unit,
    deepStrictCompare = math.deepStrictCompare;

describe('deepStrictCompare', function() {

  it('should compare two numbers correctly', function() {
    assert.equal(deepStrictCompare(2, 3), -1);
    assert.equal(deepStrictCompare(2, 2), 0);
    assert.equal(deepStrictCompare(2, 1), 1);
    assert.equal(deepStrictCompare(0, 0), 0);
    assert.equal(deepStrictCompare(-2, 2), -1);
    assert.equal(deepStrictCompare(-2, -3), 1);
    assert.equal(deepStrictCompare(-3, -2), -1);
  });

  it('should compare two floating point numbers correctly', function() {
    // Infinity
    assert.equal(deepStrictCompare(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY), 0);
    assert.equal(deepStrictCompare(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY), 0);
    assert.equal(deepStrictCompare(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY), 1);
    assert.equal(deepStrictCompare(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY), -1);
    assert.equal(deepStrictCompare(Number.POSITIVE_INFINITY, 2.0), 1);
    assert.equal(deepStrictCompare(2.0, Number.POSITIVE_INFINITY), -1);
    assert.equal(deepStrictCompare(Number.NEGATIVE_INFINITY, 2.0), -1);
    assert.equal(deepStrictCompare(2.0, Number.NEGATIVE_INFINITY), 1);
    // floating point numbers
    assert.equal(deepStrictCompare(0.3 - 0.2, 0.1), 0);
  });

  it('should compare two booleans', function() {
    assert.equal(deepStrictCompare(true, true), 0);
    assert.equal(deepStrictCompare(true, false), 1);
    assert.equal(deepStrictCompare(false, true), -1);
    assert.equal(deepStrictCompare(false, false), 0);
  });

  it('should compare bignumbers', function() {
    assert.strictEqual(deepStrictCompare(bignumber(2), bignumber(3)), -1);
    assert.strictEqual(deepStrictCompare(bignumber(2), bignumber(2)), 0);
    assert.strictEqual(deepStrictCompare(bignumber(3), bignumber(2)), 1);
    assert.strictEqual(deepStrictCompare(bignumber(0), bignumber(0)), 0);
    assert.strictEqual(deepStrictCompare(bignumber(-2), bignumber(2)), -1);
  });

  it('should compare two fractions', function() {
    var a = math.fraction(1,3);
    var b = math.fraction(1,6);
    assert(deepStrictCompare(a, b) instanceof math.type.Fraction);
    assert.equal(a.toString(), '0.(3)');
    assert.equal(b.toString(), '0.1(6)');

    assert.equal(deepStrictCompare(math.fraction(3), math.fraction(2)).valueOf(), 1);
    assert.equal(deepStrictCompare(math.fraction(2), math.fraction(3)).valueOf(), -1);
    assert.equal(deepStrictCompare(math.fraction(3), math.fraction(3)).valueOf(), 0);

    assert.strictEqual(deepStrictCompare(math.add(math.fraction(0.1), math.fraction(0.2)), math.fraction(0.3)).valueOf(), 0); // this would fail with numbers
  });

  it('should compare two measures of the same unit', function() {
    assert.equal(deepStrictCompare(unit('100cm'), unit('10inch')), 1);
    assert.equal(deepStrictCompare(unit('99cm'), unit('1m')), -1);
    assert.equal(deepStrictCompare(unit('1m'), unit('1m')), bignumber(0));
    assert.equal(deepStrictCompare(unit('101cm'), unit('1m')), 1);
  });

  it('should throw an error for two measures of different units', function() {

    // TODO: compare units with different base

    assert.throws(function () {deepStrictCompare(math.unit(5, 'km'), math.unit(100, 'gram'));});
  });

  it('should compare mixed types (by type name)', function() {
    // booleans
    assert.strictEqual (deepStrictCompare(2, true), 1);
    assert.strictEqual (deepStrictCompare(0, false), 1);
    assert.strictEqual (deepStrictCompare(true, 2), -1);
    assert.strictEqual (deepStrictCompare(false, 2), -1);

    // null
    assert.strictEqual (deepStrictCompare(2, null), 1);
    assert.strictEqual (deepStrictCompare(null, 2), -1);

    // undefined
    assert.strictEqual (deepStrictCompare(2, undefined), -1);
    assert.strictEqual (deepStrictCompare(undefined, 2), 1);

    // fractions and units
    assert.strictEqual (deepStrictCompare(1, math.fraction(1,3)), 1);
    assert.strictEqual (deepStrictCompare(math.fraction(1,3), 1), -1);

    // units and numbers
    assert.strictEqual (deepStrictCompare(unit('100cm'), 22), -1);
    assert.strictEqual (deepStrictCompare(22, unit('100cm')), 1);

    // units and bignumbers
    assert.strictEqual (deepStrictCompare(unit('100cm'), bignumber(22)), 1);
    assert.strictEqual (deepStrictCompare(bignumber(22), unit('100cm')), -1);

    // numbers and complex
    assert.strictEqual (deepStrictCompare(1, complex(2,3)), 1);
    assert.strictEqual (deepStrictCompare(complex(2,3), 1), -1);

    // numbers and bignumbers
    assert.strictEqual (deepStrictCompare(bignumber(2), 3), -1);
    assert.strictEqual (deepStrictCompare(2, bignumber(2)), 1);

    // array, DenseMatrix, SparseMatrix
    assert.strictEqual (deepStrictCompare(matrix([2]), [2]), 1);
    assert.strictEqual (deepStrictCompare(sparse([2]), [2]), 1);
    assert.strictEqual (deepStrictCompare(sparse([2]), matrix([2])), 1);

    // string and number
    assert.strictEqual (deepStrictCompare('0', 0), 1);
  });

  it('should perform natural comparison for two strings', function() {
    assert.equal(deepStrictCompare('abd', 'abc'), 1);
    assert.equal(deepStrictCompare('abc', 'abc'), 0);
    assert.equal(deepStrictCompare('abc', 'abd'), -1);

    // no natural sorting here
    assert.equal(deepStrictCompare('10', '2'), -1);
  });

  it('should compare arrays', function () {
    // different number of dimensions
    // Note: for arrays we don't compare the number of dimensions!
    assert.strictEqual(deepStrictCompare([[2]], [1]), -1);

    // different size
    assert.strictEqual(deepStrictCompare([[2,3]], [[4]]), 1);

    // different content
    assert.strictEqual(deepStrictCompare([[2,3]], [[2,4]]), -1);

    // equal
    assert.strictEqual(deepStrictCompare([[2,3], [5,6]], [[2,3], [5,6]]), 0);
  });

  it('should compare dense matrices', function () {
    // different number of dimensions
    assert.strictEqual(deepStrictCompare(matrix([[2]]), matrix([1])), 1);

    // different size
    assert.strictEqual(deepStrictCompare(matrix([[2,3]]), matrix([[4]])), 1);

    // different content
    assert.strictEqual(deepStrictCompare(matrix([[2,3]]), matrix([[2,4]])), -1);

    // equal
    assert.strictEqual(deepStrictCompare(matrix([[2,3], [5,6]]), matrix([[2,3], [5,6]])), 0);
  });

  it('should compare sparse matrices', function () {
    // different number of dimensions
    assert.strictEqual(deepStrictCompare(sparse([[2]]), sparse([1])), 1);

    // different size
    assert.strictEqual(deepStrictCompare(sparse([[2,3]]), sparse([[4]])), 1);

    // different content
    assert.strictEqual(deepStrictCompare(sparse([[2,3]]), sparse([[2,4]])), -1);

    // equal
    assert.strictEqual(deepStrictCompare(sparse([[2,3], [5,6]]), sparse([[2,3], [5,6]])), 0);
  });

  it('should compare objects', function () {
    // different number of keys
    assert.strictEqual(deepStrictCompare({a:2, b:3}, {a:2}), 1);

    // different keys
    assert.strictEqual(deepStrictCompare({b:3}, {a:2}), 1);

    // different values
    assert.strictEqual(deepStrictCompare({a:3}, {a:2}), 1);

    // equal
    assert.strictEqual(deepStrictCompare({a:2, b:3}, {a:2, b:3}), 0);
    
    // nesting
    assert.strictEqual(deepStrictCompare({a:2, b: {c: 4}}, {a:2, b: {c: 3}}), 1);
    assert.strictEqual(deepStrictCompare({a:2, b: {c: 3}}, {a:2, b: {c: 4}}), -1);
  });

  it('should apply configuration option epsilon', function() {
    var mymath = math.create();

    assert.equal(mymath.deepStrictCompare(1, 0.991), 1);
    assert.equal(mymath.deepStrictCompare(math.bignumber(1), math.bignumber(0.991)).valueOf(), 1);

    mymath.config({epsilon: 1e-2});
    assert.equal(mymath.deepStrictCompare(1, 0.991), 0);
    assert.equal(mymath.deepStrictCompare(math.bignumber(1), math.bignumber(0.991)), 0);
  });

  it('should compare complex numbers', function() {
    assert.equal(deepStrictCompare(complex(1,1), complex(1,1)), 0);
    assert.equal(deepStrictCompare(complex(2,1), complex(1,2)), 1);
    assert.equal(deepStrictCompare(complex(0,1), complex(1,2)), -1);
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {deepStrictCompare(1);}, /TypeError: Too few arguments/);
    assert.throws(function () {deepStrictCompare(1, 2, 3);}, /TypeError: Too many arguments/);
  });

  it('should LaTeX compare', function () {
    var expression = math.parse('deepStrictCompare(1,2)');
    assert.equal(expression.toTex(), '\\mathrm{deepStrictCompare}\\left(1,2\\right)');
  });
});
