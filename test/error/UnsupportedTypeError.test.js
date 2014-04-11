var assert = require('assert'),
    UnsupportedTypeError = require('../../lib/error/UnsupportedTypeError');

describe('UnsupportedTypeError', function () {

  it('should construct an UnsupportedTypeError with no argument', function () {
    var err = new UnsupportedTypeError();
    assert(err instanceof Error);
    assert(err instanceof UnsupportedTypeError);
    assert.equal(err.fn, undefined);
    assert.deepEqual(err.types, []);
    assert.equal(err.toString(), 'UnsupportedTypeError: Unsupported type of argument');
  });

  it('should construct an UnsupportedTypeError with one argument', function () {
    var err = new UnsupportedTypeError('myfunction');
    assert(err instanceof Error);
    assert(err instanceof UnsupportedTypeError);
    assert.equal(err.fn, 'myfunction');
    assert.deepEqual(err.types, []);
    assert.equal(err.toString(), 'UnsupportedTypeError: Unsupported type of argument in function myfunction');
  });

  it('should construct an UnsupportedTypeError with two arguments', function () {
    var err = new UnsupportedTypeError('myfunction', 'number');
    assert(err instanceof Error);
    assert(err instanceof UnsupportedTypeError);
    assert.equal(err.fn, 'myfunction');
    assert.deepEqual(err.types, ['number']);
    assert.equal(err.toString(), 'UnsupportedTypeError: Function myfunction(number) not supported');
  });

  it('should construct an UnsupportedTypeError with three arguments', function () {
    var err = new UnsupportedTypeError('myfunction', 'number', 'string');
    assert(err instanceof Error);
    assert(err instanceof UnsupportedTypeError);
    assert.equal(err.fn, 'myfunction');
    assert.deepEqual(err.types, ['number', 'string']);
    assert.equal(err.toString(), 'UnsupportedTypeError: Function myfunction(number, string) not supported');
  });

  it('should construct an UnsupportedTypeError with more than three arguments', function () {
    var err = new UnsupportedTypeError('myfunction', 'number', 'string', 'date');
    assert(err instanceof Error);
    assert(err instanceof UnsupportedTypeError);
    assert.equal(err.fn, 'myfunction');
    assert.deepEqual(err.types, ['number', 'string', 'date']);
    assert.equal(err.toString(), 'UnsupportedTypeError: Function myfunction(number, string, date) not supported');
  });

  it('should throw an error when operator new is missing', function () {
    assert.throws(function () {UnsupportedTypeError();}, SyntaxError);
  });

});
