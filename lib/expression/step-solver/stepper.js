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
          nodeContext.replaceNode(node.content);
          break;
        default:
          throw Error("Unsupported node type: " + node.type);
      }
      break;
    case 'ConstantNode':
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

// Always returns the updated expression tree, which might be the same if no
// steps were possible. The tree that was passed in will almost always be 
// also manipualated 

// TODO: deep copy? if we don't return the tree, there's no way to change the
// root, and if we don't deep copy, there's no way to know if it's changed.
// Temporary fix is to return an array [tree, has_changed] (maybe make this)
// an object?
function step(rootNodeObj) {

  let rootNode = rootNodeObj.expr;
  rootNodeObj.hasChanged = false;

  // Parens that wrap everything are redundant
  while (rootNode.type === 'ParenthesisNode') {
    rootNode = rootNode.content;
    rootNodeObj.expr = rootNode;
    rootNodeObj.hasChanged = true;
  }

  if (!canBeSimplifiedFurther(rootNode)) {
    rootNodeObj.expr = rootNode;
    rootNodeObj.hasChanged = false;
    return rootNodeObj;
  }

  // If we can simplify the whole tree into a constant, don't continue to DFS
  if (canResolveMath(rootNode)) {
    rootNodeObj.expr = math.parse(rootNode.eval());
    rootNodeObj.hasChanged = true;
    return rootNodeObj;
  }

  removeUnnecessaryParens(rootNodeObj);

  // An array of expressions to check for reduction, starting with the root.
  let expressions = getNodeChildrenWithContext(rootNode);

  // Run DFS with iteration, so the search stops once something is reduced
  // TODO: can add flags to focus only on certain things, like simplifying
  // math before symbols, for example.
  while (expressions.length !== 0) {
    let current = expressions.shift();
    
    let expr = current.expr;
    switch (expr.type) {
        case 'OperatorNode':
        case 'ParenthesisNode':
          // if we can perform an operation on two constants, that's a step
          if (canResolveMath(expr)) {
            current.replaceNode(math.parse(expr.eval()));
            rootNodeObj.expr = rootNode;
            rootNodeObj.hasChanged = true;
            return rootNodeObj;
          }
          expressions = expressions.concat(getNodeChildrenWithContext(current.expr));
          break;
        case 'SymbolNode':
          // TODO
          continue;
        case 'ConstantNode':
          // we can't simplify this, but we do support constants
          continue;
        default:
          throw Error("Unsupported node type: " + expr.type);
    }
  }

  return rootNodeObj;
}


function simplify(expr) {
  let ret = new RootNode(expr);;
  do {
    ret = step(ret);
  } while (ret.hasChanged); // until it doesn't change anymore
  return ret.expr;
}

module.exports = {
  RootNode: RootNode,
  flattenOps: flattenOps,
  step: step,
  simplify: simplify,
}
