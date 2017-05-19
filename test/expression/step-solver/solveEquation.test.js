'use strict';

const assert = require('assert');
const math = require('../../../index');

const Equation = require('../../../lib/expression/step-solver/Equation.js');
const MathChangeTypes = require('../../../lib/expression/step-solver/MathChangeTypes');

const flatten = require('../../../lib/expression/step-solver/flattenOperands.js');
const solveEquation = require('../../../lib/expression/step-solver/solveEquation.js');

function testSolve(equationString, comparator, debug=false) {
  const sides = equationString.split(comparator);
  const leftNode = math.parse(sides[0]);
  const rightNode = math.parse(sides[1]);

  const steps = solveEquation(leftNode, rightNode, comparator, debug);
  if (steps.length === 0) {
    return equationString;
  }
  return steps[steps.length -1];
}

describe('solveEquation', function () {
  it('x = 1 -> x = 1', function () {
    assert.equal(
      testSolve('x = 1', '='),
      'x = 1');
  });
  it('2 = x -> x = 2', function () {
    assert.equal(
      testSolve('2 = x', '=').asciimath,
      'x = 2');
  });
  it('2 + -3 = x -> x = -1', function () {
    assert.equal(
      testSolve('2 + -3 = x', '=').asciimath,
      'x = -1');
  });
  it('x + 3 = 4 -> x = 1', function () {
    assert.equal(
      testSolve('x + 3 = 4', '=').asciimath,
      'x = 1');
  });
  it('2x - 3 = 0 -> x = 3 / 2', function () {
    assert.equal(
      testSolve('2x - 3 = 0', '=').asciimath,
      'x = 3/2');
  });
  it('x/3 - 2 = -1 -> x = 3', function () {
    assert.equal(
      testSolve('x/3 - 2 = -1', '=').asciimath,
      'x = 3');
  });
  it('5x/2 + 2 = 3x/2 + 10 -> x = 8', function () {
    assert.equal(
      testSolve('5x/2 + 2 = 3x/2 + 10', '=').asciimath,
      'x = 8');
  });
  it('2x - 1 = -x -> x = 1/3', function () {
    assert.equal(
      testSolve('2x - 1 = -x', '=').asciimath,
      'x = 1/3');
  });
  it('2 - x = -4 + x -> x = 3', function () {
    assert.equal(
      testSolve('2 - x = -4 + x', '=').asciimath,
      'x = 3');
  });
  it('2x/3 = 2 -> x = 3', function () {
    assert.equal(
      testSolve('2x/3 = 2', '=').asciimath,
      'x = 3');
  });
  it('2x - 3 = x -> x = 3', function () {
    assert.equal(
      testSolve('2x - 3 = x', '=').asciimath,
      'x = 3');
  });
  it('8 - 2a = a + 3 - 1 -> a = 3', function () {
    assert.equal(
      testSolve('8 - 2a = a + 3 - 1', '=').asciimath,
      'a = 2');
  });
  it('2 - x = 4 -> x = -2', function () {
    assert.equal(
      testSolve('2 - x = 4', '=').asciimath,
      'x = -2');
  });
  it('2 - 4x = x -> x = 2/5', function () {
    assert.equal(
      testSolve('2 - 4x = x', '=').asciimath,
      'x = 2/5');
  });
  it('9x + 4 - 3 = 2x -> x = -1/7', function () {
    assert.equal(
      testSolve('9x + 4 - 3 = 2x', '=').asciimath,
      'x = -1/7');
  });
  it('9x + 4 - 3 = -2x -> x = -1/11', function () {
    assert.equal(
      testSolve('9x + 4 - 3 = -2x', '=').asciimath,
      'x = -1/11');
  });
  it('(2x^2 - 1)(x^2 - 5)(x^2 + 5) = 0 -> 2x^6 - x^4 - 50x^2 = -25', function () {
    assert.equal(
      testSolve('(2x^2 - 1)(x^2 - 5)(x^2 + 5) = 0', '=').asciimath,
      '2x^6 - x^4 - 50x^2 = -25');
  });
  it('(-x^2 - 4x + 2)(-3x^2 - 6x + 3) = 0 -> 3x^4 + 18x^3 + 15x^2 − 24x = -6', function () {
    assert.equal(
      testSolve('(-x ^ 2 - 4x + 2)(-3x^2 - 6x + 3) = 0', '=').asciimath,
      '3x^4 + 18x^3 + 15x^2 - 24x = -6');
  });
  it('5x + (1/2)x = 27 -> x = 1', function () {
    assert.equal(
      testSolve('5x + (1/2)x = 27 ', '=').asciimath,
      'x = 54/11');
  });
  it('2x/3 = 2x - 4 -> x = 3', function () {
    assert.equal(
      testSolve('2x/3 = 2x - 4 ', '=').asciimath,
      'x = 3');
  });
  // TODO: update test once we have root support
  it('x^2 - 2 = 0 -> x^2 = 2', function () {
    assert.equal(
      testSolve('x^2 - 2 = 0', '=').asciimath,
      'x^2 = 2');
  });
  // TODO(bug): x/(2/3) is not the same as (x/2)/3 or x/2/3
  // it('x/(2/3) = 1 -> x = 3/2', function () {
  //   assert.equal(
  //     testSolve('x/(2/3) = 1', '=').asciimath,
  //     'x = 3/2');
  // });
  // TODO(bug): add test once we fix parens/fraction issue, or support () here
  // it('(x+1)/3 = 4 -> x = 3', function () {
  //   assert.equal(
  //     testSolve('(x+1)/3 = 4', '=').asciimath,
  //     'x = 3');
  // });
  // TODO(bug): add test once we fix parens/fraction issue
  // it('2(x+3)/3 = 2 -> x = 0', function () {
  //   assert.equal(
  //     testSolve('2(x+3)/3 = 2', '=').asciimath,
  //     'x = 0');
  // });
});

