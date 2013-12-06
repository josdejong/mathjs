// test types utils
var assert = require('assert'),
    approx = require('../../tools/approx'),
    types = require('../../lib/util/types');

describe ('types', function () {

  it('type', function() {
    assert.equal(types.type(null), 'null');
    assert.equal(types.type(undefined), 'undefined');
    assert.equal(types.type(), 'undefined');
    assert.equal(types.type(false), 'boolean');
    assert.equal(types.type(true), 'boolean');
    assert.equal(types.type(2.3), 'number');
    assert.equal(types.type(Number(2.3)), 'number');
    assert.equal(types.type(new Number(2.3)), 'number');
    assert.equal(types.type('bla'), 'string');
    assert.equal(types.type(new String('bla')), 'string');
    assert.equal(types.type({}), 'object');
    assert.equal(types.type(new Object()), 'object');
    assert.equal(types.type([]), 'array');
    assert.equal(types.type(new Array()), 'array');
    assert.equal(types.type(new Date()), 'date');
  });

});