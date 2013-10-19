// test format
var assert = require('assert');
var math = require('../../../index.js');

describe('format', function() {

  it('should format numbers', function() {
    assert.equal(math.format(2/7), '0.28571');
    assert.equal(math.format(0.10400), '0.104');
    assert.equal(math.format(1000), '1000');
    assert.equal(math.format(2.3e-7), '2.3e-7');
    assert.equal(math.format(2.3e-6), '2.3e-6');
    assert.equal(math.format(2.3e-5), '2.3e-5');
    assert.equal(math.format(2.3e-4), '2.3e-4');
    assert.equal(math.format(2.3e-3), '0.0023');
    assert.equal(math.format(2.3e-2), '0.023');
    assert.equal(math.format(2.3e-1), '0.23');
    assert.equal(math.format(2.3), '2.3');
    assert.equal(math.format(2.3e1), '23');
    assert.equal(math.format(2.3e2), '230');
    assert.equal(math.format(2.3e3), '2300');
    assert.equal(math.format(2.3e4), '23000');
    assert.equal(math.format(2.3e5), '2.3e5');
    assert.equal(math.format(2.3e6), '2.3e6');
  });

  describe('precision', function() {
    it('should format numbers with given precision', function() {
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

  it('should format numbers with correct number of digits', function() {
    assert.equal(math.format(1000.000), '1000');
    assert.equal(math.format(1000.0010), '1000'); // rounded off at 5 digits
    assert.equal(math.format(math.pi), '3.1416');
    assert.equal(math.format(math.pi * 10000), '31416');
    assert.equal(math.format(math.pi / 100), '0.031416');
    assert.equal(math.format(math.e), '2.7183');
  });

  it('should format strings', function() {
    assert.equal(math.format('hello'), '"hello"');
  });

  it('should format arrays', function() {
    assert.equal(math.format([[1,2],[3,4]]), '[[1, 2], [3, 4]]');
    assert.equal(math.format([[math.unit(2/3, 'm'), 2/7],['hi', math.complex(2,1/3)]]),
        '[[0.66667 m, 0.28571], ["hi", 2 + 0.33333i]]');
  });

  it('should format complex values', function() {
    assert.equal(math.format(math.divide(math.complex(2,5),3)), '0.66667 + 1.6667i');
  });

});