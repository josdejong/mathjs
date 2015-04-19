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
    var c = new ConstantNode(4);
    var n = new FunctionNode('sqrt', [c]);
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
    assert.throws(function () {new FunctionNode(s, [])}, TypeError);
    assert.throws(function () {new FunctionNode('sqrt', [2, 3])}, TypeError);
    assert.throws(function () {new FunctionNode('sqrt', [c, 3])}, TypeError);
  });

  it ('should compile a FunctionNode', function () {
    var c = new ConstantNode(4);
    var n = new FunctionNode('sqrt', [c]);

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

    var a = new ConstantNode(4);
    var b = new ConstantNode(5);
    var n = new FunctionNode('myFunction', [a, b]);

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

    var a = new ConstantNode(4);
    var b = new ConstantNode(5);
    var n = new FunctionNode('myFunction', [a, b]);

    var scope = {
      myFunction: function () {
        return 42;
      }
    };
    assert.equal(n.compile(mymath).eval(scope), 42);
  });

  it ('should filter a FunctionNode', function () {
    var b = new ConstantNode(2);
    var c = new ConstantNode(1);
    var n = new FunctionNode('a', [b, c]);

    assert.deepEqual(n.filter(function (node) {return node instanceof FunctionNode}),  [n]);
    assert.deepEqual(n.filter(function (node) {return node instanceof RangeNode}),     []);
    assert.deepEqual(n.filter(function (node) {return node instanceof ConstantNode}),  [b, c]);
    assert.deepEqual(n.filter(function (node) {return node instanceof ConstantNode && node.value == '2'}),  [b]);
    assert.deepEqual(n.filter(function (node) {return node instanceof ConstantNode && node.value == '4'}),  []);
  });

  it ('should run forEach on a FunctionNode', function () {
    // multiply(x + 2, x)
    var a = new SymbolNode('x');
    var b = new ConstantNode(2);
    var c = new OperatorNode('+', 'add', [a, b]);
    var d = new SymbolNode('x');
    var f = new FunctionNode('multiply', [c, d]);

    var nodes = [];
    var paths = [];
    f.forEach(function (node, path, parent) {
      nodes.push(node);
      paths.push(path);
      assert.strictEqual(parent, f);
    });

    assert.equal(nodes.length, 2);
    assert.strictEqual(nodes[0], c);
    assert.strictEqual(nodes[1], d);
    assert.deepEqual(paths, ['args[0]', 'args[1]']);
  });

  it ('should map a FunctionNode', function () {
    // multiply(x + 2, x)
    var a = new SymbolNode('x');
    var b = new ConstantNode(2);
    var c = new OperatorNode('+', 'add', [a, b]);
    var d = new SymbolNode('x');
    var f = new FunctionNode('multiply', [c, d]);

    var nodes = [];
    var paths = [];
    var g = new ConstantNode(3);
    var h = f.map(function (node, path, parent) {
      nodes.push(node);
      paths.push(path);
      assert.strictEqual(parent, f);

      return node instanceof SymbolNode && node.name == 'x' ? g : node;
    });

    assert.equal(nodes.length, 2);
    assert.strictEqual(nodes[0], c);
    assert.strictEqual(nodes[1], d);
    assert.deepEqual(paths, ['args[0]', 'args[1]']);

    assert.notStrictEqual(h, f);
    assert.strictEqual(h.args[0],  c);
    assert.strictEqual(h.args[0].args[0],  a);
    assert.strictEqual(h.args[0].args[1],  b);
    assert.equal(h.name, 'multiply');
    assert.strictEqual(h.args[1],  g);
  });

  it ('should throw an error when the map callback does not return a node', function () {
    var b = new ConstantNode(2);
    var f = new FunctionNode('factorial', [b]);

    assert.throws(function () {
      f.map(function () {});
    }, /Callback function must return a Node/)
  });

  it ('should transform a FunctionNodes (nested) parameters', function () {
    // multiply(x + 2, x)
    var a = new SymbolNode('x');
    var b = new ConstantNode(2);
    var c = new OperatorNode('+', 'add', [a, b]);
    var d = new SymbolNode('x');
    var f = new FunctionNode('multiply', [c, d]);

    var g = new ConstantNode(3);
    var h = f.transform(function (node) {
      return node instanceof SymbolNode && node.name == 'x' ? g : node;
    });

    assert.notStrictEqual(h, f);
    assert.deepEqual(h.args[0].args[0],  g);
    assert.deepEqual(h.args[0].args[1],  b);
    assert.deepEqual(h.name, 'multiply');
    assert.deepEqual(h.args[1],  g);
  });

  it ('should transform a FunctionNodes name', function () {
    // add(2, 3)
    var b = new ConstantNode(2);
    var c = new ConstantNode(3);
    var d = new FunctionNode('add', [b, c]);

    var f = d.transform(function (node) {
      if (node instanceof FunctionNode) {
        node.name = 'subtract';
      }
      return node;
    });

    assert.notStrictEqual(f, d);
    assert.deepEqual(f.name, 'subtract');
  });

  it ('should transform a FunctionNode itself', function () {
    // add(2, 3)
    var b = new ConstantNode(2);
    var c = new ConstantNode(3);
    var d = new FunctionNode('add', [b, c]);

    var e = new ConstantNode(5);
    var f = d.transform(function (node) {
      return node instanceof FunctionNode ? e : node;
    });

    assert.strictEqual(f, e);
  });

  it ('should traverse a FunctionNode', function () {
    // add(2, 3)
    var b = new ConstantNode(2);
    var c = new ConstantNode(3);
    var d = new FunctionNode('add', [b, c]);

    var count = 0;
    d.traverse(function (node, path, parent) {
      count++;

      switch(count) {
        case 1:
          assert.strictEqual(node, d);
          assert.strictEqual(path, null);
          assert.strictEqual(parent, null);
          break;

        case 2:
          assert.strictEqual(node, b);
          assert.strictEqual(path, 'args[0]');
          assert.strictEqual(parent, d);
          break;

        case 3:
          assert.strictEqual(node, c);
          assert.strictEqual(path, 'args[1]');
          assert.strictEqual(parent, d);
          break;
      }
    });

    assert.equal(count, 3);
  });

  it ('should clone a FunctionNode', function () {
    // add(2, 3)
    var b = new ConstantNode(2);
    var c = new ConstantNode(3);
    var d = new FunctionNode('add', [b, c]);

    var e = d.clone();
    assert(e instanceof FunctionNode);
    assert.deepEqual(e, d);
    assert.notStrictEqual(e, d);
    assert.equal(e.name, d.name);
    assert.notStrictEqual(e.args, d.args);
    assert.strictEqual(e.args[0], d.args[0]);
    assert.strictEqual(e.args[1], d.args[1]);
  });

  it ('should stringify a FunctionNode', function () {
    var c = new ConstantNode(4);
    var n = new FunctionNode('sqrt', [c]);

    assert.equal(n.toString(), 'sqrt(4)');
  });

  it ('should LaTeX a FunctionNode', function () {
    var c1 = new ConstantNode(4);
    var c2 = new ConstantNode(5);

    var n = new FunctionNode('sqrt', [c1]);
    assert.equal(n.toTex(), '\\sqrt{4}');

    // test permutations
    var n2 = new FunctionNode('permutations', [c1]);
    assert.equal(n2.toTex(), '\\mathrm{permutations}\\left(4\\right)');

    var o = new OperatorNode('+', 'add', [c1, c2]);
    var n3 = new FunctionNode('permutations', [o]);
    assert.equal(n3.toTex(), '\\mathrm{permutations}\\left(4+5\\right)');
  });

  it ('should have an identifier', function () {
    var a = new ConstantNode(2);
    var n = new FunctionNode('factorial', [a]);

    assert.equal(n.getIdentifier(), 'FunctionNode:factorial');
  });

  it ('should LaTeX a FunctionNode with custom toTex', function () {
    //Also checks if the custom functions get passed on to the children
    var customFunction = function (node, callback) {
      if (node.type === 'FunctionNode') {
        var latex = '\\mbox{' + node.name + '}\\left(';
        node.args.forEach(function (arg) {
          latex += arg.toTex(callback) + ', ';
        });
        latex += '\\right)';
        return latex;
      }
      else if (node.type === 'ConstantNode') {
        return 'const\\left(' + node.value + ', ' + node.valueType + '\\right)'
      }
    };

    var a = new ConstantNode(1);
    var b = new ConstantNode(2);

    var n1 = new FunctionNode('add', [a, b]);
    var n2 = new FunctionNode('subtract', [a, b]);

    assert.equal(n1.toTex(customFunction), '\\mbox{add}\\left(const\\left(1, number\\right), const\\left(2, number\\right), \\right)');
    assert.equal(n2.toTex(customFunction), '\\mbox{subtract}\\left(const\\left(1, number\\right), const\\left(2, number\\right), \\right)');
  });

  it ('should LaTeX a FunctionNode with custom toTex for a single function', function () {
    //Also checks if the custom functions get passed on to the children
    var customFunction = {
      'add': function (node, callbacks) {
        return node.args[0].toTex(callbacks) 
          + ' ' + node.name + ' ' 
          + node.args[1].toTex(callbacks);
      }
    };

    var a = new ConstantNode(1);
    var b = new ConstantNode(2);

    var n = new FunctionNode('add', [a, b]);

    assert.equal(n.toTex(customFunction), '1 add 2');
  });

});
