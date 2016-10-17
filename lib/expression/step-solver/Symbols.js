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
// Returns null if no terms with the symbol name are in the node.
// e.g. 4x^2 + 2x + y + 2 with `symbolName=x` would return 2x
Symbols.getLastSymbolTerm = function(node, symbolName) {
  // First check if the node itself is a polyomial term with symbolName
  if(isSymbolTerm(node, symbolName)) {
    return node;
  }
  // Otherwise, it's a sum of terms. Look through the operands for a term
  // with `symbolName`
  else if (NodeType.isOperator(node) && node.op === '+') {
    for (let i = node.args.length - 1; i >= 0 ; i--) {
      const child = node.args[i];
      if (isSymbolTerm(child, symbolName)) {
        return child;
      }
    }
  }
  return null;
}

// Iterates through a node and returns the last term that does not have the
// symbolName including other polynomial terms, and constants or constant
// fractions
// e.g. 4x^2 with `symbolName=x` would return 4
// e.g. 4x^2 + 2x + 2/4 with `symbolName=x` would return 2/4
// e.g. 4x^2 + 2x + y with `symbolName=x` would return y
Symbols.getLastNonSymbolTerm = function(node, symbolName) {
  if (isSymbolTerm(node, symbolName)) {
    return new PolynomialTermNode(node).getCoeffNode();
  }
  else if (NodeType.isOperator(node)) {
    for (let i = node.args.length - 1; i >= 0 ; i--) {
      const child = node.args[i];
      if (!isSymbolTerm(child, symbolName)) {
        return child;
      }
    }
  }

  return null;
}

// Returns if `node` is a polynomial term with symbol `symbolName`
function isSymbolTerm(node, symbolName) {
  if (PolynomialTermNode.isPolynomialTerm(node)) {
    const polyTerm = new PolynomialTermNode(node);
    if (polyTerm.getSymbolName() === symbolName) {
      return true;
    }
  }
  return false;
}

module.exports = Symbols;
