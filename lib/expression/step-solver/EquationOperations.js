'use strict';
// Operations on equation nodes

const math = require('../../../index');

const Equation = require('./Equation');
const EquationStatus = require('./EquationStatus');
const MathChangeTypes = require('./MathChangeTypes');
const NodeCreator = require('./NodeCreator');
const NodeType = require('./NodeType');
const PolynomialTermNode = require('./PolynomialTermNode');
const Symbols = require('./Symbols.js');

class EquationOperations {};

// Ensures that the given equation has the given symbolName on the left side,
// by swapping the right and left sides if it is only in the right side.
// So 3 = x would become x = 3.
EquationOperations.ensureSymbolInLeftNode = function(equation, symbolName) {
  const leftSideSymbolTerm = Symbols.getFirstSymbolTerm(
    equation.leftNode, symbolName);
  const rightSideSymbolTerm = Symbols.getFirstSymbolTerm(
    equation.rightNode, symbolName);

  if (!leftSideSymbolTerm) {
    if (rightSideSymbolTerm) {
      equation = new Equation(
        equation.rightNode, equation.leftNode, equation.comparator)
      return new EquationStatus(equation, true, MathChangeTypes.SWAP_SIDES);
    }
    else {
      throw Error('No term with symbol: ' + symbolName)
    }
  }
  return new EquationStatus(equation);
}

// TODO: Ensures that a symbol is not in the denominator by multiplying
// both sides by the whatever order of the symbol necessary.
// This is blocked on the simplifying functionality of canceling symbols in fractions
EquationOperations.removeSymbolFromDenominator = function(equation, symbolName) {
  // pass for now
  return new EquationStatus(equation);
}

// Removes the given symbolName from the right side by adding, multiplying, subtracting
// or dividing it from both sides as appropriate
// TODO: support inverting functions e.g. sqrt, ^, log etc.
EquationOperations.removeSymbolFromRightSide = function(equation, symbolName) {
  const symbolTerm = Symbols.getFirstSymbolTerm(equation.rightNode, symbolName);

  let inverseOp, inverseTerm, changeType;
  if (symbolTerm){
    if (NodeType.isOperator(equation.rightNode)) {
      if (equation.rightNode.op === '+') {
        inverseOp = '-';
        changeType = MathChangeTypes.SUBTRACT_FROM_BOTH_SIDES;
        inverseTerm = symbolTerm;

        return performTermOperationOnEquation(
            equation, inverseOp, inverseTerm, changeType)
      }
      else {
        throw Error('Unsupported operation: ' + symbolTerm.op);
      }
    }
    else if (NodeType.isUnaryMinus(equation.rightNode)) {
      inverseOp = '+';
      changeType = MathChangeTypes.ADD_TO_BOTH_SIDES;
      inverseTerm = symbolTerm.args[0];

      return performTermOperationOnEquation(
          equation, inverseOp, inverseTerm, changeType)
    }
  }

  return new EquationStatus(equation);
}

// Isolates the given symbolName to the left side by adding, multiplying, subtracting
// or dividing all other symbols and constants from both sides appropriately
// TODO: support inverting functions e.g. sqrt, ^, log etc.
EquationOperations.isolateSymbolOnLeftSide = function(equation, symbolName) {
  let nonSymbolTerm = Symbols.getLastNonSymbolTerm(equation.leftNode, symbolName);

  let inverseOp, inverseTerm, changeType;
  if (nonSymbolTerm) {
    if (NodeType.isOperator(equation.leftNode)) {
      if (equation.leftNode.op === '+') {
        inverseOp = '-';
        changeType = MathChangeTypes.SUBTRACT_FROM_BOTH_SIDES;
        inverseTerm = nonSymbolTerm;
      }
      else if (equation.leftNode.op === '*') {
        if (NodeType.isConstantFraction(nonSymbolTerm)) {
          inverseOp = '*';
          changeType = MathChangeTypes.MULTIPLY_BOTH_SIDES_BY_INVERSE_FRACTION;
          inverseTerm = NodeCreator.operator(
            '/', [nonSymbolTerm.args[1], nonSymbolTerm.args[0]]);

        } else {
          inverseOp = '/';
          changeType = MathChangeTypes.DIVIDE_FROM_BOTH_SIDES;
          inverseTerm = nonSymbolTerm;
        }
      }
      else if (equation.leftNode.op === '/') {
        if (NodeType.isConstantFraction(nonSymbolTerm) &&
            PolynomialTermNode.isPolynomialTerm(equation.leftNode)) {
          inverseOp = '*';
          changeType = MathChangeTypes.MULTIPLY_BOTH_SIDES_BY_INVERSE_FRACTION;
          inverseTerm = NodeCreator.operator(
            '/', [nonSymbolTerm.args[1], nonSymbolTerm.args[0]]);
        } else {
          inverseOp = '*';
          changeType = MathChangeTypes.MULTIPLY_TO_BOTH_SIDES;
          inverseTerm = nonSymbolTerm;
        }
      }
      else {
        throw Error('Unsupported operation: ' + equation.leftNode.op);
      }

      return performTermOperationOnEquation(
        equation, inverseOp, inverseTerm, changeType);
    }
    else if (NodeType.isUnaryMinus(equation.leftNode)) {
      inverseOp = '*';
      changeType = MathChangeTypes.MULTIPLE_BOTH_SIDES_BY_NEGATIVE_ONE;
      inverseTerm =  NodeCreator.constant(-1);

      return performTermOperationOnEquation(
          equation, inverseOp, inverseTerm, changeType);
    }
  }

  return new EquationStatus(equation);
}

function performTermOperationOnEquation(equation, op, term, changeType) {
  const leftNode = NodeCreator.operator(op, [equation.leftNode, term]);
  const rightNode = NodeCreator.operator(op, [equation.rightNode, term]);
  equation = new Equation(leftNode, rightNode, equation.comparator);
  return new EquationStatus(equation, true, changeType);
}

module.exports = EquationOperations;
