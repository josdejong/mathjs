var math = require('../../../index');

// To store expressions in a tuple with its parent and index so expression
// can be simplified and replaced later.
function storeNodeChildren(node) {
  if(node.args) {
    return node.args.map((exp, i) => {
      return {
        exp: exp,
        parent: node, 
        index: i,
        content: false,
      };
    });
  } else if(node.content) {
    return [{
      exp: node.content,
      parent: node,
      index: 0,
      content: true,
    }];
  }
  throw Error("Unsupported node type: " + node.type);
}

function replaceNode(nodeObj, newNode) {
  if (nodeObj.content) {
    nodeObj.parent.content = newNode;
  } else {
    nodeObj.parent.args[nodeObj.index] = newNode;
  }
}


// Always returns the updated expression tree, which might be the same if no
// steps were possible. The tree that was passed in will almost always be 
// also manipualated 

// TODO: deep copy? if we don't return the tree, there's no way to change the
// root, and if we don't deep copy, there's no way to know if it's changed.
// Temporary fix is to return an array [tree, has_changed] (maybe make this)
// an object?
function step(rootNode) {

  // Parens that wrap everything are redundant
  while (rootNode.type === 'ParenthesisNode') {
    rootNode = rootNode.content;
  }

  // Single nodes can't be simplified any further (e.g. constant, symbol)
  if (!rootNode.args) {
    return [rootNode, false];
  }

  // TODO add function nodes
  if (rootNode.type !== "OperatorNode") {
    return [rootNode, false];
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

  // If we can simplify the whole tree into a constant, don't continue to DFS
  if (canResolveMath(rootNode)) {
    return [math.parse(rootNode.eval()), true];
  }


  // An array of expressions to check for reduction, starting with the root.
  var expressions = storeNodeChildren(rootNode);

  // Run DFS with iteration, so the search stops once something is reduced
  // TODO: can add flags to focus only on certain things, like simplifying
  // math before symbols, for example.
  while (expressions.length !== 0) {
    var current = expressions.shift();
    
    var exp = current.exp;
    switch (exp.type) {
        case 'OperatorNode':
        case 'ParenthesisNode':
          // if we can perform an operation on two constants, that's a step
          if (canResolveMath(exp)) {
            replaceNode(current, math.parse(exp.eval()));
            return [rootNode, true];
          }
          expressions = expressions.concat(storeNodeChildren(current.exp));
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

  return [rootNode, false];
}


function simplify(exp) {
  ret = [exp, true];
  do {
    ret = step(ret[0]);
  } while (ret[1]); // until it doesn't change anymore
  return ret[0];
}

module.exports = {
  step: step,
  simplify: simplify,
}