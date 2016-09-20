const math = require('../../../index');

const MathChangeTypes = require('./MathChangeTypes');
const NodeCreator = require('./NodeCreator');
const NodeStatus = require('./NodeStatus');

// Searches for an simplifies any chains of division into a single division
// operation. e.g. 2/x/6 -> 2/(x*6)
// Returns a NodeStatus object
function simplifyDivisionDFS(node) {
  switch (node.type) {
    case 'ConstantNode': // This is the base case
    case 'SymbolNode':
      break;
    case 'OperatorNode':
      // check for a chain of division
      if (node.op === "/" && node.args[0].op === "/") {
        let denominatorList = getDenominatorList(node);
        const numerator = denominatorList.shift();
        // the new single denominator is all the chained denominators
        // multiplied together, in parentheses.
        const denominator = NodeCreator.parenthesis(
          NodeCreator.operator('*', denominatorList));
        const newNode = NodeCreator.operator('/', [numerator, denominator]);
        return new NodeStatus(
          newNode, true, MathChangeTypes.SIMPLIFY_DIVISION);
      }
      else {
        for (let i = 0; i < node.args.length; i++) {
          const child = node.args[i];
          let childNodeStatus = simplifyDivisionDFS(child);
          if (childNodeStatus.hasChanged) {
            node.args[i] = childNodeStatus.node;
            return new NodeStatus(node, true, childNodeStatus.changeType);
          }
        }
      }
      break;
    case 'ParenthesisNode':
      let contentNodeStatus = simplifyDivisionDFS(node.content);
      if (contentNodeStatus.hasChanged) {
        node.content = contentNodeStatus.node;
        return new NodeStatus(node, true, contentNodeStatus.changeType);
      }
      break;
    default:
      throw Error("Unsupported node type for : " + node);
  }
  return new NodeStatus(node);
}

// Given a the denominator of a division node, returns all the nested
// denominator nodess. e.g. 2/3/4/5 would return [2,3,4,5]
// (note: all the numbers in the example are actually constant nodes)
function getDenominatorList(denominator) {
  let node = denominator;
  let denominatorList = []
  while (node.op === '/') {
    // unshift the denominator to the front of the list, and recurse on
    // the numerator
    denominatorList.unshift(node.args[1]);
    node = node.args[0];
  }
  // unshift the final node, which wasn't a / node
  denominatorList.unshift(node);
  return denominatorList;
}

module.exports = simplifyDivisionDFS;
