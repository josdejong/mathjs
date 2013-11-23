// test select (chaining of operations)
var assert = require('assert'),
    approx = require('../../tools/approx'),
    math = require('../../index')();

describe('select', function() {

  it('should chain operations with numbers', function() {
    assert.ok(math.select(45) instanceof math.chaining.Selector);
    assert.equal(math.select(3).add(4).subtract(2).done(), 5);
    assert.equal(math.select(0).add(3).done(), 3);
  });

  it('should chain operations with bignumbers', function() {
    var result = math.select(math.bignumber(3))
        .add(4)
        .subtract(math.bignumber(2))
        .done();
    assert.deepEqual(result, math.bignumber(5));
  });

  it('should chain operations with constants', function() {
    approx.equal(math.select().pi.done(), Math.PI);
    approx.deepEqual(math.select().i.multiply(2).add(3).done(), math.complex(3, 2));
    approx.equal(math.select().pi.divide(4).sin().pow(2).done(), 0.5);
  });

  it('should chain operations with matrices', function() {
    assert.deepEqual(math.select(math.matrix([[1,2],[3,4]]))
        .subset(math.index(0,0), 8)
        .multiply(3).done(), math.matrix([[24, 6], [9, 12]]));
    assert.deepEqual(math.select([[1,2],[3,4]])
        .subset(math.index(0,0), 8)
        .multiply(3).done(), [[24, 6], [9, 12]]);
  });

  it('should get string representation', function() {
    assert.equal(math.select(5.2).toString(), '5.2');
  });

  it('should not break with null as value', function() {
    assert.equal(math.select(null).add('').done(), 'null');
  });

  it('should throw an error if called with wrong input', function() {
    assert.throws(function () {math.select().add(2).done()}, TypeError);
    assert.throws(function () {math.select(undefined).add(2).done()}, TypeError);
  });

});