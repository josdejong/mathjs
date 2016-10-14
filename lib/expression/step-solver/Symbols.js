'use strict';

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

// Iterates through a node and returns the first term that is a symbol
// including polynomial terms
Symbols.getFirstTermWithSymbolName = function(node, symbolName) {
  if (PolynomialTermNode.isPolynomialTerm(node)) {
    const polyTerm = new PolynomialTermNode(node);
    if (polyTerm.symbolName() === symbolName) {
      return polyTerm.rootNode();
    }
  }
  else if (NodeType.isOperator(node)) {
    for (let i = 0; i < node.args.length; i++) {
      const child = node.args[i];
      const symbolNode = Symbols.getFirstTermWithSymbolName(child, symbolName);
      if (symbolNode) {
        // we want to return the entire node (not just the symbol (especially
        // it's deeper in the tree)
        return child;
      }
    }
  }

  return null;
}

// Iterates through a node and returns the first term that does not have the
// symbolName including other polynomial terms, and constants or constant fractions
Symbols.getLastTermWithoutSymbolName = function(node, symbolName) {
  if (NodeType.isConstantOrConstantFraction(node)) {
    return node;
  }
  else if (PolynomialTermNode.isPolynomialTerm(node)) {
    const polyTerm = new PolynomialTermNode(node);
    if (polyTerm.symbolName() !== symbolName) {
      return polyTerm;
    } else {
      const coeff = polyTerm.coeffNode()
      if (coeff) {
        return coeff;
      }
    }
  }
  else if (NodeType.isOperator(node)) {
    for (let i = node.args.length - 1; i >= 0 ; i--) {
      const child = node.args[i];
      const nonSymbolNode = Symbols.getLastTermWithoutSymbolName(child, symbolName);
      if (nonSymbolNode) {
        // we want to return the entire node (not just the symbol (especially
        // it's deeper in the tree)
        return child;
      }
    }
  }

  return null;
}

module.exports = Symbols;
