// test error types

var assert = require('assert'),
    math = require('../../index')();

describe('error', function () {

  describe('UnsupportedTypeError', function () {

    it('should construct an UnsupportedTypeError with no argument', function () {
      var err = new math.error.UnsupportedTypeError();
      assert(err instanceof Error);
      assert(err instanceof math.error.UnsupportedTypeError);
      assert.equal(err.toString(), 'UnsupportedTypeError: Unsupported type of argument');
    });

    it('should construct an UnsupportedTypeError with one argument', function () {
      var err = new math.error.UnsupportedTypeError('myfunction');
      assert(err instanceof Error);
      assert(err instanceof math.error.UnsupportedTypeError);
      assert.equal(err.toString(), 'UnsupportedTypeError: Unsupported type of argument in function myfunction');
    });

    it('should construct an UnsupportedTypeError with two arguments', function () {
      var err = new math.error.UnsupportedTypeError('myfunction', 2);
      assert(err instanceof Error);
      assert(err instanceof math.error.UnsupportedTypeError);
      assert.equal(err.toString(), 'UnsupportedTypeError: Function myfunction(number) not supported');
    });

    it('should construct an UnsupportedTypeError with three arguments', function () {
      var err = new math.error.UnsupportedTypeError('myfunction', 2, 'hi');
      assert(err instanceof Error);
      assert(err instanceof math.error.UnsupportedTypeError);
      assert.equal(err.toString(), 'UnsupportedTypeError: Function myfunction(number, string) not supported');
    });

    it('should construct an UnsupportedTypeError with more than three arguments', function () {
      var err = new math.error.UnsupportedTypeError('myfunction', 2, 'hi', new Date());
      assert(err instanceof Error);
      assert(err instanceof math.error.UnsupportedTypeError);
      assert.equal(err.toString(), 'UnsupportedTypeError: Function myfunction(number, string, date) not supported');
    });

    it('should throw an error when operator new is missing', function () {
      assert.throws(function () {math.error.UnsupportedTypeError();}, SyntaxError);
    });

  });

  describe('ArgumentsError', function () {

    it('should construct an ArgumentsError without max', function () {
      var err = new math.error.ArgumentsError('myfunction', 1, 2);
      assert(err instanceof Error);
      assert(err instanceof math.error.ArgumentsError);
      assert.equal(err.toString(), 'ArgumentsError: Wrong number of arguments in function myfunction (1 provided, 2 expected)');
    });

    it('should construct an ArgumentsError with max', function () {
      var err = new math.error.ArgumentsError('myfunction', 1, 2, 3);
      assert(err instanceof Error);
      assert(err instanceof math.error.ArgumentsError);
      assert.equal(err.toString(), 'ArgumentsError: Wrong number of arguments in function myfunction (1 provided, 2-3 expected)');
    });

    it('should throw an error when operator new is missing', function () {
      assert.throws(function () {math.error.ArgumentsError();}, SyntaxError);
    });

  });

});