describe('constant comparison support', function () {
  it('1 = 2 -> False', function () {
    assert.equal(
      testSolve('1 = 2', '=').explanation,
      MathChangeTypes.STATEMENT_IS_FALSE);
  });
  it('3 + 5 = 8 -> True', function () {
    assert.equal(
      testSolve('3 + 5 = 8', '=').explanation,
      MathChangeTypes.STATEMENT_IS_TRUE);
  });
  it('1/2 = 1/2 -> True', function () {
    assert.equal(
      testSolve('1 = 2', '=').explanation,
      MathChangeTypes.STATEMENT_IS_FALSE);
  });
  it('2 - 3 = 5 -> True', function () {
    assert.equal(
      testSolve('2 - 3 = 5', '=').explanation,
      MathChangeTypes.STATEMENT_IS_FALSE);
  });
  it('2 > 1 -> True', function () {
    assert.equal(
      testSolve('2 > 1', '>').explanation,
      MathChangeTypes.STATEMENT_IS_TRUE);
  });
  it('2/3 > 1/3 -> True', function () {
    assert.equal(
      testSolve('2/3 > 1/3', '>').explanation,
      MathChangeTypes.STATEMENT_IS_TRUE);
  });
  it('1 > 2 -> False', function () {
    assert.equal(
      testSolve('1 > 2', '>').explanation,
      MathChangeTypes.STATEMENT_IS_FALSE);
  });
  it('1/3 > 2/3 -> False', function () {
    assert.equal(
      testSolve('1/3 > 2/3', '>').explanation,
      MathChangeTypes.STATEMENT_IS_FALSE);
  });
  it('1 >= 1 -> True', function () {
    assert.equal(
      testSolve('1 >= 1', '>=').explanation,
      MathChangeTypes.STATEMENT_IS_TRUE);
  });
  it('2 >= 1 -> True', function () {
    assert.equal(
      testSolve('2 >= 1', '>=').explanation,
      MathChangeTypes.STATEMENT_IS_TRUE);
  });
  it('1 >= 2 -> False', function () {
    assert.equal(
      testSolve('1 >= 2', '>=').explanation,
      MathChangeTypes.STATEMENT_IS_FALSE);
  });
  it('2 < 1 -> False', function () {
    assert.equal(
      testSolve('2 < 1', '<').explanation,
      MathChangeTypes.STATEMENT_IS_FALSE);
  });
  it('2/3 < 1/3 -> False', function () {
    assert.equal(
      testSolve('2/3 < 1/3', '<').explanation,
      MathChangeTypes.STATEMENT_IS_FALSE);
  });
  it('1 < 2 -> True', function () {
    assert.equal(
      testSolve('1 < 2', '<').explanation,
      MathChangeTypes.STATEMENT_IS_TRUE);
  });
  it('1/3 < 2/3 -> True', function () {
    assert.equal(
      testSolve('1/3 < 2/3', '<').explanation,
      MathChangeTypes.STATEMENT_IS_TRUE);
  });
  it('1 <= 1 -> True', function () {
    assert.equal(
      testSolve('1 <= 1', '<=').explanation,
      MathChangeTypes.STATEMENT_IS_TRUE);
  });
  it('2 <= 1 -> False', function () {
    assert.equal(
      testSolve('2 <= 1', '<=').explanation,
      MathChangeTypes.STATEMENT_IS_FALSE);
  });
  it('1 <= 2 -> True', function () {
    assert.equal(
      testSolve('1 <= 2', '<=').explanation,
      MathChangeTypes.STATEMENT_IS_TRUE);
  });
});
