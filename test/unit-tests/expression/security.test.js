import assert from 'assert'
import math from '../../../src/defaultInstance.js'

describe('security', function () {
  it('should not allow calling Function via constructor', function () {
    assert.throws(function () {
      math.evaluate('f=[].map.constructor("console.log(\'hacked...\')"); f()')
    }, /Error: Cannot access method "map" as a property/)
  })

  it('should not allow calling Function via constructor (2)', function () {
    assert.throws(function () {
      math.evaluate('f=sqrt.constructor("console.log(\'hacked...\')"); f()')
    }, /Error: No access to method "constructor"/)
  })

  it('should not allow calling Function via call/apply', function () {
    assert.throws(function () {
      math.evaluate('f=[].map.constructor.call(null, "console.log(\'hacked...\')"); f()')
    }, /Error: Cannot access method "map" as a property/)

    assert.throws(function () {
      math.evaluate('f=[].map.constructor.apply(null, ["console.log(\'hacked...\')"]); f()')
    }, /Error: Cannot access method "map" as a property/)
  })

  it('should not allow calling constructor of a class', function () {
    assert.throws(function () {
      math.evaluate('[].constructor()')
    }, /Error: No access to method "constructor"/)
  })

  it('should not allow calling constructor', function () {
    assert.throws(function () {
      math.evaluate('constructor', {})
    }, /Error: No access to property "constructor"/)

    assert.throws(function () {
      math.evaluate('toString', {})
    }, /Cannot access method "toString" as a property/)
  })

  it('should not allow calling Function via constructor', function () {
    assert.throws(function () {
      math.evaluate('f=[].map.constructor("console.log(\'hacked...\')"); f()')
    }, /Error: Cannot access method "map" as a property/)

    assert.throws(function () {
      math.evaluate('f=[].map["constructor"]("console.log(\'hacked...\')"); f()')
    }, /Error: Cannot access method "map" as a property/)
  })

  it('should not allow calling Function via a disguised constructor', function () {
    assert.throws(function () {
      math.evaluate('prop="constructor"; f=[].map[prop]("console.log(\'hacked...\')"); f()')
    }, /Error: Cannot access method "map" as a property/)

    assert.throws(function () {
      math.evaluate('f=[].map[concat("constr", "uctor")]("console.log(\'hacked...\')"); f()')
    }, /Error: Cannot access method "map" as a property/)
  })

  it('should not allow calling Function via bind', function () {
    assert.throws(function () {
      math.evaluate('f=[].map.constructor.bind()("console.log(\'hacked...\')"); f()')
    }, /Error: Cannot access method "map" as a property/)
  })

  it('should not allow calling Function via map/forEach', function () {
    // TODO: simplify this test case, let it output console.log('hacked...')
    assert.throws(function () {
      math.evaluate('["//","a/*\\nreturn process.mainModule.require"]._data.map(cos.constructor)[1]()("child_process").execSync("ps >&2")')
    }, /Error: No access to property "_data/)
  })

  it('should not allow calling Function via Object.assign', function () {
    // TODO: simplify this test case, let it output console.log('hacked...')
    assert.throws(function () {
      math.evaluate('{}.constructor.assign(cos.constructor, {binding: cos.bind})\n' +
          '{}.constructor.assign(cos.constructor, {bind: null})\n' +
          'f=cos.constructor.binding()("console.log(\'hacked...\')")\n' +
          'f()')
    }, /Error: No access to property "bind/)
  })

  it('should not allow disguising forbidden properties with unicode characters', function () {
    const scope = {
      a: {}
    }

    assert.throws(function () { math.evaluate('a.co\u006Estructor', scope) }, /Error: No access to property "constructor"/)
    assert.throws(function () { math.evaluate('a["co\\u006Estructor"]', scope) }, /Error: No access to property "constructor"/)
    assert.throws(function () { math.evaluate('a.constructor', scope) }, /Error: No access to property "constructor"/)
    assert.throws(function () { math.evaluate('a.constructor = 2', scope) }, /Error: No access to property "constructor"/)
    assert.throws(function () { math.evaluate('a["constructor"] = 2', scope) }, /Error: No access to property "constructor"/)
    assert.throws(function () { math.evaluate('a["co\\u006Estructor"] = 2', scope) }, /Error: No access to property "constructor"/)
    assert.throws(function () { math.evaluate('a = {"constructor": 2}', scope) }, /Error: No access to property "constructor"/)
    assert.throws(function () { math.evaluate('a = {constructor: 2}', scope) }, /Error: No access to property "constructor"/)
    assert.throws(function () { math.evaluate('a = {"co\\u006Estructor": 2}', scope) }, /Error: No access to property "constructor"/)
    assert.throws(function () { math.evaluate('a = {co\u006Estructor: 2}', scope) }, /Error: No access to property "constructor"/)
  })

  it('should not allow calling Function via imported, overridden function', function () {
    assert.throws(function () {
      const math2 = math.create()
      math2.evaluate('import({matrix:cos.constructor},{override:1});x=["console.log(\'hacked...\')"];x()')
    }, /Error: Undefined function import/)
  })

  it('should not allow calling Function via index retrieval', function () {
    assert.throws(function () {
      math.evaluate('a=["console.log(\'hacked...\')"]._data;a.isRange=true;x={subset:cos.constructor}[a];x()')
    }, /Error: No access to property "_data/)
  })

  it('should not allow calling Function via getOwnPropertyDescriptor', function () {
    assert.throws(function () {
      math.evaluate('p = parser()\n' +
          'p.evaluate("", [])\n' +
          'o = p.get("constructor")\n' + // this returns undefined
          'c = o.getOwnPropertyDescriptor(o.__proto__, "constructor")\n' + // errors here!
          'f = c.value("console.log(\'hacked...\')")\n' +
          'f()')
    }, /Error: No access to method "getOwnPropertyDescriptor"/)
  })

  it('should not allow calling Function via a symbol', function () {
    assert.throws(function () {
      math.evaluate('O = {}.constructor\n' +
          'd = O.getOwnPropertyDescriptor(O.__proto__, "constructor")\n' +
          'f = evaluate("value", d)("console.log(\'hacked...\')")\n' +
          'f()')
    }, /Error: No access to property "constructor/)
  })

  it('should not allow calling Function via a specially encoded constructor property name', function () {
    assert.throws(function () {
      math.evaluate('f=[].map["\\u0063onstructor"]("console.log(\'hacked...\')"); f()')
    }, /Error: Cannot access method "map" as a property/)
  })

  it('should not allow creating an Object with forbidden properties', function () {
    assert.throws(function () {
      math.evaluate('{hasOwnProperty: 2}')
    }, /Error: No access to property "hasOwnProperty/)

    assert.throws(function () {
      math.evaluate('{constructor: 2}')
    }, /Error: No access to property "constructor/)

    assert.throws(function () {
      math.evaluate('{toString: 2}')
    }, /Error: No access to property "toString/)
  })

  it('should not allow calling Object via a an object constructor', function () {
    assert.throws(function () {
      math.evaluate('{}.constructor.assign(expression.node.AssignmentNode.prototype, ' +
                '{_compile: "".toString.bind("console.log(\'hacked...\')")})\n' +
                'evaluate("a = 2")')
    }, /Error: No access to property "constructor/)
  })

  it('should not allow calling Object via a __defineGetter__', function () {
    assert.throws(function () {
      math.evaluate('expression.node.AssignmentNode.prototype.__defineGetter__("_compile", ' +
          '{}.valueOf.bind("".toString.bind("console.log(\'hacked...\')"))); evaluate("a = 2")')
    }, /Error: Undefined symbol expression/)
  })

  it('should not allow calling evaluate via a custom compiled SymbolNode', function () {
    assert.throws(function () {
      math.evaluate("s={};s.__proto__=expression.node.SymbolNode[\"prototype\"];expression.node.SymbolNode.apply(s,[\"\\\");},\\\"exec\\\":function(a){return global.eval}};//\"]._data);s.compile().exec()(\"console.log('hacked...')\")")
    }, /Error: Undefined symbol expression/)
  })

  it('should not allow calling evaluate via parse', function () {
    assert.throws(function () {
      math.evaluate('x=parse("cos");x.name = "\\");},\\"evaluate\\": function(a) {return global.eval}};//a"; x.compile().evaluate()("console.log(\'hacked...\')")')
    }, /No access to property "name"/)
  })

  it('should not allow calling evaluate via parse (2)', function () {
    assert.throws(function () {
      math.evaluate('p = parse("{}[\\"console.log(\'hacked...\')\\"]"); p.index.dimensions["0"].valueType = "boolean"; p.evaluate()')
    }, /No access to property "index"/)
  })

  it('should not allow calling evaluate via function.syntax', function () {
    assert.throws(function () {
      math.evaluate('cos.syntax="global.eval";s=unit("5 cm");s.units=[]._data;s.value=cos;s._compile=s.toString;expression.node.Node.prototype.compile.call(s).evaluate()("console.log(\'hacked...\')")')
    }, /Error: No access to property "syntax"/)
  })

  it('should not allow calling evaluate via clone', function () {
    assert.throws(function () {
      math.evaluate('expression.node.ConstantNode.prototype.clone.call({"value":"evaluate"}).evaluate()("console.log(\'hacked...\')")')
    }, /Error: Undefined symbol expression/)
  })

  it('should not allow replacing _compile', function () {
    assert.throws(function () {
      math.evaluate('c(x,y)="console.log(\'hacked...\')";expression.node.Node.prototype.compile.apply({_compile:c}).evaluate()')
    }, /Error: Undefined symbol expression/)
  })

  it('should not allow using restricted properties via subset (1)', function () {
    assert.throws(function () {
      math.evaluate('f()=false;' +
          'g()={length:3};' +
          'h()={"0":0,"1":0,"2":0};' +
          'j(x)=[x("constructor")];' +
          'k(x)={map:j};' +
          'i={isIndex:true,isScalar:f,size:g,min:h,max:h,dimension:k};' +
          'f=subset(subset([[[0]]],i),index(1,1,1))("console.log(\'hacked...\')");' +
          'f()')
    }, /TypeError: Unexpected type of argument in function subset \(expected: Index, actual: Object, index: 1\)/)
  })

  it('should not allow accessing proto via dimension', function () {
    assert.strictEqual(math.evaluate('a=index([0,1]);b=a.dimension("__proto__");b').toString(), '[null]')
  })

  it('should not allow using restricted properties via subset (2)', function () {
    assert.throws(function () {
      math.evaluate("scope={}; setter = evaluate(\"f(obj, name, newValue, assign) = (obj[name] = newValue)\", scope); o = parse(\"1\"); setter(o, \"value\", \"evaluate\", subset); scope.obj.compile().evaluate()(\"console.log('hacked...')\")")
    }, /Error: No access to property "value"/)
  })

  it('should not allow using restricted properties via subset (3)', function () {
    // this exploit does no longer work because parse("1") returns a ConstantNode
    // and subset doesn't accept that anymore (expects a plain Object)
    assert.throws(function () {
      math.evaluate('subset(parse("1"), index("value"), "evaluate").compile().evaluate()("console.log(\'hacked...\')")')
    }, /TypeError: Unexpected type of argument in function subset/)
  })

  it('should not allow inserting fake nodes with bad code via node.map or node.transform', function () {
    assert.throws(function () {
      math.evaluate("badValue = {\"isNode\": true, \"_compile\": evaluate(\"f(a, b) = \\\"evaluate\\\"\")}; x = evaluate(\"f(child, path, parent) = path ==\\\"value\\\" ? newChild : child\", {\"newChild\": badValue}); parse(\"x = 1\").map(x).compile().evaluate()(\"console.log('hacked')\")")
    }, /Error: Cannot convert "object" to a number/)

    assert.throws(function () {
      math.evaluate("badValue = {\"isNode\": true, \"type\": \"ConstantNode\", \"valueType\": \"string\", \"_compile\": evaluate(\"f(a, b) = \\\"evaluate\\\"\")}; x = evaluate(\"f(child, path, parent) = path ==\\\"value\\\" ? newChild : child\", {\"newChild\": badValue}); parse(\"x = 1\").map(x).compile().evaluate()(\"console.log('hacked...')\")")
    }) // The error message is vague but well...
  })

  it('should not allow replacing validateSafeMethod with a local variant', function () {
    assert.throws(function () {
      math.evaluate("evaluate(\"f(validateSafeMethod)=cos.constructor(\\\"return evaluate\\\")()\")(evaluate(\"f(x,y)=0\"))(\"console.log('hacked...')\")")
    }, /SyntaxError: Value expected/)
  })

  it('should not allow abusing toString', function () {
    assert.throws(function () {
      math.evaluate("badToString = evaluate(\"f() = 1\"); badReplace = evaluate(\"f(a, b) = \\\"evaluate\\\"\"); badNumber = {toString:badToString, replace:badReplace}; badNode = {\"isNode\": true, \"type\": \"ConstantNode\", \"valueType\": \"number\", \"value\": badNumber}; x = evaluate(\"f(child, path, parent) = badNode\", {badNode:badNode}); parse(\"(1)\").map(x).compile().evaluate()(\"console.log('hacked...')\")")
    }, /Error: No access to property "toString"/)
  })

  it('should not allow creating a bad FunctionAssignmentNode', function () {
    assert.throws(function () {
      math.evaluate("badNode={isNode:true,type:\"FunctionAssignmentNode\",expr:parse(\"1\"),types:{join:evaluate(\"f(a)=\\\"\\\"\")},params:{\"forEach\":evaluate(\"f(x)=1\"),\"join\":evaluate(\"f(x)=\\\"){return evaluate;}});return fn;})())}});return fn;})());}};//\\\"\")}};parse(\"f()=x\").map(evaluate(\"f(a,b,c)=badNode\",{\"badNode\":badNode})).compile().evaluate()()()(\"console.log('hacked...')\")")
    }, /SyntaxError: Value expected/)
  })

  it('should not allow creating a bad OperatorNode (1)', function () {
    assert.throws(function () {
      math.evaluate("badNode={isNode:true,type:\"FunctionAssignmentNode\",expr:parse(\"1\"),types:{join:evaluate(\"f(a)=\\\"\\\"\")},params:{\"forEach\":evaluate(\"f(x)=1\"),\"join\":evaluate(\"f(x)=\\\"){return evaluate;}});return fn;})())}});return fn;})());}};//\\\"\")}};parse(\"f()=x\").map(evaluate(\"f(a,b,c)=badNode\",{\"badNode\":badNode})).compile().evaluate()()()(\"console.log('hacked...')\")")
    }, /SyntaxError: Value expected/)
  })

  it('should not allow creating a bad OperatorNode (2)', function () {
    assert.throws(function () {
      math.evaluate("parse(\"(0)\").map(evaluate(\"f(a,b,c)=d\",{d:{isNode:true,type:\"OperatorNode\",fn:\"__lookupGetter__\",args:{map:evaluate(\"f(a)=b\",{b:{join:evaluate(\"f(a)=\\\"1)||evaluate;}};//\\\"\")}})}}})).compile().evaluate()(\"console.log('hacked...')\")")
    }, /TypeError: Node expected for parameter "content"/)
  })

  it('should not allow creating a bad ConstantNode', function () {
    assert.throws(function () {
      math.evaluate('f(x,y)="evaluate";g()=3;fakeConstantNode={"isNode": true, "type": "ConstantNode", "valueType": "number", "value": {"replace": f, "toString": g}};injectFakeConstantNode(child,path,parent)=path=="value"?fakeConstantNode:child;parse("a=3").map(injectFakeConstantNode).compile().evaluate()("console.log(\'hacked...\')")')
    }, /Error: No access to property "toString"/)
  })

  it('should not allow creating a bad ArrayNode', function () {
    assert.throws(function () {
      math.evaluate('g(x)="evaluate";f(x)=({join: g});fakeArrayNode={isNode: true, type: "ArrayNode", items: {map: f}};injectFakeArrayNode(child,path,parent)=path=="value"?fakeArrayNode:child;parse("a=3").map(injectFakeArrayNode).compile().evaluate()[1]("console.log(\'hacked...\')")')
    }, /Error: Cannot convert "object" to a number/)
  })

  it('should not allow unescaping escaped double quotes', function () {
    // exploits:
    // 1) A bug in validateSafeMethod which allows to call any method in Object.prototype
    // 2) A bug in stringify
    assert.throws(function () {
      math.evaluate("x=parse(\"\\\"a\\\"\");x.__defineGetter__(\"value\",evaluate(\"f()=\\\"false\\\\\\\\\\\\\\\\\\\\\\\"&&evaluate;}};\\/\\/\\\"\")); x.compile().evaluate()(\"console.log('hacked...')\")")
    }, /Error: No access to method "__defineGetter__"/)
  })

  it('should not allow using method chain', function () {
    assert.throws(function () {
      math.evaluate('f=chain("a(){return evaluate;};function b").typed({"":f()=0}).done();' +
          'g=f();' +
          "g(\"console.log('hacked...')\")")
    }, /Error: Undefined function chain/)
  })

  it('should not allow using method chain (2)', function () {
    assert.throws(function () {
      math.evaluate("evilMath=chain().create().done();evilMath.import({\"_compile\":f(a,b,c)=\"evaluate\",\"isNode\":f()=true}); parse(\"(1)\").map(g(a,b,c)=evilMath.chain()).compile().evaluate()(\"console.log('hacked...')\")")
    }, /Error: Undefined function chain/)
  })

  it('should not allow using method Chain', function () {
    assert.throws(function () {
      math.evaluate('x=parse("a",{nodes:{a:Chain}});Chain.bind(x,{})();' +
          'evilMath=x.create().done();' +
          'evilMath.import({"_compile":f(a,b,c)="evaluate","isNode":f()=true}); ' +
          "parse(\"(1)\").map(g(a,b,c)=evilMath.chain()).compile().evaluate()(\"console.log('hacked...')\")")
    }, /SyntaxError: Value expected/)
  })

  it('should not allow passing a function name containg bad contents', function () {
    // underlying issues where:
    // the input '[]["fn"]()=0'
    // - defines a function in the root scope, but this shouldn't be allowed syntax
    // - there is a typed function created which unsecurely evaluates JS code with the function name in it
    //   -> when the function name contains JS code it can be executed, example:
    //
    //         const fn = typed("(){}+console.log(`hacked...`);function a", { "": function () { } })

    assert.throws(function () {
      math.evaluate('[]["(){}+console.log(`hacked...`);function a"]()=0')
    }, /SyntaxError: Invalid left hand side of assignment operator =/)

    assert.throws(function () {
      math.evaluate('{}["(){}+console.log(`hacked...`);function a"]()=0')
    }, /SyntaxError: Invalid left hand side of assignment operator =/)
  })

  it('should allow calling functions on math', function () {
    assert.strictEqual(math.evaluate('sqrt(4)'), 2)
  })

  it('should allow invoking methods on complex numbers', function () {
    assert.deepStrictEqual(math.evaluate('complex(4, 0).sqrt(2)'), math.complex(2, 0))
  })

  it('should allow accessing properties on an object', function () {
    assert.deepStrictEqual(math.evaluate('obj.a', { obj: { a: 42 } }), 42)
  })

  it('should not allow accessing inherited properties on an object', function () {
    assert.throws(function () {
      math.evaluate('obj.constructor', { obj: { a: 42 } })
    }, /Error: No access to property "constructor"/)
  })

  it('should not allow accessing __proto__', function () {
    assert.throws(function () {
      math.evaluate('{}.__proto__')
    }, /Error: No access to property "__proto__"/)
  })

  it('should not allow getting properties from non plain objects', function () {
    assert.throws(function () { math.evaluate('[]._data') }, /No access to property "_data"/)
    assert.throws(function () { math.evaluate('unit("5cm").valueOf') }, /Cannot access method "valueOf" as a property/)
  })

  it('should not allow accessing constructor via FunctionNode.name', function () {
    assert.throws(function () {
      // could execute a nodejs script like "return process.mainModule.require(child_process).execSync(whoami)"
      const result = math.evaluate('evalFunctionNode=parse("constructor(\'return process.version\')")._compile({},{});' +
        'f=evalFunctionNode(null,cos);' +
        'f()')
      console.warn('Hacked! node.js version:', result.entries[0])
    }, /No access to property "constructor"/)
  })

  it('should not have access to specific namespaces', function () {
    Object.keys(math.expression.mathWithTransform).forEach(function (name) {
      const value = math.expression.mathWithTransform[name]

      // only plain functions allowed, no constructor functions
      if (typeof value === 'function') {
        assert.strictEqual(isPlainFunction(value), true,
          'only plain functions expected, constructor functions not allowed (name: "' + name + '")')
      } else {
        // plain objects not allowed, only class instances like units and complex numbers
        if (value && typeof value === 'object') {
          if (isPlainObject(value)) {
            throw new Error('plain objects are not allowed, only class instances (object name: ' + name + ')')
          }
        }
      }
    })

    assert.throws(function () { math.evaluate('expression') }, /Undefined symbol/)
    assert.throws(function () { math.evaluate('type') }, /Undefined symbol/)
    assert.throws(function () { math.evaluate('error') }, /Undefined symbol/)
    assert.throws(function () { math.evaluate('json') }, /Undefined symbol/)

    assert.strictEqual(math.expression.mathWithTransform.Matrix, undefined)
    assert.strictEqual(math.expression.mathWithTransform.Node, undefined)
    assert.strictEqual(math.expression.mathWithTransform.chain, undefined)
    assert.deepStrictEqual(math.evaluate('chain'), math.unit('chain'))
  })

  it('should not allow polluting the Object prototype via config', function () {
    const obj = {}
    assert.strictEqual(obj.polluted, undefined)

    // change the configuration
    const newConfig = JSON.parse('{"__proto__":{"polluted":"yes"}}')
    math.config(newConfig)
    assert.strictEqual(obj.polluted, undefined)
  })

  it('should not allow polluting the Object prototype via config via the expression parser', function () {
    const obj = {}
    assert.strictEqual(obj.polluted, undefined)

    // change the configuration
    math.evaluate('config({"__proto__":{"polluted":"yes"}})')
    assert.strictEqual(obj.polluted, undefined)
  })

  it('should not allow polluting the Object prototype by creating an object in the expression parser', function () {
    const obj = {}
    assert.strictEqual(obj.polluted, undefined)

    // change the configuration
    math.evaluate('a = {"__proto__":{"polluted":"yes"}}')
    assert.strictEqual(obj.polluted, undefined)
  })
})

function isPlainObject (object) {
  return typeof object === 'object' && object &&
      object.constructor === Object &&
      Object.getPrototypeOf(object) === Object.prototype
}

function isPlainFunction (fn) {
  return typeof fn === 'function' && fn.prototype.constructor === fn
}
