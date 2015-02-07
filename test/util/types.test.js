// test types utils
var assert = require('assert'),
    approx = require('../../tools/approx'),
    types = require('../../lib/util/types');

describe ('types', function () {

  it('should return the type of null', function () {
    assert.equal(types.type(null), 'null');
  });

  it('should return the type of undefined', function () {
    assert.equal(types.type(undefined), 'undefined');
    assert.equal(types.type(), 'undefined');
  });

  it('should return the type of a boolean', function () {

    assert.equal(types.type(false), 'boolean');
    assert.equal(types.type(true), 'boolean');
  });

  it('should return the type of a number', function () {
    assert.equal(types.type(2.3), 'number');
    assert.equal(types.type(Number(2.3)), 'number');
    assert.equal(types.type(new Number(2.3)), 'number');
    assert.equal(types.type(NaN), 'number');
  });

  it('should return the type of a string', function () {
    assert.equal(types.type('bla'), 'string');
    assert.equal(types.type(new String('bla')), 'string');
  });

  it('should return the type of an object', function () {
    assert.equal(types.type({}), 'object');
    assert.equal(types.type(new Object()), 'object');
  });

  it('should return the type of an array', function () {
    assert.equal(types.type([]), 'array');
    assert.equal(types.type(new Array()), 'array');
  });

  it('should return the type of a function', function () {
    assert.equal(types.type(function () {}), 'function');
  });

  it('should return the type of a date', function () {
    assert.equal(types.type(new Date()), 'date');
  });

  it('should return the type of a regexp', function () {
    assert.equal(types.type(/regexp/), 'regexp');
  });

});