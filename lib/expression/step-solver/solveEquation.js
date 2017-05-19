'use strict';

const math = require('../../../index');

const Equation = require('./Equation');
const EquationOperations = require('./EquationOperations');
const EquationStatus = require('./EquationStatus');
const MathChangeTypes = require('./MathChangeTypes');
const NodeType = require('./NodeType');
const Symbols = require('./Symbols.js');

const flatten = require('./flattenOperands.js');
const hasUnsupportedNodes = require('./hasUnsupportedNodes');
const stepper = require('./simplifyExpression.js');
const stepThrough = stepper.stepThrough;

const COMPARATOR_TO_FUNCTION = {
  '=': function(left, right) { return left === right },
  '>': function(left, right) { return left > right },
  '>=': function(left, right) { return left >= right },
  '<': function(left, right) { return left < right },
  '<=': function(left, right) { return left <= right },
}

// Given a leftNode, rightNode and a comparator, will return the steps to get
// the solution. Possible solutions include:
// - solving for a variable (e.g. 'x=3' for '3x=4+5')
// - the result of comparing values (e.g. 'true' for 3 = 3, 'false' for 3 < 2)
function solveEquation(leftNode, rightNode, comparator, debug=false) {
  let equation = new Equation(leftNode, rightNode, comparator);

  if (debug) {
    console.log('\n\nSolving: ' + equation.prettyPrint(false, true));
  }

  // we can't solve/find steps if there are any unsupported nodes
  if (hasUnsupportedNodes(equation.leftNode) ||
      hasUnsupportedNodes(equation.rightNode)) {
    return [];
  }

  const symbolSet = Symbols.getSymbolsInEquation(equation);

  // Right now we don't support more than 1 symbol in the equation
  // (e.g. 3x + 4y = x has both x and y)
  // TODO: remove this once we support canceling out symbols
  if (symbolSet.size > 1) {
    return [];
  }

  if (symbolSet.size === 0) {
    return solveConstantEquation(equation, debug);
  }
  const symbolName = symbolSet.values().next().value;

  let equationStatus;
  let steps = [];

  const originalEquationStr = equation.prettyPrint();
  const MAX_STEP_COUNT = 30;
  let iters = 0

  // Step through the math equation until nothing changes
  do {
    steps = addSimplificationSteps(steps, equation, iters===0, debug);
    if (steps.length > 0) {
      const lastStep = steps[steps.length - 1];
      equation = Equation.createEquationFromString(
        lastStep.asciimath, equation.comparator);
    }

    equation.leftNode = flatten(equation.leftNode);
    equation.rightNode = flatten(equation.rightNode);
    equationStatus = step(equation, symbolName);
    if (equationStatus.hasChanged) {
      steps = addStep(steps, equationStatus, debug);
    }

    equation = equationStatus.equation;
    if (iters++ === MAX_STEP_COUNT) {
      throw Error('Potential infinite loop for equation: ' + originalEquationStr);
    }
  } while (equationStatus.hasChanged);

  return steps;
}

// Given a symbol and an equation, performs a single step to
// solve for the symbol. Returns an EquationStatus object.
function step(equation, symbolName) {
  const solveFunctions = [
    // ensure the symbol is always on the left node
    EquationOperations.ensureSymbolInLeftNode,
    // get rid of denominators that have the symbol
    EquationOperations.removeSymbolFromDenominator,
    // remove the symbol from the right side
    EquationOperations.removeSymbolFromRightSide,
    // isolate the symbol on the left side
    EquationOperations.isolateSymbolOnLeftSide,
  ];

  for (let i = 0; i < solveFunctions.length; i++) {
    const equationStatus = solveFunctions[i](equation, symbolName);
    if (equationStatus.hasChanged) {
      return equationStatus;
    }
  }
  return new EquationStatus(equation);
}

// Simplifies the equation and returns the simplification steps
function addSimplificationSteps(steps, equation, firstTime, debug=false) {
  let equationStatus;

  let leftSteps = stepThrough(equation.leftNode, false, firstTime);
  for (let i = 0; i < leftSteps.length; i++) {
    let step = leftSteps[i];
    equation.leftNode = math.parse(step.asciimath);
    equationStatus = new EquationStatus(equation, true, step.explanation)
    steps = addStep(steps, equationStatus, debug);
  }

  let rightSteps = stepThrough(equation.rightNode, false, firstTime);
  for (let i = 0; i < rightSteps.length; i++) {
    let step = rightSteps[i];
    equation.rightNode = math.parse(step.asciimath);
    equationStatus = new EquationStatus(equation, true, step.explanation)
    steps = addStep(steps, equationStatus, debug);
  }

  return steps;
}

// adds a step to the given steps based on the given equationStatus
function addStep(steps, equationStatus, debug) {
  let explanation = equationStatus.changeType;
  let asciimath = equationStatus.equation.prettyPrint();
  let latex = equationStatus.equation.prettyPrint(true);
  steps.push({
    'explanation': explanation,
    'asciimath': asciimath,
    'latex': latex
  });
  if (debug) {
    console.log('\n' + explanation);
    console.log(asciimath);
  }
  return steps;
}

// Given an equation of constants, will simplify both sides, returning
// the steps and the result of the equation e.g. 'True' or 'False'
function solveConstantEquation(equation, debug) {
  let steps = []
  let solution = '';
  const compareFunction = COMPARATOR_TO_FUNCTION[equation.comparator];

  if (!compareFunction) {
    throw Error('Unexpected comparator');
  }

  steps = addSimplificationSteps(steps, equation, true, debug);
  if (steps.length > 0) {
    const lastStep = steps[steps.length - 1];
    equation = Equation.createEquationFromString(
      lastStep.asciimath, equation.comparator);
  }

  if (!NodeType.isConstantOrConstantFraction(equation.leftNode, true) ||
      !NodeType.isConstantOrConstantFraction(equation.rightNode, true)) {
    throw Error('Expected both nodes to be constants');
  }

  let leftValue = equation.leftNode.eval();
  let rightValue = equation.rightNode.eval();
  let changeType;
  if (compareFunction(leftValue, rightValue)) {
    changeType = MathChangeTypes.STATEMENT_IS_TRUE;
  }
  else {
    changeType = MathChangeTypes.STATEMENT_IS_FALSE;
  }

  // add a final step for the solution
  let equationStatus = new EquationStatus(equation, true, changeType)
  steps = addStep(steps, equationStatus, debug)
  return steps
}

module.exports = solveEquation;
