'use strict';

const math = require('../../../index');

// Given leftNode, rightNode and the operator between them, will return the
// solution and the steps to get to the solution.
function solveEquation(symbolName, equation, debug=false) {
  if (debug) {
    console.log('\n\nSolving: ' + Util.prettyPrintEquation(equation, true));
  }

  // TODO(ael): return if there are more than 1 symbol in leftNode and rightNode

  // TODO(ael): return if there are any exponents on symbols

  // TODO(ael): return if it has unsupported nodes

  if (resolvesToConstant(leftNode) && resolvesToConstant(rightNode)) {
    return solveConstantEquation(leftNode, rightNode, comparator);
  }

  let steps = []

  // Step through the math equation until nothing changes
  let equationStatus = new EquationStatus(leftNode, rightNode, comparator)
  while (equationStatus.hasChanged) {
    // TODO(ael): clean up how I simplpify and add the simplifying steps here
    let simplifySteps = simplifyBothSides(equationStatus.leftNode, equationStatus.rightNode, comparator, debug)
    if (simplifySteps.length > 0) {
      let lastStep = simplifySteps[simplifySteps.length - 1];
      bothNodes = lastStep.split(comparator);
      equationStatus.leftNode = flatten(math.parse(bothNodes[0]));
      equationStatus.rightNode = flatten(math.parse(bothNodes[1]));
    }

    steps.concat(simplifySteps);
    equationStatus = step(symbolName, equationStatus.leftNode, equationStatus.rightNode, comparator);
    steps = addStep(steps, equationStatus, debug);
  }

  // TODO: factor higher order equations

  solution = getSolution(leftNode, rightNode, comparator)
  return [steps, solution]
}

// Given a symbol, two mathjs nodes and a comparator, performs a single step to
// solve for the symbol. Returns an EquationStatus object.
function step(symbolName, leftNode, rightNode, comparator) {
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
    equationStatus = solveFunctions[i](symbolName, leftNode, rightNode, comparator);
    if (equationStatus.hasChanged) {
      return equationStatus;
    }
  }
  return new EquationStatus(leftNode, rightNode, comparator);
}

function ensureSymbolInLeftNode(symbolName, leftNode, rightNode, comparator) {
  const leftSideSymbolTerm = getAnyTermWithSymbolName(rightNode, symbolName);
  const rightSideSymbolTerm = getAnyTermWithSymbolName(leftNode, symbolName);

  if (!leftSideSymbolTerm) {
    if (rightSideSymbolTerm) {
      return new EquationStatus(rightNode, leftNode, comparator, true, "Swapped sides");
    }
    else {
      throw Error("Can't find term with symbol: ": symbolName)
    }
  }
  return new EquationStatus(leftNode, rightNode, comparator);
}

// If the symbol is in any denominator in the equation, we want to multiply
// both sides by that denominator (TODO)
function removeSymbolFromDenominator(symbolName, leftNode, rightNode, comparator) {
  // pass for now
  return new EquationStatus(leftNode, rightNode, comparator);
}

// Move terms that have the give symbolName from the RHS to the LHS
function removeSymbolFromRightSide(symbolName, leftNode, rightNode, comparator) {
  let symbolTerm = getAnyTermWithSymbolName(rightNode, symbolName);

  if (symbolTerm){
    if (isOperator(rightNode)) {
      if (rightNode.op === '+') {
        leftNode = NodeCreator.operator('-', [leftNode, symbolTerm]);
        rightNode = NodeCreator.operator('-', [rightNode, symbolTerm]);
        return new EquationStatus(leftNode, rightNode, comparator, true, "Subtracting term from both sides");
      }
      else if (rightNode.op == '*') {
        leftNode = NodeCreator.operator('/', [leftNode, symbolTerm]);
        rightNode = NodeCreator.operator('/', [rightNode, symbolTerm]);
        return new EquationStatus(leftNode, rightNode, comparator, true, "Dividing term from both sides");
      }
      else if (rightNode.op === '/') {
        leftNode = NodeCreator.operator('*', [leftNode, symbolTerm]);
        rightNode = NodeCreator.operator('*', [rightNode, symbolTerm]);
        return new EquationStatus(leftNode, rightNode, comparator, true, "Multiplying term to both sides");
      }
       else {
        throw Error('Unsupported operation: ' + node.op);
      }
    }
    else if (NodeType.isUnaryMinus(rightNode)) {
      leftNode = NodeCreator.operator('+', [leftNode, symbolTerm.args[0]]);
      rightNode = NodeCreator.operator('+', [rightNode, symbolTerm.args[0]]);
      return new EquationStatus(leftNode, rightNode, comparator, true, "Adding term to both sides");
    }
  }

  return new EquationStatus(leftNode, rightNode, comparator);
}

