// test the contents of index.js
var assert = require('assert'),
    index = require('../../../lib/expression/node/index');

describe('node/index', function() {

  it('should contain all nodes', function() {
    assert.equal(index.length, 14);
  });

});
