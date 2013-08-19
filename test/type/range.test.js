// test data type Range

var assert = require('assert');
var math = require('../../index.js'),
    Range = math.type.Range;


var assert = require('assert');
var math = require('../../index.js'),
    index = math.index;

describe('range', function() {

  it('should create a range', function() {
    var r = new Range(2,6);
    assert.deepEqual(r.toArray(), [2,3,4,5]);
    assert.equal(r.size(), 4);
  });

  it('should create a range with custom step', function() {
    var r = new Range(10, 4, -1);
    assert.deepEqual(r.toArray(), [10,9,8,7,6,5]);
    assert.equal(r.size(), 6);
  });

  it('should create a range with floating points', function() {
    var r = new Range(1, 5.5, 1.5);
    assert.deepEqual(r.toArray(), [1,2.5,4]);
    assert.equal(r.size(), 3);
  });

  it('should create an empty range', function() {
    var r = new Range();
    assert.deepEqual(r.toArray(), []);
  });

  it('should create a range with only one value', function() {
    var r = new Range(0,1);
    assert.deepEqual(r.toArray(), [0]);
    assert.equal(r.size(), 1);
  });

  it('should create an empty range because of wrong step size', function() {
    var r = new Range(0,10,0);
    assert.deepEqual(r.toArray(), []);
    assert.equal(r.size(), 0);

    r = new Range(0,10,-1);
    assert.deepEqual(r.toArray(), []);
    assert.equal(r.size(), 0);
  });

  it('should create a range from a string', function() {
    var r = Range.parse('10:-1:4');
    assert.deepEqual(r.toArray(), [10,9,8,7,6,5]);
    assert.equal(r.size(), 6);

    r = Range.parse('2 : 6');
    assert.deepEqual(r.toArray(), [2,3,4,5]);
    assert.equal(r.size(), 4);
  });

  it('should return null when parsing an invalid string', function() {
    assert.equal(Range.parse('a:4'), null);
    assert.equal(Range.parse('3'), null);
    assert.equal(Range.parse(''), null);
  });

  // TODO: extensively test Range
});