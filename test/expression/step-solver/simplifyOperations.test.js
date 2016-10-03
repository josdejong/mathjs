"use strict"

const assert = require('assert');
const math = require('../../../index');

const simplifyOperations = require('../../../lib/expression/step-solver/simplifyOperations.js');
const flatten = require('../../../lib/expression/step-solver/flattenOperands.js');

function simplify(exprString) {
  return simplifyOperations(flatten(math.parse(exprString))).node;
}

describe('simplifies', function () {
  it('performArithmetic 2+2 -> 4', function () {
    assert.deepEqual(
      simplify('2+2'),
      math.parse('4'));
  });
  it('performArithmetic 2*3*5 -> 30', function () {
    assert.deepEqual(
      simplify('2*3*5'),
      math.parse('30'));
  });
  it('removes multiplication by 1 x*1 -> x', function () {
    assert.deepEqual(
      simplify('x*1'),
      math.parse('x'));
  });
  it('removes multiplication by 1 1*z^2 -> z^2', function () {
    assert.deepEqual(
      simplify('1*z^2'),
      math.parse('z^2'));
  });
  it('removes multiplication by 1 2*1*z^2 -> 2*z^2', function () {
    assert.deepEqual(
      simplify('2*1*z^2'),
      math.parse('2*z^2'));
  });
  it('removes multiplication by 0: 0x -> 0', function () {
    assert.deepEqual(
      simplify('0x'),
      math.parse('0'));
  });
  it('removes multiplication by 0: 2*0*z^2 -> 0', function () {
    assert.deepEqual(
      simplify('2*0*z^2'),
      math.parse('0'));
  });
  it('removes multiplication by -1 -1*x -> -x', function () {
    assert.deepEqual(
      simplify('-1*x'),
      flatten(math.parse('-x')));
  });
  it('removes multiplication by -1 x^2*-1 -> -x^2', function () {
    assert.deepEqual(
      simplify('x^2*-1'),
      flatten(math.parse('-x^2')));
  });
  it('does not remove multiplication by -1 for 2*x*2*-1 ', function () {
    assert.deepEqual(
      simplify('2*x*2*-1'),
      flatten(math.parse('2*x*2*-1')));
  });
  it('removeExponentByOne x^1 -> x', function () {
    assert.deepEqual(
      simplify('x^1'),
      math.parse('x'));
  });
  it('simplifyDoubleUnaryMinus --5 -> 5', function () {
    assert.deepEqual(
      simplify('--5'),
      math.parse('5'));
  });
  it('simplifyDoubleUnaryMinus --x -> x', function () {
    assert.deepEqual(
      simplify('--x'),
      math.parse('x'));
  });
  // note the double parens are handled in stepper.js with a final call to remove unnecessary parens
  it('simplifyDoubleUnaryMinus -(-(2+x)) -> 2+x', function () {
    assert.deepEqual(
      simplify('-(-(2+x))'),
      math.parse('2+x'));
  });
  it('removeAdditionByZero 2+0+x -> 2+x', function () {
    assert.deepEqual(
      simplify('2+0+x'),
      math.parse('2+x'));
  });
  it('x/1 -> x', function () {
    assert.deepEqual(
      simplify('x/1'),
      (math.parse('x')));
  });
  it('(x+3)/-1 -> -(x+3)', function () {
    assert.deepEqual(
      simplify('(x+3)/-1'),
      math.parse('-(x+3)'));
  });
});
