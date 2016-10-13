'use strict';

const math = require('../../../index');

const MathChangeTypes = require('./MathChangeTypes');
const MathResolveChecks = require('./MathResolveChecks');
const NodeCreator = require('./NodeCreator');
const NodeType = require('./NodeType');
const Equation = require('./Equation');
const EquationStatus = require('./EquationStatus');
const PolynomialTermNode = require('./PolynomialTermNode');
const stepper = require('../../../lib/expression/step-solver/simplifyExpression.js');
const flatten = require('./flattenOperands.js');
const hasUnsupportedNodes = require('./hasUnsupportedNodes');
const symbols = require('./symbols.js');
const prettyPrint = require('./prettyPrint');

const stepThrough = stepper.stepThrough;

// Given leftNode, rightNode and the operator between them, will return the
// solution and the steps to get to the solution.
function solveEquation(equation, debug=false) {
  if (debug) {
    console.log('\n\nSolving: ' + prettyPrintEquation(equation, true));
  }

  // TODO: the symbol should be decided based on the equation
  // later letters take priority z > y > x, or c > b > a
  const symbolName = 'x';

  // return if there are more than 1 symbol in leftNode and rightNode
  // TODO: remove this once we support canceling out symbols
  const leftSymbols = symbols.getSymbols(equation.leftNode);
  const rightSymbols = symbols.getSymbols(equation.rightNode);
  const allSymbols = new Set(...leftSymbols, ...rightSymbols);
  if (allSymbols.size > 1) {
    return [[], ""];
  }

  // return if it has any unsupported nodes
  if (hasUnsupportedNodes(equation.leftNode) || hasUnsupportedNodes(equation.rightNode)) {
    return [[], ""];
  }

  if (MathResolveChecks.resolvesToConstant(equation.leftNode) &&
      MathResolveChecks.resolvesToConstant(equation.rightNode)) {
    return solveConstantEquation(equation);
  }

  let steps = []

  // Step through the math equation until nothing changes
  let equationStatus = new EquationStatus(equation, true);
  while (equationStatus.hasChanged) {
    let simplifySteps = simplifyBothSides(equationStatus.equation, debug)
    if (simplifySteps.length > 0) {
      let lastStep = simplifySteps[simplifySteps.length - 1];
      equationStatus.equation = createEquationFromString(lastStep.equation, equation.comparator);
      steps.concat(simplifySteps);
    }

    equationStatus = step(symbolName, equationStatus.equation);
    steps = addStep(steps, equationStatus, debug);
  }

const solution = getSolution(equationStatus.equation)
  return [steps, solution]
}

// Given a symbol, two mathjs nodes and a comparator, performs a single step to
// solve for the symbol. Returns an EquationStatus object.
function step(symbolName, equation) {
  const solveFunctions = [
    // ensure the symbol is always on the left node
    ensureSymbolInLeftNode,
    // get rid of denominators that have the symbol
    removeSymbolFromDenominator,
    // remove the symbol from the right side
    removeSymbolFromRightSide,
    // isolate the symbol on the left side
    isolateSymbolOnLeftSide,
  ];

  for (let i = 0; i < solveFunctions.length; i++) {
    let equationStatus = solveFunctions[i](symbolName, equation);
    if (equationStatus.hasChanged) {
      return equationStatus;
    }
  }
  return new EquationStatus(equation);
}

function ensureSymbolInLeftNode(symbolName, equation) {
  const leftSideSymbolTerm = getAnyTermWithSymbolName(equation.leftNode, symbolName);
  const rightSideSymbolTerm = getAnyTermWithSymbolName(equation.rightNode, symbolName);

  if (!leftSideSymbolTerm) {
    if (rightSideSymbolTerm) {
      equation = new Equation(equation.rightNode, equation.leftNode, equation.comparator)
      return new EquationStatus(equation, true, MathChangeTypes.SWAP_SIDES);
    }
    else {
      throw Error("Can't find term with symbol: " + symbolName)
    }
  }
  return new EquationStatus(equation);
}

// If the symbol is in any denominator in the equation, we want to multiply
// both sides by that denominator (TODO)
function removeSymbolFromDenominator(symbolName, equation) {
  // pass for now
  return new EquationStatus(equation);
}

