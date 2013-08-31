// test parse
var assert = require('assert'),
    approx = require('../../../tools/approx.js'),
    math = require('../../../index.js');

describe('parse', function() {

  it('should parse constants', function() {
    assert.ok(math.parse('pi') instanceof math.expression.node.Node);
    assert.equal(math.parse('pi').eval(), Math.PI);
  });

  it('should parse arithmetic operations', function() {
    assert.equal(math.parse('(2+3)/4').eval(), 1.25);
    assert.equal(math.parse('0 + 2').toString(), 'ans = 0 + 2');
  });

  it('should parse functions', function() {
    assert.equal(math.parse('sqrt(-4)').eval().toString(), '2i');
  });

  it('should parse a series of expressions', function() {
    assert.deepEqual(math.parse(['a=3', 'b=4', 'a*b']).map(function (node) {
      return node.eval();
    }), [3, 4, 12]);

    assert.deepEqual(math.parse(math.matrix(['a=3', 'b=4', 'a*b'])).map(function (node) {
      return node.eval();
    }), math.matrix([3, 4, 12]));
  });

  it('should parse multiple expressions', function() {
    assert.deepEqual(math.parse('a=3\nb=4\na*b').eval(), [3, 4, 12]);
    assert.deepEqual(math.parse('b = 43; b * 4').eval(), [172]);
  });

  it('should parse a custom function', function() {
    assert.deepEqual(math.parse('function f(x) = a * x; a=2; f(4)').eval(), [8]);
  });

  it('should throw an error if called with wrong number of arguments', function() {
    assert.throws(function () {math.parse()}, SyntaxError);
    assert.throws(function () {math.parse(1,2,3)}, SyntaxError);
  });

  it('should throw an error if called with a number', function() {
    assert.throws(function () {math.parse(23)}, TypeError);
  });

  it('should throw an error if called with a unit', function() {
    assert.throws(function () {math.parse(math.unit('5cm'))}, TypeError);
  });

  it('should throw an error if called with a complex number', function() {
    assert.throws(function () {math.parse(new math.type.Complex(2,3))}, TypeError);
  });

  it('should throw an error if called with a boolean', function() {
    assert.throws(function () {math.parse(true)}, TypeError);
  });

  it('should handle the given scope', function() {
    var scope = {
      a: 3,
      b: 4
    };
    assert.deepEqual(math.parse('a*b', scope).eval(), 12);
    assert.deepEqual(math.parse('c=5', scope).eval(), 5);
    assert.deepEqual(math.parse('function f(x) = x^a', scope).eval(), 'f(x)');
    assert.deepEqual(scope, {
      a: 3,
      b: 4,
      c: 5,
      f: 'f(x)',
      ans: 'f(x)'
    });
    assert.equal(scope.f(3), 27);
    scope.a = 2;
    assert.equal(scope.f(3), 9);
    scope.hello = function (name) {
      return 'hello, ' + name + '!';
    };
    assert.deepEqual(math.parse('hello("jos")', scope).eval(), 'hello, jos!');
  });

  it('should parse zero', function() {
    assert.equal(math.parse('0').toString(), 'ans = 0');
  });

  it('should parse a string', function() {
    assert.equal(math.parse('"hello"').toString(), 'ans = "hello"');
  });

  it('should parse a matrix', function() {
    assert.equal(math.parse('[1, 2 + 3i, 4]').toString(), 'ans = [[1, 2 + 3i, 4]]');
  });

  it('shouldn\'t break with multiple unary minuses', function() {
    assert.equal(math.eval('5-3'), 2);
    assert.equal(math.eval('5--3'), 8);
    assert.equal(math.eval('5---3'), 2);
    assert.equal(math.eval('5+---3'), 2);
    assert.equal(math.eval('5----3'), 8);
    assert.equal(math.eval('5+--(2+1)'), 8);
  });


  it('operators', function () {

    it('should parse +', function() {
      assert.equal(math.eval('2 + 3'), 5);
      assert.equal(math.eval('2 + 3 + 4'), 9);
    });

    it('should parse /', function() {
      assert.equal(math.eval('4 / 2'), 2);
      assert.equal(math.eval('8 / 2 / 2'), 2);
    });

    it('should parse ./', function() {
      assert.equal(math.eval('4 ./ 2'), 2);
      assert.equal(math.eval('8 ./ 2 / 2'), 2);
    });

    it('should parse .*', function() {
      approx.equal(math.eval('4 .* 2'), 8);
      approx.equal(math.eval('8 .* 2 .* 2'), 32);
    });

    it('should parse .^', function() {
      approx.equal(math.eval('2.^3'), 8);
      approx.equal(math.eval('-2.^2'), -4);  // -(2^2)
      approx.equal(math.eval('2.^3.^4'), 2.41785163922926e+24); // 2^(3^4)
    });

    it('should parse ==', function() {
      assert.equal(math.eval('2 == 3'), false);
      assert.equal(math.eval('2 == 2'), true);
    });

    it('should parse >', function() {
      assert.equal(math.eval('2 > 3'), false);
      assert.equal(math.eval('2 > 2'), false);
      assert.equal(math.eval('2 > 1'), true);
    });

    it('should parse >=', function() {
      assert.equal(math.eval('2 >= 3'), false);
      assert.equal(math.eval('2 >= 2'), true);
      assert.equal(math.eval('2 >= 1'), true);
    });

    it('should parse %', function() {
      approx.equal(math.eval('8 % 3'), 2);
    });

    it.skip('should parse mod', function() {
      approx.equal(math.eval('8 mod 3'), 2);
    });

    it.skip('should parse *', function() {
      approx.equal(math.eval('4 * 2'), 8);
      approx.equal(math.eval('8 * 2 * 2'), 32);
    });

    it.skip('should parse ^', function() {
      approx.equal(math.eval('2^3'), 8);
      approx.equal(math.eval('-2^2'), -4);  // -(2^2)
      approx.equal(math.eval('2^3^4'), 2.41785163922926e+24); // 2^(3^4)
    });

    it.skip('should parse <', function() {
      assert.equal(math.eval('2 < 3'), true);
      assert.equal(math.eval('2 < 2'), false);
      assert.equal(math.eval('2 < 1'), false);
    });

    it.skip('should parse <=', function() {
      assert.equal(math.eval('2 <= 3'), true);
      assert.equal(math.eval('2 <= 2'), true);
      assert.equal(math.eval('2 <= 1'), false);
    });

    it.skip('should parse -', function() {
      assert.equal(math.eval('4 - 2'), 2);
      assert.equal(math.eval('8 - 2 - 2'), 4);
    });

    it.skip('should parse unary -', function() {
      assert.equal(math.eval('-2'), -2);
      assert.equal(math.eval('4*-2'), -8);
      assert.equal(math.eval('4 * -2'), -8);
      assert.equal(math.eval('4+-2'), 2);
      assert.equal(math.eval('4 + -2'), 2);
      assert.equal(math.eval('4--2'), 6);
      assert.equal(math.eval('4 - -2'), 6);
    });

    it.skip('should parse unary !=', function() {
      assert.equal(math.eval('2 != 3'), true);
      assert.equal(math.eval('2 != 2'), false);
    });

    it.skip('should parse :', function() {
      assert.equal(math.eval('2:5'), [2,3,4,5]);
      assert.equal(math.eval('5:-1:2'), [5,4,3,2]);
    });

    it('should parse in', function() {
      assert.equal(math.eval('2.54 cm in inch').toString(), '1 inch');
      assert.equal(math.eval('2.54 cm + 2 inch in foot').toString(), '0.25 foot');
    });

  });


  describe('functions', function () {

    it('should parse all arithmetic functions', function () {
      assert.equal(math.eval('abs(-4.2)'), 4.2);
      assert.equal(math.eval('add(2, 3)'), 5);
      assert.equal(math.eval('ceil(1.3)'), 2);
      assert.equal(math.eval('ceil(1.8)'), 2);
      assert.equal(math.eval('cube(4)'), 64);
      assert.equal(math.eval('divide(4, 2)'), 2);
      assert.equal(math.eval('edivide(4, 2)'), 2);
      assert.equal(math.eval('emultiply(4, 2)'), 8);
      approx.equal(math.eval('epow(2,3)'), 8);
      approx.equal(math.eval('epow(-2,2)'), 4);
      assert.equal(math.eval('equal(2, 3)'), false);
      assert.equal(math.eval('equal(2, 2)'), true);
      approx.equal(math.eval('exp(1)'), Math.E);
      approx.deepEqual(math.eval('1+exp(pi*i)'), new math.type.Complex(0, 0));
      assert.equal(math.eval('fix(1.3)'), 1);
      assert.equal(math.eval('fix(1.8)'), 1);
      assert.equal(math.eval('floor(1.3)'), 1);
      assert.equal(math.eval('floor(1.8)'), 1);
      assert.equal(math.eval('gcd(12, 8)'), 4);
      assert.equal(math.eval('larger(2, 3)'), false);
      assert.equal(math.eval('larger(2, 2)'), false);
      assert.equal(math.eval('larger(2, 1)'), true);
      assert.equal(math.eval('largereq(2, 3)'), false);
      assert.equal(math.eval('largereq(2, 2)'), true);
      assert.equal(math.eval('largereq(2, 1)'), true);
      assert.equal(math.eval('lcm(4, 6)'), 12);
      approx.equal(math.eval('log(e)'), 1);
      approx.equal(math.eval('log(2.71828182845905)'), 1);
      approx.equal(math.eval('log10(1000)'), 3);
      approx.equal(math.eval('mod(8, 3)'), 2);
      approx.equal(math.eval('multiply(4, 2)'), 8);
      approx.equal(math.eval('pow(2,3)'), 8);
      approx.equal(math.eval('pow(-2,2)'), 4);
      assert.equal(math.eval('round(pi)'), 3);
      assert.equal(math.eval('round(pi, 3)'), 3.142);
      assert.equal(math.eval('sign(3)'), 1);
      assert.equal(math.eval('sign(-3)'), -1);
      assert.equal(math.eval('sign(0)'), 0);
      assert.equal(math.eval('smaller(2, 3)'), true);
      assert.equal(math.eval('smaller(2, 2)'), false);
      assert.equal(math.eval('smaller(2, 1)'), false);
      assert.equal(math.eval('smallereq(2, 3)'), true);
      assert.equal(math.eval('smallereq(2, 2)'), true);
      assert.equal(math.eval('smallereq(2, 1)'), false);
      assert.equal(math.eval('sqrt(25)'), 5);
      assert.equal(math.eval('square(4)'), 16);
      assert.equal(math.eval('subtract(4, 2)'), 2);
      assert.equal(math.eval('unary(4)'), -4);
      assert.equal(math.eval('unequal(2, 3)'), true);
      assert.equal(math.eval('unequal(2, 2)'), false);
      assert.deepEqual(math.eval('xgcd(36163, 21199)'), [1247, -7, 12]);
    });

    describe('construction', function () {

      it('should parse construction function boolean correctly', function() {
        assert.equal(math.eval('boolean("true")'), true);
        assert.equal(math.eval('boolean("false")'), false);
        assert.equal(math.eval('boolean(true)'), true);
        assert.equal(math.eval('boolean(false)'), false);
        assert.equal(math.eval('boolean(1)'), true);
        assert.equal(math.eval('boolean(2)'), true);
        assert.equal(math.eval('boolean(0)'), false);
      });

      it('should parse construction function complex correctly', function() {
        assert.deepEqual(math.eval('complex()'), new math.type.Complex(0,0));
        assert.deepEqual(math.eval('complex(2,3)'), new math.type.Complex(2,3));
        assert.deepEqual(math.eval('complex("2+3i")'), new math.type.Complex(2,3));
      });

      it('should pasre construction function number correctly', function() {
        assert.equal(math.eval('number(123)'), 123);
        assert.equal(math.eval('number("123")'), 123);
        assert.equal(math.eval('number()'), 0);
      });

      it('should pasre construction function string correctly', function() {
        assert.equal(math.eval('string(123)'), '123');
        assert.equal(math.eval('string(2+3i)'), '2 + 3i');
        assert.equal(math.eval('string(1:5)'), '[1, 2, 3, 4, 5]');
        assert.equal(math.eval('string(2 inch)'), '2 inch');
        assert.equal(math.eval('string([1,2;3,4])'), '[[1, 2], [3, 4]]');
      });

      it('should pasre construction function unit correctly', function() {
        assert.deepEqual(math.eval('unit(2, "m")'), new math.type.Unit(2, 'm'));
        assert.deepEqual(math.eval('unit("2m")'), new math.type.Unit(2, 'm'));
      });

    });
  });

});