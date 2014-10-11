// test FunctionNode
var assert = require('assert');
var approx = require('../../../tools/approx');
var math = require('../../../index');
var Node = require('../../../lib/expression/node/Node');
var ConstantNode = require('../../../lib/expression/node/ConstantNode');
var SymbolNode = require('../../../lib/expression/node/SymbolNode');
var RangeNode = require('../../../lib/expression/node/RangeNode');
var FunctionNode = require('../../../lib/expression/node/FunctionNode');
var OperatorNode = require('../../../lib/expression/node/OperatorNode');

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

  it ('should filter a FunctionNode', function () {
    var a = new SymbolNode('a'),
        b = new ConstantNode(2),
        c = new ConstantNode(1);
    var n = new FunctionNode(a, [b, c]);

    assert.deepEqual(n.filter(function (node) {return node instanceof FunctionNode}),  [n]);
    assert.deepEqual(n.filter(function (node) {return node instanceof SymbolNode}),    [a]);
    assert.deepEqual(n.filter(function (node) {return node instanceof RangeNode}),     []);
    assert.deepEqual(n.filter(function (node) {return node instanceof ConstantNode}),  [b, c]);
    assert.deepEqual(n.filter(function (node) {return node instanceof ConstantNode && node.value == '2'}),  [b]);
    assert.deepEqual(n.filter(function (node) {return node instanceof ConstantNode && node.value == '4'}),  []);
  });

  it ('should transform an FunctionNodes (nested) parameters', function () {
    // multiply(x + 2, x)
    var a = new SymbolNode('x');
    var b = new ConstantNode(2);
    var c = new OperatorNode('+', 'add', [a, b]);
    var d = new SymbolNode('x');
    var e = new SymbolNode('multiply');
    var f = new FunctionNode(e, [c, d]);

    var g = new ConstantNode(3);
    var h = f.transform(function (node) {
      return node instanceof SymbolNode && node.name == 'x' ? g : node;
    });

    assert.strictEqual(h, f);
    assert.strictEqual(c.params[0],  g);
    assert.strictEqual(c.params[1],  b);
    assert.strictEqual(f.symbol, e);
    assert.strictEqual(f.params[0],  c);
    assert.strictEqual(f.params[1],  g);
  });

  it ('should transform an FunctionNodes symbol', function () {
    // add(2, 3)
    var a = new SymbolNode('add');
    var b = new ConstantNode(2);
    var c = new ConstantNode(3);
    var d = new FunctionNode(a, [b, c]);

    var e = new SymbolNode('subtract');
    var f = d.transform(function (node) {
      return node instanceof SymbolNode ? e : node;
    });

    assert.strictEqual(f, d);
    assert.strictEqual(d.symbol, e);
  });

  it ('should transform an FunctionNode itself', function () {
    // add(2, 3)
    var a = new SymbolNode('add');
    var b = new ConstantNode(2);
    var c = new ConstantNode(3);
    var d = new FunctionNode(a, [b, c]);

    var e = new ConstantNode(5);
    var f = d.transform(function (node) {
      return node instanceof FunctionNode ? e : node;
    });

    assert.strictEqual(f, e);
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
