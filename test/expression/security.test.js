var assert = require('assert');
var math = require('../../index');

describe('security', function () {

  it ('should not allow calling Function via constructor', function () {
    assert.throws(function () {
      math.eval('[].map.constructor("console.log(\'hacked...\')")()')
    }, /Error: Access to "Function" is disabled/)
  })

  it ('should not allow calling Function via call/apply', function () {
    assert.throws(function () {
      math.eval('[].map.constructor.call(null, "console.log(\'hacked...\')")()')
    }, /Error: Access to "Function" is disabled/)

    assert.throws(function () {
      math.eval('[].map.constructor.apply(null, ["console.log(\'hacked...\')"])()')
    }, /Error: Access to "Function" is disabled/)
  })

  it ('should not allow calling Function via constructor', function () {
    assert.throws(function () {
      math.eval('[].map.constructor("console.log(\'hacked...\')")()')
    }, /Error: Access to "Function" is disabled/)

    assert.throws(function () {
      math.eval('[].map["constructor"]("console.log(\'hacked...\')")()')
    }, /Error: Access to "Function" is disabled/)
  })

  it ('should not allow calling Function via a disguised constructor', function () {
    assert.throws(function () {
      math.eval('prop="constructor"; [].map[prop]("console.log(\'hacked...\')")()')
    }, /Error: Access to "Function" is disabled/)

    assert.throws(function () {
      math.eval('[].map[concat("constr", "uctor")]("console.log(\'hacked...\')")()')
    }, /Error: Access to "Function" is disabled/)
  })

  it ('should not allow calling Function via bind', function () {
    assert.throws(function () {
      math.eval('[].map.constructor.bind()("console.log(\'hacked...\')")()')
    }, /Error: Access to "Function" is disabled/)
  })

  it ('should not allow calling Function via map/forEach', function () {
    // TODO: simplify this test case, let it output console.log('hacked...')
    assert.throws(function () {
      math.eval('["//","a/*\\nreturn process.mainModule.require"]._data.map(cos.constructor)[1]()("child_process").execSync("ps >&2")');
    }, /Error: Access to "Function" is disabled/)
  })

  it ('should not allow calling Function via Object.assign', function () {
    // TODO: simplify this test case, let it output console.log('hacked...')
    assert.throws(function () {
      math.eval('{}.constructor.assign(cos.constructor, {binding: cos.bind})\n' +
          '{}.constructor.assign(cos.constructor, {bind: null})\n' +
          'cos.constructor.binding()("console.log(\'hacked...\')")()')
    }, /Error: Access to "Function" is disabled/)
  })

  it ('should not allow calling Function via imported, overridden function', function () {
    assert.throws(function () {
      var math2 = math.create();
      math2.eval('import({matrix:cos.constructor},{override:1});x=["console.log(\'hacked...\')"];x()');
    }, /Error: Access to "Function" is disabled/)
  })

  it ('should not allow calling Function via index retrieval', function () {
    assert.throws(function () {
      math.eval('a=["console.log(\'hacked...\')"]._data;a.isRange=true;x={subset:cos.constructor}[a];x()');
    }, /Error: Access to "Function" is disabled/)
  })

  it ('should not allow calling Function via getOwnPropertyDescriptor', function () {
    assert.throws(function () {
      math.eval('p = parser()\n' +
          'p.eval("", [])\n' +
          'o = p.get("constructor")\n' +
          'c = o.getOwnPropertyDescriptor(o.__proto__, "constructor")\n' +
          'c.value("console.log(\'hacked...\')")()')
    }, /Error: Access to "Function" is disabled/)
  })

  it ('should not allow calling Function via a symbol', function () {
    assert.throws(function () {
      math.eval('O = {}.constructor\n' +
          'd = O.getOwnPropertyDescriptor(O.__proto__, "constructor")\n' +
          'eval("value", d)("console.log(\'hacked...\')")()')
    }, /Error: Access to "Function" is disabled/)
  })

  it ('should not allow calling Function via a specially encoded constructor property name', function () {
    assert.throws(function () {
      math.eval('[].map["\\x63onstructor"]("console.log(\'hacked...\')")()')
    }, /Error: Access to "Function" is disabled/)
  })

});
