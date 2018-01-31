// test UnaryOperatorNode
var assert = require('assert');
var math = require('../../../index');
var ConstantNode = math.expression.node.ConstantNode;
var SymbolNode = math.expression.node.SymbolNode;
var OperatorNode = math.expression.node.OperatorNode;
var UnaryOperatorNode = math.expression.node.UnaryOperatorNode;

describe('UnaryOperatorNode', function() {

  var constantNode = new ConstantNode(2);

  it('should have isUnaryOperatorNode', function () {
    var node = new UnaryOperatorNode('op', 'fn', constantNode);
    assert(node.isUnaryOperatorNode);
  });

  it('should throw an error when calling without new operator', function () {
    assert.throws(function () {
      UnaryOperatorNode('-', 'unaryMinus', constantNode);
    }, SyntaxError);
  });

  it('should throw an error when calling without a value', function () {
    assert.throws(function () {
      UnaryOperatorNode('-', 'unaryMinus');
    }, SyntaxError);
  });

  it('should compile an UnaryOperatorNode', function () {

    var a = new ConstantNode(2);
    var n = new UnaryOperatorNode('-', 'unaryMinus', a);
    var expr = n.compile();

    assert.equal(expr.eval(), -2);
  });

  it('should throw an error in case of unresolved operator function', function () {
    var n = new UnaryOperatorNode('***', 'foo', constantNode);

    assert.throws(function () {
      n.compile();
    }, /Function foo missing in provided namespace/);
  });

  it('should filter an UnaryOperatorNode', function () {
    var twoNode = new ConstantNode(2);
    var n = new UnaryOperatorNode('-', 'unaryMinus', twoNode);

    assert.deepEqual(n.filter(function (node) {
      return node instanceof UnaryOperatorNode
    }), [n]);
    assert.deepEqual(n.filter(function (node) {
      return node instanceof SymbolNode
    }), []);
    assert.deepEqual(n.filter(function (node) {
      return node instanceof ConstantNode
    }), [twoNode]);
    assert.deepEqual(n.filter(function (node) {
      return node instanceof ConstantNode && node.value === '2'
    }), [twoNode]);
    assert.deepEqual(n.filter(function (node) {
      return node instanceof ConstantNode && node.value === '4'
    }), []);
  });

  it('should run forEach on an UnaryOperatorNode', function () {
    var x = new SymbolNode('x');
    var b = new UnaryOperatorNode('-', 'unaryMinus', x);

    var nodes = [];
    var paths = [];
    b.forEach(function (node, path, parent) {
      nodes.push(node);
      paths.push(path);
      assert.strictEqual(parent, b);
    });

    assert.deepEqual(nodes, [x]);
    assert.deepEqual(paths, ['arg']);
  });

  it('should map an UnaryOperatorNode', function () {
    var x = new SymbolNode('x');
    var b = new UnaryOperatorNode('-', 'unaryMinus', x);
    var f = new ConstantNode(3);

    var nodes = [];
    var paths = [];
    var c = b.map(function (node, path, parent) {
      nodes.push(node);
      paths.push(path);
      assert.strictEqual(parent, b);

      return node;
    });

    assert.deepEqual(nodes, [x]);
    assert.deepEqual(paths, ['arg']);

    assert.notStrictEqual(c, b);
    assert.strictEqual(c.arg, b.arg);
  });

  it('should throw an error when the map callback does not return a node', function () {
    var x = new SymbolNode('x');
    var node = new UnaryOperatorNode('-', 'unaryMinus', x);

    assert.throws(function () {
      node.map(function () {
      });
    }, /Callback function must return a Node/)
  });

  it('should transform an UnaryOperatorNodes parameters', function () {
    var x = new SymbolNode('x');
    var b = new UnaryOperatorNode('-', 'unaryMinus', x);

    var f = new ConstantNode(3);

    var transformed = b.transform(function (node) {
      return node instanceof SymbolNode && node.name === 'x' ? f : node;
    });

    var notTransformed = b.transform(function (node) {
      return node;
    });

    assert.deepEqual(transformed.arg, f);
    assert.deepEqual(notTransformed.arg, x);
  });

  it('should transform an UnaryOperatorNode itself', function () {
    var x = new SymbolNode('x');
    var b = new UnaryOperatorNode('-', 'unaryMinus', x);

    var f = new ConstantNode(3);
    var transformed = b.transform(function (node) {
      return node instanceof UnaryOperatorNode ? f : node;
    });

    assert.notStrictEqual(transformed, b);
    assert.deepEqual(transformed, f);
  });

  it('should clone an UnaryOperatorNode', function () {
    var x = new SymbolNode('x');
    var node = new UnaryOperatorNode('-', 'unaryMinus', x);

    var cloned = node.clone();
    assert(cloned instanceof UnaryOperatorNode);
    assert.deepEqual(cloned, node);
    assert.notStrictEqual(cloned, node);
    assert.strictEqual(cloned.arg, node.arg);
  });


  it('test equality another Node', function () {
    var a = new UnaryOperatorNode('-', 'unaryMinus', new SymbolNode('x'));
    var aAgain = new UnaryOperatorNode('-', 'unaryMinus', new SymbolNode('x'));
    var b = new UnaryOperatorNode('-', 'unaryMinus', new ConstantNode(2));
    var c = new UnaryOperatorNode('!', 'factorial', new SymbolNode('x'));
    var d = new UnaryOperatorNode('*', 'unaryMinus', new SymbolNode('x'));

    assert.strictEqual(a.equals(null), false);
    assert.strictEqual(a.equals(undefined), false);
    assert.strictEqual(a.equals(aAgain), true);
    assert.strictEqual(a.equals(b), false);
    assert.strictEqual(a.equals(c), false);
    assert.strictEqual(a.equals(d), false);
  });

  describe('toString', function () {
    it('should stringify an UnaryOperatorNode with factorial', function () {
      var a = new ConstantNode(2);
      var n = new UnaryOperatorNode('!', 'factorial', a);
      assert.equal(n.toString(), '2!');
    });

    it('should stringify an UnaryOperatorNode with unary minus', function () {
      var a = new ConstantNode(2);
      var n = new UnaryOperatorNode('-', 'unaryMinus', a);
      assert.equal(n.toString(), '-2');
    });

    it('should stringify UnaryOperatorNodes containing a binary OperatorNode', function () {
      assert.equal(math.parse('(a*b)!').toString(), '(a * b)!');
      assert.equal(math.parse('-(a*b)').toString(), '-(a * b)');
      assert.equal(math.parse('-(a+b)').toString(), '-(a + b)');
    });

    it('should stringify UnaryOperatorNodes containing a UnaryOperatorNode', function () {
      assert.equal(math.parse('(-a)!').toString({parenthesis: 'auto'}), '(-a)!');
      assert.equal(math.parse('-(a!)').toString({parenthesis: 'auto'}), '-a!');
      assert.equal(math.parse('-(-a)').toString({parenthesis: 'auto'}), '-(-a)');
    });
  });

  it('should stringify an UnaryOperatorNode with custom toString', function () {
    var passedNode = null;
    var string = 'should be returned from toString';

    var toStringOptions = {
      handler: function (node, options) {
        passedNode = node;
        assert.deepEqual(options, toStringOptions);
        return string;
      }
    };

    var a = new ConstantNode(1);

    var n = new UnaryOperatorNode('-', 'unaryMinus', a);

    assert.equal(n.toString(toStringOptions), string);
  });

  it('should LaTeX an UnaryOperatorNode', function () {
    var a = new ConstantNode(2);
    var n = new UnaryOperatorNode('-', 'unaryMinus', a);
    assert.equal(n.toTex(), '-2');
  });

  it('should LaTeX an UnaryOperatorNode with factorial', function () {
    var a = new ConstantNode(2);
    var n = new UnaryOperatorNode('!', 'factorial', a);
    assert.equal(n.toTex(), '2!');
  });

  it('should LaTeX an UnaryOperatorNode with factorial of an OperatorNode', function () {
    var a = new ConstantNode(2);
    var b = new ConstantNode(3);

    var sub = new OperatorNode('-', 'subtract', [a, b]);
    var add = new OperatorNode('+', 'add', [a, b]);
    var mult = new OperatorNode('*', 'multiply', [a, b]);
    var div = new OperatorNode('/', 'divide', [a, b]);

    var n1 = new UnaryOperatorNode('!', 'factorial', sub);
    var n2 = new UnaryOperatorNode('!', 'factorial', add);
    var n3 = new UnaryOperatorNode('!', 'factorial', mult);
    var n4 = new UnaryOperatorNode('!', 'factorial', div);
    assert.equal(n1.toTex(), '\\left(2-3\\right)!');
    assert.equal(n2.toTex(), '\\left(2+3\\right)!');
    assert.equal(n3.toTex(), '\\left(2\\cdot3\\right)!');
    assert.equal(n4.toTex(), '\\frac{2}{3}!');
  });

  it('should LaTeX an UnaryOperatorNode with unary minus', function () {
    var a = new ConstantNode(2);
    var b = new ConstantNode(3);

    var sub = new OperatorNode('-', 'subtract', [a, b]);
    var add = new OperatorNode('+', 'add', [a, b]);

    var n1 = new UnaryOperatorNode('-', 'unaryMinus', a);
    var n2 = new UnaryOperatorNode('-', 'unaryMinus', sub);
    var n3 = new UnaryOperatorNode('-', 'unaryMinus', add);

    assert.equal(n1.toTex(), '-2');
    assert.equal(n2.toTex(), '-\\left(2-3\\right)');
    assert.equal(n3.toTex(), '-\\left(2+3\\right)');
  });

  it('should have an identifier', function () {
    var a = new ConstantNode(1);

    var n = new UnaryOperatorNode('-', 'unaryMinus', a);

    assert.equal(n.getIdentifier(), 'UnaryOperatorNode:unaryMinus');
  });

  it('should LaTeX an UnaryOperatorNode with custom toTex for a single operator', function () {

    var passedNode = null;
    var string = 'should be returned from toString';

    var toStringOptions = {
      handler: function (node, options) {
        passedNode = node;
        assert.deepEqual(options, toStringOptions);
        return string;
      }
    };

    var a = new ConstantNode(1);

    var n = new UnaryOperatorNode('-', 'unaryMinus', a);

    assert.equal(n.toTex(toStringOptions), string);

  });
});