// Move terms that have the give symbolName from the RHS to the LHS
function removeSymbolFromRightSide(symbolName, equation) {
  let symbolTerm = getAnyTermWithSymbolName(equation.rightNode, symbolName);

  if (symbolTerm){
    if (NodeType.isOperator(equation.rightNode)) {
      if (equation.rightNode.op === '+') {
        newnewLeftNode = NodeCreator.operator('-', [equation.leftNode, symbolTerm]);
        newRightNode = NodeCreator.operator('-', [equation.rightNode, symbolTerm]);
        equation = new Equation(newLeftNode, newRightNode, equation.comparator);

        return new EquationStatus(equation, true, MathChangeTypes.SUBTRACT_FROM_BOTH_SIDES);
      }
      else if (equation.rightNode.op === '*') {
        newLeftNode = NodeCreator.operator('/', [equation.leftNode, symbolTerm]);
        newRightNode = NodeCreator.operator('/', [equation.rightNode, symbolTerm]);
        equation = new Equation(newLeftNode, newRightNode, equation.comparator);

        return new EquationStatus(equation, true, MathChangeTypes.DIVIDE_FROM_BOTH_SIDES);
      }
      else if (equation.rightNode.op === '/') {
        newLeftNode = NodeCreator.operator('*', [equation.leftNode, symbolTerm]);
        newRightNode = NodeCreator.operator('*', [equation.rightNode, symbolTerm]);
        equation = new Equation(newLeftNode, newRightNode, equation.comparator);

        return new EquationStatus(equation, true, MathChangeTypes.MULTIPLY_TO_BOTH_SIDES);
      }
       else {
        throw Error('Unsupported operation: ' + node.op);
      }
    }
    else if (NodeType.isUnaryMinus(equation.rightNode)) {
      newLeftNode = NodeCreator.operator('+', [equation.leftNode, symbolTerm.args[0]]);
      newRightNode = NodeCreator.operator('+', [equation.rightNode, symbolTerm.args[0]]);
      equation = new Equation(newLeftNode, newRightNode, equation.comparator);

      return new EquationStatus(equation, true, MathChangeTypes.ADD_TO_BOTH_SIDES);
    }
  }

  return new EquationStatus(equation);
}

// Move terms that do not have the give symbolName from the LHS to the RHS
function isolateSymbolOnLeftSide(symbolName, equation) {
  let nonSymbolTerm = getAnyTermWithoutSymbolName(equation.leftNode, symbolName);
  let newLeftNode, newRightNode;

  if (nonSymbolTerm) {
    if (NodeType.isOperator(equation.leftNode)) {
      if (equation.leftNode.op === '+') {
        newLeftNode = NodeCreator.operator('-', [equation.leftNode, nonSymbolTerm]);
        newRightNode = NodeCreator.operator('-', [equation.rightNode, nonSymbolTerm]);
        equation = new Equation(newLeftNode, newRightNode, equation.comparator)
        return new EquationStatus(equation, true, MathChangeTypes.SUBTRACT_FROM_BOTH_SIDES);
      }
      else if (equation.leftNode.op === '*') {
        newLeftNode = NodeCreator.operator('/', [equation.leftNode, nonSymbolTerm]);
        newRightNode = NodeCreator.operator('/', [equation.rightNode, nonSymbolTerm]);
        equation = new Equation(newLeftNode, newRightNode, equation.comparator)
        return new EquationStatus(equation, true, MathChangeTypes.DIVIDE_FROM_BOTH_SIDES);
      }
      else if (equation.leftNode.op === '/') {
        newLeftNode = NodeCreator.operator('*', [equation.leftNode, nonSymbolTerm]);
        newRightNode = NodeCreator.operator('*', [equation.rightNode, nonSymbolTerm]);
        equation = new Equation(newLeftNode, newRightNode, equation.comparator)
        return new EquationStatus(equation, true, MathChangeTypes.MULTIPLY_TO_BOTH_SIDES);
      }
       else {
        throw Error('Unsupported operation: ' + equation.leftNode.op);
      }
    }
    else if (NodeType.isUnaryMinus(equation.leftNode)) {
      newLeftNode = NodeCreator.operator('+', [equation.leftNode, nonSymbolTerm.args[0]]);
      newRightNode = NodeCreator.operator('+', [equation.rightNode, nonSymbolTerm.args[0]]);
      equation = new Equation(newLeftNode, newRightNode, equation.comparator)
      return new EquationStatus(equation, true, MathChangeTypes.ADD_TO_BOTH_SIDES);
    }
  }

  return new EquationStatus(equation);
}

