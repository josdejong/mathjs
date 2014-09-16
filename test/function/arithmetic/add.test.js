// test add
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    error = require('../../../lib/error/index'),
    math = require('../../../index'),
    bignumber = math.bignumber,
    add = math.add;

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

  it('should add bignumbers', function() {
    assert.deepEqual(add(bignumber(0.1), bignumber(0.2)), bignumber(0.3));
    assert.deepEqual(add(bignumber('2e5001'), bignumber('3e5000')), bignumber('2.3e5001'));
    assert.deepEqual(add(bignumber('9999999999999999999'), bignumber('1')), bignumber('1e19'));
  });

  it('should add mixed numbers and bignumbers', function() {
    assert.deepEqual(add(bignumber(0.1), 0.2), bignumber(0.3));
    assert.deepEqual(add(0.1, bignumber(0.2)), bignumber(0.3));

    approx.equal(add(1/3, bignumber(1)), 1.333333333333333);
    approx.equal(add(bignumber(1), 1/3), 1.333333333333333);
  });

  it('should add mixed booleans and bignumbers', function() {
    assert.deepEqual(add(bignumber(0.1), true), bignumber(1.1));
    assert.deepEqual(add(bignumber(0.1), false), bignumber(0.1));
    assert.deepEqual(add(false, bignumber(0.2)), bignumber(0.2));
    assert.deepEqual(add(true, bignumber(0.2)), bignumber(1.2));
  });

  it('should add mixed complex numbers and bignumbers', function() {
    assert.deepEqual(add(math.complex(3, -4), bignumber(2)), math.complex(5, -4));
    assert.deepEqual(add(bignumber(2), math.complex(3, -4)), math.complex(5, -4));
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
    assert.throws(function () {add(math.unit('5cm'), 2)}, math.error.UnsupportedTypeError);
    assert.throws(function () {add(math.unit('5cm'), new Date())}, math.error.UnsupportedTypeError);
    assert.throws(function () {add(new Date(), math.unit('5cm'))}, math.error.UnsupportedTypeError);
  });

  it('should concatenate two strings', function() {
    assert.equal(add('hello ', 'world'), 'hello world');
    assert.equal(add('str', 123), 'str123');
    assert.equal(add(123, 'str'), '123str');
  });

  it('should concatenate strings and matrices element wise', function() {
    assert.deepEqual(add('A', ['B', 'C']), ['AB', 'AC']);
    assert.deepEqual(add(['B', 'C'], 'A'), ['BA', 'CA']);

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
    var a5 = math.pow(a2, 2);
    assert.ok(a5 instanceof math.type.Matrix);
    assert.deepEqual(a5.size(), [2,2]);
    assert.deepEqual(a5.valueOf(), [[7,10],[15,22]]);
  });

  it('should add a scalar and a matrix correctly', function() {
    assert.deepEqual(add(2, math.matrix([3,4])), math.matrix([5,6]));
    assert.deepEqual(add(math.matrix([3,4]), 2), math.matrix([5,6]));
  });

  it('should add a scalar and an array correctly', function() {
    assert.deepEqual(add(2, [3,4]), [5,6]);
    assert.deepEqual(add([3,4], 2), [5,6]);
  });

  it('should add a matrix and an array correctly', function() {
    var a = [1,2,3];
    var b = math.matrix([3,2,1]);
    var c = add(a, b);

    assert.ok(c instanceof math.type.Matrix);
    assert.deepEqual(c, math.matrix([4,4,4]));
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {add(1)}, error.ArgumentsError);
    assert.throws(function () {add(1, 2, 3)}, error.ArgumentsError);
  });

});
