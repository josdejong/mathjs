var assert = require('assert'),
    math = require('../../../index.js'),
    range = math.range;

describe('range', function() {

  it('should parse a valid string correctly', function() {
    assert.deepEqual(range('1:6').valueOf(), [1,2,3,4,5]);
    assert.deepEqual(range('0:2:10').valueOf(), [0,2,4,6,8]);
    assert.deepEqual(range('5:-1:0').valueOf(), [5,4,3,2,1]);
    assert.deepEqual(range('2:-2:-3').valueOf(), [2,0,-2]);
  });

  it('should create a range start:1:end if called with 2 numbers', function() {
    var a = range(1,6);
    var b = range(a);
    a.start = 3;
    assert.deepEqual(a.valueOf(), [3,4,5]);
    assert.deepEqual(b.valueOf(), [1,2,3,4,5]);
    assert.deepEqual(range(1,6).valueOf(), [1,2,3,4,5]);
    assert.deepEqual(range(6,1).valueOf(), []);
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

  it('should create a range start:step:end if called with 3 numbers', function() {
    assert.deepEqual(range(0,10,2).valueOf(), [0,2,4,6,8]);
    assert.deepEqual(range(5,0,-1).valueOf(), [5,4,3,2,1]);
    assert.deepEqual(range(2,-4,-2).valueOf(), [2,0,-2]);
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