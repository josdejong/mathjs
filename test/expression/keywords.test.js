// test keywords
var assert = require('assert'),
    keywords = require('../../src/expression/keywords');

describe('keywords', function() {

  it('should return a map with reserved keywords', function() {
    assert.deepEqual(Object.keys(keywords).sort(), ['end'].sort());
  });

});
