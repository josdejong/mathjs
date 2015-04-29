// test add
var assert = require('assert');
var approx = require('../../../tools/approx');
var math = require('../../../index');
var BigNumber = require('decimal.js');
var add = math.add;

// TODO: make unit tests independent of math
describe('add', function() {

  it('should add two numbers', function() {
    assert.equal(add(2, 3), 5);
    assert.equal(add(-2, 3), 1);
    assert.equal(add(2, -3), -1);
    assert.equal(add(-5, -3), -8);
  });

  it('should add booleans', function() {
    assert.equal(add(true, true), 2);
    assert.equal(add(true, false), 1);
    assert.equal(add(false, true), 1);
    assert.equal(add(false, false), 0);
  });

  it('should add numbers and null', function () {
    assert.equal(math.add(null, null), 0);
    assert.equal(math.add(null, 1), 1);
    assert.equal(math.add(1, null), 1);
  });

  it('should add mixed numbers and booleans', function() {
    assert.equal(add(2, true), 3);
    assert.equal(add(2, false), 2);
    assert.equal(add(true, 2), 3);
    assert.equal(add(false, 2), 2);
  });

  it('should add BigNumbers', function() {
    assert.deepEqual(add(new BigNumber(0.1), new BigNumber(0.2)), new BigNumber(0.3));
    assert.deepEqual(add(new BigNumber('2e5001'), new BigNumber('3e5000')), new BigNumber('2.3e5001'));
    assert.deepEqual(add(new BigNumber('9999999999999999999'), new BigNumber('1')), new BigNumber('1e19'));
  });

  it('should add mixed numbers and BigNumbers', function() {
    assert.deepEqual(add(new BigNumber(0.1), 0.2), new BigNumber(0.3));
    assert.deepEqual(add(0.1, new BigNumber(0.2)), new math.type.BigNumber(0.3));

    assert.throws(function () {add(1/3, new BigNumber(1));}, /Cannot implicitly convert a number with >15 significant digits to BigNumber/);
    assert.throws(function () {add(new BigNumber(1), 1/3);}, /Cannot implicitly convert a number with >15 significant digits to BigNumber/);
  });

  it('should add mixed booleans and BigNumbers', function() {
    assert.deepEqual(add(new BigNumber(0.1), true), new BigNumber(1.1));
    assert.deepEqual(add(new BigNumber(0.1), false), new BigNumber(0.1));
    assert.deepEqual(add(false, new BigNumber(0.2)), new math.type.BigNumber(0.2));
    assert.deepEqual(add(true, new BigNumber(0.2)), new math.type.BigNumber(1.2));
  });

  it('should add mixed complex numbers and BigNumbers', function() {
    assert.deepEqual(add(math.complex(3, -4), new BigNumber(2)), math.complex(5, -4));
    assert.deepEqual(add(new BigNumber(2), math.complex(3, -4)), math.complex(5, -4));
  });

  it('should add two complex numbers', function() {
    assert.equal(add(math.complex(3, -4), math.complex(8, 2)), '11 - 2i');
    assert.equal(add(math.complex(3, -4), 10), '13 - 4i');
    assert.equal(add(10, math.complex(3, -4)), '13 - 4i');
  });

  it('should add two measures of the same unit', function() {
    approx.deepEqual(add(math.unit(5, 'km'), math.unit(100, 'mile')), math.unit(165.93, 'km'));
  });

  it('should throw an error for two measures of different units', function() {
    assert.throws(function () {
      add(math.unit(5, 'km'), math.unit(100, 'gram'));
    });
  });

  it('should throw an error when one of the two units has undefined value', function() {
    assert.throws(function () {
      add(math.unit('km'), math.unit('5gram'));
    }, /Parameter x contains a unit with undefined value/);
    assert.throws(function () {
      add(math.unit('5 km'), math.unit('gram'));
    }, /Parameter y contains a unit with undefined value/);
  });

  it('should throw an error in case of a unit and non-unit argument', function() {
    assert.throws(function () {add(math.unit('5cm'), 2);}, /TypeError/);
    assert.throws(function () {add(math.unit('5cm'), new Date());}, /TypeError/);
    assert.throws(function () {add(new Date(), math.unit('5cm'));}, /TypeError/);
  });

  it('should concatenate two strings', function() {
    assert.equal(add('hello ', 'world'), 'hello world');
    assert.equal(add('str', 123), 'str123');
    assert.equal(add(123, 'str'), '123str');
  });
  
  describe('Array', function () {
    
    it('should concatenate strings and array element wise', function() {
      assert.deepEqual(add('A', ['B', 'C']), ['AB', 'AC']);
      assert.deepEqual(add(['B', 'C'], 'A'), ['BA', 'CA']);
    });
    
    it('should add arrays correctly', function() {
      var a2 = [[1,2],[3,4]];
      var a3 = [[5,6],[7,8]];
      var a4 = add(a2, a3);
      assert.deepEqual(a4, [[6,8],[10,12]]);
    });
    
    it('should add a scalar and an array correctly', function() {
      assert.deepEqual(add(2, [3,4]), [5,6]);
      assert.deepEqual(add([3,4], 2), [5,6]);
    });

    it('should add array and dense matrix correctly', function() {
      var a = [1,2,3];
      var b = math.matrix([3,2,1]);
      var c = add(a, b);

      assert.ok(c instanceof math.type.Matrix);
      assert.deepEqual(c, math.matrix([4,4,4]));
    });
    
    it('should add array and sparse matrix correctly', function() {
      var a = [[1,2,3],[4,5,6]];
      var b = math.sparse([[6, 5, 4],[ 3, 2, 1]]);
      var c = add(a, b);

      assert.ok(c instanceof math.type.Matrix);
      assert.deepEqual(c, math.matrix([[7,7,7],[7,7,7]]));
    });
  });

  describe('DenseMatrix', function () {
    
    it('should concatenate strings and matrices element wise', function() {
      assert.deepEqual(add('A', math.matrix(['B', 'C'])), math.matrix(['AB', 'AC']));
      assert.deepEqual(add(math.matrix(['B', 'C']), 'A'), math.matrix(['BA', 'CA']));
    });
    
    it('should add matrices correctly', function() {
      var a2 = math.matrix([[1,2],[3,4]]);
      var a3 = math.matrix([[5,6],[7,8]]);
      var a4 = add(a2, a3);
      assert.ok(a4 instanceof math.type.Matrix);
      assert.deepEqual(a4.size(), [2,2]);
      assert.deepEqual(a4.valueOf(), [[6,8],[10,12]]);
    });
    
    it('should add a scalar and a matrix correctly', function() {
      assert.deepEqual(add(2, math.matrix([3,4])), math.matrix([5,6]));
      assert.deepEqual(add(math.matrix([3,4]), 2), math.matrix([5,6]));
    });

    it('should add matrix and array correctly', function() {
      var a = math.matrix([1,2,3]);
      var b = [3,2,1];
      var c = add(a, b);

      assert.ok(c instanceof math.type.Matrix);
      assert.deepEqual(c, math.matrix([4,4,4]));
    });
    
    it('should add dense and sparse matrices correctly', function() {
      var a = math.matrix([[1,2,3],[1,0,0]]);
      var b = math.sparse([[3,2,1],[0,0,1]]);
      var c = add(a, b);

      assert.ok(c instanceof math.type.Matrix);
      assert.deepEqual(c, math.matrix([[4,4,4],[1,0,1]]));
    });
  });
  
  describe('SparseMatrix', function () {

    it('should add matrices correctly', function() {
      var a2 = math.matrix([[1,2],[3,4]], 'sparse');
      var a3 = math.matrix([[5,-2],[7,-4]], 'sparse');
      var a4 = add(a2, a3);
      assert.ok(a4 instanceof math.type.Matrix);
      assert.deepEqual(a4, math.sparse([[6,0],[10,0]]));
    });

    it('should add a scalar and a matrix correctly', function() {
      assert.deepEqual(add(2, math.matrix([[3,4],[5,6]], 'sparse')), math.matrix([[5,6],[7,8]], 'sparse'));
      assert.deepEqual(add(math.matrix([[3,4],[5,6]], 'sparse'), 2), math.matrix([[5,6],[7,8]], 'sparse'));
    });

    it('should add matrix and array correctly', function() {
      var a = math.matrix([[1,2,3],[1,0,0]], 'sparse');
      var b = [[3,2,1],[0,0,1]];
      var c = add(a, b);

      assert.ok(c instanceof math.type.Matrix);
      assert.deepEqual(c, math.matrix([[4,4,4],[1,0,1]]));
    });
    
    it('should add sparse and dense matrices correctly', function() {
      var a = math.sparse([[1,2,3],[1,0,0]]);
      var b = math.matrix([[3,2,1],[0,0,1]]);
      var c = add(a, b);

      assert.ok(c instanceof math.type.Matrix);
      assert.deepEqual(c, math.matrix([[4,4,4],[1,0,1]]));
    });
    
    it('should add two pattern matrices correctly', function() {
      
      var a = new math.type.SparseMatrix({
        values: undefined,
        index: [0, 1, 2, 0],
        ptr: [0, 2, 3, 4],
        size: [3, 3]
      });
      
      var b = new math.type.SparseMatrix({
        values: undefined,
        index: [0, 1, 2, 1],
        ptr: [0, 3, 3, 4],
        size: [3, 3]
      });
      
      var c = add(a, b);
      
      assert.deepEqual(
        c, 
        new math.type.SparseMatrix({
          values: undefined,
          index: [0, 1, 2, 2, 0, 1],
          ptr: [0, 3, 4, 6],
          size: [3, 3]
        }));
    });
    
    it('should add pattern and value matrices correctly', function() {

      var a = new math.type.SparseMatrix({
        values: undefined,
        index: [0, 1, 2, 0],
        ptr: [0, 2, 3, 4],
        size: [3, 3]
      });

      var b = new math.type.SparseMatrix({
        values: [1, 2, 3, 4],
        index: [0, 1, 2, 1],
        ptr: [0, 3, 3, 4],
        size: [3, 3]
      });

      var c = add(a, b);

      assert.deepEqual(
        c, 
        new math.type.SparseMatrix({
          values: undefined,
          index: [0, 1, 2, 2, 0, 1],
          ptr: [0, 3, 4, 6],
          size: [3, 3]
        }));
    });
    
    it('should add value and pattern matrices correctly', function() {

      var a = new math.type.SparseMatrix({
        values: [1, 2, 3, 4],
        index: [0, 1, 2, 0],
        ptr: [0, 2, 3, 4],
        size: [3, 3]
      });

      var b = new math.type.SparseMatrix({
        values: undefined,
        index: [0, 1, 2, 1],
        ptr: [0, 3, 3, 4],
        size: [3, 3]
      });

      var c = add(a, b);

      assert.deepEqual(
        c, 
        new math.type.SparseMatrix({
          values: undefined,
          index: [0, 1, 2, 2, 0, 1],
          ptr: [0, 3, 4, 6],
          size: [3, 3]
        }));
    });
  });
  
  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {add(1);}, /TypeError: Too few arguments/);
    assert.throws(function () {add(1, 2, 3);}, /TypeError: Too many arguments/);
  });

  it('should LaTeX add', function () {
    var expression = math.parse('add(1,2)');
    assert.equal(expression.toTex(), '\\left(1+2\\right)');
  });

});
