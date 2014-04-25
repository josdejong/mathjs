var assert = require('assert'),
    error = require('../../lib/error/index');

describe('index.js', function () {

  it('should contain error namespace', function () {
    assert.equal(typeof error, 'object');
    assert('ArgumentsError' in error);
    assert('DimensionError' in error);
    assert('IndexError' in error);
    assert('UnsupportedTypeError' in error);
  });

});