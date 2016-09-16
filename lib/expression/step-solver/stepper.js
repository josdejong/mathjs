"use strict"

const math = require('../../../index');
const collectLikeTermsDFS = require('./LikeTermCollector').collectLikeTermsDFS;
const flattenOps = require('./flattenOps');
const NodeStatus = require('./NodeStatus');
const removeUnnecessaryParens = require('./removeUnnecessaryParens');
const simplifyOperationsDFS = require('./simplifyOperations');
const MathChangeTypes = require('./MathChangeTypes');

// Always returns the updated expression tree and if it was updated.
function step(node) {
  let nodeStatus;

  // Parens that wrap everything are redundant
  if (node.type === 'ParenthesisNode') {
    while (node.type === 'ParenthesisNode') {
      node = node.content;
    }
  }

  nodeStatus = removeUnnecessaryParens(node);
  if (nodeStatus.hasChanged) {
    return nodeStatus;
  }

  // We assume from hereon out that the root node is an operator node with args
  // If this is not the case, return early so other stuff doesn't break.
  if (!node.args || node.type !== "OperatorNode") {
    return new NodeStatus(node);
  }

  nodeStatus = flattenOps(node);
  if (nodeStatus.hasChanged) {
    return nodeStatus;
  }

  // First, try combining terms (e.g. 2+2 or 2x*6x)
  nodeStatus = simplifyOperationsDFS(node);
  if (nodeStatus.hasChanged) {
    return nodeStatus;
  }

  // Then see if any like terms can be collected at the top level
  nodeStatus = collectLikeTermsDFS(node);
  if (nodeStatus.hasChanged) {
    return nodeStatus;
  }

  return new nodeStatus(node);
}


function simplify(node, debug=false) {
  if (debug) {
    console.log("\n\nSimplifying: " + prettyPrint(node));
  }

  let iter = 1;

  let nodeStatus = step(node);
  while(nodeStatus.hasChanged) {
    if (debug) {
      console.log("\nStep " + iter + ": " + nodeStatus.changeType);
      console.log(prettyPrint(nodeStatus.node));
    }
    iter++;
    nodeStatus = step(nodeStatus.node);
  };
  if (debug) {
    console.log("\nDone\n\n");
  }
  return nodeStatus.node;
}

/*  DEMO ------------------------------------------------------------------------- */

// keep this function though, it's pretty sweet
function prettyPrint(node) {
  switch (node.type) {
    case 'OperatorNode':
      let str = prettyPrint(node.args[0]);
      for (let i = 1; i < node.args.length; i++) {
        switch (node.op) {
          case '+':
          case '-':
          case '/':
            str += ' ' + node.op + ' ';
            break;
          case '*':
            if (!node.implicit) {
              str += ' ' + node.op + ' ';
            }
            break;
          case '^':
            str += node.op;
        }

        str += prettyPrint(node.args[i]);
      }
      return str;
    case 'ParenthesisNode':
      return "(" + prettyPrint(node.content) + ")";
    case 'ConstantNode':
    case 'SymbolNode':
      return node.toString();

  }
}


process.stdin.resume();
process.stdin.setEncoding('utf8');
var util = require('util');

process.stdin.on('data', function (text) {
  let input = util.inspect(text).replace('\\n', '');
  input = input.replace('\'', '');
  input = input.replace('\'', '');

  if (input === 'quit') {
    done();
  }
  simplify(math.parse(input), true);
});

function done() {
  console.log('Exiting stepper');
  process.exit();
}
/*  ------------------------------------------------------------------------------ */

// TODO: move things not in this module into their own test files
module.exports = {
  step: step,
  simplify: simplify,
}
