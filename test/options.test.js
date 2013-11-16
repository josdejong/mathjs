// test options
var assert = require('assert'),
    math = require('../index')();


describe('options', function() {

  it('should have option matrix.defaultType', function() {
    assert.equal(math.options.matrix.defaultType, 'matrix');
  });

  it('should have option number.defaultType', function() {
    assert.equal(math.options.number.defaultType, 'number');
  });

});