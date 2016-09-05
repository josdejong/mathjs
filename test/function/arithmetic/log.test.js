// test log
var assert = require('assert');
var approx = require('../../../tools/approx');
var error = require('../../../lib/error/index');
var math = require('../../../index');
var mathPredictable = math.create({predictable: true});
var complex = math.complex;
var matrix = math.matrix;
var unit = math.unit;
var range = math.range;
var log = math.log;

describe('log', function() {
  it('should return the log of a boolean value', function () {
    assert.equal(log(true), 0);
    assert.equal(log(false), -Infinity);
    assert.equal(log(1,false), 0);
  });

  it('should return the log of null', function () {
    assert.equal(log(null), -Infinity);
    assert.equal(log(1, null), 0);
  });

  it('should return the log of positive numbers', function() {
    approx.deepEqual(log(1), 0);
    approx.deepEqual(log(2), 0.693147180559945);
    approx.deepEqual(log(3), 1.098612288668110);
    approx.deepEqual(math.exp(log(100)), 100);
  });

  it('should return the log of negative numbers', function() {
    approx.deepEqual(log(-1), complex('0.000000000000000 + 3.141592653589793i'));
    approx.deepEqual(log(-2), complex('0.693147180559945 + 3.141592653589793i'));
    approx.deepEqual(log(-3), complex('1.098612288668110 + 3.141592653589793i'));
  });

  it('should return the log of negative numbers with predictable: true', function() {
    assert.equal(typeof mathPredictable.log(-1), 'number');
    assert(isNaN(mathPredictable.log(-1)));
  });

  it('should return the log of zero', function() {
    approx.deepEqual(log(0), -Infinity);
  });

  it('should return the log base N of a number', function() {
    approx.deepEqual(log(100, 10), 2);
    approx.deepEqual(log(1000, 10), 3);
    approx.deepEqual(log(8, 2), 3);
    approx.deepEqual(log(16, 2), 4);
  });

  it('should throw an error if invalid number of arguments', function() {
    assert.throws(function () {log()}, /TypeError: Too few arguments in function log \(expected: any, index: 1\)/);
    assert.throws(function () {log(1, 2, 3)}, /TypeError: Too many arguments in function log \(expected: 2, actual: 3\)/);
  });

  it('should return the log of positive bignumbers', function() {
    var bigmath = math.create({precision: 100});

    assert.deepEqual(bigmath.log(bigmath.bignumber(1)), bigmath.bignumber('0'));
    assert.deepEqual(bigmath.log(bigmath.bignumber(2)), bigmath.bignumber('0.6931471805599453094172321214581765680755001343602552541206800094933936219696947156058633269964186875'));
    assert.deepEqual(bigmath.log(bigmath.bignumber(3)), bigmath.bignumber('1.098612288668109691395245236922525704647490557822749451734694333637494293218608966873615754813732089'));

    // note: the following gives a round-off error with regular numbers
    assert.deepEqual(bigmath.log(bigmath.bignumber(1000), bigmath.bignumber(10)), bigmath.bignumber(3));
  });

  it('should return the log of negative bignumbers', function() {
    var bigmath = math.create({precision: 100});

    approx.deepEqual(bigmath.log(bigmath.bignumber(-1)), complex('0.000000000000000 + 3.141592653589793i'));
    approx.deepEqual(bigmath.log(bigmath.bignumber(-2)), complex('0.693147180559945 + 3.141592653589793i'));
    approx.deepEqual(bigmath.log(bigmath.bignumber(-3)), complex('1.098612288668110 + 3.141592653589793i'));
  });

  it('should return the log of negative bignumbers with predictable:true', function() {
    assert.ok(mathPredictable.log(math.bignumber(-1)).isNaN());
  });

  it('should return the log of a bignumber with value zero', function() {
    var bigmath = math.create({precision: 100});

    assert.deepEqual(bigmath.log(bigmath.bignumber(0)).toString(), '-Infinity');
  });

  it('should return the log of a complex number', function() {
    approx.deepEqual(log(math.i),          complex('1.570796326794897i'));
    approx.deepEqual(log(complex(0, -1)),  complex('-1.570796326794897i'));
    approx.deepEqual(log(complex(1, 1)),   complex('0.346573590279973 + 0.785398163397448i'));
    approx.deepEqual(log(complex(1, -1)),  complex('0.346573590279973 - 0.785398163397448i'));
    approx.deepEqual(log(complex(-1, -1)), complex('0.346573590279973 - 2.356194490192345i'));
    approx.deepEqual(log(complex(-1, 1)),  complex('0.346573590279973 + 2.356194490192345i'));
    approx.deepEqual(log(complex(1, 0)),   complex(0, 0));
  });

  it('should throw an error when used on a unit', function() {
    assert.throws(function () {log(unit('5cm'))});
  });

  it('should throw an error when used on a string', function() {
    assert.throws(function () {log('text')});
  });

  it('should return the log of each element of a matrix', function() {
    var res = [0, 0.693147180559945, 1.098612288668110, 1.386294361119891];
    approx.deepEqual(log([1,2,3,4]), res);
    approx.deepEqual(log(matrix([1,2,3,4])), matrix(res));
    approx.deepEqual(log(matrix([[1,2],[3,4]])),
        matrix([[0, 0.693147180559945], [1.098612288668110, 1.386294361119891]]));
  });

  describe('Quaternion', function () {

    it('should log quaternions with base e', function () {
      assert.deepEqual(log(math.quaternion({r:-1})), math.quaternion({i:Math.PI}));
      approx.deepEqual(log(math.quaternion({r:2, i:1})), math.quaternion({r:0.8047189562170503, i:0.46364760900080615}));
      approx.deepEqual(log(math.quaternion(2,3,-1,2)), math.quaternion(1.4451858789480823, 0.8658571885733402, -0.28861906285778005, 0.5772381257155601));
      approx.deepEqual(log(math.quaternion(-5,3,-2,0)), math.quaternion(1.8187930798631928, 2.094136451714334, -1.396090967809556, 0));
    });

    it('should returns the log of a quaternion with real base', function () {
      approx.deepEqual(log(math.quaternion(1,2,3,4), 2), math.quaternion(2.4534452978042594, 0.7432624803406092, 1.1148937205109137, 1.4865249606812183));
      approx.deepEqual(log(math.quaternion(-1,3,-5,2), 2), math.quaternion(2.642701109431124, 1.2157822201686082, -2.0263037002810136, 0.8105214801124053));
      approx.deepEqual(log(math.quaternion(1,2,3,4), 0.5), math.quaternion(-2.4534452978042594, -0.7432624803406092, -1.1148937205109137, -1.4865249606812183));
    });

    it('should log Quaternions with a Quaternion base', function () {
      approx.deepEqual(log(math.quaternion(1,2,3,4), math.quaternion(1,2,3,4)), math.quaternion({r:1}));
      approx.deepEqual(log(math.quaternion(1,2,3,4), math.quaternion(-1,-2,-3,-4)), math.quaternion(0.07677530705872884, 0.3323621401313245, 0.4985432101969867, 0.664724280262649));
    });
  });

  it('should LaTeX log', function () {
    var expr1 = math.parse('log(e)');
    var expr2 = math.parse('log(32,2)');

    assert.equal(expr1.toTex(), '\\ln\\left( e\\right)');
    assert.equal(expr2.toTex(), '\\log_{2}\\left(32\\right)');
  });

});