var assert = require('assert');
var math = require('../../index');

describe('security', function () {

  it ('should not allow calling Function/eval via a symbol', function () {
    assert.throws(function () {
      math.eval('disguised("console.log(\\"hacked...\\")")()', {disguised: eval})
    }, /Error: Calling "eval" is not allowed/)

    assert.throws(function () {
      math.eval('disguised("console.log(\\"hacked...\\")")()', {disguised: Function})
    }, /Error: Calling "Function" is not allowed/)
  })

  it ('should not allow calling Function/eval via an object property', function () {
    assert.throws(function () {
      math.eval('[].map.constructor("console.log(\\"hacked...\\")")()')
    }, /Error: Calling "Function" is not allowed/)

    assert.throws(function () {
      math.eval('obj.disguised("console.log(\\"hacked...\\")")()', {obj: {disguised: eval}})
    }, /Error: Calling "eval" is not allowed/)

    assert.throws(function () {
      math.eval('obj.disguised("console.log(\\"hacked...\\")")()', {obj: {disguised: Function}})
    }, /Error: Calling "Function" is not allowed/)
  })

  it ('should not allow calling Function/eval when returned by a function', function () {
    assert.throws(function () {
      math.eval('fn()("console.log(\\"hacked...\\")")()', {fn: function () {return Function}})
    }, /Error: Calling "Function" is not allowed/)

    assert.throws(function () {
      math.eval('fn()("console.log(\\"hacked...\\")")()', {fn: function () {return eval}})
    }, /Error: Calling "eval" is not allowed/)
  })

  it ('should not allow calling Function/eval via call/apply', function () {
    assert.throws(function () {
      math.eval('[].map.constructor.call(null, "console.log(\\"hacked...\\")")()')
    }, /Error: Calling "call" is not allowed/)

    assert.throws(function () {
      math.eval('[].map.constructor.apply(null, ["console.log(\\"hacked...\\")"])()')
    }, /Error: Calling "apply" is not allowed/)
  })

  it ('should not allow calling Function/eval via bind', function () {
    assert.throws(function () {
      math.eval('[].map.constructor.bind()("console.log(\\"hacked...\\")")()')
    }, /Error: Calling "bind" is not allowed/)
  })

});
