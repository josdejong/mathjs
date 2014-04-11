// test error types

var assert = require('assert'),
    error = require('../../lib/util/error');

describe('error', function () {

  describe('ArgumentsError', function () {

    it('should construct an ArgumentsError without max', function () {
      var err = new error.ArgumentsError('myfunction', 1, 2);
      assert(err instanceof Error);
      assert(err instanceof error.ArgumentsError);
      assert.equal(err.toString(), 'ArgumentsError: Wrong number of arguments in function myfunction (1 provided, 2 expected)');
    });

    it('should construct an ArgumentsError with max', function () {
      var err = new error.ArgumentsError('myfunction', 1, 2, 3);
      assert(err instanceof Error);
      assert(err instanceof error.ArgumentsError);
      assert.equal(err.toString(), 'ArgumentsError: Wrong number of arguments in function myfunction (1 provided, 2-3 expected)');
    });

    it('should throw an error when operator new is missing', function () {
      assert.throws(function () {error.ArgumentsError();}, SyntaxError);
    });

  });

  describe('DimensionError', function () {

    it('should construct a DimensionError with numbers', function () {
      var err = new error.DimensionError(3, 5);
      assert(err instanceof Error);
      assert(err instanceof RangeError);
      assert(err instanceof error.DimensionError);
      assert.equal(err.toString(), 'DimensionError: Dimension mismatch (3 != 5)');
    });

    it('should construct a DimensionError with numbers and a custom relation', function () {
      var err = new error.DimensionError(3, 5, '<');
      assert(err instanceof Error);
      assert(err instanceof RangeError);
      assert(err instanceof error.DimensionError);
      assert.equal(err.toString(), 'DimensionError: Dimension mismatch (3 < 5)');
    });

    it('should construct a DimensionError with arrays', function () {
      var err = new error.DimensionError([2,3], [1,3]);
      assert(err instanceof Error);
      assert(err instanceof RangeError);
      assert(err instanceof error.DimensionError);
      assert.equal(err.toString(), 'DimensionError: Dimension mismatch ([2, 3] != [1, 3])');
    });

    it('should construct a DimensionError with arrays and a custom relation', function () {
      var err = new error.DimensionError([2,3], [1,3], '<');
      assert(err instanceof Error);
      assert(err instanceof RangeError);
      assert(err instanceof error.DimensionError);
      assert.equal(err.toString(), 'DimensionError: Dimension mismatch ([2, 3] < [1, 3])');
    });

    it('should throw an error when operator new is missing', function () {
      assert.throws(function () {error.DimensionError(3, 5);}, SyntaxError);
    });

  });

  describe('IndexError', function () {

    it('should construct an IndexError without min and max', function () {
      var err = new error.IndexError(5);
      assert(err instanceof Error);
      assert(err instanceof RangeError);
      assert(err instanceof error.IndexError);
      assert.equal(err.toString(), 'IndexError: Index out of range (5)');
    });

    it('should construct an IndexError without min and max (2)', function () {
      var err = new error.IndexError(-5);
      assert(err instanceof Error);
      assert(err instanceof RangeError);
      assert(err instanceof error.IndexError);
      assert.equal(err.toString(), 'IndexError: Index out of range (-5 < 0)');
    });

    it('should construct an IndexError with max', function () {
      var err = new error.IndexError(5, 3);
      assert(err instanceof Error);
      assert(err instanceof RangeError);
      assert(err instanceof error.IndexError);
      assert.equal(err.toString(), 'IndexError: Index out of range (5 > 2)');
    });

    it('should construct an IndexError with min and max', function () {
      var err = new error.IndexError(0, 2, 5);
      assert(err instanceof Error);
      assert(err instanceof RangeError);
      assert(err instanceof error.IndexError);
      assert.equal(err.toString(), 'IndexError: Index out of range (0 < 2)');
    });

    it('should construct an IndexError with min and max', function () {
      var err = new error.IndexError(6, 1, 4);
      assert(err instanceof Error);
      assert(err instanceof RangeError);
      assert(err instanceof error.IndexError);
      assert.equal(err.toString(), 'IndexError: Index out of range (6 > 3)');
    });

  });

  describe('UnsupportedTypeError', function () {

    it('should construct an UnsupportedTypeError with no argument', function () {
      var err = new error.UnsupportedTypeError();
      assert(err instanceof Error);
      assert(err instanceof error.UnsupportedTypeError);
      assert.equal(err.toString(), 'UnsupportedTypeError: Unsupported type of argument');
    });

    it('should construct an UnsupportedTypeError with one argument', function () {
      var err = new error.UnsupportedTypeError('myfunction');
      assert(err instanceof Error);
      assert(err instanceof error.UnsupportedTypeError);
      assert.equal(err.toString(), 'UnsupportedTypeError: Unsupported type of argument in function myfunction');
    });

    it('should construct an UnsupportedTypeError with two arguments', function () {
      var err = new error.UnsupportedTypeError('myfunction', 'number');
      assert(err instanceof Error);
      assert(err instanceof error.UnsupportedTypeError);
      assert.equal(err.toString(), 'UnsupportedTypeError: Function myfunction(number) not supported');
    });

    it('should construct an UnsupportedTypeError with three arguments', function () {
      var err = new error.UnsupportedTypeError('myfunction', 'number', 'string');
      assert(err instanceof Error);
      assert(err instanceof error.UnsupportedTypeError);
      assert.equal(err.toString(), 'UnsupportedTypeError: Function myfunction(number, string) not supported');
    });

    it('should construct an UnsupportedTypeError with more than three arguments', function () {
      var err = new error.UnsupportedTypeError('myfunction', 'number', 'string', 'date');
      assert(err instanceof Error);
      assert(err instanceof error.UnsupportedTypeError);
      assert.equal(err.toString(), 'UnsupportedTypeError: Function myfunction(number, string, date) not supported');
    });

    it('should throw an error when operator new is missing', function () {
      assert.throws(function () {error.UnsupportedTypeError();}, SyntaxError);
    });

  });

});
