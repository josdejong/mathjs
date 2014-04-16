// test parse
var assert = require('assert'),
    approx = require('../../tools/approx'),
    mathjs = require('../../index'),
    parse = require('../../lib/expression/parse'),
    math = mathjs(),
    Complex = math.type.Complex,
    Matrix = math.type.Matrix,
    Unit = math.type.Unit;

/**
 * Helper function to parse an expression and immediately evaluate its results
 * @param {String} expr
 * @param {Object} [scope]
 * @return {*} result
 */
function parseAndEval(expr, scope) {
  return parse(expr)
      .compile(math)
      .eval(scope);
}

describe('parse', function() {

  it('should parse a single expression', function() {
    approx.equal(parse('2 + 6 / 3').compile(math).eval(), 4);
  });

  it('should parse an empty expression', function() {
    assert.strictEqual(parse('').compile(math).eval(), undefined);
  });

  it('should parse an array with expressions', function() {
    var scope = {};
    assert.deepEqual(parse(['a=3', 'b=4', 'a*b']).map(function (node) {
      return node.compile(math).eval(scope);
    }), [3, 4, 12]);
  });

  it('should parse a matrix with expressions', function() {
    var scope = {};
    assert.deepEqual(parse(new Matrix(['a=3', 'b=4', 'a*b'])).map(function (node) {
      return node.compile(math).eval(scope);
    }), new Matrix([3, 4, 12]));
  });

  it('should parse an array with an empty expression', function() {
    assert.deepEqual(parse(['']).map(function (node) {
      return node.compile(math).eval();
    }), [undefined]);
  });

  it('should parse an array with an empty expression', function() {
    assert.deepEqual(parse(new Matrix([''])).map(function (node) {
      return node.compile(math).eval();
    }), new Matrix([undefined]));
  });

  it('should parse multiline expressions', function() {
    assert.deepEqual(parse('a=3\nb=4\na*b').compile(math).eval(), [3, 4, 12]);
    assert.deepEqual(parse('b = 43; b * 4').compile(math).eval(), [172]);
  });

  it('should skip empty lines in multiline expressions', function() {
    assert.deepEqual(parse('\n;\n2 * 4\n').compile(math).eval(), [8]);
  });

  it('should give informative syntax errors', function() {
    assert.throws(function () {parse('sin pi').compile(math).eval()}, /First parameter in Unit constructor must be a number/);
    assert.throws(function () {parse('2 +')}, /Unexpected end of expression \(char 5\)/);
    assert.throws(function () {parse('2 ~ 3')}, /Syntax error in part "~ 3" \(char 3\)/);
    assert.throws(function () {parse('2 + 3\n3 +\n-4')}, /Value expected \(char 10\)/);
  });

  it('should throw an error if called with wrong number of arguments', function() {
    assert.throws(function () {parse()}, SyntaxError);
    assert.throws(function () {parse(1,2,3)}, SyntaxError);
    assert.throws(function () {parse([1, 2])}, TypeError);
  });

  it('should throw an error if called with a wrong type of argument', function() {
    assert.throws(function () {parse(23)}, TypeError);
    assert.throws(function () {parse(math.unit('5cm'))}, TypeError);
    assert.throws(function () {parse(new Complex(2,3))}, TypeError);
    assert.throws(function () {parse(true)}, TypeError);
  });

  it('should throw an error in case of unsupported characters', function() {
    assert.throws(function () {parse('2\u00A1')}, /Syntax error in part "\u00A1"/);
  });

  describe('comments', function () {

    it('should skip comments', function() {
      assert.equal(parseAndEval('2 + 3 # - 4'), 5);
    });

    it('should skip comments in a block', function() {
      assert.deepEqual(parseAndEval('2 + 3 # - 4\n6-2'), [5, 4]);
    });

  });

  describe('number', function () {

    it('should parse valid numbers', function() {
      assert.equal(parseAndEval('0'), 0);
      assert.equal(parseAndEval('3'), 3);
      assert.equal(parseAndEval('3.2'), 3.2);
      assert.equal(parseAndEval('003.2'), 3.2);
      assert.equal(parseAndEval('003.200'), 3.2);
      assert.equal(parseAndEval('.2'), 0.2);
      assert.equal(parseAndEval('2.'), 2);
      assert.equal(parseAndEval('3e2'), 300);
      assert.equal(parseAndEval('300e2'), 30000);
      assert.equal(parseAndEval('300e+2'), 30000);
      assert.equal(parseAndEval('300e-2'), 3);
      assert.equal(parseAndEval('300E-2'), 3);
      assert.equal(parseAndEval('3.2e2'), 320);
    });

    it('should throw an error with invalid numbers', function() {
      assert.throws(function () {parseAndEval('.'); }, SyntaxError);
      assert.throws(function () {parseAndEval('3.2.2'); }, SyntaxError);
      assert.throws(function () {parseAndEval('3.2e2.2'); }, SyntaxError);
      assert.throws(function () {parseAndEval('32e'); }, SyntaxError);
      assert.throws(function () {parseAndEval('3abc'); }, SyntaxError);
    });

  });

  describe('bignumber', function () {

    it('should parse bignumbers', function() {
      assert.deepEqual(parseAndEval('bignumber(0.1)'), math.bignumber(0.1));
      assert.deepEqual(parseAndEval('bignumber("1.2e500")'), math.bignumber('1.2e500'));
    });

    it('should output bignumbers if default number type is bignumber', function() {
      var math = mathjs({
        number: 'bignumber'
      });

      assert.deepEqual(parse('0.1').compile(math).eval(), math.bignumber(0.1));
      assert.deepEqual(parse('1.2e5000').compile(math).eval(), math.bignumber('1.2e5000'));
    });

  });

  describe('string', function () {

    it('should parse a string', function() {
      assert.deepEqual(parseAndEval('"hello"'), "hello");
      assert.deepEqual(parseAndEval('   "hi" '), "hi");
    });

    it('should throw an error with invalid strings', function() {
      assert.throws(function () {parseAndEval('"hi'); }, SyntaxError);
      assert.throws(function () {parseAndEval(' hi" '); }, Error);
    });

    it('should get a string subset', function() {
      var scope = {};
      assert.deepEqual(parseAndEval('c="hello"', scope), "hello");
      assert.deepEqual(parseAndEval('c[2:4]', scope), "ell");
      assert.deepEqual(parseAndEval('c[5:-1:1]', scope), "olleh");
      assert.deepEqual(parseAndEval('c[end-2:-1:1]', scope), "leh");
    });

    it('should set a string subset', function() {
      var scope = {};
      assert.deepEqual(parseAndEval('c="hello"', scope), "hello");
      assert.deepEqual(parseAndEval('c[1] = "H"', scope), "Hello");
      assert.deepEqual(parseAndEval('c', scope), "Hello");
      assert.deepEqual(parseAndEval('c[6:11] = " world"', scope), "Hello world");
      assert.deepEqual(parseAndEval('c', scope), "Hello world");
      assert.deepEqual(scope.c, "Hello world");
    });

  });

  describe('unit', function () {

    it('should parse units', function() {
      assert.deepEqual(parseAndEval('5cm'), new Unit(5, 'cm'));
      assert.ok(parseAndEval('5cm') instanceof Unit);
    });

    it('should correctly parse negative temperatures', function () {
      approx.deepEqual(parseAndEval('-6 celsius'), new Unit(-6, 'celsius'));
      approx.deepEqual(parseAndEval('--6 celsius'), new Unit(6, 'celsius'));
      approx.deepEqual(parseAndEval('-6 celsius to fahrenheit'),
          new Unit(21.2, 'fahrenheit').to('fahrenheit'));
    });

    it('should convert units', function() {
      var scope = {};
      approx.deepEqual(parseAndEval('(5.08 cm * 1000) to inch', scope),
          math.unit(2000, 'inch').to('inch'));
      approx.deepEqual(parseAndEval('(5.08 cm * 1000) to mm', scope),
          math.unit(50800, 'mm').to('mm'));
      approx.deepEqual(parseAndEval('ans to inch', scope),
          math.unit(2000, 'inch').to('inch'));

      approx.deepEqual(parseAndEval('10 celsius to fahrenheit'),
          math.unit(50, 'fahrenheit').to('fahrenheit'));
      approx.deepEqual(parseAndEval('20 celsius to fahrenheit'),
          math.unit(68, 'fahrenheit').to('fahrenheit'));
      approx.deepEqual(parseAndEval('50 fahrenheit to celsius'),
          math.unit(10, 'celsius').to('celsius'));
    });

    it('should evaluate operator "to" with correct precedence ', function () {
      approx.deepEqual(parseAndEval('5.08 cm * 1000 to inch'),
          new Unit(2000, 'inch').to('inch'));
    });

    it('should evaluate operator "in" (alias of "to") ', function () {
      approx.deepEqual(parseAndEval('5.08 cm in inch'),
          new Unit(2, 'inch').to('inch'));
    });

    it('should evaluate unit "in" (should not conflict with operator "in")', function () {
      approx.deepEqual(parseAndEval('2 in'),
          new Unit(2, 'in'));
      approx.deepEqual(parseAndEval('5.08 cm in in'),
          new Unit(2, 'in').to('in'));
      approx.deepEqual(parseAndEval('5 in in in'),
          new Unit(5, 'in').to('in'));
      approx.deepEqual(parseAndEval('2 in to meter'),
          new Unit(2, 'inch').to('meter'));
      approx.deepEqual(parseAndEval('2 in in meter'),
          new Unit(2, 'inch').to('meter'));
    });
  });

  describe('complex', function () {

    it('should parse complex values', function () {
      assert.deepEqual(parseAndEval('i'), new Complex(0,1));
      assert.deepEqual(parseAndEval('2+3i'), new Complex(2,3));
      assert.deepEqual(parseAndEval('2+3*i'), new Complex(2,3));
    });

  });

  describe('matrix', function () {

    it('should parse a matrix', function() {
      assert.ok(parseAndEval('[1,2;3,4]') instanceof Matrix);

      var m = parseAndEval('[1,2,3;4,5,6]');
      assert.deepEqual(m.size(), [2,3]);
      assert.deepEqual(m, new Matrix([[1,2,3],[4,5,6]]));

      var b = parseAndEval('[5, 6; 1, 1]');
      assert.deepEqual(b.size(), [2,2]);
      assert.deepEqual(b, new Matrix([[5,6],[1,1]]));

      // from 1 to n dimensions
      assert.deepEqual(parseAndEval('[ ]'), new Matrix([]));
      assert.deepEqual(parseAndEval('[1,2,3]'), new Matrix([1,2,3]));
      assert.deepEqual(parseAndEval('[1;2;3]'), new Matrix([[1],[2],[3]]));
      assert.deepEqual(parseAndEval('[[1,2],[3,4]]'), new Matrix([[1,2],[3,4]]));
      assert.deepEqual(parseAndEval('[[[1],[2]],[[3],[4]]]'), new Matrix([[[1],[2]],[[3],[4]]]));
    });

    it('should skip newlines in a matrix', function() {
      assert.deepEqual(parseAndEval('[\n  1,2;\n  3,4\n]'), new Matrix([[1,2], [3,4]]));
    });

    it('should parse an empty matrix', function() {
      assert.deepEqual(parseAndEval('[]'), new Matrix([]));
    });

    it('should get a matrix subset', function() {
      var scope = {
        a: new Matrix([
          [1,2,3],
          [4,5,6],
          [7,8,9]
        ])
      };
      assert.deepEqual(parseAndEval('a[2, :]', scope),        new Matrix([4,5,6]));
      assert.deepEqual(parseAndEval('a[2, :2]', scope),       new Matrix([4,5]));
      assert.deepEqual(parseAndEval('a[2, :end-1]', scope),   new Matrix([4,5]));
      assert.deepEqual(parseAndEval('a[2, 2:]', scope),       new Matrix([5,6]));
      assert.deepEqual(parseAndEval('a[2, 2:3]', scope),      new Matrix([5,6]));
      assert.deepEqual(parseAndEval('a[2, 1:2:3]', scope),    new Matrix([4,6]));
      assert.deepEqual(parseAndEval('a[:, 2]', scope),        new Matrix([[2],[5],[8]]));
      assert.deepEqual(parseAndEval('a[:2, 2]', scope),       new Matrix([[2],[5]]));
      assert.deepEqual(parseAndEval('a[:end-1, 2]', scope),   new Matrix([[2],[5]]));
      assert.deepEqual(parseAndEval('a[2:, 2]', scope),       new Matrix([[5],[8]]));
      assert.deepEqual(parseAndEval('a[2:3, 2]', scope),      new Matrix([[5],[8]]));
      assert.deepEqual(parseAndEval('a[1:2:3, 2]', scope),    new Matrix([[2],[8]]));
    });

    it('should parse matrix resizings', function() {
      var scope = {};
      assert.deepEqual(parseAndEval('a = []', scope),    new Matrix([]));
      assert.deepEqual(parseAndEval('a[1:3,1] = [1;2;3]', scope), new Matrix([[1],[2],[3]]));
      assert.deepEqual(parseAndEval('a[:,2] = [4;5;6]', scope), new Matrix([[1,4],[2,5],[3,6]]));

      assert.deepEqual(parseAndEval('a = []', scope),    new Matrix([]));
      assert.deepEqual(parseAndEval('a[1,3] = 3', scope), new Matrix([arr(uninit,uninit,3)]));
      assert.deepEqual(parseAndEval('a[2,:] = [[4,5,6]]', scope), new Matrix([arr(uninit, uninit, 3),[4,5,6]]));

      assert.deepEqual(parseAndEval('a = []', scope),    new Matrix([]));
      assert.deepEqual(parseAndEval('a[3,1] = 3', scope), new Matrix([arr(uninit),arr(uninit),[3]]));
      assert.deepEqual(parseAndEval('a[:,2] = [4;5;6]', scope), new Matrix([arr(uninit,4),arr(uninit,5),[3,6]]));

      assert.deepEqual(parseAndEval('a = []', scope),    new Matrix([]));
      assert.deepEqual(parseAndEval('a[1,1:3] = [[1,2,3]]', scope), new Matrix([[1,2,3]]));
      assert.deepEqual(parseAndEval('a[2,:] = [[4,5,6]]', scope), new Matrix([[1,2,3],[4,5,6]]));
    });

    it('should get/set the matrix correctly', function() {
      var scope = {};
      parseAndEval('a=[1,2;3,4]', scope);
      parseAndEval('a[1,1] = 100', scope);
      assert.deepEqual(scope.a.size(), [2,2]);
      assert.deepEqual(scope.a, new Matrix([[100,2],[3,4]]));
      parseAndEval('a[2:3,2:3] = [10,11;12,13]', scope);
      assert.deepEqual(scope.a.size(), [3,3]);
      assert.deepEqual(scope.a, new Matrix([arr(100, 2, uninit),[3,10,11],arr(uninit,12,13)]));
      var a = scope.a;
      // note: after getting subset, uninitialized elements are replaced by elements with an undefined value
      assert.deepEqual(a.subset(math.index([0,3], [0,2])), new Matrix([[100,2],[3,10],[undefined,12]]));
      assert.deepEqual(parseAndEval('a[1:3,1:2]', scope), new Matrix([[100,2],[3,10],[undefined,12]]));

      scope.b = [[1,2],[3,4]];
      assert.deepEqual(parseAndEval('b[1,:]', scope), [1, 2]);
    });

    it('should get/set the matrix correctly for 3d matrices', function() {
      var scope = {};
      assert.deepEqual(parseAndEval('f=[1,2;3,4]', scope), new Matrix([[1,2],[3,4]]));
      assert.deepEqual(parseAndEval('size(f)', scope), new Matrix([2,2]));
      /* TODO: doesn't work correctly
       assert.deepEqual(parseAndEval('f[:,:,1]=[5,6;7,8]', scope), new Matrix([
       [
       [1,2],
       [3,4]
       ],
       [
       [5,6],
       [7,8]
       ]
       ]));
       */
      scope.f = new Matrix([
        [
          [1,5],
          [2,6]
        ],
        [
          [3,7],
          [4,8]
        ]
      ]);
      assert.deepEqual(parseAndEval('size(f)', scope), new Matrix([2,2,2]));
      assert.deepEqual(parseAndEval('f[:,:,1]', scope), new Matrix([[[1],[2]],[[3],[4]]]));
      assert.deepEqual(parseAndEval('f[:,:,2]', scope), new Matrix([[[5],[6]],[[7],[8]]]));
      assert.deepEqual(parseAndEval('f[:,2,:]', scope), new Matrix([[[2,6]],[[4,8]]]));
      assert.deepEqual(parseAndEval('f[2,:,:]', scope), new Matrix([[3,7],[4,8]]));

      parseAndEval('a=diag([1,2,3,4])', scope);
      assert.deepEqual(parseAndEval('a[3:end, 3:end]', scope), new Matrix([[3,0],[0,4]]));
      assert.deepEqual(parseAndEval('a[3:end, 2:end]=9*ones(2,3)', scope), new Matrix([
        [1,0,0,0],
        [0,2,0,0],
        [0,9,9,9],
        [0,9,9,9]
      ]));
      assert.deepEqual(parseAndEval('a[2:end-1, 2:end-1]', scope), new Matrix([[2,0],[9,9]]));
    });

    it('should merge nested matrices', function() {
      var scope = {};
      parseAndEval('a=[1,2;3,4]', scope);

    });

    it('should parse matrix concatenations', function() {
      var scope = {};
      parseAndEval('a=[1,2;3,4]', scope);
      parseAndEval('b=[5,6;7,8]', scope);
      assert.deepEqual(parseAndEval('c=concat(a,b)', scope), new Matrix([[1,2,5,6],[3,4,7,8]]));
      assert.deepEqual(parseAndEval('c=concat(a,b,0)', scope), new Matrix([[1,2],[3,4],[5,6],[7,8]]));
      assert.deepEqual(parseAndEval('c=concat(concat(a,b), concat(b,a), 0)', scope), new Matrix([[1,2,5,6],[3,4,7,8],[5,6,1,2],[7,8,3,4]]));
      assert.deepEqual(parseAndEval('c=concat([[1,2]], [[3,4]], 0)', scope), new Matrix([[1,2],[3,4]]));
      assert.deepEqual(parseAndEval('c=concat([[1]], [2;3], 0)', scope), new Matrix([[1],[2],[3]]));
      assert.deepEqual(parseAndEval('d=1:3', scope), new Matrix([1,2,3]));
      assert.deepEqual(parseAndEval('concat(d,d)', scope), new Matrix([1,2,3,1,2,3]));
      assert.deepEqual(parseAndEval('e=1+d', scope), new Matrix([2,3,4]));
      assert.deepEqual(parseAndEval('size(e)', scope), new Matrix([3]));
      assert.deepEqual(parseAndEval('concat(e,e)', scope), new Matrix([2,3,4,2,3,4]));
      assert.deepEqual(parseAndEval('[[],[]]', scope), new Matrix([[],[]]));
      assert.deepEqual(parseAndEval('[[],[]]', scope).size(), [2, 0]);
      assert.deepEqual(parseAndEval('size([[],[]])', scope), new Matrix([2, 0]));
    });

    it('should throw an error for invalid matrix', function() {
      assert.throws(function () {parseAndEval('[1, 2')}, /End of matrix ] expected/);
      assert.throws(function () {parseAndEval('[1; 2')}, /End of matrix ] expected/);
    });

    it('should throw an error when matrix rows mismatch', function() {
      assert.throws(function () {parseAndEval('[1, 2; 1, 2, 3]')}, /Column dimensions mismatch/);
    });

    it('should throw an error for invalid matrix subsets', function() {
      var scope = {a: [1,2,3]};
      assert.throws(function () {parseAndEval('a[1', scope)}, /Parenthesis ] expected/);
    });

    it('should throw an error for invalid matrix concatenations', function() {
      var scope = {};
      assert.throws(function () {parseAndEval('c=concat(a, [1,2,3])', scope)});
    });
  });

  describe('boolean', function () {

    it('should parse boolean values', function () {
      assert.equal(parseAndEval('true'), true);
      assert.equal(parseAndEval('false'), false);
    });

  });


  describe('constants', function () {

    it('should parse constants', function() {
      assert.deepEqual(parseAndEval('i'), new Complex(0, 1));
      approx.equal(parseAndEval('pi'), Math.PI);
      approx.equal(parseAndEval('e'), Math.E);
    });

  });

  describe('variables', function () {

    it('should parse valid variable assignments', function() {
      var scope = {};
      assert.equal(parseAndEval('a = 0.75', scope), 0.75);
      assert.equal(parseAndEval('a + 2', scope), 2.75);
      assert.equal(parseAndEval('a = 2', scope), 2);
      assert.equal(parseAndEval('a + 2', scope), 4);
      approx.equal(parseAndEval('pi * 2', scope), 6.283185307179586);
    });

    it('should throw an error on undefined symbol', function() {
      assert.throws(function() {parseAndEval('qqq + 2'); });
    });

    it('should throw an error on invalid assignments', function() {
      //assert.throws(function () {parseAndEval('sin(2) = 0.75')}, SyntaxError); // TODO: should this throw an exception?
      assert.throws(function () {parseAndEval('sin + 2 = 3')}, SyntaxError);
    });

    it('should parse nested assignments', function() {
      var scope = [];
      assert.equal(parseAndEval('c = d = (e = 4.5)', scope), 4.5);
      assert.equal(scope.c, 4.5);
      assert.equal(scope.d, 4.5);
      assert.equal(scope.e, 4.5);
      assert.deepEqual(parseAndEval('a = [1,2,f=3]', scope), new Matrix([1,2,3]));
      assert.equal(scope.f, 3);
      assert.equal(parseAndEval('2 + (g = 3 + 4)', scope), 9);
      assert.equal(scope.g, 7);
    });

    it('should throw an error for invalid nested assignments', function() {
      assert.throws(function () {parseAndEval('a(j = 3)', {})}, SyntaxError);
    });

  });


  describe('functions', function () {

    it('should parse functions', function() {
      assert.equal(parseAndEval('sqrt(4)'), 2);
      assert.equal(parseAndEval('sqrt(6+3)'), 3);
      assert.equal(parseAndEval('atan2(2,2)'), 0.7853981633974483);
      assert.deepEqual(parseAndEval('sqrt(-4)'), new Complex(0, 2));
      assert.equal(parseAndEval('abs(-4.2)'), 4.2);
      assert.equal(parseAndEval('add(2, 3)'), 5);
      approx.deepEqual(parseAndEval('1+exp(pi*i)'), new Complex(0, 0));
      assert.equal(parseAndEval('unequal(2, 3)'), true);
    });

    it('should parse functions without parameters', function() {
      assert.equal(parseAndEval('r()', {r: function() {return 2;}}), 2);
    });

    it('should parse function assignments', function() {
      var scope = {};
      parseAndEval('x=100', scope); // for testing scoping of the function variables
      assert.equal(parseAndEval('f(x) = x^2', scope).syntax, 'f(x)');
      assert.equal(parseAndEval('f(3)', scope), 9);
      assert.equal(scope.f(3), 9);
      assert.equal(scope.x, 100);
      assert.equal(parseAndEval('g(x, y) = x^y', scope).syntax, 'g(x, y)');
      assert.equal(parseAndEval('g(4,5)', scope), 1024);
      assert.equal(scope.g(4,5), 1024);
    });

    it ('should correctly evaluate variables in assigned functions', function () {
      var scope = {};
      assert.equal(parseAndEval('a = 3', scope), 3);
      assert.equal(parseAndEval('f(x) = a * x', scope).syntax, 'f(x)');
      assert.equal(parseAndEval('f(2)', scope), 6);
      assert.equal(parseAndEval('a = 5', scope), 5);
      assert.equal(parseAndEval('f(2)', scope), 10);
      assert.equal(parseAndEval('g(x) = x^q', scope).syntax, 'g(x)');
      assert.equal(parseAndEval('q = 4/2', scope), 2);
      assert.equal(parseAndEval('g(3)', scope), 9);
    });

    it('should throw an error for undefined variables in an assigned function', function() {
      var scope = {};
      assert.equal(parseAndEval('g(x) = x^q', scope).syntax, 'g(x)');
      assert.throws(function () {
        parseAndEval('g(3)', scope);
      }, function (err) {
        return (err instanceof Error) && (err.toString() == 'Error: Undefined symbol q');
      });
    });

    it('should throw an error on invalid left hand side of a function assignment', function() {
      assert.throws(function () {
        var scope = {};
        parseAndEval('g(x, 2) = x^2', scope);
      }, SyntaxError);

      assert.throws(function () {
        var scope = {};
        parseAndEval('2(x, 2) = x^2', scope);
      }, SyntaxError);
    });
  });

  describe ('parentheses', function () {
    it('should parse parentheses overriding the default precedence', function () {
      approx.equal(parseAndEval('2 - (2 - 2)'), 2);
      approx.equal(parseAndEval('2 - ((2 - 2) - 2)'), 4);
      approx.equal(parseAndEval('3 * (2 + 3)'), 15);
      approx.equal(parseAndEval('(2 + 3) * 3'), 15);
    });

    it('should throw an error in case of unclosed parentheses', function () {
      assert.throws(function () {parseAndEval('3 * (1 + 2')}, /Parenthesis \) expected/);
    });
  });

  describe ('operators', function () {

    it('should parse operations', function() {
      approx.equal(parseAndEval('(2+3)/4'), 1.25);
      approx.equal(parseAndEval('2+3/4'), 2.75);
      assert.equal(parse('0 + 2').toString(), 'ans = 0 + 2');
    });

    it('should parse +', function() {
      assert.equal(parseAndEval('2 + 3'), 5);
      assert.equal(parseAndEval('2 + 3 + 4'), 9);
    });

    it('should parse /', function() {
      assert.equal(parseAndEval('4 / 2'), 2);
      assert.equal(parseAndEval('8 / 2 / 2'), 2);
    });

    it('should parse ./', function() {
      assert.equal(parseAndEval('4./2'), 2);
      assert.equal(parseAndEval('4 ./ 2'), 2);
      assert.equal(parseAndEval('8 ./ 2 / 2'), 2);

      assert.deepEqual(parseAndEval('[1,2,3] ./ [1,2,3]'), new Matrix([1,1,1]));
    });

    it('should parse .*', function() {
      approx.deepEqual(parseAndEval('2.*3'), 6);
      approx.deepEqual(parseAndEval('2 .* 3'), 6);
      approx.deepEqual(parseAndEval('2. * 3'), 6);
      approx.deepEqual(parseAndEval('4 .* 2'), 8);
      approx.deepEqual(parseAndEval('8 .* 2 .* 2'), 32);
      assert.deepEqual(parseAndEval('a=3; a.*4'), [12]);

      assert.deepEqual(parseAndEval('[1,2,3] .* [1,2,3]'), new Matrix([1,4,9]));
    });

    it('should parse .^', function() {
      approx.deepEqual(parseAndEval('2.^3'), 8);
      approx.deepEqual(parseAndEval('2 .^ 3'), 8);
      assert.deepEqual(parseAndEval('2. ^ 3'), 8);
      approx.deepEqual(parseAndEval('-2.^2'), -4);  // -(2^2)
      approx.deepEqual(parseAndEval('2.^3.^4'), 2.41785163922926e+24); // 2^(3^4)

      assert.deepEqual(parseAndEval('[2,3] .^ [2,3]'), new Matrix([4,27]));
    });

    it('should parse ==', function() {
      assert.equal(parseAndEval('2 == 3'), false);
      assert.equal(parseAndEval('2 == 2'), true);
    });

    it('should parse >', function() {
      assert.equal(parseAndEval('2 > 3'), false);
      assert.equal(parseAndEval('2 > 2'), false);
      assert.equal(parseAndEval('2 > 1'), true);
    });

    it('should parse >=', function() {
      assert.equal(parseAndEval('2 >= 3'), false);
      assert.equal(parseAndEval('2 >= 2'), true);
      assert.equal(parseAndEval('2 >= 1'), true);
    });

    it('should parse %', function() {
      approx.equal(parseAndEval('8 % 3'), 2);
    });

    it('should parse mod', function() {
      approx.equal(parseAndEval('8 mod 3'), 2);
    });

    it('should parse *', function() {
      approx.equal(parseAndEval('4 * 2'), 8);
      approx.equal(parseAndEval('8 * 2 * 2'), 32);
    });

    it('should parse ^', function() {
      approx.equal(parseAndEval('2^3'), 8);
      approx.equal(parseAndEval('-2^2'), -4);  // -(2^2)
      approx.equal(parseAndEval('2^3^4'), 2.41785163922926e+24); // 2^(3^4)
    });

    it('should parse <', function() {
      assert.equal(parseAndEval('2 < 3'), true);
      assert.equal(parseAndEval('2 < 2'), false);
      assert.equal(parseAndEval('2 < 1'), false);
    });

    it('should parse <=', function() {
      assert.equal(parseAndEval('2 <= 3'), true);
      assert.equal(parseAndEval('2 <= 2'), true);
      assert.equal(parseAndEval('2 <= 1'), false);
    });

    it('should parse -', function() {
      assert.equal(parseAndEval('4 - 2'), 2);
      assert.equal(parseAndEval('8 - 2 - 2'), 4);
    });

    it('should parse unary -', function() {
      assert.equal(parseAndEval('-2'), -2);
      assert.equal(parseAndEval('4*-2'), -8);
      assert.equal(parseAndEval('4 * -2'), -8);
      assert.equal(parseAndEval('4+-2'), 2);
      assert.equal(parseAndEval('4 + -2'), 2);
      assert.equal(parseAndEval('4--2'), 6);
      assert.equal(parseAndEval('4 - -2'), 6);

      assert.equal(parseAndEval('5-3'), 2);
      assert.equal(parseAndEval('5--3'), 8);
      assert.equal(parseAndEval('5---3'), 2);
      assert.equal(parseAndEval('5+---3'), 2);
      assert.equal(parseAndEval('5----3'), 8);
      assert.equal(parseAndEval('5+--(2+1)'), 8);
    });

    it('should parse unary !=', function() {
      assert.equal(parseAndEval('2 != 3'), true);
      assert.equal(parseAndEval('2 != 2'), false);
    });

    it('should parse contitional expression a ? b : c', function() {
      assert.equal(parseAndEval('2 ? true : false'), true);
      assert.equal(parseAndEval('0 ? true : false'), false);
      assert.equal(parseAndEval('false ? true : false'), false);

      assert.equal(parseAndEval('2 > 0 ? 1 : 2 < 0 ? -1 : 0'), 1);
      assert.equal(parseAndEval('(2 > 0 ? 1 : 2 < 0) ? -1 : 0'), -1);
      assert.equal(parseAndEval('-2 > 0 ? 1 : -2 < 0 ? -1 : 0'), -1);
      assert.equal(parseAndEval('0 > 0 ? 1 : 0 < 0 ? -1 : 0'), 0);
    });

    it('should throw an error when false part of contitional expression is missing', function() {
      assert.throws(function() {parseAndEval('2 ? true')}, /False part of conditional expression expected/);
    });

    it('should parse : (range)', function() {
      assert.ok(parseAndEval('2:5') instanceof Matrix);
      assert.deepEqual(parseAndEval('2:5'), new Matrix([2,3,4,5]));
      assert.deepEqual(parseAndEval('10:-2:0'), new Matrix([10,8,6,4,2,0]));
      assert.deepEqual(parseAndEval('2:4.0'), new Matrix([2,3,4]));
      assert.deepEqual(parseAndEval('2:4.5'), new Matrix([2,3,4]));
      assert.deepEqual(parseAndEval('2:4.1'), new Matrix([2,3,4]));
      assert.deepEqual(parseAndEval('2:3.9'), new Matrix([2,3]));
      assert.deepEqual(parseAndEval('2:3.5'), new Matrix([2,3]));
      assert.deepEqual(parseAndEval('3:-1:0.5'), new Matrix([3,2,1]));
      assert.deepEqual(parseAndEval('3:-1:0.5'), new Matrix([3,2,1]));
      assert.deepEqual(parseAndEval('3:-1:0.1'), new Matrix([3,2,1]));
      assert.deepEqual(parseAndEval('3:-1:-0.1'), new Matrix([3,2,1,0]));
    });

    it('should parse to', function() {
      approx.deepEqual(parseAndEval('2.54 cm to inch'), math.unit(1, 'inch').to('inch'));
      approx.deepEqual(parseAndEval('2.54 cm + 2 inch to foot'), math.unit(0.25, 'foot').to('foot'));
    });

    it('should parse in', function() {
      approx.deepEqual(parseAndEval('2.54 cm in inch'), math.unit(1, 'inch').to('inch'));
    });

    it('should parse \' (transpose)', function() {
      assert.deepEqual(parseAndEval('23\''), 23);
      assert.deepEqual(parseAndEval('[1,2,3;4,5,6]\''), new Matrix([[1,4],[2,5],[3,6]]));
      assert.ok(parseAndEval('[1,2,3;4,5,6]\'') instanceof Matrix);
      assert.deepEqual(parseAndEval('[1:5]'), new Matrix([[1,2,3,4,5]]));
      assert.deepEqual(parseAndEval('[1:5]\''), new Matrix([[1],[2],[3],[4],[5]]));
      assert.deepEqual(parseAndEval('size([1:5])'), new Matrix([1, 5]));
      assert.deepEqual(parseAndEval('[1,2;3,4]\''), new Matrix([[1,3],[2,4]]));
    });

    it('should respect operator precedence', function() {
      assert.equal(parseAndEval('4-2+3'), 5);
      assert.equal(parseAndEval('4-(2+3)'), -1);
      assert.equal(parseAndEval('4-2-3'), -1);
      assert.equal(parseAndEval('4-(2-3)'), 5);

      assert.equal(parseAndEval('2+3*4'), 14);
      assert.equal(parseAndEval('2*3+4'), 10);
      assert.equal(parseAndEval('2*3^2'), 18);

      assert.equal(parseAndEval('2^3'), 8);
      assert.equal(parseAndEval('2^3^4'), Math.pow(2, Math.pow(3, 4)));
      assert.equal(parseAndEval('1.5^1.5^1.5'), parseAndEval('1.5^(1.5^1.5)'));
      assert.equal(parseAndEval('1.5^1.5^1.5^1.5'), parseAndEval('1.5^(1.5^(1.5^1.5))'));

      assert.equal(parseAndEval('-3^2'), -9);
      assert.equal(parseAndEval('(-3)^2'), 9);

      assert.equal(parseAndEval('2^3!'), 64);
      assert.equal(parseAndEval('2^(3!)'), 64);

      assert.equal(parseAndEval('-4!'), -24);
      assert.equal(parseAndEval('3!+2'), 8);

      assert.equal(parseAndEval('2 > 3 ? true : false'), false);
      assert.equal(parseAndEval('2 == 3 ? true : false'), false);
      assert.equal(parseAndEval('3 ? 2 + 4 : 2 - 1'), 6);
      assert.deepEqual(parseAndEval('3 ? true : false; 22'), [22]);
      assert.deepEqual(parseAndEval('3 ? 5cm to m : 5cm in mm'), new Unit(5, 'cm').to('m'));
      assert.deepEqual(parseAndEval('2 == 4-2 ? [1,2] : false'), new Matrix([1,2]));
      assert.deepEqual(parseAndEval('false ? 1:2:6'), new Matrix([2,3,4,5,6]));

      // TODO: extensively test operator precedence

    });
  });

  describe('functions', function () {
    describe('functions', function () {
      it('should evaluate function "mod"', function () {
        approx.equal(parseAndEval('mod(8, 3)'), 2);

      });

      it('should evaluate function "to" ', function () {
        approx.deepEqual(parseAndEval('to(5.08 cm * 1000, inch)'),
            math.unit(2000, 'inch').to('inch'));
      });
    });

  });

  describe('bignumber', function () {
    var bigmath = mathjs({
      number: 'bignumber'
    });
    var BigNumber = bigmath.type.BigNumber;

    it('should parse numbers as bignumber', function() {
      assert.deepEqual(bigmath.bignumber('2.3'), new BigNumber('2.3'));
      assert.deepEqual(bigmath.eval('2.3'), new BigNumber('2.3'));
      assert.deepEqual(bigmath.eval('2.3e+500'), new BigNumber('2.3e+500'));
    });

    it('should evaluate functions supporting bignumbers', function() {
      assert.deepEqual(bigmath.eval('0.1 + 0.2'), new BigNumber('0.3'));
    });

    it('should evaluate functions supporting bignumbers', function() {
      assert.deepEqual(bigmath.eval('add(0.1, 0.2)'), new BigNumber('0.3'));
    });

    it('should work with mixed numbers and bignumbers', function() {
      approx.equal(bigmath.eval('pi + 1'), 4.141592653589793);
    });

    it('should evaluate functions not supporting bignumbers', function() {
      approx.equal(bigmath.eval('sin(0.1)'), 0.09983341664682815);
    });

    it('should create a range from bignumbers', function() {
      assert.deepEqual(bigmath.eval('4:6'),
          bigmath.matrix([new BigNumber(4), new BigNumber(5), new BigNumber(6)]));
      assert.deepEqual(bigmath.eval('0:2:4'),
          bigmath.matrix([new BigNumber(0), new BigNumber(2), new BigNumber(4)]));
    });

    it('should create a matrix with bignumbers', function() {
      assert.deepEqual(bigmath.eval('[0.1, 0.2]'),
          bigmath.matrix([new BigNumber(0.1), new BigNumber(0.2)]));
    });

    it('should get a elements from a matrix with bignumbers', function() {
      var scope = {};
      assert.deepEqual(bigmath.eval('a=[0.1, 0.2]', scope),
          bigmath.matrix([new BigNumber(0.1), new BigNumber(0.2)]));

      assert.deepEqual(bigmath.eval('a[1]', scope), new BigNumber(0.1));
      assert.deepEqual(bigmath.eval('a[:]', scope),
          bigmath.matrix([new BigNumber(0.1), new BigNumber(0.2)]));
      assert.deepEqual(bigmath.eval('a[1:2]', scope),
          bigmath.matrix([new BigNumber(0.1), new BigNumber(0.2)]));
    });

    it('should replace elements in a matrix with bignumbers', function() {
      var scope = {};
      assert.deepEqual(bigmath.eval('a=[0.1, 0.2]', scope),
          bigmath.matrix([new BigNumber(0.1), new BigNumber(0.2)]));

      assert.deepEqual(bigmath.eval('a[1] = 0.3', scope),
          bigmath.matrix([new BigNumber(0.3), new BigNumber(0.2)]));
      assert.deepEqual(bigmath.eval('a[:] = [0.5, 0.6]', scope),
          bigmath.matrix([new BigNumber(0.5), new BigNumber(0.6)]));
      assert.deepEqual(bigmath.eval('a[1:2] = [0.7, 0.8]', scope),
          bigmath.matrix([new BigNumber(0.7), new BigNumber(0.8)]));
    });

    it('should work with complex numbers (downgrades bignumbers to number)', function() {
      assert.deepEqual(bigmath.eval('3i'), new Complex(0, 3));
      assert.deepEqual(bigmath.eval('2 + 3i'), new Complex(2, 3));
      assert.deepEqual(bigmath.eval('2 * i'), new Complex(0, 2));
    });

    it('should work with units (downgrades bignumbers to number)', function() {
      assert.deepEqual(bigmath.eval('2 cm'), new Unit(2, 'cm'));
    });
  });

  describe('scope', function () {

    it('should use a given scope for assignments', function() {
      var scope = {
        a: 3,
        b: 4
      };
      assert.deepEqual(parse('a*b').compile(math).eval(scope), 12);
      assert.deepEqual(parse('c=5').compile(math).eval(scope), 5);
      assert.deepEqual(parse('f(x) = x^a').compile(math).eval(scope).syntax, 'f(x)');


      assert.deepEqual(Object.keys(scope).length, 5);
      assert.deepEqual(scope.a, 3);
      assert.deepEqual(scope.b, 4);
      assert.deepEqual(scope.c, 5);
      assert.deepEqual(typeof scope.f, 'function');
      assert.deepEqual(typeof scope.ans, 'function');
      assert.strictEqual(scope.f, scope.ans);

      assert.equal(scope.f(3), 27);
      scope.a = 2;
      assert.equal(scope.f(3), 9);
      scope.hello = function (name) {
        return 'hello, ' + name + '!';
      };
      assert.deepEqual(parse('hello("jos")').compile(math).eval(scope), 'hello, jos!');
    });

    it('should parse undefined symbols, defining symbols, and removing symbols', function() {
      var scope = {};
      var n = parse('q');
      assert.throws(function () { n.compile(math).eval(scope); });
      parse('q=33').compile(math).eval(scope);
      assert.equal(n.compile(math).eval(scope), 33);
      delete scope.q;
      assert.throws(function () { n.compile(math).eval(scope); });

      n = parse('qq[1,1]=33');
      assert.throws(function () { n.compile(math).eval(scope); });
      parse('qq=[1,2;3,4]').compile(math).eval(scope);
      assert.deepEqual(n.compile(math).eval(scope), new Matrix([[33,2],[3,4]]));
      parse('qq=[4]').compile(math).eval(scope);
      assert.deepEqual(n.compile(math).eval(scope), new Matrix([[33]]));
      delete scope.qq;
      assert.throws(function () { n.compile(math).eval(scope); });
    });


  });

  describe('errors', function () {

    it('should return IndexErrors with one based indices', function () {
      // functions throw a zero-based error
      assert.throws(function () {math.subset([1,2,3], math.index(4))}, /Index out of range \(4 > 2\)/);
      assert.throws(function () {math.subset([1,2,3], math.index(-2))}, /Index out of range \(-2 < 0\)/);

      // evaluation via parser throws one-based error
      assert.throws(function () {math.eval('[1,2,3][4]')}, /Index out of range \(4 > 3\)/);
      assert.throws(function () {math.eval('[1,2,3][-2]')}, /Index out of range \(-2 < 1\)/);
    })
  });

  describe('node tree', function () {

    // TODO: test parsing into a node tree

    it('should correctly stringify a node tree', function() {
      assert.equal(parse('0').toString(), 'ans = 0');
      assert.equal(parse('"hello"').toString(), 'ans = "hello"');
      assert.equal(parse('[1, 2 + 3i, 4]').toString(), 'ans = [1, 2 + 3i, 4]');
    });

    describe('custom nodes', function () {
      // define a custom node
      function CustomNode (args) {
        this.args = args;
      }
      CustomNode.prototype = new math.expression.node.Node();
      CustomNode.prototype.toString = function () {
        return 'CustomNode';
      };
      CustomNode.prototype._compile = function (defs) {
        var strArgs = [];
        this.args.forEach(function (arg) {
          strArgs.push(arg.toString());
        });
        return '"CustomNode(' + strArgs.join(', ') + ')"';
      };

      var nodes = {
        custom: CustomNode
      };

      it('should parse custom nodes', function() {
        var node = parse('custom(x, (2+x), sin(x))', nodes);
        assert.equal(node.compile(math).eval(), 'CustomNode(x, 2 + x, sin(x))');
      });

      it('should parse custom nodes without parameters', function() {
        var node = parse('custom()', nodes);
        assert.equal(node.compile(math).eval(), 'CustomNode()');
        assert.equal(node.find({type: CustomNode}).length, 1);

        var node2 = parse('custom', nodes);
        assert.equal(node2.compile(math).eval(), 'CustomNode()');
        assert.equal(node2.find({type: CustomNode}).length, 1);
      });

      it('should throw an error on syntax errors in using custom nodes', function() {
        assert.throws(function () {parse('custom(x', nodes)}, /Parenthesis \) expected/);
        assert.throws(function () {parse('custom(x, ', nodes)}, /Unexpected end of expression/);
      });
    });

  });

});


/**
 * Helper function to create an Array containing uninitialized values
 * Example: arr(uninit, uninit, 2);    // [ , , 2 ]
 */
var uninit = {};
function arr() {
  var array = [];
  array.length = arguments.length;
  for (var i = 0; i < arguments.length; i++) {
    var value = arguments[i];
    if (value !== uninit) {
      array[i] = value;
    }
  }
  return array;
}