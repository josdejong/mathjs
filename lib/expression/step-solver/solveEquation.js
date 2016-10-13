'use strict';

const math = require('../../../index');

const Equation = require('./Equation');
const EquationOperations = require('./EquationOperations');
const EquationStatus = require('./EquationStatus');
const NodeType = require('./NodeType');

const hasUnsupportedNodes = require('./hasUnsupportedNodes');
const stepper = require('../../../lib/expression/step-solver/simplifyExpression.js');
const Symbols = require('./Symbols.js');

const stepThrough = stepper.stepThrough;

// Given leftNode, rightNode and the operator between them, will return the
// solution and the steps to get to the solution.
function solveEquation(equation, debug=false) {
  if (debug) {
    console.log('\n\nSolving: ' + Equation.prettyPrintEquation(equation, true));
  }

  // return if it has any unsupported nodes
  if (hasUnsupportedNodes(equation.leftNode) || hasUnsupportedNodes(equation.rightNode)) {
    return [[], ""];
  }

  const symbolSet = Symbols.getSymbolsInEquation(equation);

  // return if there are more than 1 symbol in leftNode and rightNode
  // TODO: remove this once we support canceling out symbols
  if (symbolSet.size > 1) {
    return [[], ""];
  }

  if (symbolSet.size == 0) {
    return solveConstantEquation(equation);
  }
  const symbolName = symbolSet.values().next().value;

  let equationStatus;
  let steps = []

  // Step through the math equation until nothing changes
  do {
    steps = addSimplificationSteps(steps, equation, debug)
    if (steps.length > 0) {
      let lastStep = steps[steps.length - 1];
      equation = Equation.createEquationFromString(lastStep.equationString, equation.comparator);
    }

    equationStatus = step(equation, symbolName);
    steps = addStep(steps, equationStatus, debug);
    equation = equationStatus.equation;
  } while (equationStatus.hasChanged);

  // for now, the right hand side is the solution
  // in the future, we can factor or do other things
  const solution = Equation.prettyPrintEquation(equation)

  return [steps, solution]
}

// Given a symbol, two mathjs nodes and a comparator, performs a single step to
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
    let equationStatus = solveFunctions[i](equation, symbolName);
    if (equationStatus.hasChanged) {
      return equationStatus;
    }
  }
  return new EquationStatus(equation);
}

// simplify leftNode nad rightNode and returns the simplification steps
function addSimplificationSteps(steps, equation, debug=false) {
  let leftSteps = stepThrough(equation.leftNode);
  let rightSteps = stepThrough(equation.rightNode);
  let equationStatus;

  for (let i = 0; i < leftSteps.length; i++) {
    let step = leftSteps[i];
    equation.leftNode = math.parse(step.expression);
    equationStatus = new EquationStatus(equation, {changeType: step.explanation})
    steps = addStep(steps, equationStatus, debug)
  }
  for (let i = 0; i < rightSteps.length; i++) {
    let step = rightSteps[i];
    equation.rightNode = math.parse(step.expression);
    equationStatus = new EquationStatus(equation, {changeType: step.explanation})
    steps = addStep(steps, equationStatus, debug)
  }
  return steps
}

// TODO(ael): adds a step
function addStep(steps, equationStatus, debug) {
  const explanation = equationStatus.changeType;
  const equationString = Equation.prettyPrintEquation(equationStatus.equation);
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

// Given an equation of constants, will simplify both sides and return
// the steps and the solution (No solution, Infinite solutions, True, False etc.)
function solveConstantEquation(equation) {
  let steps = []
  let solution = "";

  steps = addSimplificationSteps(steps, equation, debug);
  if (steps.length > 0) {
    let lastStep = steps[steps.length - 1];
    equation = Equation.createEquationFromString(lastStep.equationString, equation.comparator);
  }

  if (!NodeType.isConstant(equation.leftNode) || !NodeType.isConstant(equation.rightNode)) {
    throw Error('Expected both nodes to be constants');
  }

  let leftValue = parseFloat(equation.leftNode.value);
  let rightValue = parseFloat(equation.rightNode.value);
  if (comparator === "=") {
    if (leftValue === rightValue) {
      if (leftValue === 0) {
        solution = "Infinite solutions"
      } else {
        solution = "One solution"
      }
    }
    else {
      solution = "No solution"
    }
  }
  else if (comparator === ">") {
    if (leftValue > rightValue) {
      solution = "This is true"
    }
    else {
      solution = "This is false"
    }
  }
  else if (comparator === ">=") {
    if (leftValue >= rightValue) {
      solution = "This is true"
    }
    else {
      solution = "This is false"
    }
  }
  else if (comparator === "<") {
    if (leftValue < rightValue) {
      solution = "This is true"
    }
    else {
      solution = "This is false"
    }
  }
  else if (comparator === "<=") {
    if (leftValue <= rightValue) {
      solution = "This is true"
    }
    else {
      solution = "This is false"
    }
  }

  return [steps, solution]
}

module.exports = solveEquation;
