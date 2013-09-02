// test add
var assert = require('assert');
var math = require('../../../index.js'),
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

  it('should add mixed numbers and booleans', function() {
    assert.equal(add(2, true), 3);
    assert.equal(add(2, false), 2);
    assert.equal(add(true, 2), 3);
    assert.equal(add(false, 2), 2);
  });

  it('should add two complex numbers', function() {
    assert.equal(add(math.complex(3, -4), math.complex(8, 2)), '11 - 2i');
    assert.equal(add(math.complex(3, -4), 10), '13 - 4i');
    assert.equal(add(10, math.complex(3, -4)), '13 - 4i');
  });

  it('should add two measures of the same unit', function() {
    assert.equal(add(math.unit(5, 'km'), math.unit(100, 'mile')).toString(), '165.93 km');
  });

  it('should throw an error for two measures of different units', function() {
    assert.throws(function () {
      add(math.unit(5, 'km'), math.unit(100, 'gram'));
    });
  });

  it('should concatenate two strings', function() {
    assert.equal(add('hello ', 'world'), 'hello world');
    assert.equal(add('str', 123), 'str123');
    assert.equal(add(123, 'str'), '123str');
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

});
