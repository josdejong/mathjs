"use strict"

const math = require('../../../index');

// To store expressions in a tuple with its parent and index so expressions
// can be simplified and replaced easily in the tree.
class NodeContext {
  constructor(expr, parent, index, inParenNode) {
    this.expr = expr;
    this.parent = parent;
    this.index = index;
    this.inParenNode = inParenNode;
  }

  // Replaces the current node using the context of its parent, or using the
  // root node obj for replacement if it is the root node.
  replaceNode(newNode, rootNodeObj=null) {
    if (this.parent) {
      if (this.inParenNode) {
        this.parent.content = newNode;
      } else {
        this.parent.args[this.index] = newNode;
      }      
    } else { // it's the root node
      if (!rootNodeObj) {
        throw Error("Can't replace the rootnode without rootNodeObj");
      }
      rootNodeObj.expr = newNode;
    }
  }

  // Returns an array of NodeContext objects, one for each child.
  getContextsForChildren() {
    // Operation node (and later, function nodes)
    if(this.expr.args) {
      return this.expr.args.map(
        (child, i) => new NodeContext(child, this.expr, i, false));
    }
    // Paren nodes
    else if(this.expr.content) {
      return [new NodeContext(this.expr.content, this.expr, 0, true)];
    }

    else throw Error("Unsupported node type: " + this.expr.type);
  }
}

NodeContext.makeRootNodeContext = function(rootNodeObj) {
  return new NodeContext(rootNodeObj.expr, null, 0, false);
}

module.exports = NodeContext;
