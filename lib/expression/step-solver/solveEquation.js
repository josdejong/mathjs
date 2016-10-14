'use strict';

const math = require('../../../index');

const Equation = require('./Equation');
const EquationOperations = require('./EquationOperations');
const EquationStatus = require('./EquationStatus');
const NodeType = require('./NodeType');
const Symbols = require('./Symbols.js');

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

// Given an equation, will return the steps to get the solution and a string
// representation of the solution. Possible solutions include solving for a
// variable or the result of comparing values (e.g. 'true' for 3 = 3 or
// 'false' for 3 < 2)
function solveEquation(equation, debug=false) {
  if (debug) {
    console.log('\n\nSolving: ' + equation.prettyPrint(true));
  }

  // return if it has any unsupported nodes
  if (hasUnsupportedNodes(equation.leftNode) || hasUnsupportedNodes(equation.rightNode)) {
    return [[], ''];
  }

  const symbolSet = Symbols.getSymbolsInEquation(equation);

  // return if there are more than 1 symbol in leftNode and rightNode
  // TODO: remove this once we support canceling out symbols
  if (symbolSet.size > 1) {
    return [[], ''];
  }

  if (symbolSet.size == 0) {
    return solveConstantEquation(equation);
  }
  const symbolName = symbolSet.values().next().value;

  let equationStatus;
  let steps = []

  const originalEquationStr = equation.prettyPrint();
  const MAX_STEP_COUNT = 30;
  let iters = 0

  // Step through the math equation until nothing changes
  do {
    steps = addSimplificationSteps(steps, equation, debug);
    if (steps.length > 0) {
      const lastStep = steps[steps.length - 1];
      equation = Equation.createEquationFromString(
        lastStep.equationString, equation.comparator);
    }

    equationStatus = step(equation, symbolName);
    if (equationStatus.hasChanged) {
      steps = addStep(steps, equationStatus, debug);
    }

    equation = equationStatus.equation;
    if (iters++ == MAX_STEP_COUNT) {
      throw Error('Potential infinite loop for equation: ' + originalEquationStr);
    }
  } while (equationStatus.hasChanged);

  // for now, the right hand side is the solution
  // in the future, we can factor or do other things
  const solution = equation.prettyPrint()

  return [steps, solution]
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
function addSimplificationSteps(steps, equation, debug=false) {
  let leftSteps = stepThrough(equation.leftNode);
  let rightSteps = stepThrough(equation.rightNode);
  let equationStatus;

  for (let i = 0; i < leftSteps.length; i++) {
    let step = leftSteps[i];
    equation.leftNode = math.parse(step.expression);
    equationStatus = new EquationStatus(equation, true, step.explanation)
    steps = addStep(steps, equationStatus, debug);
  }
  for (let i = 0; i < rightSteps.length; i++) {
    let step = rightSteps[i];
    equation.rightNode = math.parse(step.expression);
    equationStatus = new EquationStatus(equation, true, step.explanation)
    steps = addStep(steps, equationStatus, debug);
  }
  return steps;
}

// adds a step to the given steps based on the given equationStatus
function addStep(steps, equationStatus, debug) {
  const explanation = equationStatus.changeType;
  const equationString = equationStatus.equation.prettyPrint();
  steps.push({
    'explanation': explanation,
    'equationString': equationString
  });
  if (debug) {
    console.log('\n' + explanation);
    console.log(equationString);
  }
  return steps;
}

// Given an equation of constants, will simplify both sides, returning
// the steps and the result of the equation e.g. 'True' or 'False'
function solveConstantEquation(equation) {
  let steps = []
  let solution = '';
  const compareFunction = COMPARATOR_TO_FUNCTION[equation.comparator];

  steps = addSimplificationSteps(steps, equation);
  if (steps.length > 0) {
    const lastStep = steps[steps.length - 1];
    equation = Equation.createEquationFromString(
      lastStep.equationString, equation.comparator);
  }

  if (!NodeType.isConstantOrConstantFraction(equation.leftNode) ||
      !NodeType.isConstantOrConstantFraction(equation.rightNode)) {
    throw Error('Expected both nodes to be constants');
  }

  let leftValue = parseFloat(equation.leftNode.value);
  let rightValue = parseFloat(equation.rightNode.value);

  if (compareFunction) {
    if (compareFunction(leftValue, rightValue)) {
      solution = 'True'
    } else {
      solution = 'False'
    }
  }
  else {
    throw Error('Unexpected comparator');
  }

  return [steps, solution]
}

module.exports = solveEquation;
