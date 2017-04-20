"use strict"

const math = require('../../../index');
const likeTermCollector = require('./LikeTermCollector');
const flattenOps = require('./flattenOps');
const NodeContext = require('./NodeContext');
const removeUnnecessaryParens = require('./removeUnnecessaryParens');
const simplifyOperationsDFS = require('./simplifyOperations');
const MathChangeTypes = require('./MathChangeTypes');

// This is always the top level node of the overall expression the student is
// solving. As we move step by step, the expr is updated.
class RootNode {
  constructor(expr) {
    this.expr = expr;
    this.hasChanged = false;
    this.changeType = MathChangeTypes.NO_CHANGE;
  }
}

// Always returns the updated expression tree and if it was updated.
function step(rootNodeObj) {

  let rootNode = rootNodeObj.expr;
  rootNodeObj.hasChanged = false;

  // Parens that wrap everything are redundant
  while (rootNode.type === 'ParenthesisNode') {
    rootNode = rootNode.content;
    rootNodeObj.expr = rootNode;
    rootNodeObj.hasChanged = true;
    rootNodeObj.changeType = MathChangeTypes.REMOVE_PARENS_ROOT_NODE;
  }

  const before = rootNodeObj.expr.toString();
  removeUnnecessaryParens(NodeContext.makeRootNodeContext(rootNodeObj));
  if (rootNodeObj.expr.toString() !== before) {
    rootNodeObj.changeType = MathChangeTypes.REMOVE_PARENS_GENERAL;
    rootNodeObj.hasChanged = true;
    return rootNodeObj;
  }

  // We assume from hereon out that the root node is an operator node with args
  // If this is not the case, return early so other stuff doesn't break.
  if (!rootNode.args || rootNode.type !== "OperatorNode") {
    rootNodeObj.expr = rootNode;
    rootNodeObj.hasChanged = false;
    rootNodeObj.changeType = MathChangeTypes.NO_CHANGE;
    return rootNodeObj;
  }

  rootNode = flattenOps(rootNode);

  // First, try combining terms (e.g. 2+2 or 2x*6x)
  let ret = simplifyOperationsDFS(rootNodeObj);
  if (ret.hasChanged) {
    return ret;
  }

  // Then see if any like terms can be collected at the top level
  ret = likeTermCollector.collectLikeTermsDFS(rootNodeObj, rootNode);
  if (ret.hasChanged) {
    return ret;
  }

  rootNodeObj.changeType = MathChangeTypes.NO_CHANGE;
  return rootNodeObj;
}


function simplify(expr, debug=false) {
  if (debug) {
    console.log("\n\nSimplifying: " + prettyPrint(expr));
  }
  let iter = 1;
  let ret = step(new RootNode(expr));
  while(ret.hasChanged) {
    if (debug) {
      console.log("\nStep " + iter + ": " + ret.changeType);
      console.log(prettyPrint(ret.expr));
    }
    iter++;
    ret = step(ret);
  };
  if (debug) {
    console.log("\nDone\n\n");
  }
  return ret.expr;
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
  RootNode: RootNode,
  step: step,
  simplify: simplify,
}
