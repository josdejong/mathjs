// test Node
var assert = require('assert');
var approx = require('../../../tools/approx');
var math = require('../../../index');
var Node = require('../../../lib/expression/node/Node');

describe('Node', function() {
  function MyNode () {}
  MyNode.prototype = new Node();
  MyNode.prototype.forEach = function () {};
  MyNode.prototype.map = function () {
    return new MyNode();
  };

  it ('should create a Node', function () {
    var n = new Node();
    assert(n instanceof Node);
  });

  it ('should throw an error when calling without new operator', function () {
    assert.throws(function () {Node()}, SyntaxError);
  });

  it ('should filter a Node', function () {
    var n = new MyNode();

    assert.deepEqual(n.filter(function () {return true}), [n]);
    assert.deepEqual(n.filter(function (node) {return node instanceof Node}), [n]);
    assert.deepEqual(n.filter(function (node) {return node instanceof Date}), []);
  });

  it ('should transform a Node', function () {
    var a = new MyNode();
    var b = new MyNode();
    var c = a.transform(function (node) {
      return b;
    });
    assert.strictEqual(c, b);

    // no match
    a = new MyNode();
    b = new MyNode();
    c = a.transform(function (node) {
      return node;
    });
    assert.notStrictEqual(c, a);
  });

  it ('should transform a Node using a replacement function', function () {
    var a = new MyNode();
    var b = new MyNode();
    var c = a.transform(function (node) {
      assert.deepEqual(node, a);
      return b;
    });
    assert.strictEqual(c, b);
  });

  it ('should throw an error when cloning a Node interface', function () {
    assert.throws(function () {
      var a = new Node();
      a.clone();
    }, /Cannot clone a Node interface/);
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

  it ('should have an identifier', function () {
	  var n = new Node();
	  assert.equal(n.getIdentifier(), 'Node');
  });

  it ('should throw an error if precedence is not defined', function () {
	  var n = new Node();
	  assert.throws(function () {
      n.getPrecedence();
    }, /Precedence is not defined for "Node"/);
  });

});
