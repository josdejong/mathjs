var assert = require('assert'),
    DimensionError = require('../../lib/error/DimensionError');

describe('DimensionError', function () {

  it('should construct a DimensionError with numbers', function () {
    var err = new DimensionError(3, 5);
    assert(err instanceof Error);
    assert(err instanceof RangeError);
    assert(err instanceof DimensionError);
    assert.equal(err.toString(), 'DimensionError: Dimension mismatch (3 != 5)');
  });

  it('should construct a DimensionError with numbers and a custom relation', function () {
    var err = new DimensionError(3, 5, '<');
    assert(err instanceof Error);
    assert(err instanceof RangeError);
    assert(err instanceof DimensionError);
    assert.equal(err.toString(), 'DimensionError: Dimension mismatch (3 < 5)');
  });

  it('should construct a DimensionError with arrays', function () {
    var err = new DimensionError([2,3], [1,3]);
    assert(err instanceof Error);
    assert(err instanceof RangeError);
    assert(err instanceof DimensionError);
    assert.equal(err.toString(), 'DimensionError: Dimension mismatch ([2, 3] != [1, 3])');
  });

  it('should construct a DimensionError with arrays and a custom relation', function () {
    var err = new DimensionError([2,3], [1,3], '<');
    assert(err instanceof Error);
    assert(err instanceof RangeError);
    assert(err instanceof DimensionError);
    assert.equal(err.toString(), 'DimensionError: Dimension mismatch ([2, 3] < [1, 3])');
  });

  it('should throw an error when operator new is missing', function () {
    assert.throws(function () {DimensionError(3, 5);}, SyntaxError);
  });

});
