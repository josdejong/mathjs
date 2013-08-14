// test parser

var assert = require('assert'),
    approx = require('../../tools/approx.js'),
    math = require('../../index.js'),
    matrix = math.matrix,
    range = math.range,
    round = math.round;

describe('parser', function() {

  var parser;

  beforeEach(function() {
    parser = math.parser();
  })

  it('should respect operator precedence', function() {
    assert.equal(parser.eval('4-2+3'), 5);
    assert.equal(parser.eval('4-(2+3)'), -1);
    assert.equal(parser.eval('4-2-3'), -1);
    assert.equal(parser.eval('4-(2-3)'), 5);

    assert.equal(parser.eval('2+3*4'), 14);
    assert.equal(parser.eval('2*3+4'), 10);
    assert.equal(parser.eval('2*3^2'), 18);

    assert.equal(parser.eval('2^3'), 8);
    assert.equal(parser.eval('2^3^4'), Math.pow(2, Math.pow(3, 4)));
    assert.equal(parser.eval('1.5^1.5^1.5'), parser.eval('1.5^(1.5^1.5)'));
    assert.equal(parser.eval('1.5^1.5^1.5^1.5'), parser.eval('1.5^(1.5^(1.5^1.5))'));

    assert.equal(parser.eval('-3^2'), -9);
    assert.equal(parser.eval('(-3)^2'), 9);

    assert.equal(parser.eval('2^3!'), 64);
    assert.equal(parser.eval('2^(3!)'), 64);

    assert.equal(parser.eval('-4!'), -24);
    assert.equal(parser.eval('3!+2'), 8);

    assert.deepEqual(parser.eval('[1,2;3,4]\' * 2').valueOf(), [[2,6],[4,8]]);
    assert.deepEqual(parser.eval('[1,2;3,4]\' * [5,6;7,8]').valueOf(), [[26,30],[38,44]]);
    assert.deepEqual(parser.eval('[1,2;3,4] * [5,6;7,8]\'').valueOf(), [[17,23],[39,53]]);
    assert.deepEqual(parser.eval('[1,2;3,4]\'+2').valueOf(), [[3,5],[4,6]]);
  });

  it('should parse valid numbers', function() {
    assert.equal(parser.eval('3'), 3);
    assert.equal(parser.eval('3.2'), 3.2);
    assert.equal(parser.eval('003.2'), 3.2);
    assert.equal(parser.eval('003.200'), 3.2);
    assert.equal(parser.eval('.2'), 0.2);
    assert.equal(parser.eval('2.'), 2);
    assert.equal(parser.eval('3e2'), 300);
    assert.equal(parser.eval('300e2'), 30000);
    assert.equal(parser.eval('300e+2'), 30000);
    assert.equal(parser.eval('300e-2'), 3);
    assert.equal(parser.eval('300E-2'), 3);
    assert.equal(parser.eval('3.2e2'), 320);
  });


  it('should throw an error with invalid numbers', function() {
    assert.throws(function () {parser.eval('.'); });
    assert.throws(function () {parser.eval('3.2.2'); });
    assert.throws(function () {parser.eval('3.2e2.2'); });
  });

  it('should parse constants', function() {
    assert.deepEqual(parser.eval('i'), math.complex(0, 1));
    assert.deepEqual(parser.eval('pi'), Math.PI);
  });


  it('should parse function calls', function() {
    assert.equal(parser.eval('sqrt(4)'), 2);
    assert.equal(parser.eval('sqrt(6+3)'), 3);
    assert.equal(parser.eval('atan2(2,2)'), 0.7853981633974483);
  });


  it('should parse valid assignments', function() {
    assert.equal(parser.eval('a = 0.75'), 0.75);
    assert.equal(parser.eval('a + 2'), 2.75);
    assert.equal(parser.eval('a = 2'), 2);
    assert.equal(parser.eval('a + 2'), 4);
    approx.equal(parser.eval('pi * 2'), 6.283185307179586);
  });

  it('should throw an error for invalid assignments', function() {
    assert.throws(function() {parser.eval('a + 2'); }); // TODO: throws an stack overflow
  });


  it('should parse nested assignments', function() {
    assert.equal(parser.eval('c = d = (e = 4.5)'), 4.5);
    assert.equal(parser.get('c'), 4.5);
    assert.equal(parser.get('d'), 4.5);
    assert.equal(parser.get('e'), 4.5);
    assert.deepEqual(parser.eval('a = [1,2,f=3]'), matrix([[1,2,3]]));
    assert.equal(parser.get('f'), 3);
    assert.equal(parser.eval('2 + (g = 3 + 4)'), 9);
    assert.equal(parser.get('g'), 7);
  });

  it('should throw an error for invalid nested assignments', function() {
    assert.throws(function () {parser.eval('a(j = 3)')}, SyntaxError);
  });


  it('should parse function assignments', function() {
    parser.eval('x=100'); // for testing scoping of the function variables
    assert.equal(parser.eval('function f(x) = x^2'), 'f(x)');
    assert.equal(parser.eval('f(3)'), 9);
    assert.equal(parser.eval('x'), 100);
    assert.equal(parser.eval('function g(x, y) = x^y'), 'g(x, y)');
    assert.equal(parser.eval('g(4,5)'), 1024);
    var g = parser.eval('g');
  });


  it('should parse ranges', function() {
    assert.ok(parser.eval('2:5') instanceof math.type.Range);
    assert.deepEqual(parser.eval('2:6').toArray(), [2,3,4,5]);
    assert.deepEqual(parser.eval('10:-2:0').toArray(), [10,8,6,4,2]);
  });


  it('should parse matrices', function() {
    parser.set('a', matrix([
      [1,2,3],
      [4,5,6],
      [7,8,9]
    ]));
    assert.deepEqual(parser.eval('a(1, :)'),        matrix([[4,5,6]]));
    assert.deepEqual(parser.eval('a(1, :2)'),       matrix([[4,5]]));
    assert.deepEqual(parser.eval('a(1, :end-1)'),   matrix([[4,5]]));
    assert.deepEqual(parser.eval('a(1, 1:)'),       matrix([[5,6]]));
    assert.deepEqual(parser.eval('a(1, 1:3)'),      matrix([[5,6]]));
    assert.deepEqual(parser.eval('a(1, 0:2:4)'),    matrix([[4,6]]));
    assert.deepEqual(parser.eval('a(:, 1)'),        matrix([[2],[5],[8]]));
    assert.deepEqual(parser.eval('a(:2, 1)'),       matrix([[2],[5]]));
    assert.deepEqual(parser.eval('a(:end-1, 1)'),   matrix([[2],[5]]));
    assert.deepEqual(parser.eval('a(1:, 1)'),       matrix([[5],[8]]));
    assert.deepEqual(parser.eval('a(1:3, 1)'),      matrix([[5],[8]]));
    assert.deepEqual(parser.eval('a(0:2:4, 1)'),    matrix([[2],[8]]));
    // TODO: implement and test support for Array (instead of Matrix)
  });


  it('should parse matrix resizings', function() {
    assert.deepEqual(parser.eval('a = []'),    matrix([]));
    assert.deepEqual(parser.eval('a(0:3,0) = [1;2;3]'), matrix([[1],[2],[3]]));
    assert.deepEqual(parser.eval('a(:,1) = [4;5;6]'), matrix([[1,4],[2,5],[3,6]]));

    assert.deepEqual(parser.eval('a = []'),    matrix([]));
    assert.deepEqual(parser.eval('a(0,2) = 3'), matrix([[0,0,3]]));
    assert.deepEqual(parser.eval('a(1,:) = [4,5,6]'), matrix([[0,0,3],[4,5,6]]));

    assert.deepEqual(parser.eval('a = []'),    matrix([]));
    assert.deepEqual(parser.eval('a(2,0) = 3'), matrix([[0],[0],[3]]));
    assert.deepEqual(parser.eval('a(:,1) = [4;5;6]'), matrix([[0,4],[0,5],[3,6]]));

    assert.deepEqual(parser.eval('a = []'),    matrix([]));
    assert.deepEqual(parser.eval('a(0,0:3) = [1,2,3]'), matrix([[1,2,3]]));
    assert.deepEqual(parser.eval('a(1,:) = [4,5,6]'), matrix([[1,2,3],[4,5,6]]));
  });


  it('should get the right matrix size', function() {
    assert.ok(parser.eval('[1,2;3,4]') instanceof math.type.Matrix);
    var m = parser.eval('[1,2,3;4,5,6]');
    assert.deepEqual(m.size(), [2,3]);
    assert.deepEqual(m.valueOf(), [[1,2,3],[4,5,6]]);
    var b = parser.eval('[5, 6; 1, 1]');
    assert.deepEqual(b.size(), [2,2]);
    assert.deepEqual(b.valueOf(), [[5,6],[1,1]]);
    b.set([1, [0, 1]], [[7, 8]]);
    assert.deepEqual(b.size(), [2,2]);
    assert.deepEqual(b.valueOf(), [[5,6],[7,8]]);
    assert.deepEqual(parser.eval('[ ]').valueOf(), []);
  });


  it('should get/set the matrix correctly', function() {
    parser.eval('a=[1,2;3,4]');
    parser.eval('a(0,0) = 100');
    assert.deepEqual(parser.get('a').size(), [2,2]);
    assert.deepEqual(parser.get('a').valueOf(), [[100,2],[3,4]]);
    parser.eval('a(1:3,1:3) = [10,11;12,13]');
    assert.deepEqual(parser.get('a').size(), [3,3]);
    assert.deepEqual(parser.get('a').valueOf(), [[100,2,0],[3,10,11],[0,12,13]]);
    var a = parser.get('a');
    assert.deepEqual(a.get([math.range('0:3'), math.range('0:2')]).valueOf(), [[100,2],[3,10],[0,12]]);
    assert.deepEqual(parser.eval('a(0:3,0:2)').valueOf(), [[100,2],[3,10],[0,12]]);

    parser.set('b', [[1,2],[3,4]]);
    assert.deepEqual(parser.eval('b(0,:)'), [[1, 2]]); // TODO: matrix should be squeezed
  });


  it('should get/set the matrix correctly for 3d matrices', function() {
    assert.deepEqual(parser.eval('f=[1,2;3,4]'), matrix([[1,2],[3,4]]));
    assert.deepEqual(parser.eval('size(f)'), matrix([2,2]));
    /* TODO: doesn't work correctly
     assert.deepEqual(parser.eval('f(:,:,1)=[5,6;7,8]'), matrix([
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
    parser.set('f', matrix([
      [
        [1,5],
        [2,6]
      ],
      [
        [3,7],
        [4,8]
      ]
    ]));
    assert.deepEqual(parser.eval('size(f)'), matrix([2,2,2]));
    assert.deepEqual(parser.eval('f(:,:,0)'), matrix([[[1],[2]],[[3],[4]]])); // TODO: last dimension should be squeezed
    assert.deepEqual(parser.eval('f(:,:,1)'), matrix([[[5],[6]],[[7],[8]]])); // TODO: last dimension should be squeezed
    assert.deepEqual(parser.eval('f(:,1,:)'), matrix([[[2,6]],[[4,8]]]));
    assert.deepEqual(parser.eval('f(1,:,:)'), matrix([[[3,7],[4,8]]]));

    parser.eval('a=diag([1,2,3,4])');
    assert.deepEqual(parser.eval('a(2:end, 2:end)'), matrix([[3,0],[0,4]]));
    assert.deepEqual(parser.eval('a(2:end, 1:end)=9*ones(2,3)'), matrix([
      [1,0,0,0],
      [0,2,0,0],
      [0,9,9,9],
      [0,9,9,9]
    ]));
    assert.deepEqual(parser.eval('a(1:end-1, 1:end-1)'), matrix([[2,0],[9,9]]));
  });


  it('should parse matrix concatenations', function() {
    parser.eval('a=[1,2;3,4]');
    parser.eval('b=[5,6;7,8]');
    assert.deepEqual(parser.eval('c=[a,b]'), matrix([[1,2,5,6],[3,4,7,8]]));
    assert.deepEqual(parser.eval('c=[a;b]'), matrix([[1,2],[3,4],[5,6],[7,8]]));
    assert.deepEqual(parser.eval('c=[a,b;b,a]'), matrix([[1,2,5,6],[3,4,7,8],[5,6,1,2],[7,8,3,4]]));
    assert.deepEqual(parser.eval('c=[[1,2]; [3,4]]'), matrix([[1,2],[3,4]]));
    assert.deepEqual(parser.eval('c=[1; [2;3]]'), matrix([[1],[2],[3]]));
    assert.deepEqual(parser.eval('d=1:4'), range(1,4));  // d is a Range
    assert.deepEqual(parser.eval('[d,d]'), matrix([[1,2,3,1,2,3]]));
    assert.deepEqual(parser.eval('[d;d]'), matrix([[1,2,3],[1,2,3]]));
    assert.deepEqual(parser.eval('e=1+d'), [2,3,4]);  // e is an Array
    assert.deepEqual(parser.eval('size(e)'), [3]);
    assert.deepEqual(parser.eval('[e,e]'), matrix([[2,3,4,2,3,4]]));
    assert.deepEqual(parser.eval('[e;e]'), matrix([[2,3,4],[2,3,4]]));
    assert.deepEqual(parser.eval('[[],[]]'), matrix([[]]));
    assert.deepEqual(parser.eval('[[],[]]').size(), [1, 0]);
  });

  it('should throw an error for invalid matrix concatenations', function() {
    assert.throws(function () {parser.eval('c=[a; [1,2,3] ]')});
  });

  it('should parse matrix transpositions', function() {
    assert.deepEqual(parser.eval('[1,2,3;4,5,6]\'').valueOf(), [[1,4],[2,5],[3,6]]);
    assert.ok(parser.eval('[1,2,3;4,5,6]\'') instanceof math.type.Matrix);
    assert.deepEqual(parser.eval('23\'').valueOf(), 23);
    assert.deepEqual(parser.eval('[1:5]').valueOf(), [[1,2,3,4]]);
    assert.deepEqual(parser.eval('[1:5]\'').valueOf(), [[1],[2],[3],[4]]);
    assert.deepEqual(parser.eval('size([1:5])').valueOf(), [1, 4]);
  });


  it('parse element wise operators', function() {
    assert.deepEqual(parser.eval('2.*3'), 6);
    assert.deepEqual(parser.eval('2 .* 3'), 6);
    assert.deepEqual(parser.eval('2. * 3'), 6);
    assert.deepEqual(parser.eval('2 .^ 3'), 8);
    assert.deepEqual(parser.eval('4./2'), 2);
    assert.deepEqual(parser.eval('4 ./ 2'), 2);
    assert.deepEqual(parser.eval('a=3; a.*4'), [12]);
    assert.deepEqual(parser.eval('[1,2,3] .* [1,2,3]'), matrix([[1,4,9]]));
    assert.deepEqual(parser.eval('[1,2,3] ./ [1,2,3]'), matrix([[1,1,1]]));
    assert.deepEqual(parser.eval('[2,3] .^ [2,3]'), matrix([[4,27]]));
  });


  it('should parse measurement units', function() {
    assert.equal(parser.eval('5cm').toString(), '50 mm');
    assert.ok(parser.eval('5cm') instanceof math.type.Unit);
    //assert.equal(parser.eval('5.08 cm * 1000 in inch').toString(), '2000 inch'); // TODO: this gives an error
    assert.equal(parser.eval('(5.08 cm * 1000) in inch').toString(), '2000 inch');
    assert.equal(parser.eval('(5.08 cm * 1000) in mm').toString(), '50800 mm');
    assert.equal(parser.eval('ans in inch').toString(), '2000 inch');

    parser = math.parser();
    assert.equal(parser.eval('a = 3'), 3);
    assert.equal(parser.eval('function f(x) = a * x'), 'f(x)');
    assert.equal(parser.eval('f(2)'), 6);
    assert.equal(parser.eval('a = 5'), 5);
    assert.equal(parser.eval('f(2)'), 10);
    assert.equal(parser.eval('function g(x) = x^q'), 'g(x)');
    assert.equal(parser.eval('q = 4/2'), 2);
    assert.equal(parser.eval('g(3)'), 9);
  });

  it('should throw an error for invalid units', function() {
    assert.equal(parser.eval('function g(x) = x^q'), 'g(x)');
    assert.throws(function () {
      parser.eval('g(3)');
    }, function (err) {
      return (err instanceof Error) && (err.toString() == 'Error: Undefined symbol q');
    });
  });


  it('should parse undefined symbols, defining symbols, and removing symbols', function() {
    var n;
    var n = parser.parse('q');
    assert.throws(function () { n.eval(); });
    parser.eval('q=33');
    assert.equal(n.eval(), 33);
    parser.remove('q');
    assert.throws(function () { n.eval(); });

    n = parser.parse('qq(0,0)=33');
    assert.throws(function () { n.eval(); });
    parser.eval('qq=[1,2;3,4]');
    assert.deepEqual(n.eval(), matrix([[33,2],[3,4]]));
    parser.eval('qq=[4]');
    assert.deepEqual(n.eval(), matrix([[33]]));
    parser.remove('qq');
    assert.throws(function () { n.eval(); });
  });



  it('should support custom node handlers', function() {
    function CustomNode (params, paramScopes) {
      this.params = params;
      this.paramScopes = paramScopes;
    }
    CustomNode.prototype = new math.expr.node.Node();
    CustomNode.prototype.toString = function () {
      return 'CustomNode';
    };
    CustomNode.prototype.eval = function () {
      var strParams = [];
      this.params.forEach(function (param) {
        strParams.push(param.toString());
      });
      return 'CustomNode(' + strParams.join(', ') + ')';
    };

    math.expr.node.handlers['custom'] = CustomNode;

    var node = math.parse('custom(x, (2+x), sin(x))');
    assert.equal(node.eval(), 'CustomNode(x, 2 + x, sin(x))');

  });

// TODO: extensively test the Parser

});
