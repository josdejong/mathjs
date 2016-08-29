"use strict"

const math = require('../../../index');

// To store expressions in a tuple with its parent and index so expressions
// can be simplified and replaced easily in the tree.
class NodeContext {
  constructor(expr, parent, index, isContent) {
    this.expr = expr;
    this.parent = parent;
    this.index = index;
    this.isContent = isContent;
  }

  replaceNode(newNode) {
    if (this.isContent) {
      this.parent.content = newNode;
    } else {
      this.parent.args[this.index] = newNode;
    }
  }
}

class RootNode {
  constructor(expr) {
    this.expr = expr;
    this.hasChanged = false;
  }
}

// Returns an array of NodeContext objects, one for each child of `node`.
function getNodeChildrenWithContext(node) {
  if(node.args) {
    return node.args.map((expr, i) => new NodeContext(expr, node, i, false));
  }

  if(node.content) {
    return [new NodeContext(node.content, node, 0, true)];
  }

  throw Error("Unsupported node type: " + node.type);
}

// Remove parens around constant nodes
function removeUnnecessaryParens(nodeContext) {
  let node = nodeContext.expr;

  switch (node.type) {
    case 'OperatorNode':
      getNodeChildrenWithContext(node).forEach(child => removeUnnecessaryParens(child));
      break;
    // parenthesis are uncessary when the content is a constant or also parenthesis
    case 'ParenthesisNode':
      switch (node.content.type) {
        case 'OperatorNode':
          break;
        case 'ParenthesisNode':
          nodeContext.replaceNode(node.content);
          removeUnnecessaryParens(getNodeChildrenWithContext(node));
          break;
        case 'ConstantNode':
        case 'SymbolNode':
          nodeContext.replaceNode(node.content);
          break;
        default:
          throw Error("Unsupported node type: " + node.type);
      }
      break;
    case 'ConstantNode':
    case 'SymbolNode':
      break;
    default:
      throw Error("Unsupported node type: " + node.type);
  }
}

// This function assumes that rootNode isn't a ParenthesisNode.
// A node can be simplified further only if it has children.
function canBeSimplifiedFurther(rootNode) {
  // TODO add function nodes
  return (rootNode.args && rootNode.type === "OperatorNode");
}

// If the node is a constant or is an operation on two constants.
// e.g. 3, 2+4, (8-3), sqrt(x) would all return true
// e.g. 3x + 4, 2+4+2, 3*(4+3) would all return false
function canResolveMath(node) {
  switch (node.type) {
    case 'OperatorNode':
      return node.args.every((child) => child.type === 'ConstantNode');
    case 'ParenthesisNode':
      return canResolveMath(node.content);
    case 'ConstantNode':
      return true;
    case 'SymbolNode':
      return false;
    default:
      throw Error("Unsupported node type: " + node.type);
  }
  return false;
}

// Flattens the tree accross the same operation (just + and * for now)
// e.g. 2+2+2 is parsed by mathjs as 2+(2+2), but this would change that to
// 2+2+2, ie one + node that has three children.
function flattenOps(node) {
  // TODO add support for function nodes like sqrt(x)
  switch (node.type) {
    case 'ConstantNode': // This is the base case
    case 'SymbolNode':
      break;
    case 'OperatorNode':
      let newChildren = [];
      // TODO: add -, and also add / if it makes sense
      if (node.op === "+" || node.op === "*") {
        node.args.forEach((child) => {
          // This will make an array of arrays
          newChildren.push(expandOp(node.op, child));
        });
        node.args = [].concat.apply([], newChildren);
      }
      node.args.forEach((child) => flattenOps(child));
      break;
    case 'ParenthesisNode':
      flattenOps(node.content);
      break;
    default:
      throw Error("Unsupported node type: " + node.type);
  }

  return node;
}

function expandOp(op, node) {
  if (node.type === 'OperatorNode' && node.op === op) {
    let nodesUnderOp = [];
    node.args.forEach((child) => {
      // This will make an array of arrays
      nodesUnderOp.push(expandOp(node.op, child));
    });
    return [].concat.apply([], nodesUnderOp);
  }

  return [node];
}

// TEMPORARY (hopefully) because apparently operations can only be evaluated
// if they have two arguments?? :(

function manualEval(exp) {
  if (exp.type === 'ParenthesisNode') {
    exp = exp.content;
  }
  switch (exp.op) {
    case '*':
      return exp.args.map(x => parseInt(x.value)).reduce(
        (prev, curr) => prev * curr);
    case '+':
      return exp.args.map(x => parseInt(x.value)).reduce(
        (prev, curr) => prev + curr);
    // these operations should only be done with two arguments
    default:
      return exp.eval();
  }
}

// If we can do a simplify step (e.g. adding two terms, performing some
// arithmetic). Always returns the updated expression tree and if it was
// updated.
function simplifyStepDFS(rootNodeObj) {
  let rootNode = rootNodeObj.expr;

  // An array of expressions to check for reduction, starting with the root.
  let expressions = getNodeChildrenWithContext(rootNode);

  // Run DFS with iteration, so the search stops once something is reduced.
  while (expressions.length !== 0) {
    let current = expressions.shift();
    let expr = current.expr;
    switch (expr.type) {
        case 'OperatorNode':
        case 'ParenthesisNode':
          // if we can perform an operation on two constants, that's a step
          if (canResolveMath(expr)) {
            current.replaceNode(math.parse(manualEval(expr)));
            rootNodeObj.expr = rootNode;
            rootNodeObj.hasChanged = true;
            return rootNodeObj;
          }
          expressions = expressions.concat(
            getNodeChildrenWithContext(current.expr));
          break;
        case 'SymbolNode':
        case 'ConstantNode':
          // we can't simplify this any further
          continue;
        default:
          throw Error("Unsupported node type: " + expr.type);
    }
  }

  rootNodeObj.hasChanged = false;
  return rootNodeObj;
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
  }

  removeUnnecessaryParens(rootNodeObj);

  if (!canBeSimplifiedFurther(rootNode)) {
    rootNodeObj.expr = rootNode;
    rootNodeObj.hasChanged = false;
    return rootNodeObj;
  }

  flattenOps(rootNode);

  // If we can simplify the whole tree into a constant, don't continue to DFS
  if (canResolveMath(rootNode)) {
    rootNodeObj.expr = math.parse(manualEval(rootNode));
    rootNodeObj.hasChanged = true;
    return rootNodeObj;
  }

  // First, try simplifying
  let ret = simplifyStepDFS(rootNodeObj);
  if (ret.hasChanged) {
    return ret;
  }

  return rootNodeObj;
}


function simplify(expr) {
  let ret = new RootNode(expr);;
  do {
    ret = step(ret);
  } while (ret.hasChanged);
  return ret.expr;
}

module.exports = {
  RootNode: RootNode,
  flattenOps: flattenOps,
  step: step,
  simplify: simplify,
}
