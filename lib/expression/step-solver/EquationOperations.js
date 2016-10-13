'use strict';
// Operations on polynomial term nodes

const math = require('../../../index');

const Equation = require('./Equation');
const EquationStatus = require('./EquationStatus');
const MathChangeTypes = require('./MathChangeTypes');
const NodeCreator = require('./NodeCreator');
const NodeType = require('./NodeType');
const Symbols = require('./Symbols.js');

class EquationOperations {};

// Ensures that the given equation has the given symbolName on the left side,
// by swapping the right and left sides if it is only in the right side
EquationOperations.ensureSymbolInLeftNode = function(equation, symbolName) {
  const leftSideSymbolTerm = Symbols.getAnyTermWithSymbolName(equation.leftNode, symbolName);
  const rightSideSymbolTerm = Symbols.getAnyTermWithSymbolName(equation.rightNode, symbolName);
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

// TODO: Ensures that a symbol is not in the denominator by multiplying
// both sides by the whatever order of the symbol necessary
EquationOperations.removeSymbolFromDenominator = function(equation, symbolName) {
  // pass for now
  return new EquationStatus(equation);
}

// Removes the given symbolName from the right side by adding, multiplying, subtracting
// or dividing it from both sides as appropriate
// TODO: support inverting functions e.g. sqrt, ^, log etc.
EquationOperations.removeSymbolFromRightSide = function(equation, symbolName) {
  let symbolTerm = Symbols.getAnyTermWithSymbolName(equation.rightNode, symbolName);

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

// Isolates the given symbolName to the left side by adding, multiplying, subtracting
// or dividing all other symbols and constants from both sides appropriately
// TODO: support inverting functions e.g. sqrt, ^, log etc.
EquationOperations.isolateSymbolOnLeftSide = function(equation, symbolName) {
  let nonSymbolTerm = Symbols.getAnyTermWithoutSymbolName(equation.leftNode, symbolName);
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

module.exports = EquationOperations;
