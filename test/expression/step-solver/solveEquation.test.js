'use strict';

const assert = require('assert');
const math = require('../../../index');

const Equation = require('../../../lib/expression/step-solver/Equation.js');
const solveEquation = require('../../../lib/expression/step-solver/solveEquation.js');

function testSolve(equationString, debug=false) {
  const equation = Equation.createEquationFromString(equationString, '=');
  const [steps, solution] = solveEquation(equation, debug);
  if (debug) {
    console.log(steps);
  }
  return solution;
}

describe('solveEquation', function () {
    it('x = 1 -> x = 1', function () {
      assert.equal(
        testSolve('x = 1'),
        'x = 1');
    });
    it('2 = x -> x = 2', function () {
      assert.equal(
        testSolve('2 = x'),
        'x = 2');
    });
    it('x + 3 = 4 -> x = 1', function () {
      assert.equal(
        testSolve('x + 3 = 4'),
        'x = 1');
    });
    it('2x - 3 = 0 -> x = 3 / 2', function () {
      assert.equal(
        testSolve('2x - 3 = 0'),
        'x = 3 / 2');
    });
    it('2x/3 = 2 -> x = 3', function () {
      assert.equal(
        testSolve('2x/3 = 2'),
        'x = 3');
    });
    // it('5x + (1/2)x = 27 -> x = 1', function () {
    //   assert.equal(
    //     testSolve('5x + (1/2)x = 27 '),
    //     'x = 54/11');
    // });
});
