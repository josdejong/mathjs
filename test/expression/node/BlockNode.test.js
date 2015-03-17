// test BlockNode
var assert = require('assert');
var approx = require('../../../tools/approx');
var math = require('../../../index');
var Node = require('../../../lib/expression/node/Node');
var ConstantNode = require('../../../lib/expression/node/ConstantNode');
var SymbolNode = require('../../../lib/expression/node/SymbolNode');
var OperatorNode = require('../../../lib/expression/node/OperatorNode');
var RangeNode = require('../../../lib/expression/node/RangeNode');
var AssignmentNode = require('../../../lib/expression/node/AssignmentNode');
var BlockNode = require('../../../lib/expression/node/BlockNode');
var ResultSet = require('../../../lib/type/ResultSet');

describe('BlockNode', function() {

  it ('should create a BlockNode', function () {
    var n = new BlockNode([]);
    assert(n instanceof BlockNode);
    assert(n instanceof Node);
    assert.equal(n.type, 'BlockNode');
  });

  it ('should throw an error when calling without new operator', function () {
    assert.throws(function () {BlockNode()}, SyntaxError);
  });

  it ('should throw an error when adding invalid blocks', function () {
    assert.throws(function () {new BlockNode()}, /Array expected/);
    assert.throws(function () {new BlockNode([2])}, /Property "node" must be a Node/);
    assert.throws(function () {new BlockNode([{node: 2, visible:true}])}, /Property "node" must be a Node/);
    assert.throws(function () {new BlockNode([{node: new Node(), visible: 2}])}, /Property "visible" must be a boolean/);
  });

  it ('should compile and evaluate a BlockNode', function () {
    var n = new BlockNode([
      {
        node: new ConstantNode(5),
        visible: true
      },
      {
        node: new AssignmentNode('foo', new ConstantNode(3)),
        visible: false
      },
      {
        node: new SymbolNode('foo'),
        visible: true
      }
    ]);

    var scope = {};
    assert.deepEqual(n.compile(math).eval(scope), new ResultSet([5, 3]));
    assert.deepEqual(scope, {foo: 3});
  });

  it ('expressions should be visible by default', function () {
    var n = new BlockNode([
      {node: new ConstantNode(5)}
    ]);

    assert.deepEqual(n.compile(math).eval(), new ResultSet([5]));
  });

  it ('should filter a BlockNode', function () {
    var a = new ConstantNode(5);
    var b2 = new ConstantNode(3);
    var b = new AssignmentNode('foo', b2);
    var c = new SymbolNode('foo');
    var d = new BlockNode([
      {node: a, visible: true},
      {node: b, visible: false},
      {node: c, visible: true}
    ]);

    assert.deepEqual(d.filter(function (node) {return node instanceof BlockNode}),     [d]);
    assert.deepEqual(d.filter(function (node) {return node instanceof SymbolNode}),    [c]);
    assert.deepEqual(d.filter(function (node) {return node instanceof RangeNode}),     []);
    assert.deepEqual(d.filter(function (node) {return node instanceof ConstantNode}),  [a, b2]);
    assert.deepEqual(d.filter(function (node) {return node instanceof ConstantNode && node.value == '3'}),  [b2]);
  });

  it ('should run forEach on a BlockNode', function () {
    // [x, 2]
    var x = new SymbolNode('x');
    var two = new ConstantNode(2);
    var c = new OperatorNode('+', 'add', [two, x]);
    var a = new BlockNode([
      {node: x},
      {node: c}
    ]);

    var nodes = [];
    var paths = [];
    a.forEach(function (node, path, parent) {
      nodes.push(node);
      paths.push(path);
      assert.strictEqual(parent, a);
    });

    assert.equal(nodes.length, 2);
    assert.strictEqual(nodes[0], x);
    assert.strictEqual(nodes[1], c);
    assert.deepEqual(paths, ['blocks[0].node', 'blocks[1].node']);
  });

  it ('should map a BlockNode', function () {
    // [x, 2]
    var x = new SymbolNode('x');
    var two = new ConstantNode(2);
    var c = new OperatorNode('+', 'add', [two, x]);
    var a = new BlockNode([
      {node: x},
      {node: c}
    ]);

    var nodes = [];
    var paths = [];
    var d = new ConstantNode(3);
    var e = a.map(function (node, path, parent) {
      nodes.push(node);
      paths.push(path);
      assert.strictEqual(parent, a);
      return node instanceof SymbolNode && node.name == 'x' ? d : node;
    });

    assert.equal(nodes.length, 2);
    assert.strictEqual(nodes[0], x);
    assert.strictEqual(nodes[1], c);
    assert.deepEqual(paths, ['blocks[0].node', 'blocks[1].node']);

    assert.notStrictEqual(e, a);
    assert.strictEqual(e.blocks[0].node,  d);
    assert.strictEqual(e.blocks[1].node,  c);

    // should not touch nested nodes
    assert.strictEqual(e.blocks[1].node.args[0], two);
    assert.strictEqual(e.blocks[1].node.args[1], x);
  });

  it ('should throw an error when the map callback does not return a node', function () {
    var x = new SymbolNode('x');
    var two = new ConstantNode(2);
    var c = new OperatorNode('+', 'add', [two, x]);
    var a = new BlockNode([
      {node: x},
      {node: c}
    ]);

    assert.throws(function () {
      a.map(function () {});
    }, /Callback function must return a Node/)
  });

  it ('should transform a BlockNodes parameters', function () {
    // [x, 2]
    var b = new SymbolNode('x');
    var c = new ConstantNode(2);
    var a = new BlockNode([
      {node: b},
      {node: c}
    ]);

    var d = new ConstantNode(3);
    var e = a.transform(function (node) {
      return node instanceof SymbolNode && node.name == 'x' ? d : node;
    });

    assert.notStrictEqual(e, a);
    assert.deepEqual(e.blocks[0].node,  d);
    assert.deepEqual(e.blocks[1].node,  c);
  });

  it ('should transform a BlockNode itself', function () {
    // [x, 2]
    var a = new BlockNode([]);

    var d = new ConstantNode(3);
    var e = a.transform(function (node) {
      return node instanceof BlockNode ? d : node;
    });
    assert.strictEqual(e, d);
  });

  it ('should traverse a BlockNode', function () {
    var a = new ConstantNode(1);
    var b = new ConstantNode(2);
    var c = new BlockNode([
      {node: a, visible: true},
      {node: b, visible: true}
    ]);

    var count = 0;
    c.traverse(function (node, index, parent) {
      count++;

      switch(count) {
        case 1:
          assert.strictEqual(node, c);
          assert.strictEqual(index, null);
          assert.strictEqual(parent, null);
          break;

        case 2:
          assert.strictEqual(node, a);
          assert.strictEqual(index, 'blocks[0].node');
          assert.strictEqual(parent, c);
          break;

        case 3:
          assert.strictEqual(node, b);
          assert.strictEqual(index, 'blocks[1].node');
          assert.strictEqual(parent, c);
          break;
      }
    });

    assert.equal(count, 3);
  });

  it ('should clone a BlockNode', function () {
    // [x, 2]
    var b = new SymbolNode('x');
    var c = new ConstantNode(2);
    var a = new BlockNode([
      {node: b},
      {node: c}
    ]);

    var d = a.clone();
    assert(d instanceof BlockNode);
    assert.deepEqual(a, d);
    assert.notStrictEqual(a, d);
    assert.notStrictEqual(a.blocks, d.blocks);
    assert.notStrictEqual(a.blocks[0], d.blocks[0]);
    assert.notStrictEqual(a.blocks[1], d.blocks[1]);
    assert.strictEqual(a.blocks[0].node, d.blocks[0].node);
    assert.strictEqual(a.blocks[1].node, d.blocks[1].node);
  });

  it ('should stringify a BlockNode', function () {
    var n = new BlockNode([
      {node: new ConstantNode(5), visible:true},
      {node: new AssignmentNode('foo', new ConstantNode(3)), visible:false},
      {node: new SymbolNode('foo'), visible:true}
    ]);

    assert.equal(n.toString(), '5\nfoo = 3;\nfoo');
  });

  it ('should LaTeX a BlockNode', function () {
    var n = new BlockNode([
      {node: new ConstantNode(5), visible:true},
      {node: new AssignmentNode('foo', new ConstantNode(3)), visible:false},
      {node: new SymbolNode('foo'), visible:true}
    ]);

    assert.equal(n.toTex(), '5\n{foo}={3};\nfoo');
  });

  it ('should LaTeX a BlockNode with custom toTex', function () {
    //Also checks if the custom functions get passed on to the children
    var customFunction = function (node, callback) {
      if (node.type === 'BlockNode') {
        var latex = '';
        node.blocks.forEach(function (block) {
          latex += block.node.toTex(callback) + '; ';
        });

        return latex;
      }
      else if (node.type === 'ConstantNode') {
        return 'const\\left(' + node.value + ', ' + node.valueType + '\\right)'
      }
    };

    var a = new ConstantNode(1);
    var b = new ConstantNode(2);

    var n = new BlockNode([{node: a}, {node: b}]);

    assert.equal(n.toTex(customFunction), 'const\\left(1, number\\right); const\\left(2, number\\right); ');
  });

});
