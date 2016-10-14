'use strict';

const NodeCreator = require('./NodeCreator');
const NodeType = require('./NodeType');
const PolynomialTermNode = require('./PolynomialTermNode');

const Symbols = {};

// returns the set of all the symbols in an equation
Symbols.getSymbolsInEquation = function(equation) {
  const leftSymbols = Symbols.getSymbolsInExpression(equation.leftNode);
  const rightSymbols = Symbols.getSymbolsInExpression(equation.rightNode);
  const symbols = new Set(...leftSymbols, ...rightSymbols);
  return symbols;
}

// return the set of symbols in the expression tree
Symbols.getSymbolsInExpression = function(expression) {
  const symbolNodes = expression.filter(node => node.isSymbolNode); // all the symbol nodes
  const symbols = symbolNodes.map(node => node.name); // all the symbol nodes' names
  const symbolSet = new Set(symbols); // to get rid of duplicates
  return symbolSet;
}

// Iterates through a node and returns the polynomial term with the symbol name
Symbols.getFirstSymbolTerm = function(node, symbolName) {
  let symbolTerm = Symbols.getSymbolTerm(node, symbolName);
  if (symbolTerm) {
    return symbolTerm;
  }
  else if (NodeType.isOperator(node)) {
    for (let i = 0; i < node.args.length; i++) {
      const child = node.args[i];
      const symbolTerm = Symbols.getSymbolTerm(child, symbolName);
      if (symbolTerm) {
        return symbolTerm;
      }
    }
  }

  return null;
}

// Returns the polynomial term in the node the given symbolName
Symbols.getSymbolTerm = function(node, symbolName) {
  if (PolynomialTermNode.isPolynomialTerm(node)) {
    const polyTerm = new PolynomialTermNode(node);
    if (polyTerm.symbolName() === symbolName) {
      return polyTerm.rootNode();
    }
  }
  return null;
}

// Iterates through a node and returns the last term that does not have the
// symbolName including other polynomial terms, and constants or constant fractions
Symbols.getLastNonSymbolTerm = function(node, symbolName) {
  let nonSymbolTerm = Symbols.getNonSymbolTerm(node, symbolName, false);
  if (nonSymbolTerm) {
    return nonSymbolTerm;
  }
  else if (NodeType.isOperator(node)) {
    for (let i = node.args.length - 1; i >= 0 ; i--) {
      const child = node.args[i];
      const nonSymbolTerm = Symbols.getNonSymbolTerm(child, symbolName, true);
      if (nonSymbolTerm) {
        return nonSymbolTerm;
      }
    }
  }

  return nonSymbolTerm;
}

// Returns the node if it doesn't have the given symbolName
// If the node is a polynomial term, it will return the coefficient term
Symbols.getNonSymbolTerm = function(node, symbolName, inOperation) {
  if (NodeType.isConstantOrConstantFraction(node)) {
    return node;
  }
  else if (PolynomialTermNode.isPolynomialTerm(node)) {
    const polyTerm = new PolynomialTermNode(node);
    if (polyTerm.symbolName() !== symbolName) {
      return polyTerm;
    } else if (!inOperation) {
      return polyTerm.coeffNode();
    }
  }

  return null;
}

module.exports = Symbols;
