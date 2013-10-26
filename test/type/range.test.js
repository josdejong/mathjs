// test data type Range

var assert = require('assert'),
    math = require('../../index')(),
    Range = math.type.Range;

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

  it('should stringify a range to format start:step:end', function () {
    assert.equal(new math.type.Range(0,10).toString(), '0:10');
    assert.equal(new math.type.Range(0,10,2).toString(), '0:2:10');
  });

  it('should stringify a range to format start:step:end with given precision', function () {
    assert.equal(new math.type.Range(1/3, 4/3, 2/3).format(3), '0.333:0.667:1.33');
    assert.equal(new math.type.Range(1/3, 4/3, 2/3).format(4), '0.3333:0.6667:1.333');
    assert.equal(new math.type.Range(1/3, 4/3, 2/3).format(), '0.3333333333333333:0.6666666666666666:1.3333333333333333');
  });

});