// test ArrayNode
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    mathjs = require('../../../index'),
    math = mathjs(),
    Node = require('../../../lib/expression/node/Node'),
    ConstantNode = require('../../../lib/expression/node/ConstantNode'),
    ArrayNode = require('../../../lib/expression/node/ArrayNode');

describe('ArrayNode', function() {

  it ('should create an ArrayNode', function () {
    // TODO
  });

  it ('should evaluate an ArrayNode', function () {
    // TODO
  });

  it ('should compile an ArrayNode', function () {
    var a = new ConstantNode('number', '1');
    var b = new ConstantNode('number', '2');
    var c = new ConstantNode('number', '3');
    var d = new ConstantNode('number', '4');
    var n = new ArrayNode([a, b, c, d]);

    var expr = n.compile(math);
    assert.deepEqual(expr.eval(), math.matrix([1,2,3,4]));

    var mathArray = mathjs({matrix: 'array'});
    var expr2 = n.compile(mathArray);
    assert.deepEqual(expr2.eval(), [1,2,3,4]);
  });

  it ('should compile nested ArrayNodes', function () {
    var a = new ConstantNode('number', '1');
    var b = new ConstantNode('number', '2');
    var c = new ConstantNode('number', '3');
    var d = new ConstantNode('number', '4');

    var n2 = new ArrayNode([a, b]);
    var n3 = new ArrayNode([c, d]);
    var n4 = new ArrayNode([n2, n3]);

    var expr = n4.compile(math);
    assert.deepEqual(expr.eval(), math.matrix([[1,2],[3,4]]));
  });

  it ('should find an ArrayNode', function () {
    // TODO
  });

  it ('should match an ArrayNode', function () {
    // TODO
  });

  it ('should stringify an ArrayNode', function () {
    var a = new ConstantNode('number', '1');
    var b = new ConstantNode('number', '2');
    var c = new ConstantNode('number', '3');
    var d = new ConstantNode('number', '4');
    var n = new ArrayNode([a, b, c, d]);

    assert.equal(n.toString(), '[1, 2, 3, 4]');
  });

});