// Move terms that do not have the give symbolName from the LHS to the RHS
function isolateSymbolOnLeftSide(symbolName, leftNode, rightNode, comparator) {
  let nonSymbolTerm = getAnyTermWithoutSymbolName(leftNode, symbolName);

  if (nonSymbolTerm) {
    if (isOperator(leftNode)) {
      if (leftNode.op === '+') {
        leftNode = NodeCreator.operator('-', [leftNode, nonSymbolTerm]);
        rightNode = NodeCreator.operator('-', [rightNode, nonSymbolTerm]);
        return new EquationStatus(leftNode, rightNode, comparator, true, "Subtracting term from both sides");
      }
      else if (leftNode.op == '*') {
        leftNode = NodeCreator.operator('/', [leftNode, nonSymbolTerm]);
        rightNode = NodeCreator.operator('/', [rightNode, nonSymbolTerm]);
        return new EquationStatus(leftNode, rightNode, comparator, true, "Dividing term from both sides");
      }
      else if (leftNode.op === '/') {
        leftNode = NodeCreator.operator('*', [leftNode, nonSymbolTerm]);
        rightNode = NodeCreator.operator('*', [rightNode, nonSymbolTerm]);
        return new EquationStatus(leftNode, rightNode, comparator, true, "Multiplying term to both sides");
      }
       else {
        throw Error('Unsupported operation: ' + leftNode.op);
      }
    }
    else if (NodeType.isUnaryMinus(leftNode)) {
      leftNode = NodeCreator.operator('+', [leftNode, nonSymbolTerm.args[0]]);
      rightNode = NodeCreator.operator('+', [rightNode, nonSymbolTerm.args[0]]);
      return new EquationStatus(leftNode, rightNode, comparator, true, "Adding term to both sides");
    }
  }

  return new EquationStatus(leftNode, rightNode, comparator);
}

// Iterates through a node and returns the first term that is a symbol
function getAnyTermWithSymbolName(node, symbolName) {
  for(let i = 0; i < node.args.length; i++) {
    let child = node.args[i];
    if (PolynomialTermNode.isPolynomialTerm(child)) {
      const polyTerm = new PolynomialTermNode(child);
      if (polyTerm.getSymbolName === symbolName) {
        return polyTerm;
      }
    }
  }
}

// Iterates through a node and returns the first term that does not have the symbol
function getAnyTermWithoutSymbolName(node, symbolName) {
  for(let i = 0; i < node.args.length; i++) {
    let child = node.args[i];
    if (isConstant(child)) {
      return child;
    }
    else if (PolynomialTermNode.isPolynomialTerm(child)) {
      const polyTerm = new PolynomialTermNode(child);
      if (polyTerm.getSymbolName !== symbolName) {
        return polyTerm;
      }
    }
  }
}

// simplify leftNode nad rightNode and returns the simplification steps
function simplifyBothSides(leftNode, rightNode, comparator, debug=false) {
  leftSteps = stepThrough(leftNode);
  rightSteps = stepThrough(rightNode);
  steps = combineSteps(leftSteps, rightSteps, comparator, debug);
  return steps
}

// combines the steps on the left hand side and those on the right hand side
function combineSteps(leftSteps, rightSteps, leftExpression, rightExpression, comparator, debug=false) {
  let steps = [];
  let step, equation;
  for (let i = 0; i < leftSteps.length; i++) {
    step = leftSteps[i];
    leftExpression = step.expression;
    equation = leftExpression + comparator + rightExpression;
    steps = addStep(steps, step.explanation, equation, debug)
  }
  for (let i = 0; i < rightSteps.length; i++) {
    step = rightSteps[i];
    rightExpression = step.expression
    equation = leftExpression + comparator + rightExpression;
    steps = addStep(steps, step.explanation, equation, debug)
  }
  return steps
}

// adds a step
function addStep(steps, explanation, debug) {
  const explanation = equationStatus.changeType;
  const equation = Util.prettyPrint(equationStatus.leftNode) + equationStatus.comparator + Util.prettyPrint(equationStatus.rightNode);
  steps.push({
    'explanation': explanation,
    'equation': equation
  });
  if (debug) {
    console.log('\n' + stepExplanation);
    console.log(equation);
  }
  return steps;
}

// Returns the solution for an equation
function getSolution(leftNode, rightNode, comparator) {
  // TODO: factor higher-order equations

  // for now, the right hand side is the solution
  return Util.prettyPrint(rightNode, false)
}

// Given an equation of constants, will simplify both sides and return
// the steps and the solution (No solution, Infinite solutions, True, False etc.)
function solveConstantEquation(leftNode, rightNode, comparator) {
  let steps, solution;

  steps = simplifyBothSides(leftNode, rightNode, comparator, debug);
  leftNode = steps.leftNode;
  rightNode = steps.rightNode;

  if (!NodeType.isConstant(steps.leftNode) || !NodeType.isConstant(steps.rightNode)) {
    throw Error('Expected both nodes to be constants');
  }

  let leftValue = parseFloat(steps.leftNode.value);
  let rightValue = parseFloat(steps.rightNode.value);
  if (comparator == "=") {
      if (leftValue === 0) {
        solution = "Infinite solutions"
      } else {
        solution = "One solution"
      }
    } else {
      solution = "No solution"
    }
  }
  else if (comparator == ">") {
    if (leftValue > rightValue)
      solution = "This is true"
    }
    else {
      solution = "This is false"
    }
  }
  else if (comparator == ">=") {
    if (leftValue >= rightValue)
      solution = "This is true"
    }
    else {
      solution = "This is false"
    }
  }
  else if (comparator == "<") {
    if (leftValue < rightValue)
      solution = "This is true"
    }
    else {
      solution = "This is false"
    }
  }
  else if (comparator == "<=") {
    if (leftValue <= rightValue)
      solution = "This is true"
    }
    else {
      solution = "This is false"
    }
  }

  return [steps, solution]
}
