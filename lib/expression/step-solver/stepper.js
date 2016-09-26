"use strict"

const math = require('../../../index');

const collectLikeTerms = require('./LikeTermCollector').collectLikeTermsDFS;
const flattenOperands = require('./flattenOperands');
const NodeStatus = require('./NodeStatus');
const removeUnnecessaryParens = require('./removeUnnecessaryParens');
const simplifyDivision = require('./simplifyDivision');
const simplifyOperations = require('./simplifyOperations');
const Util = require('./Util');


// Returns a NodeStatus object with a possibly-updated expression tree
function step(node) {
  let nodeStatus;

  // Parens that wrap everything are redundant
  // note that removeUnnecessaryParens recursively removes parens that aren't
  // needed, while this step only applies to the very top level expression.
  // e.g. (2 + 3) * 4 can't become 2 + 3 * 4, but if (2 + 3) as a top level
  // expression can become 2 + 3
  if (node.type === 'ParenthesisNode') {
    while (node.type === 'ParenthesisNode') {
      node = node.content;
    }
  }

  // start by removing unnecessary parens, but don't count it as a step
  node = removeUnnecessaryParens(node).node;

  // We assume from hereon out that the root node is an operator node with args
  // If this is not the case, return early so other stuff doesn't break.
  if (!node.args || node.type !== "OperatorNode") {
    return new NodeStatus(node);
  }

  // Start with flattening the tree so we can change it more easily
  node = flattenOperands(node);
  const simplificationFunctions = [
    // Simplify any division chains into a single division operation.
    simplifyDivision,
    // Try combining terms (e.g. 2+2->4 or 2x*6x->12x^2)
    simplifyOperations,
    // Then see if any like terms can be collected at the top level
    collectLikeTerms,
  ];

  for (let i = 0; i < simplificationFunctions.length; i++) {
    nodeStatus = simplificationFunctions[i](node);
    if (nodeStatus.hasChanged) {
      // Remove unnecessary parens before returning, in case one of the steps
      // results in more parens than needed.
      node = removeUnnecessaryParens(node).node;
      return nodeStatus;
    }
  }
  return new NodeStatus(node);
}

// Given a mathjs expression node, steps through simplifying the expression.
// Returns the simplified expression node.
function simplify(node, debug=false) {
  const steps = stepThrough(node, debug);
  if (steps.length > 0) {
    return steps.pop().node;
  }
  else {
    // this will do any necessary flattening/removing parens (which aren't
    // counted as a step)
    return step(node).node;
  }
}

function stepThrough(node, debug=false) {
  if (debug) {
    console.log("\n\nSimplifying: " + Util.prettyPrint(node));
  }


  // Keep stepping through the math expression until nothing changes
  let steps = [];
  let iter = 1;
  let nodeStatus = step(node);
  while(nodeStatus.hasChanged) {
    let stepExplanation = "Step " + iter + ": " + nodeStatus.changeType;
    let exprString = Util.prettyPrint(nodeStatus.node);
    steps.push({
      "explanation": stepExplanation,
      "expression": exprString,
      "node": nodeStatus.node,
    });
    if (debug) {
      console.log("\n" + stepExplanation);
      console.log(exprString);
    }
    iter++;
    nodeStatus = step(nodeStatus.node);
  };
  if (debug) {
    console.log("\nDone\n\n");
  }
  return steps;
}

module.exports = {
  step: step,
  simplify: simplify,
  stepThrough: stepThrough,
}
