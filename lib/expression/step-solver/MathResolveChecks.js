"use strict"

const math = require('../../../index');

const MathResolveChecks = {
	// Returns true if the node is a constant or can eventually be resolved to
	// a constant.
	// e.g. 2, 2+4, (2+4)^2 would all return true. x + 4 would return false
	resolvesToConstant: function(node) {
	  switch (node.type) {
	    case 'OperatorNode':
	      return node.args.every(
	      	(child) => MathResolveChecks.resolvesToConstant(child));
	    case 'ParenthesisNode':
	      return MathResolveChecks.resolvesToConstant(node.content);
	    case 'ConstantNode':
	      return true;
	    case 'SymbolNode':
	      return false;
	    default:
	      throw Error("Unsupported node type: " + node.type);
	  }
	  return false;
	},
}

module.exports = MathResolveChecks;