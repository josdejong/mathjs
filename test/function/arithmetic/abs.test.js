// test abs
var assert = require('assert');
var math = require('../../../src/index.js');

describe('abs', function () {

  it('parser', function () {
    assert.equal(math.eval('abs(-4.2)'), 4.2);
  });

  it('number', function () {
    assert.equal(math.abs(-4.2), 4.2);
    assert.equal(math.abs(-3.5), 3.5);
    assert.equal(math.abs(100), 100);
    assert.equal(math.abs(0), 0);
  });

  it('complex', function () {
    assert.equal(math.abs(math.complex(3, -4)), 5);
  });

  it('unit', function () {
    assert.throws(function () {
      math.abs(math.unit(5, 'km'));
    });
  });

  it('string', function () {
    assert.throws(function () {
      math.abs('a string');
    });
  });

  it('matrix, array', function () {
    var a1 = math.abs(math.matrix([1,-2,3]));
    assert.ok(a1 instanceof math.type.Matrix);
    assert.deepEqual(a1.size(), [3]);
    assert.deepEqual(a1.valueOf(), [1,2,3]);
    a1 = math.abs(math.range(-2,2));
    assert.ok(Array.isArray(a1));
    assert.deepEqual(a1.length, 5);
    assert.deepEqual(a1, [2,1,0,1,2])
  });

});
