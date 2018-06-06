// test the contents of index.js
var assert = require('assert');
var index = require('../../../src/expression/node/index');

describe('node/index', function() {

  it('should contain all nodes', function() {
    assert.equal(index.length, 16);
  });

});
