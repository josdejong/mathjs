var assert = require('assert'),
    IndexError = require('../../lib/error/IndexError');

describe('IndexError', function () {

  it('should construct an IndexError without min and max', function () {
    var err = new IndexError(5);
    assert(err instanceof Error);
    assert(err instanceof RangeError);
    assert(err instanceof IndexError);
    assert.equal(err.toString(), 'IndexError: Index out of range (5)');
  });

  it('should construct an IndexError without min and max (2)', function () {
    var err = new IndexError(-5);
    assert(err instanceof Error);
    assert(err instanceof RangeError);
    assert(err instanceof IndexError);
    assert.equal(err.toString(), 'IndexError: Index out of range (-5 < 0)');
  });

  it('should construct an IndexError with max', function () {
    var err = new IndexError(5, 3);
    assert(err instanceof Error);
    assert(err instanceof RangeError);
    assert(err instanceof IndexError);
    assert.equal(err.toString(), 'IndexError: Index out of range (5 > 2)');
  });

  it('should construct an IndexError with min and max', function () {
    var err = new IndexError(0, 2, 5);
    assert(err instanceof Error);
    assert(err instanceof RangeError);
    assert(err instanceof IndexError);
    assert.equal(err.toString(), 'IndexError: Index out of range (0 < 2)');
  });

  it('should construct an IndexError with min and max', function () {
    var err = new IndexError(6, 1, 4);
    assert(err instanceof Error);
    assert(err instanceof RangeError);
    assert(err instanceof IndexError);
    assert.equal(err.toString(), 'IndexError: Index out of range (6 > 3)');
  });

});
