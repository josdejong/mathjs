// test OperatorNode
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math = require('../../../index'),
    Node = require('../../../lib/expression/node/Node'),
    ConstantNode = require('../../../lib/expression/node/ConstantNode'),
    SymbolNode = require('../../../lib/expression/node/SymbolNode'),
    OperatorNode = require('../../../lib/expression/node/OperatorNode');

describe('OperatorNode', function() {

  it ('should create an OperatorNode', function () {
    var n = new OperatorNode('op', 'fn', []);
    assert(n instanceof OperatorNode);
    assert(n instanceof Node);
    assert.equal(n.type, 'OperatorNode');
  });

  it ('should throw an error when calling without new operator', function () {
    var a = new ConstantNode(2);
    var b = new ConstantNode(3);
    assert.throws(function () {OperatorNode('+', 'add', [a, b])}, SyntaxError);
  });

  it ('should compile an OperatorNode', function () {
    var a = new ConstantNode(2);
    var b = new ConstantNode(3);
    var n = new OperatorNode('+', 'add', [a, b]);

    var expr = n.compile(math);

    assert.equal(expr.eval(), 5);
  });

  it ('should throw an error in case of unresolved operator function', function () {
    var a = new ConstantNode(2);
    var b = new ConstantNode(3);
    var n = new OperatorNode('+', 'add', [a, b]);

    var emptyNamespace = {};

    assert.throws(function () {
      n.compile(emptyNamespace);
    }, /Function add missing in provided namespace/);
  });

  it ('should filter an OperatorNode', function () {
    var a = new ConstantNode(2);
    var b = new ConstantNode(3);
    var n = new OperatorNode('+', 'add', [a, b]);

    assert.deepEqual(n.filter(function (node) {return node instanceof OperatorNode}),  [n]);
    assert.deepEqual(n.filter(function (node) {return node instanceof SymbolNode}),    []);
    assert.deepEqual(n.filter(function (node) {return node instanceof ConstantNode}),  [a, b]);
    assert.deepEqual(n.filter(function (node) {return node instanceof ConstantNode && node.value == '2'}),  [a]);
    assert.deepEqual(n.filter(function (node) {return node instanceof ConstantNode && node.value == '4'}),  []);
  });

  it ('should filter an OperatorNode without contents', function () {
    var n = new OperatorNode('op', 'fn', []);

    assert.deepEqual(n.filter(function (node) {return node instanceof OperatorNode}),  [n]);
    assert.deepEqual(n.filter(function (node) {return node instanceof SymbolNode}),    []);
  });

  it ('should run forEach on an OperatorNode', function () {
    // x^2-x
    var a = new SymbolNode('x');
    var b = new ConstantNode(2);
    var c = new OperatorNode('^', 'pow', [a, b]);
    var d = new SymbolNode('x');
    var e = new OperatorNode('-', 'subtract', [c, d]);

    var nodes = [];
    var paths = [];
    e.forEach(function (node, path, parent) {
      nodes.push(node);
      paths.push(path);
      assert.strictEqual(parent, e);
    });

    assert.equal(nodes.length, 2);
    assert.strictEqual(nodes[0], c);
    assert.strictEqual(nodes[1], d);
    assert.deepEqual(paths, ['args[0]', 'args[1]']);
  });

  it ('should map an OperatorNode', function () {
    // x^2-x
    var a = new SymbolNode('x');
    var b = new ConstantNode(2);
    var c = new OperatorNode('^', 'pow', [a, b]);
    var d = new SymbolNode('x');
    var e = new OperatorNode('-', 'subtract', [c, d]);

    var nodes = [];
    var paths = [];
    var f = new ConstantNode(3);
    var g = e.map(function (node, path, parent) {
      nodes.push(node);
      paths.push(path);
      assert.strictEqual(parent, e);

      return node instanceof SymbolNode && node.name == 'x' ? f : node;
    });

    assert.equal(nodes.length, 2);
    assert.strictEqual(nodes[0], c);
    assert.strictEqual(nodes[1], d);
    assert.deepEqual(paths, ['args[0]', 'args[1]']);

    assert.notStrictEqual(g,  e);
    assert.strictEqual(g.args[0], e.args[0]);
    assert.strictEqual(g.args[0].args[0], a); // nested x is not replaced
    assert.deepEqual(g.args[0].args[1], b);
    assert.deepEqual(g.args[1],  f);
  });

  it ('should throw an error when the map callback does not return a node', function () {
    var a = new SymbolNode('x');
    var b = new ConstantNode(2);
    var c = new OperatorNode('^', 'pow', [a, b]);

    assert.throws(function () {
      c.map(function () {});
    }, /Callback function must return a Node/)
  });

  it ('should transform an OperatorNodes parameters', function () {
    // x^2-x
    var a = new SymbolNode('x');
    var b = new ConstantNode(2);
    var c = new OperatorNode('^', 'pow', [a, b]);
    var d = new SymbolNode('x');
    var e = new OperatorNode('-', 'subtract', [c, d]);

    var f = new ConstantNode(3);
    var g = e.transform(function (node) {
      return node instanceof SymbolNode && node.name == 'x' ? f : node;
    });

    assert.notStrictEqual(g,  e);
    assert.notStrictEqual(g.args[0], e.args[0]);
    assert.strictEqual(g.args[0].args[0],  f);
    assert.deepEqual(g.args[0].args[1],  b);
    assert.deepEqual(g.args[1],  f);
  });

  it ('should transform an OperatorNode itself', function () {
    // x^2-x
    var a = new SymbolNode('x');
    var b = new ConstantNode(2);
    var c = new OperatorNode('+', 'add', [a, b]);

    var f = new ConstantNode(3);
    var g = c.transform(function (node) {
      return node instanceof OperatorNode ? f : node;
    });

    assert.notStrictEqual(g, c);
    assert.deepEqual(g,  f);
  });

  it ('should clone an OperatorNode', function () {
    // x^2-x
    var a = new SymbolNode('x');
    var b = new ConstantNode(2);
    var c = new OperatorNode('+', 'add', [a, b]);

    var d = c.clone();
    assert(d instanceof OperatorNode);
    assert.deepEqual(d, c);
    assert.notStrictEqual(d, c);
    assert.notStrictEqual(d.args, c.args);
    assert.strictEqual(d.args[0], c.args[0]);
    assert.strictEqual(d.args[1], c.args[1]);
  });

  describe('toString', function () {
    it ('should stringify an OperatorNode', function () {
      var a = new ConstantNode(2);
      var b = new ConstantNode(3);
      var c = new ConstantNode(4);

      var n = new OperatorNode('+', 'add', [a, b]);
      assert.equal(n.toString(), '2 + 3');
    });

    it ('should stringify an OperatorNode with factorial', function () {
      var a = new ConstantNode(2);
      var n = new OperatorNode('!', 'factorial', [a]);
      assert.equal(n.toString(), '2!');
    });

    it ('should stringify an OperatorNode with unary minus', function () {
      var a = new ConstantNode(2);
      var n = new OperatorNode('-', 'unaryMinus', [a]);
      assert.equal(n.toString(), '-2');
    });

    it ('should stringify an OperatorNode with zero arguments', function () {
      var n = new OperatorNode('foo', 'foo', []);
      assert.equal(n.toString(), 'foo()');
    });

    it ('should stringify an OperatorNode with more than two operators', function () {
      var a = new ConstantNode(2);
      var b = new ConstantNode(3);
      var c = new ConstantNode(4);

      var n = new OperatorNode('foo', 'foo', [a, b, c]);
      assert.equal(n.toString(), 'foo(2, 3, 4)');

    });

    it ('should stringify an OperatorNode with nested operator nodes', function () {
      var a = new ConstantNode(2);
      var b = new ConstantNode(3);
      var c = new ConstantNode(4);
      var d = new ConstantNode(5);

      var n1 = new OperatorNode('+', 'add', [a, b]);
      var n2 = new OperatorNode('-', 'subtract', [c, d]);
      var n3 = new OperatorNode('*', 'multiply', [n1, n2]);

      assert.equal(n1.toString(), '2 + 3');
      assert.equal(n2.toString(), '4 - 5');
      assert.equal(n3.toString(), '(2 + 3) * (4 - 5)');
    });

    it ('should stringify left associative OperatorNodes that are associative with another Node', function () {
      assert.equal(math.parse('(a+b)+c').toString(), 'a + b + c');
      assert.equal(math.parse('a+(b+c)').toString(), 'a + b + c');
      assert.equal(math.parse('(a+b)-c').toString(), 'a + b - c');
      assert.equal(math.parse('a+(b-c)').toString(), 'a + b - c');

      assert.equal(math.parse('(a*b)*c').toString(), 'a * b * c');
      assert.equal(math.parse('a*(b*c)').toString(), 'a * b * c');
      assert.equal(math.parse('(a*b)/c').toString(), 'a * b / c');
      assert.equal(math.parse('a*(b/c)').toString(), 'a * b / c');
    });

    it ('should stringify left associative OperatorNodes that are not associative with another Node', function () {
      assert.equal(math.parse('(a-b)-c').toString(), 'a - b - c');
      assert.equal(math.parse('a-(b-c)').toString(), 'a - (b - c)');
      assert.equal(math.parse('(a-b)+c').toString(), 'a - b + c');
      assert.equal(math.parse('a-(b+c)').toString(), 'a - (b + c)');

      assert.equal(math.parse('(a/b)/c').toString(), 'a / b / c');
      assert.equal(math.parse('a/(b/c)').toString(), 'a / (b / c)');
      assert.equal(math.parse('(a/b)*c').toString(), 'a / b * c');
      assert.equal(math.parse('a/(b*c)').toString(), 'a / (b * c)');
    });

    it ('should stringify right associative OperatorNodes that are not associative with another Node', function () {
      assert.equal(math.parse('(a^b)^c').toString(), '(a ^ b) ^ c');
      assert.equal(math.parse('a^(b^c)').toString(), 'a ^ b ^ c');
    });

    it ('should stringify unary OperatorNodes containing a binary OperatorNode', function () {
      assert.equal(math.parse('(a*b)!').toString(), '(a * b)!');
      assert.equal(math.parse('-(a*b)').toString(), '-(a * b)');
      assert.equal(math.parse('-(a+b)').toString(), '-(a + b)');
    });

    it ('should stringify unary OperatorNodes containing a unary OperatorNode', function () {
      assert.equal(math.parse('(-a)!').toString(), '(-a)!');
      assert.equal(math.parse('-(a!)').toString(), '-a!');
      assert.equal(math.parse('-(-a)').toString(), '-(-a)');
    });
  });

  it ('should LaTeX an OperatorNode', function () {
    var a = new ConstantNode(2);
    var b = new ConstantNode(3);
    var c = new ConstantNode(4);

    var n = new OperatorNode('+', 'add', [a, b]);
    assert.equal(n.toTex(), '{2} + {3}');
  });

  it ('should LaTeX an OperatorNode with factorial', function () {
    var a = new ConstantNode(2);
    var n = new OperatorNode('!', 'factorial', [a]);
    assert.equal(n.toTex(), '2!');
  });

  it ('should LaTeX an OperatorNode with factorial of an OperatorNode', function () {
    var a = new ConstantNode(2);
    var b = new ConstantNode(3);

    var sub = new OperatorNode('-', 'subtract', [a, b]);
    var add = new OperatorNode('+', 'add', [a, b]);
    var mult = new OperatorNode('*', 'multiply', [a, b]);
    var div = new OperatorNode('/', 'divide', [a, b]);

    var n1= new OperatorNode('!', 'factorial', [sub] );
    var n2= new OperatorNode('!', 'factorial', [add] );
    var n3= new OperatorNode('!', 'factorial', [mult] );
    var n4= new OperatorNode('!', 'factorial', [div] );
    assert.equal(n1.toTex(), '\\left({{2} - {3}}\\right)!');
    assert.equal(n2.toTex(), '\\left({{2} + {3}}\\right)!');
    assert.equal(n3.toTex(), '\\left({{2} \\cdot {3}}\\right)!');
    assert.equal(n4.toTex(), '\\left({\\frac{2}{3}}\\right)!');
  });

  it ('should LaTeX an OperatorNode with unary minus', function () {
    var a = new ConstantNode(2);
    var b = new ConstantNode(3);

    var sub = new OperatorNode('-', 'subtract', [a, b]);
    var add = new OperatorNode('+', 'add', [a, b]);

    var n1 = new OperatorNode('-', 'unaryMinus', [a]);
    var n2 = new OperatorNode('-', 'unaryMinus', [sub]);
    var n3 = new OperatorNode('-', 'unaryMinus', [add]);

    assert.equal(n1.toTex(), '-2');
    assert.equal(n2.toTex(), '-\\left({{2} - {3}}\\right)');
    assert.equal(n3.toTex(), '-\\left({{2} + {3}}\\right)');
  });

  it ('should LaTeX an OperatorNode that subtracts an OperatorNode', function() {
    var a = new ConstantNode(1);
    var b = new ConstantNode(2);
    var c = new ConstantNode(3);

    var sub = new OperatorNode('-', 'subtract', [b, c]);
    var add = new OperatorNode('+', 'add', [b, c]);

    var n1 = new OperatorNode('-', 'subtract', [a, sub]);
    var n2 = new OperatorNode('-', 'subtract', [a, add]);

    assert.equal(n1.toTex(), '{1} - \\left({{2} - {3}}\\right)');
    assert.equal(n2.toTex(), '{1} - \\left({{2} + {3}}\\right)');
  });

  it ('should LaTeX an OperatorNode with zero arguments', function () {
    var n = new OperatorNode('foo', 'foo', []);
    assert.equal(n.toTex(), 'foo\\left({}\\right)');
  });

  it ('should LaTeX an OperatorNode with more than two operators', function () {
    var a = new ConstantNode(2);
    var b = new ConstantNode(3);
    var c = new ConstantNode(4);

    var n = new OperatorNode('foo', 'foo', [a, b, c]);
    assert.equal(n.toTex(), 'foo\\left({2, 3, 4}\\right)');

  });

  it ('should LaTeX an OperatorNode with nested operator nodes', function () {
    var a = new ConstantNode(2);
    var b = new ConstantNode(3);
    var c = new ConstantNode(4);
    var d = new ConstantNode(5);

    var n1 = new OperatorNode('+', 'add', [a, b]);
    var n2 = new OperatorNode('-', 'subtract', [c, d]);
    var n3 = new OperatorNode('*', 'multiply', [n1, n2]);

    var m2 = new OperatorNode('*', 'multiply', [n1, c]);
    var m3 = new OperatorNode('-', 'subtract', [m2, d]);

    assert.equal(n1.toTex(), '{2} + {3}');
    assert.equal(n2.toTex(), '{4} - {5}');
    assert.equal(n3.toTex(), '\\left({{2} + {3}}\\right) \\cdot \\left({{4} - {5}}\\right)');
    assert.equal(m3.toTex(), '{\\left({{2} + {3}}\\right) \\cdot {4}} - {5}');
  });

  it ('should have an identifier', function () {
    var a = new ConstantNode(1);
    var b = new ConstantNode(2);

    var n = new OperatorNode('+', 'add', [a, b]);

    assert.equal(n.getIdentifier(), 'OperatorNode:add');
  });

  it ('should LaTeX an OperatorNode with custom toTex', function () {
    //Also checks if the custom functions get passed on to the children
    var customFunction = function (node, callback) {
      if (node.type === 'OperatorNode') {
        return node.op + node.fn + '(' 
          + node.args[0].toTex(callback)
          + ', ' +  node.args[1].toTex(callback) + ')';
      }
      else if (node.type === 'ConstantNode') {
        return 'const\\left(' + node.value + ', ' + node.valueType + '\\right)'
      }
    };

    var a = new ConstantNode(1);
    var b = new ConstantNode(2);

    var n1 = new OperatorNode('+', 'add', [a, b]);
	var n2 = new OperatorNode('-', 'subtract', [a, b]);

    assert.equal(n1.toTex(customFunction), '+add(const\\left(1, number\\right), const\\left(2, number\\right))');
    assert.equal(n2.toTex(customFunction), '-subtract(const\\left(1, number\\right), const\\left(2, number\\right))');
  });

  it ('should LaTeX an OperatorNode with custom toTex for a single operator', function () {
    //Also checks if the custom functions get passed on to the children
    var customFunction = function (node, callback) {
      if ((node.type === 'OperatorNode') && (node.fn === 'add')) {
        return node.args[0].toTex(callback)
          + node.op + node.fn + node.op + 
          node.args[1].toTex(callback);
      }
      else if (node.type === 'ConstantNode') {
        return 'const\\left(' + node.value + ', ' + node.valueType + '\\right)'
      }
    };

    var a = new ConstantNode(1);
    var b = new ConstantNode(2);

    var n = new OperatorNode('+', 'add', [a, b]);

    assert.equal(n.toTex(customFunction), 'const\\left(1, number\\right)+add+const\\left(2, number\\right)');
  });

});
