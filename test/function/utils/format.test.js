// test format
var assert = require('assert'),
    error = require('../../../lib/error/index'),
    math = require('../../../index');

describe('format', function() {

  it('should format numbers', function() {
    assert.equal(math.format(2/7), '0.2857142857142857');
    assert.equal(math.format(0.10400), '0.104');
    assert.equal(math.format(2.3), '2.3');
    assert.equal(math.format(2.3e6), '2.3e+6');
  });

  it('should format strings', function() {
    assert.equal(math.format('hello'), '"hello"');
  });

  it('should format arrays', function() {
    assert.equal(math.format([[1,2],[3,4]]), '[[1, 2], [3, 4]]');
    var array = [[math.unit(2/3, 'm'), 2/7],['hi', math.complex(2,1/3)]];
    assert.equal(math.format(array, 5), '[[0.66667 m, 0.28571], ["hi", 2 + 0.33333i]]');
  });

  it('should format complex values', function() {
    assert.equal(math.format(math.divide(math.complex(2,5),3)), '0.6666666666666666 + 1.6666666666666667i');
    assert.equal(math.format(math.divide(math.complex(2,5),3), 5), '0.66667 + 1.6667i');
    assert.equal(math.format(math.divide(math.complex(2,5),3), {notation: 'fixed'}), '1 + 2i');
    assert.equal(math.format(math.divide(math.complex(2,5),3), {notation: 'fixed', precision: 1}), '0.7 + 1.7i');
  });

  describe('precision', function() {
    it('should format numbers with given precision', function() {
      assert.equal(math.format(1/3), '0.3333333333333333');
      assert.equal(math.format(1/3, 3), '0.333');
      assert.equal(math.format(1/3, 4), '0.3333');
      assert.equal(math.format(1/3, 5), '0.33333');
      assert.equal(math.format(math.complex(1/3, 2), 3), '0.333 + 2i');
    });

    it('should format complex numbers with given precision', function() {
      assert.equal(math.format(math.complex(1/3, 1/3), 3), '0.333 + 0.333i');
      assert.equal(math.format(math.complex(1/3, 1/3), 4), '0.3333 + 0.3333i');
    });

    it('should format matrices with given precision', function() {
      assert.equal(math.format([1/3, 1/3], 3), '[0.333, 0.333]');
      assert.equal(math.format([1/3, 1/3], 4), '[0.3333, 0.3333]');
      assert.equal(math.format(math.matrix([1/3, 1/3]), 4), '[0.3333, 0.3333]');
    });

    it('should format units with given precision', function() {
      assert.equal(math.format(math.unit(2/3, 'm'), 3), '0.667 m');
      assert.equal(math.format(math.unit(2/3, 'm'), 4), '0.6667 m');
    });

    it('should format ranges with given precision', function() {
      assert.equal(math.format(new math.type.Range(1/3, 4/3, 2/3), 3), '0.333:0.667:1.33');
    });

  });

  describe('bignumber', function () {
    var bigmath = math.create({precision: 20}); // ensure the precision is 20 digits

    it('should format big numbers', function() {
      assert.equal(math.format(bigmath.bignumber(2).dividedBy(7)), '0.28571428571428571429');
      assert.equal(math.format(bigmath.bignumber(0.10400)), '0.104');
      assert.equal(math.format(bigmath.bignumber(2.3)), '2.3');
      assert.equal(math.format(bigmath.bignumber(2.3e6)), '2.3e+6');
    });

    it('should format big numbers with given precision', function() {
      var oneThird = bigmath.bignumber(1).div(3);
      assert.equal(bigmath.format(oneThird), '0.33333333333333333333'); // 20 digits
      assert.equal(bigmath.format(oneThird, 3), '0.333');
      assert.equal(bigmath.format(oneThird, 4), '0.3333');
      assert.equal(bigmath.format(oneThird, 5), '0.33333');
      assert.equal(bigmath.format(oneThird, 18), '0.333333333333333333');
    });
  });

  it('should throw an error on wrong number of arguments', function() {
    assert.throws (function () {math.format()}, error.ArgumentsError);
    assert.throws (function () {math.format(1, 2, 3)}, error.ArgumentsError);
  });

});