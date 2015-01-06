var assert = require('assert');
var functionUtils = require('../../lib/util/function');

describe('util.function', function() {

  describe('memoize', function () {

    it('should memoize a function with one argument', function () {
      var f = function (x) {return x * x};

      var m = functionUtils.memoize(f);

      assert.strictEqual(m(2), 4);
      assert.strictEqual(m(3), 9);
    });

    it('should throw an error in case of functions with multiple arguments', function () {
      var f = function (x, y) {return x - y};

      assert.throws(function () {
        functionUtils.memoize(f);
      })
    });

    it('should really return the cached result', function () {
      var a = 2;
      var f = function (x) {return a}; // trick: no pure function

      var m = functionUtils.memoize(f);

      assert.strictEqual(m(4), 2);
      a = 3;
      assert.strictEqual(m(4), 2);
    });

  });

});
