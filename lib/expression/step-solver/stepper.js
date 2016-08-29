"use strict"

const math = require('../../../index');

// To store expressions in a tuple with its parent and index so expressions
// can be simplified and replaced easily in the tree.
class NodeContext {
  constructor(exp, parent, index, isContent) {
    this.exp = exp;
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
  constructor(exp) {
    this.exp = exp;
    this.hasChanged = false;
  }
}

// Returns an array of NodeContext objects, one for each child of `node`.
function getNodeChildrenWithContext(node) {
  if(node.args) {
    return node.args.map((exp, i) => new NodeContext(exp, node, i, false));
  }

  if(node.content) {
    return [new NodeContext(node.content, node, 0, true)];
  }

  throw Error("Unsupported node type: " + node.type);
}

// This function assumes that rootNode isn't a ParenthesisNode.
// A node can be simplified further only if it has children.
function canBeSimplifiedFurther(rootNode) {
  // TODO add function nodes
  return (rootNode.args && rootNode.type === "OperatorNode");
}

// If the node is a constant or is an operation on two constants.
// e.g. 2+4, (8-3), sqrt(x) would all return true
// e.g. 3x + 4, 2+4+2, 3*(4+3) would all return false
// TODO add support for function nodes like sqrt(x)
function canResolveMath(exp) {
  switch (exp.type) {
    case 'OperatorNode':
      return exp.args.every((child) => child.type === 'ConstantNode');
    case 'ParenthesisNode':
      return canResolveMath(exp.content);
    case 'ConstantNode':
      return true;
  }
  return false;
}

// Always returns the updated expression tree, which might be the same if no
// steps were possible. The tree that was passed in will almost always be 
// also manipualated 

// TODO: deep copy? if we don't return the tree, there's no way to change the
// root, and if we don't deep copy, there's no way to know if it's changed.
// Temporary fix is to return an array [tree, has_changed] (maybe make this)
// an object?
function step(rootNodeObj) {

  let rootNode = rootNodeObj.exp;
  rootNodeObj.hasChanged = false;

  // Parens that wrap everything are redundant
  while (rootNode.type === 'ParenthesisNode') {
    rootNode = rootNode.content;
    rootNodeObj.hasChanged = true;
  }

  if (!canBeSimplifiedFurther(rootNode)) {
    rootNodeObj.exp = rootNode;
    rootNodeObj.hasChanged = false;
    return rootNodeObj;
  }

  // If we can simplify the whole tree into a constant, don't continue to DFS
  if (canResolveMath(rootNode)) {
    rootNodeObj.exp = math.parse(rootNode.eval());
    rootNodeObj.hasChanged = true;
    return rootNodeObj;
  }

  // An array of expressions to check for reduction, starting with the root.
  let expressions = getNodeChildrenWithContext(rootNode);

  // Run DFS with iteration, so the search stops once something is reduced
  // TODO: can add flags to focus only on certain things, like simplifying
  // math before symbols, for example.
  while (expressions.length !== 0) {
    let current = expressions.shift();
    
    let exp = current.exp;
    switch (exp.type) {
        case 'OperatorNode':
        case 'ParenthesisNode':
          // if we can perform an operation on two constants, that's a step
          if (canResolveMath(exp)) {
            current.replaceNode(math.parse(exp.eval()));
            rootNodeObj.exp = rootNode;
            rootNodeObj.hasChanged = true;
            return rootNodeObj;
          }
          expressions = expressions.concat(getNodeChildrenWithContext(current.exp));
          break;
        case 'SymbolNode':
          // TODO
          continue;
        case 'ConstantNode':
          // we can't simplify this, but we do support constants
          continue;
        default:
          throw Error("Unsupported node type: " + exp.type);
    }
  }

  return rootNodeObj;
}


function simplify(exp) {
  let ret = new RootNode(exp);;
  do {
    ret = step(ret);
  } while (ret.hasChanged); // until it doesn't change anymore
  return ret.exp;
}

module.exports = {
  RootNode: RootNode,
  step: step,
  simplify: simplify,
}
