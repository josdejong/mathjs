var assert = require('assert'),
    mathjs = require('../../../index'),
    math = mathjs(),
    range = math.range,
    matrix = math.matrix;

describe('range', function() {

  it('should parse a valid string correctly', function() {
    assert.deepEqual(range('1:6'), matrix([1,2,3,4,5]));
    assert.deepEqual(range('0:2:10'), matrix([0,2,4,6,8]));
    assert.deepEqual(range('5:-1:0'), matrix([5,4,3,2,1]));
    assert.deepEqual(range('2:-2:-3'), matrix([2,0,-2]));
  });

  it('should create a range start:1:end if called with 2 numbers', function() {
    assert.deepEqual(range(3,6), matrix([3,4,5]));
    assert.deepEqual(range(1,6), matrix([1,2,3,4,5]));
    assert.deepEqual(range(1,6.1), matrix([1,2,3,4,5,6]));
    assert.deepEqual(range(1,5.9), matrix([1,2,3,4,5]));
    assert.deepEqual(range(6,1), matrix([]));
  });

  it('should create a range start:step:end if called with 3 numbers', function() {
    assert.deepEqual(range(0,10,2), matrix([0,2,4,6,8]));
    assert.deepEqual(range(5,0,-1), matrix([5,4,3,2,1]));
    assert.deepEqual(range(2,-4,-2), matrix([2,0,-2]));
  });

  it('should output an array when setting matrix==="array"', function() {
    var math2 = mathjs({
      matrix: 'array'
    });

    assert.deepEqual(math2.range(0,10,2), [0,2,4,6,8]);
    assert.deepEqual(math2.range(5,0,-1), [5,4,3,2,1]);
  });

  it('should create a range with bignumbers', function() {
    assert.deepEqual(range(math.bignumber(1), math.bignumber(3)), matrix([math.bignumber(1),math.bignumber(2)]));
  });

  it('should create a range with mixed numbers and bignumbers', function() {
    assert.deepEqual(range(math.bignumber(1), 3), matrix([math.bignumber(1),math.bignumber(2)]));
    assert.deepEqual(range(1, math.bignumber(3)), matrix([math.bignumber(1),math.bignumber(2)]));

    assert.deepEqual(range(1, math.bignumber(3), math.bignumber(1)), matrix([math.bignumber(1),math.bignumber(2)]));
    assert.deepEqual(range(math.bignumber(1), 3, math.bignumber(1)), matrix([math.bignumber(1),math.bignumber(2)]));
    assert.deepEqual(range(math.bignumber(1), math.bignumber(3), 1), matrix([math.bignumber(1),math.bignumber(2)]));

    assert.deepEqual(range(math.bignumber(1), 3, 1), matrix([math.bignumber(1),math.bignumber(2)]));
    assert.deepEqual(range(1, math.bignumber(3), 1), matrix([math.bignumber(1),math.bignumber(2)]));
    assert.deepEqual(range(1, 3, math.bignumber(1)), matrix([math.bignumber(1),math.bignumber(2)]));
  });

  it('should parse a range with bignumbers', function() {
    var math = mathjs({
      number: 'bignumber'
    });
    assert.deepEqual(math.range('1:3'), matrix([math.bignumber(1),math.bignumber(2)]));
  });

  describe ('option includeEnd', function () {
    it('should parse a string and include end', function () {
      assert.deepEqual(range('1:6', false), matrix([1,2,3,4,5]));
      assert.deepEqual(range('1:6', true), matrix([1,2,3,4,5,6]));
    });

    it('should create a range start:1:end and include end', function () {
      assert.deepEqual(range(3,6, false), matrix([3,4,5]));
      assert.deepEqual(range(3,6, true), matrix([3,4,5,6]));
    });

    it('should create a range start:step:end and include end', function () {
      assert.deepEqual(range(0,10,2, false), matrix([0,2,4,6,8]));
      assert.deepEqual(range(0,10,2, true), matrix([0,2,4,6,8,10]));
    });
  });

  it('should throw an error if called with an invalid string', function() {
    assert.throws(function () {range('invalid range')}, SyntaxError);
  });

  it('should throw an error if called with a single number', function() {
    assert.throws(function () {range(2)}, TypeError);
  });

  it('should throw an error if called with a unit', function() {
    assert.throws(function () {range(math.unit('5cm'))}, TypeError);
  });

  it('should throw an error if called with a complex number', function() {
    assert.throws(function () {range(math.complex(2,3))}, TypeError);
  });

  it('should throw an error if called with one invalid argument', function() {  
    assert.throws(function () {range(2, 'string')}, TypeError);
    assert.throws(function () {range(math.unit('5cm'), 2)}, TypeError);
    assert.throws(function () {range(2, math.complex(2,3))}, TypeError);
    assert.throws(function () {range(2, 'string', 3)}, TypeError);
    assert.throws(function () {range(2, 1, math.unit('5cm'))}, TypeError);
    assert.throws(function () {range(math.complex(2,3), 1, 3)}, TypeError);
  });

  it('should throw an error if called with an invalid number of arguments', function() {
    assert.throws(function () {range()}, SyntaxError);
    assert.throws(function () {range(1,2,3,4)}, SyntaxError);
  });
});