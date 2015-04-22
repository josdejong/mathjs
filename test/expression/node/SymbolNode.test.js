// test SymbolNode
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math = require('../../../index'),
    Node = require('../../../lib/expression/node/Node'),
    ConstantNode = require('../../../lib/expression/node/ConstantNode'),
    OperatorNode = require('../../../lib/expression/node/OperatorNode'),
    SymbolNode = require('../../../lib/expression/node/SymbolNode');

describe('SymbolNode', function() {

  it ('should create a SymbolNode', function () {
    var n = new SymbolNode('sqrt');
    assert(n instanceof SymbolNode);
    assert(n instanceof Node);
    assert.equal(n.type, 'SymbolNode');
  });

  it ('should throw an error when calling without new operator', function () {
    assert.throws(function () {SymbolNode('sqrt')}, SyntaxError);
  });

  it ('should throw an error when calling with wrong arguments', function () {
    assert.throws(function () {new SymbolNode()}, TypeError);
    assert.throws(function () {new SymbolNode(2)}, TypeError);
  });

  it ('should throw an error when evaluating an undefined symbol', function () {
    var scope = {};
    var s = new SymbolNode('foo');
    assert.throws(function () {s.compile(math).eval(scope)}, Error);
  });

  it ('should compile a SymbolNode', function () {
    var s = new SymbolNode('a');

    var expr = s.compile(math);
    var scope = {a: 5};
    assert.equal(expr.eval(scope), 5);
    assert.throws(function () {expr.eval({})}, Error);

    var s2 = new SymbolNode('sqrt');
    var expr2 = s2.compile(math);
    var scope2 = {};
    assert.strictEqual(expr2.eval(scope2), math.sqrt);
  });

  it ('should filter a SymbolNode', function () {
    var n = new SymbolNode('x');
    assert.deepEqual(n.filter(function (node) {return node instanceof SymbolNode}),  [n]);
    assert.deepEqual(n.filter(function (node) {return node.name == 'x'}),  [n]);
    assert.deepEqual(n.filter(function (node) {return node.name == 'q'}),  []);
    assert.deepEqual(n.filter(function (node) {return node instanceof ConstantNode}),  []);
  });

  it ('should run forEach on a SymbolNode', function () {
    var a = new SymbolNode('a');
    a.forEach(function () {
      assert.ok(false, 'should not execute, symbol has no childs')
    });
  });

  it ('should map a SymbolNode', function () {
    var a = new SymbolNode('a');
    var c = new SymbolNode('c');
    var b = a.map(function () {
      assert.ok(false, 'should not execute, symbol has no childs')
    });

    assert.notStrictEqual(b, a);
    assert.deepEqual(b, a);
  });

  it ('should transform a SymbolNode', function () {
    var a = new SymbolNode('x');
    var b = new SymbolNode('y');
    var c = a.transform(function (node) {
      return node instanceof SymbolNode && node.name == 'x' ? b : node;
    });
    assert.deepEqual(c,  b);

    // no match should leave the symbol as is
    var d = a.transform(function (node) {
      return node instanceof SymbolNode && node.name == 'q' ? b : node;
    });
    assert.deepEqual(d,  a);
  });

  it ('should clone a SymbolNode', function () {
    var a = new SymbolNode('x');
    var b = a.clone();

    assert(b instanceof SymbolNode);
    assert.deepEqual(a, b);
    assert.notStrictEqual(a, b);
    assert.equal(a.name, b.name);
  });

  it ('should stringify a SymbolNode', function () {
    var s = new SymbolNode('foo');

    assert.equal(s.toString(), 'foo');
  });

  it ('should LaTeX a SymbolNode', function () {
    var s = new SymbolNode('foo');

    assert.equal(s.toTex(), '\\mathrm{foo}');
  });

  it ('should LaTeX a SymbolNode with custom toTex', function () {
    //Also checks if the custom functions get passed on to the children
    var customFunction = function (node, callback) {
      if (node.type === 'SymbolNode') {
        return 'symbol(' + node.name + ')';
      }
    };

    var n = new SymbolNode('a');

    assert.equal(n.toTex(customFunction), 'symbol(a)');
  });

  it ('should LaTeX a SymbolNode without breaking \\cdot', function () {
    var a = new ConstantNode(1);
    var b = new SymbolNode('Epsilon');

    var mult = new OperatorNode('*', 'multiply', [a,b]);

    assert.equal(mult.toTex(), '1\\cdot E');
  });

});
