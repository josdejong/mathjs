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

  it ('should find a Node', function () {
    var n = new Node();

    assert.deepEqual(n.find(), [n]);
    assert.deepEqual(n.find({type: Node}), [n]);
    assert.deepEqual(n.find({type: Date}), []);
  });

  it ('should match a Node when not providing a filter', function () {
    var node = new Node();
    assert.equal(node.match(), true);
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

  it ('should match a node by its type', function () {
    var node = new Node();

    assert.equal(node.match(), true);
    assert.equal(node.match({type: Node}), true);
  });

  it ('should match a node by its properties', function () {
    var node = new Node();
    node.a = 2;
    node.b = 'c';

    assert.equal(node.match(), true);
    assert.equal(node.match({type: Node}), true);
    assert.equal(node.match({type: Date}), false);
    assert.equal(node.match({properties: {a: 2}}), true);
    assert.equal(node.match({properties: {a: 3}}), false);
    assert.equal(node.match({properties: {a: 2, b: 'c'}}), true);
    assert.equal(node.match({properties: {a: 2, b: 'd'}}), false);
    assert.equal(node.match({properties: {b: 'c'}}), true);
  });

  it ('should ignore inherited fields when matching', function () {
    Object.prototype.foo = 'bar';
    var node = new Node();
    node.foo = 'something else';

    var filter = {
      properties: {}
    };

    assert.equal(filter.foo, 'bar');
    assert.equal(node.foo, 'something else');
    assert.equal(node.match(filter), true);

    delete Object.prototype.foo;
  });

});
