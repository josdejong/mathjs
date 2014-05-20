// test IfElseNode
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math = require('../../../index')(),
    Node = require('../../../lib/expression/node/Node'),
    ConstantNode = require('../../../lib/expression/node/ConstantNode'),
    SymbolNode = require('../../../lib/expression/node/SymbolNode'),
    OperatorNode = require('../../../lib/expression/node/OperatorNode'),
    TernaryNode = require('../../../lib/expression/node/TernaryNode');

describe('TernaryNode', function() {

  it ('should create a TernaryNode', function () {
    var n = new TernaryNode('ifElse');
    assert(n instanceof TernaryNode);
    assert(n instanceof Node);
    assert.equal(n.type, 'TernaryNode');
  });

  it ('should throw an error when calling without new operator', function () {
    var a = new ConstantNode('number', '2');
    var b = new ConstantNode('boolean', 'true');
    var c = new ConstantNode('boolean', 'false');
    assert.throws(function () {TernaryNode(['?', ':'], 'ifElse', [a, b, c])}, SyntaxError);
  });

  it ('should compile an TernaryNode', function () {
    var a = new ConstantNode('number', '2');
    var b = new ConstantNode('boolean', 'true');
    var c = new ConstantNode('boolean', 'false');
    var n = new TernaryNode(['?', ':'], 'ifElse', [a, b, c]);

    var expr = n.compile(math);

    assert.equal(expr.eval(), true);
  });

  it ('should throw an error in case of unresolved operator function', function () {
    var a = new ConstantNode('number', '2');
    var b = new ConstantNode('boolean', 'true');
    var c = new ConstantNode('boolean', 'false');
    var n = new TernaryNode(['?', ':'], 'ifElse', [a, b, c]);

    var emptyNamespace = {};

    assert.throws(function () {
      n.compile(emptyNamespace);
    }, /Function ifElse missing in provided namespace/);
  });

  it ('should find a TernaryNode', function () {
    var a = new ConstantNode('number', '2');
    var b = new ConstantNode('boolean', 'true');
    var c = new ConstantNode('boolean', 'false');
    var n = new TernaryNode(['?', ':'], 'ifElse', [a, b, c]);

    assert.deepEqual(n.find({type: TernaryNode}),  [n]);
    assert.deepEqual(n.find({type: SymbolNode}),    []);
    assert.deepEqual(n.find({type: ConstantNode}),  [a, b, c]);
    assert.deepEqual(n.find({type: ConstantNode, properties: {value: '2'}}),  [a]);
    assert.deepEqual(n.find({type: ConstantNode, properties: {value: '4'}}),  []);
  });

  it ('should find an TernaryNode without contents', function () {
    var n = new TernaryNode();

    assert.deepEqual(n.find({type: TernaryNode}),  [n]);
    assert.deepEqual(n.find({type: SymbolNode}),    []);
  });

  it ('should match a TernaryNode', function () {
    var a = new TernaryNode();
    assert.equal(a.match({type: TernaryNode}),  true);
    assert.equal(a.match({type: ConstantNode}), false);
  });

  it ('should stringify a TernaryNode', function () {
    var a = new ConstantNode('number', '2');
    var b = new ConstantNode('boolean', 'true');
    var c = new ConstantNode('boolean', 'false');
    var n = new TernaryNode(['?', ':'], 'ifElse', [a, b, c]);

    assert.equal(n.toString(), '2 ? true : false');
  });

  it.skip ('should stringify a TernaryNode with nested operator nodes', function () {
    var a = new ConstantNode('number', '2');
    var b = new ConstantNode('number', '3');
    var c = new ConstantNode('number', '4');
    var d = new ConstantNode('number', '5');

    var n1 = new SymbolNode('a');
    var n2 = new OperatorNode('+', 'add', [a, b]);
    var n3 = new OperatorNode('-', 'subtract', [c, d]);

    var n = new TernaryNode(['?', ':'], 'ifElse', [n1, n2, n3]);

    assert.equal(n.toString(), 'a ? 2 + 3 : 4 - 5');
  });

  it ('should LaTeX a TernaryNode', function () {
    var a = new ConstantNode('number', '2');
    var b = new ConstantNode('boolean', 'true');
    var c = new ConstantNode('boolean', 'false');
    var n = new TernaryNode(['?', ':'], 'ifElse', [a, b, c]);

    assert.equal(n.toTex(), '\\left\\{\\begin{array}{l l}{true}, &\\quad' +
        '{\\text{if}\\;2}\\\\{false}, &\\quad' +
        '{\\text{otherwise}}\\end{array}\\right.');
  });

  it.skip ('should LaTeX a TernaryNode with nested operator nodes', function () {
    var a = new ConstantNode('number', '2');
    var b = new ConstantNode('number', '3');
    var c = new ConstantNode('number', '4');
    var d = new ConstantNode('number', '5');

    var n1 = new SymbolNode('a');
    var n2 = new OperatorNode('+', 'add', [a, b]);
    var n3 = new OperatorNode('-', 'subtract', [c, d]);

    var n = new TernaryNode(['?', ':'], 'ifElse', [n1, n2, n3]);

    assert.equal(n.toTex(), '\\left\\{\\begin{array}{l l}{{2}+{3}}, &\\quad' +
        '{\\text{if}\\;a}\\\\{{4}-{5}}, &\\quad' +
        '{\\text{otherwise}}\\end{array}\\right.');
  });

});
