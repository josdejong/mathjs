'use strict';

const assert = require('assert');
const math = require('../../../index');

const Equation = require('../../../lib/expression/step-solver/Equation.js');
const solveEquation = require('../../../lib/expression/step-solver/solveEquation.js');

function testSolve(equationString, comparator, debug=false) {
  const equation = Equation.createEquationFromString(equationString, comparator);
  const [steps, solution] = solveEquation(equation, debug);
  if (debug) {
    console.log(steps);
  }
  return solution;
}

describe('solveEquation', function () {
    it('x = 1 -> x = 1', function () {
      assert.equal(
        testSolve('x = 1', '='),
        'x = 1');
    });
    it('2 = x -> x = 2', function () {
      assert.equal(
        testSolve('2 = x', '='),
        'x = 2');
    });
    it('x + 3 = 4 -> x = 1', function () {
      assert.equal(
        testSolve('x + 3 = 4', '='),
        'x = 1');
    });
    it('2x - 3 = 0 -> x = 3 / 2', function () {
      assert.equal(
        testSolve('2x - 3 = 0', '='),
        'x = 3 / 2');
    });
    it('2x/3 = 2 -> x = 3', function () {
      assert.equal(
        testSolve('2x/3 = 2', '='),
        'x = 3');
    });
    it('2(x+3)/3 = 2 -> x = 0', function () {
      assert.equal(
        testSolve('2(x+3)/3 = 2', '='),
        'x = 0');
    });
    // TODO: add test once fraction support is fixed
    // it('5x + (1/2)x = 27 -> x = 1', function () {
    //   assert.equal(
    //     testSolve('5x + (1/2)x = 27 ', '='),
    //     'x = 54/11');
    // });

    // TODO: add test once we have root support
    // it('x^2 - 2 = 0 -> x^2 = 2', function () {
    //   assert.equal(
    //     testSolve('x^2 - 2 = 0', '='),
    //     'x^2 = 2');
    // });
});

describe('constant comparison support', function () {
    it('0 = 0 -> "Infinite solutions"', function () {
      assert.equal(
        testSolve('0 = 0', '='),
        'Infinite solutions');
    });
    it('1 = 2 -> "No solution"', function () {
      assert.equal(
        testSolve('1 = 2', '='),
        'No solution');
    });
    it('3 + 5 = 8 -> "One solution"', function () {
      assert.equal(
        testSolve('3 + 5 = 8', '='),
        'One solution');
    });
    it('2 > 1 -> "This is true"', function () {
      assert.equal(
        testSolve('2 > 1', '>'),
        'This is true');
    });
    it('1 > 2 -> "This is false"', function () {
      assert.equal(
        testSolve('1 > 2', '>'),
        'This is false');
    });
    it('1 >= 1 -> "This is true"', function () {
      assert.equal(
        testSolve('1 >= 1', '>='),
        'This is true');
    });
    it('2 >= 1 -> "This is true"', function () {
      assert.equal(
        testSolve('2 >= 1', '>='),
        'This is true');
    });
    it('1 >= 2 -> "This is false"', function () {
      assert.equal(
        testSolve('1 >= 2', '>='),
        'This is false');
    });
    it('2 < 1 -> "This is false"', function () {
      assert.equal(
        testSolve('2 < 1', '<'),
        'This is false');
    });
    it('1 < 2 -> "This is true"', function () {
      assert.equal(
        testSolve('1 < 2', '<'),
        'This is true');
    });
    it('1 <= 1 -> "This is true"', function () {
      assert.equal(
        testSolve('1 <= 1', '<='),
        'This is true');
    });
    it('2 <= 1 -> "This is false"', function () {
      assert.equal(
        testSolve('2 <= 1', '<='),
        'This is false');
    });
    it('1 <= 2 -> "This is true"', function () {
      assert.equal(
        testSolve('1 <= 2', '<='),
        'This is true');
    });
});
