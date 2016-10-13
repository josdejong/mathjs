'use strict';

const symbols = {};

// return the set of symbols in the node
symbols.getSymbols = function(node) {
  let symbolNodes = node.filter(node => node.isSymbolNode); // all the symbol nodes
  let symbols = symbolNodes.map(node => node.name); // all the symbol nodes' names
  let symbolSet = new Set(symbols); // to get rid of duplicates
  return symbolSet;
}

module.exports = symbols;
