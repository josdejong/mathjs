// test compareNatural
var assert = require('assert'),
    math = require('../../../index'),
    bignumber = math.bignumber,
    complex = math.complex,
    matrix = math.matrix,
    sparse = math.sparse,
    unit = math.unit,
    compareNatural = math.compareNatural;

describe('compareNatural', function() {

  it('should naturally compare two numbers correctly', function() {
    assert.equal(compareNatural(2, 3), -1);
    assert.equal(compareNatural(2, 2), 0);
    assert.equal(compareNatural(2, 1), 1);
    assert.equal(compareNatural(0, 0), 0);
    assert.equal(compareNatural(-2, 2), -1);
    assert.equal(compareNatural(-2, -3), 1);
    assert.equal(compareNatural(-3, -2), -1);
  });

  it('should naturally compare  two floating point numbers correctly', function() {
    // Infinity
    assert.equal(compareNatural(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY), 0);
    assert.equal(compareNatural(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY), 0);
    assert.equal(compareNatural(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY), 1);
    assert.equal(compareNatural(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY), -1);
    assert.equal(compareNatural(Number.POSITIVE_INFINITY, 2.0), 1);
    assert.equal(compareNatural(2.0, Number.POSITIVE_INFINITY), -1);
    assert.equal(compareNatural(Number.NEGATIVE_INFINITY, 2.0), -1);
    assert.equal(compareNatural(2.0, Number.NEGATIVE_INFINITY), 1);
    // floating point numbers
    assert.equal(compareNatural(0.3 - 0.2, 0.1), 0);
  });

  it('should naturally compare  two booleans', function() {
    assert.equal(compareNatural(true, true), 0);
    assert.equal(compareNatural(true, false), 1);
    assert.equal(compareNatural(false, true), -1);
    assert.equal(compareNatural(false, false), 0);
  });

  it('should naturally compare  mixed numbers and booleans', function() {
    assert.equal(compareNatural(2, true), 1);
    assert.equal(compareNatural(0, true), -1);
    assert.equal(compareNatural(true, 2), -1);
    assert.equal(compareNatural(false, 2), -1);
  });

  it('should naturally compare  mixed numbers and null', function() {
    assert.equal(compareNatural(2, null), 1);
    assert.equal(compareNatural(0, null), 0);
    assert.equal(compareNatural(null, 2), -1);
  });

  it('should naturally compare bignumbers', function() {
    assert.deepEqual(compareNatural(bignumber(2), bignumber(3)), bignumber(-1));
    assert.deepEqual(compareNatural(bignumber(2), bignumber(2)), bignumber(0));
    assert.deepEqual(compareNatural(bignumber(3), bignumber(2)), bignumber(1));
    assert.deepEqual(compareNatural(bignumber(0), bignumber(0)), bignumber(0));
    assert.deepEqual(compareNatural(bignumber(-2), bignumber(2)), bignumber(-1));
  });

  it('should naturally compare  mixed numbers and bignumbers', function() {
    assert.deepEqual(compareNatural(bignumber(2), 3), bignumber(-1));
    assert.deepEqual(compareNatural(2, bignumber(2)), bignumber(0));
  });

  it('should naturally compare  mixed booleans and bignumbers', function() {
    assert.deepEqual(compareNatural(bignumber(0.1), true), bignumber(-1));
    assert.deepEqual(compareNatural(bignumber(1), true), bignumber(0));
    assert.deepEqual(compareNatural(bignumber(1), false), bignumber(1));
    assert.deepEqual(compareNatural(false, bignumber(0)), bignumber(0));
    assert.deepEqual(compareNatural(true, bignumber(0)), bignumber(1));
  });

  it('should naturally compare  two fractions', function() {
    var a = math.fraction(1,3);
    var b = math.fraction(1,6);
    assert(compareNatural(a, b) instanceof math.type.Fraction);
    assert.equal(a.toString(), '0.(3)');
    assert.equal(b.toString(), '0.1(6)');

    assert.equal(compareNatural(math.fraction(3), math.fraction(2)).valueOf(), 1);
    assert.equal(compareNatural(math.fraction(2), math.fraction(3)).valueOf(), -1);
    assert.equal(compareNatural(math.fraction(3), math.fraction(3)).valueOf(), 0);

    assert.strictEqual(compareNatural(math.add(math.fraction(0.1), math.fraction(0.2)), math.fraction(0.3)).valueOf(), 0); // this would fail with numbers
  });

  it('should naturally compare  mixed fractions and numbers', function() {
    assert.deepEqual(compareNatural(1, math.fraction(1,3)), math.fraction(1));
    assert.deepEqual(compareNatural(math.fraction(1,3), 1), math.fraction(-1));
  });

  it('should naturally compare two measures of the same unit', function() {
    assert.equal(compareNatural(unit('100cm'), unit('10inch')), 1);
    assert.equal(compareNatural(unit('99cm'), unit('1m')), -1);
    assert.equal(compareNatural(unit('1m'), unit('1m')), bignumber(0));
    assert.equal(compareNatural(unit('101cm'), unit('1m')), 1);
  });

  it('should throw an error if comparing a unit with a number', function() {
    assert.throws(function () {compareNatural(unit('100cm'), 22);});
  });

  it('should throw an error for two measures of different units', function() {
    assert.throws(function () {compareNatural(math.unit(5, 'km'), math.unit(100, 'gram'));});
  });

  it('should throw an error if comparing a unit with a bignumber', function() {
    assert.throws(function () {compareNatural(unit('100cm'), bignumber(22));});
  });

  it('should perform natural comparison for two strings', function() {
    assert.equal(compareNatural('0', 0), 0);

    assert.equal(compareNatural('abd', 'abc'), 1);
    assert.equal(compareNatural('abc', 'abc'), 0);
    assert.equal(compareNatural('abc', 'abd'), -1);

    assert.equal(compareNatural('10', '2'), 1);
  });

  // TODO: compareNatural for Array
  describe.skip('Array', function () {
    
    it('should compare array - scalar', function () {
      assert.deepEqual(compareNatural('B', ['A', 'B', 'C']), [1, 0, -1]);
      assert.deepEqual(compareNatural(['A', 'B', 'C'], 'B'), [-1, 0, 1]);
    });
    
    it('should compare array - array', function () {
      assert.deepEqual(compareNatural([[1, 2, 0], [-1, 0, 2]], [[3, -1, 0], [-2, 1, 0]]), [[-1, 1, 0], [1, -1, 1]]);
    });
    
    it('should compare array - dense matrix', function () {
      assert.deepEqual(compareNatural([[1, 2, 0], [-1, 0, 2]], matrix([[3, -1, 0], [-2, 1, 0]])), matrix([[-1, 1, 0], [1, -1, 1]]));
    });
    
    it('should compare array - sparse matrix', function () {
      assert.deepEqual(compareNatural([[1, 2, 0], [-1, 0, 2]], sparse([[3, -1, 0], [-2, 1, 0]])), matrix([[-1, 1, 0], [1, -1, 1]]));
    });
  });

  // TODO: compareNatural for DenseMatrix
  describe.skip('DenseMatrix', function () {

    it('should compare dense matrix - scalar', function () {
      assert.deepEqual(compareNatural('B', matrix(['A', 'B', 'C'])), matrix([1, 0, -1]));
      assert.deepEqual(compareNatural(matrix(['A', 'B', 'C']), 'B'), matrix([-1, 0, 1]));
    });

    it('should compare dense matrix - array', function () {
      assert.deepEqual(compareNatural(matrix([[1, 2, 0], [-1, 0, 2]]), [[3, -1, 0], [-2, 1, 0]]), matrix([[-1, 1, 0], [1, -1, 1]]));
    });

    it('should compare dense matrix - dense matrix', function () {
      assert.deepEqual(compareNatural(matrix([[1, 2, 0], [-1, 0, 2]]), matrix([[3, -1, 0], [-2, 1, 0]])), matrix([[-1, 1, 0], [1, -1, 1]]));
    });

    it('should compare dense matrix - sparse matrix', function () {
      assert.deepEqual(compareNatural(matrix([[1, 2, 0], [-1, 0, 2]]), sparse([[3, -1, 0], [-2, 1, 0]])), matrix([[-1, 1, 0], [1, -1, 1]]));
    });
  });

  // TODO: compareNatural for SparseMatrix
  describe.skip('SparseMatrix', function () {

    it('should compare sparse matrix - scalar', function () {
      assert.deepEqual(compareNatural('B', sparse([['A', 'B'], ['C', 'X']])), matrix([[1, 0], [-1, -1]]));
      assert.deepEqual(compareNatural(sparse([['A', 'B'], ['C', 'X']]), 'B'), matrix([[-1, 0], [1, 1]]));
    });

    it('should compare sparse matrix - array', function () {
      assert.deepEqual(compareNatural(sparse([[1, 2, 0], [-1, 0, 2]]), [[3, -1, 0], [-2, 1, 0]]), matrix([[-1, 1, 0], [1, -1, 1]]));
    });

    it('should compare sparse matrix - dense matrix', function () {
      assert.deepEqual(compareNatural(sparse([[1, 2, 0], [-1, 0, 2]]), matrix([[3, -1, 0], [-2, 1, 0]])), matrix([[-1, 1, 0], [1, -1, 1]]));
    });

    it('should compare sparse matrix - sparse matrix', function () {
      assert.deepEqual(compareNatural(sparse([[1, 2, 0], [-1, 0, 2]]), sparse([[3, -1, 0], [-2, 1, 0]])), sparse([[-1, 1, 0], [1, -1, 1]]));
    });
  });

  it('should apply configuration option epsilon', function() {
    var mymath = math.create();

    assert.equal(mymath.compareNatural(1, 0.991), 1);
    assert.equal(mymath.compareNatural(math.bignumber(1), math.bignumber(0.991)).valueOf(), 1);

    mymath.config({epsilon: 1e-2});
    assert.equal(mymath.compareNatural(1, 0.991), 0);
    assert.equal(mymath.compareNatural(math.bignumber(1), math.bignumber(0.991)), 0);
  });

  describe('Complex Numbers', function () {

    it('should naturally compare complex numbers', function() {
      assert.equal(compareNatural(complex(1,1), complex(1,1)), 0);
      assert.equal(compareNatural(complex(2,1), complex(1,2)), 1);
      assert.equal(compareNatural(complex(0,1), complex(1,2)), -1);
    });

    it('should naturally compare complex number and number', function() {
      assert.equal(compareNatural(complex(1,0), 1), 0);
      assert.equal(compareNatural(complex(2,1), 1), 1);
      assert.equal(compareNatural(complex(0,1), 1), -1);
      assert.equal(compareNatural(1, complex(1,0)), 0);
      assert.equal(compareNatural(1, complex(2,1)), -1);
      assert.equal(compareNatural(1, complex(0,1)), 1);
    });

    it('should naturally compare complex number and bignumber', function() {
      assert.equal(compareNatural(complex(1,0), math.bignumber(1)), 0);
      assert.equal(compareNatural(complex(2,1), math.bignumber(1)), 1);
      assert.equal(compareNatural(complex(0,1), math.bignumber(1)), -1);
      assert.equal(compareNatural(math.bignumber(1), complex(1,0)), 0);
      assert.equal(compareNatural(math.bignumber(1), complex(2,1)), -1);
      assert.equal(compareNatural(math.bignumber(1), complex(0,1)), 1);
    });
  });

  it('should throw an error if matrices are different sizes', function() {
    assert.throws(function () {compareNatural([1,4,6], [3,4]);});
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {compareNatural(1);}, /TypeError: Too few arguments/);
    assert.throws(function () {compareNatural(1, 2, 3);}, /TypeError: Too many arguments/);
  });

  it('should LaTeX compare', function () {
    var expression = math.parse('compareNatural(1,2)');
    assert.equal(expression.toTex(), '\\mathrm{compareNatural}\\left(1,2\\right)');
  });
});
