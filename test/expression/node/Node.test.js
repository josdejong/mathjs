// test Node
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math = require('../../../index'),
    Node = require('../../../lib/expression/node/Node');

describe('Node', function() {

  it ('should create a Node', function () {
    var n = new Node();
    assert(n instanceof Node);
  });

  it ('should throw an error when calling without new operator', function () {
    assert.throws(function () {Node()}, SyntaxError);
  });

  it ('should filter a Node', function () {
    var n = new Node();

    assert.deepEqual(n.filter(function () {return true}), [n]);
    assert.deepEqual(n.filter(function (node) {return node instanceof Node}), [n]);
    assert.deepEqual(n.filter(function (node) {return node instanceof Date}), []);
  });

  it ('should transform a Node', function () {
    var a = new Node();
    var b = new Node();
    var c = a.transform(function (node) {
      return b;
    });
    assert.deepEqual(c, b);

    // no match
    a = new Node();
    b = new Node();
    c = a.transform(function (node) {
      return node;
    });
    assert.deepEqual(c, a);
  });

  it ('should transform a Node using a replacement function', function () {
    var a = new Node();
    var b = new Node();
    var c = a.transform(function (node) {
      assert.deepEqual(node, a);
      return b;
    });
    assert.deepEqual(c, b);
  });

  it ('should test whether an object is a Node', function () {
    assert.equal(Node.isNode(new Node()), true);
    assert.equal(Node.isNode(new Date()), false);
    assert.equal(Node.isNode(2), false);
  });

  it ('should stringify a Node', function () {
    var node = new Node();
    assert.equal(node.toString(), '');
  });

  it ('should LaTeX a Node', function () {
    var node = new Node();
    assert.equal(node.toTex(), '');
  });

  it ('should throw an error in case of wrong arguments for compile', function () {
    var node = new Node();
    assert.throws(function () {
      node.compile()
    }, /Object expected/);
  });

  it ('should throw an error when compiling an abstract node', function () {
    var node = new Node();
    assert.throws(function () {
      node.compile(math)
    }, /Cannot compile a Node interface/);
  });

});
