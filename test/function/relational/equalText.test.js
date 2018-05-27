// test equalText
var assert = require('assert');
var math = require('../../../index');
var bignumber = math.bignumber;
var matrix = math.matrix;
var sparse = math.sparse;
var equalText = math.equalText;

describe('equalText', function() {

  it('should perform lexical comparison for two strings', function() {
    assert.strictEqual(equalText('abd', 'abc'), false);
    assert.strictEqual(equalText('abc', 'abc'), true);
    assert.strictEqual(equalText('abc', 'abd'), false);

    // lexical sorting of strings
    assert.strictEqual(equalText('2', '10'), false);
    assert.strictEqual(equalText('10', '2'), false);
    assert.strictEqual(equalText('10', '10'), true);
    assert.strictEqual(equalText('2e3', '2000'), false);
  });

  describe('Array', function () {

    it('should compare array - scalar', function () {
      assert.deepEqual(equalText('B', ['A', 'B', 'C']), [false, true, false]);
      assert.deepEqual(equalText(['A', 'B', 'C'], 'B'), [false, true, false]);
    });

    it('should compare array - array', function () {
      assert.deepEqual(equalText([['D', 'E', 'C'], ['B', 'C', 'E']], [['F', 'B', 'C'], ['A', 'D', 'C']]), [[false, false, true], [false, false, false]]);
    });

    it('should compare array - dense matrix', function () {
      assert.deepEqual(equalText([['D', 'E', 'C'], ['B', 'C', 'E']], matrix([['F', 'B', 'C'], ['A', 'D', 'C']])), matrix([[false, false, true], [false, false, false]]));
    });

  });

  describe('DenseMatrix', function () {

    it('should compare dense matrix - scalar', function () {
      assert.deepEqual(equalText('B', matrix(['A', 'B', 'C'])), matrix([false, true, false]));
      assert.deepEqual(equalText(matrix(['A', 'B', 'C']), 'B'), matrix([false, true, false]));
    });

    it('should compare dense matrix - array', function () {
      assert.deepEqual(equalText(matrix([['D', 'E', 'C'], ['B', 'C', 'E']]), [['F', 'B', 'C'], ['A', 'D', 'C']]), matrix([[false, false, true], [false, false, false]]));
    });

    it('should compare dense matrix - dense matrix', function () {
      assert.deepEqual(equalText(matrix([['D', 'E', 'C'], ['B', 'C', 'E']]), matrix([['F', 'B', 'C'], ['A', 'D', 'C']])), matrix([[false, false, true], [false, false, false]]));
    });

  });

  it('should throw an error in case of invalid type of arguments', function() {
    assert.throws(function () {equalText(1, 2);}, /TypeError: Unexpected type of argument in function compareText/);
    assert.throws(function () {equalText('A', sparse([['A', 'B'], ['C', 'D']]));}, /Cannot convert "A" to a number/);
    assert.throws(function () {equalText(bignumber(1), "2");}, /TypeError: Unexpected type of argument in function compareText/);
    assert.throws(function () {equalText('2', bignumber(1));}, /TypeError: Unexpected type of argument in function compareText/);
  });

  it('should throw an error in case of invalid number of arguments', function() {
    assert.throws(function () {equalText(1);}, /TypeError: Too few arguments/);
    assert.throws(function () {equalText(1, 2, 3);}, /TypeError: Too many arguments/);
  });

  it('should LaTeX compare', function () {
    var expression = math.parse('equalText(1,2)');
    assert.equal(expression.toTex(), '\\mathrm{equalText}\\left(1,2\\right)');
  });
});
