// test select (chaining of operations)
var assert = require('assert'),
    approx = require('../../tools/approx'),
    math = require('../../index'),
    Selector = math.chaining.Selector;

describe('select', function() {

  it('should chain operations with numbers', function() {
    assert.equal(new Selector(3).add(4).subtract(2).done(), 5);
    assert.equal(new Selector(0).add(3).done(), 3);
  });

  it('should chain operations with bignumbers', function() {
    var result = new Selector(math.bignumber(3))
        .add(4)
        .subtract(math.bignumber(2))
        .done();
    assert.deepEqual(result, math.bignumber(5));
  });

  it('should chain operations with constants', function() {
    approx.equal(new Selector().pi.done(), Math.PI);
    approx.deepEqual(new Selector().i.multiply(2).add(3).done(), math.complex(3, 2));
    approx.equal(new Selector().pi.divide(4).sin().pow(2).done(), 0.5);
  });

  it('should chain operations with matrices', function() {
    assert.deepEqual(new Selector(math.matrix([[1,2],[3,4]]))
        .subset(math.index(0,0), 8)
        .multiply(3).done(), math.matrix([[24, 6], [9, 12]]));
    assert.deepEqual(new Selector([[1,2],[3,4]])
        .subset(math.index(0,0), 8)
        .multiply(3).done(), [[24, 6], [9, 12]]);
  });

  it('should get string representation', function() {
    assert.equal(new Selector(5.2).toString(), '5.2');
  });

  it('should get selectors value via valueOf', function() {
    assert.equal(new Selector(5.2).valueOf(), 5.2);
    assert.equal(new Selector(5.2) + 2, 7.2);
  });

  it('should create a selector from a selector', function() {
    var a = new Selector(2.3);
    var b = new Selector(a);
    assert.equal(a.done(), 2.3);
    assert.equal(b.done(), 2.3);
  });

  it('should not break with null as value', function() {
    assert.equal(new Selector(null).add('').done(), 'null');
  });

  it('should throw an error if called with wrong input', function() {
    assert.throws(function () {new Selector().add(2).done()}, TypeError);
    assert.throws(function () {new Selector(undefined).add(2).done()}, TypeError);
  });

  it('should throw an error if constructed without new keyword', function() {
    assert.throws(function () {Selector()}, SyntaxError);
  });

  it ('should not clear inherited properties', function () {
    Object.prototype.foo = 'bar';

    var selector = new Selector();

    assert.equal(selector.foo, 'bar');
    assert.equal(selector.hasOwnProperty('foo'), false);

    delete Object.prototype.foo;
  });

});