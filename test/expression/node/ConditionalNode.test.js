// test ConditionalNode
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math = require('../../../index')(),
    Node = require('../../../lib/expression/node/Node'),
    ConstantNode = require('../../../lib/expression/node/ConstantNode'),
    SymbolNode = require('../../../lib/expression/node/SymbolNode'),
    AssignmentNode = require('../../../lib/expression/node/AssignmentNode'),
    ConditionalNode = require('../../../lib/expression/node/ConditionalNode');

describe('ConditionalNode', function() {
  var condition = new ConstantNode('boolean', 'true');
  var two = new ConstantNode('number', '2');
  var three = new ConstantNode('number', '3');
  var a = new AssignmentNode('a', two);
  var b = new AssignmentNode('b', three);

  it ('should create a ConditionalNode', function () {
    var n = new ConditionalNode(condition, a, b);
    assert(n instanceof ConditionalNode);
    assert(n instanceof Node);
    assert.equal(n.type, 'ConditionalNode');
  });

  it ('should throw an error when calling without new operator', function () {
    assert.throws(function () {ConditionalNode()}, SyntaxError);
  });

  it ('should throw an error when creating without arguments', function () {
    assert.throws(function () {new ConditionalNode()}, TypeError);
    assert.throws(function () {new ConditionalNode(condition)}, TypeError);
    assert.throws(function () {new ConditionalNode(condition, a)}, TypeError);
    assert.throws(function () {new ConditionalNode(condition, null, b)}, TypeError);
  });

  it ('should compile a ConditionalNode', function () {
    var n = new ConditionalNode(condition, a, b);
    var expr = n.compile(math);
    var scope = {};
    assert.equal(expr.eval(scope), 2);
    assert.deepEqual(scope, {a: 2});
  });

  it ('should find a ConditionalNode', function () {
    var n = new ConditionalNode(condition, a, b);

    assert.deepEqual(n.find({type: ConditionalNode}),  [n]);
    assert.deepEqual(n.find({type: ConstantNode}),  [condition, two, three]);
    assert.deepEqual(n.find({type: ConstantNode, properties: {value: '2'}}),  [two]);
  });

  it ('should match a ConditionalNode', function () {
    var n = new ConditionalNode(condition, a, b);
    assert.equal(n.match({type: ConditionalNode}), true);
    assert.equal(n.match({type: ConstantNode}), false);
  });

  it ('should stringify a ConditionalNode', function () {
    var n = new ConditionalNode(condition, a, b);

    assert.equal(n.toString(), '(true) ? (a = 2) : (b = 3)');
  });

  it ('should LaTeX a ConditionalNode', function () {
    var n = new ConditionalNode(condition, a, b);

    assert.equal(n.toTex(), '\\left\\{\\begin{array}{l l}{{a}={2}}, &\\quad{\\text{if}\\;true}\\\\{{b}={3}}, &\\quad{\\text{otherwise}}\\end{array}\\right.');
  });

});