// Iterates through a node and returns the first term that is a symbol
function getAnyTermWithSymbolName(node, symbolName) {
  if (NodeType.isSymbol(node)) {
    if (node.name === symbolName) {
      return node;
    }
  }
  else if (NodeType.isOperator(node)) {
    for (let i = 0; i < node.args.length; i++) {
      let child = node.args[i];
      if (PolynomialTermNode.isPolynomialTerm(child)) {
        const polyTerm = new PolynomialTermNode(child);
        if (polyTerm.symbolName() === symbolName) {
          return polyTerm;
        }
      }
    }
  }

  return null;
}

// Iterates through a node and returns the first term that does not have the symbol
function getAnyTermWithoutSymbolName(node, symbolName) {
  if (NodeType.isConstant(node)) {
    return node;
  }
  else if (NodeType.isSymbol(node)) {
    if (node.name !== symbolName) {
      return node;
    }
  }
  else if (NodeType.isOperator(node)) {
    for (let i = node.args.length - 1; i >= 0 ; i--) {
      let child = node.args[i];
      if (NodeType.isConstant(child)) {
        return child;
      }
      else if (PolynomialTermNode.isPolynomialTerm(child)) {
        const polyTerm = new PolynomialTermNode(child);
        if (polyTerm.symbolName() !== symbolName) {
          return polyTerm;
        }
        else {
          const coeff = polyTerm.coeffNode(false);
          if (coeff) {
            return coeff;
          }
        }
      }
    }
  }

  return null;
}

// simplify leftNode nad rightNode and returns the simplification steps
function simplifyBothSides(equation, debug=false) {
  let leftSteps = stepThrough(equation.leftNode);
  let rightSteps = stepThrough(equation.rightNode);
  let steps = combineSteps(leftSteps, rightSteps, equation, debug);
  return steps
}

// combines the steps on the left hand side and those on the right hand side
function combineSteps(leftSteps, rightSteps, equation, debug=false) {
  let steps = [];
  let equationStatus;
  for (let i = 0; i < leftSteps.length; i++) {
    let step = leftSteps[i];
    equation.leftNode = math.parse(step.expression);
    equationStatus = new EquationStatus(equation, false, step.explanation)
    steps = addStep(steps, equationStatus, debug)
  }
  for (let i = 0; i < rightSteps.length; i++) {
    let step = rightSteps[i];
    equation.rightNode = math.parse(step.expression);
    equationStatus = new EquationStatus(equation, false, step.explanation)
    steps = addStep(steps, equationStatus, debug)
  }
  return steps
}

// adds a step
function addStep(steps, equationStatus, debug) {
  const explanation = equationStatus.changeType;
  const equation = prettyPrintEquation(equationStatus.equation);
  steps.push({
    'explanation': explanation,
    'equation': equation
  });
  if (debug) {
    console.log('\n' + explanation);
    console.log(equation);
  }
  return steps;
}

// Returns the solution for an equation
function getSolution(equation) {
  // TODO: factor higher-order equations

  // for now, the right hand side is the solution
  return prettyPrintEquation(equation, false)
}

// Given an equation of constants, will simplify both sides and return
// the steps and the solution (No solution, Infinite solutions, True, False etc.)
function solveConstantEquation(equation) {
  let steps, solution;

  steps = simplifyBothSides(equation, debug);
  if (simplifySteps.length > 0) {
    let lastStep = simplifySteps[simplifySteps.length - 1];
    equationStatus.equation = createEquationFromString(lastStep.equation, equation.comparator);
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

function createEquationFromString(str, comparator) {
  const nodes = str.split(comparator);
  const leftNode = flatten(math.parse(nodes[0]));
  const rightNode = flatten(math.parse(nodes[1]));

  return new Equation(leftNode, rightNode, comparator);
}

function prettyPrintEquation(equation, showPlusMinus=false) {
  let leftSide = prettyPrint(equation.leftNode, showPlusMinus);
  let rightSide = prettyPrint(equation.rightNode, showPlusMinus);
  return leftSide + ' ' + equation.comparator + ' ' + rightSide;
}

module.exports = {
  createEquationFromString: createEquationFromString,
  solveEquation: solveEquation
};
