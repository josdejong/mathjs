'use strict';

const NodeType = require('./NodeType');
const PolynomialTermNode = require('./PolynomialTermNode');
const Util = require('./Util');

const Symbols = {};

// returns the set of all the symbols in an equation
Symbols.getSymbolsInEquation = function(equation) {
  const leftSymbols = Symbols.getSymbols(equation.leftNode);
  const rightSymbols = Symbols.getSymbols(equation.rightNode);
  const symbols = new Set(...leftSymbols, ...rightSymbols);
  return symbols;
}

// return the set of symbols in the node
Symbols.getSymbols = function(node) {
  let symbolNodes = node.filter(node => node.isSymbolNode); // all the symbol nodes
  let symbols = symbolNodes.map(node => node.name); // all the symbol nodes' names
  let symbolSet = new Set(symbols); // to get rid of duplicates
  return symbolSet;
}

// Iterates through a node and returns the first term that is a symbol
// including polynomial terms
Symbols.getFirstTermWithSymbolName = function(node, symbolName) {
  if (NodeType.isSymbol(node)) {
    if (node.name === symbolName) {
      return node;
    }
  }
  else if (NodeType.isOperator(node)) {
    for (let i = 0; i < node.args.length; i++) {
      let child = node.args[i];
      let symbolNode = Symbols.getFirstTermWithSymbolName(child, symbolName);
      if (symbolNode) {
        return symbolNode;
      }
    }
  }
  else if (NodeType.isParenthesis(node)) {
    let symbolNode = Symbols.getFirstTermWithSymbolName(node.content, symbolName);
    if (symbolNode) {
      return node;
    }
  }
  else if (NodeType.isUnaryMinus(node)) {
    let symbolNode = Symbols.getFirstTermWithSymbolName(node.args[0], symbolName);
    if (symbolNode) {
      return node;
    }
  }
  else if (PolynomialTermNode.isPolynomialTerm(node)) {
    const polyTerm = new PolynomialTermNode(node);
    if (polyTerm.symbolName() === symbolName) {
      return polyTerm;
    }
  }
  return null;
}

// Iterates through a node and returns the first term that does not have the symbol
// including polynomial terms
Symbols.getFirstTermWithoutSymbolName = function(node, symbolName) {
  if (Util.isConstantOrConstantFraction(node)) {
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
      let nonSymbolNode = Symbols.getFirstTermWithoutSymbolName(child, symbolName);
      if (nonSymbolNode) {
        return nonSymbolNode;
      }
    }
  }
  else if (NodeType.isParenthesis(node)) {
    let symbolNode = Symbols.getFirstTermWithSymbolName(node.content, symbolName);
    if (!symbolNode) {
      return node;
    }
  }
  else if (NodeType.isUnaryMinus(node)) {
    let symbolNode = Symbols.getFirstTermWithSymbolName(node.content, symbolName);
    if (!symbolNode) {
      return node;
    }
  }
  else if (PolynomialTermNode.isPolynomialTerm(node)) {
    const polyTerm = new PolynomialTermNode(node);
    if (polyTerm.symbolName() !== symbolName) {
      return polyTerm;
    } else {
      const coeff = polyTerm.coeffNode(false)
      if (coeff) {
        return coeff
      }
    }
  }

  return null;
}

module.exports = Symbols;
