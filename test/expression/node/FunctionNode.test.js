// test FunctionNode
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math = require('../../../index'),
    Node = require('../../../lib/expression/node/Node'),
    ConstantNode = require('../../../lib/expression/node/ConstantNode'),
    SymbolNode = require('../../../lib/expression/node/SymbolNode'),
    RangeNode = require('../../../lib/expression/node/RangeNode'),
    FunctionNode = require('../../../lib/expression/node/FunctionNode');

describe('FunctionNode', function() {

  it ('should create a FunctionNode', function () {
    var s = new SymbolNode('sqrt');
    var c = new ConstantNode(4);
    var n = new FunctionNode(s, [c]);
    assert(n instanceof FunctionNode);
    assert(n instanceof Node);
    assert.equal(n.type, 'FunctionNode');
  });

  it ('should throw an error when calling without new operator', function () {
    var s = new SymbolNode('sqrt');
    var c = new ConstantNode(4);
    assert.throws(function () {FunctionNode(s, [c])}, SyntaxError);
  });

  it ('should throw an error when calling with wrong arguments', function () {
    var s = new SymbolNode('sqrt');
    var c = new ConstantNode(4);
    assert.throws(function () {new FunctionNode('sqrt', [])}, TypeError);
    assert.throws(function () {new FunctionNode(s, [2, 3])}, TypeError);
    assert.throws(function () {new FunctionNode(s, [c, 3])}, TypeError);
  });

  it ('should compile a FunctionNode', function () {
    var s = new SymbolNode('sqrt');
    var c = new ConstantNode(4);
    var n = new FunctionNode(s, [c]);

    var scope = {};
    assert.equal(n.compile(math).eval(scope), 2);
  });

  it ('should compile a FunctionNode with a raw function', function () {
    var mymath = math.create();
    function myFunction (args, _math, _scope) {
      assert.equal(args.length, 2);
      assert(args[0] instanceof Node);
      assert(args[1] instanceof Node);
      assert.deepEqual(_math.__proto__, mymath);
      assert.strictEqual(_scope, scope);
      return 'myFunction(' + args.join(', ') + ')';
    }
    myFunction.rawArgs = true;
    mymath.import({myFunction: myFunction});

    var s = new SymbolNode('myFunction');
    var a = new ConstantNode(4);
    var b = new ConstantNode(5);
    var n = new FunctionNode(s, [a, b]);

    var scope = {};
    assert.equal(n.compile(mymath).eval(scope), 'myFunction(4, 5)');
  });

  it ('should compile a FunctionNode with overloaded a raw function', function () {
    var mymath = math.create();
    function myFunction (args, _math, _scope) {
      assert.ok(false, 'should not be executed');
    }
    myFunction.rawArgs = true;
    mymath.import({myFunction: myFunction});

    var s = new SymbolNode('myFunction');
    var a = new ConstantNode(4);
    var b = new ConstantNode(5);
    var n = new FunctionNode(s, [a, b]);

    var scope = {
      myFunction: function () {
        return 42;
      }
    };
    assert.equal(n.compile(mymath).eval(scope), 42);
  });

  it ('should find a FunctionNode', function () {
    var a = new SymbolNode('a'),
        b = new ConstantNode(2),
        c = new ConstantNode(1);
    var n = new FunctionNode(a, [b, c]);

    assert.deepEqual(n.find({type: FunctionNode}),  [n]);
    assert.deepEqual(n.find({type: SymbolNode}),    [a]);
    assert.deepEqual(n.find({type: RangeNode}),     []);
    assert.deepEqual(n.find({type: ConstantNode}),  [b, c]);
    assert.deepEqual(n.find({type: ConstantNode, properties: {value: '2'}}),  [b]);
    assert.deepEqual(n.find({type: ConstantNode, properties: {value: '4'}}),  []);
  });

  it ('should match a FunctionNode', function () {
    var a = new FunctionNode(new Node(), []);
    assert.equal(a.match({type: FunctionNode}),  true);
    assert.equal(a.match({type: SymbolNode}), false);
  });

  it ('should stringify a FunctionNode', function () {
    var s = new SymbolNode('sqrt');
    var c = new ConstantNode(4);
    var n = new FunctionNode(s, [c]);

    assert.equal(n.toString(), 'sqrt(4)');
  });

  it ('should LaTeX a FunctionNode', function () {
    var s = new SymbolNode('sqrt');
    var c = new ConstantNode(4);
    var n = new FunctionNode(s, [c]);

    assert.equal(n.toTex(), '\\sqrt{4}');
  });

});
