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

  replaceNode(newNode) {
    if (this.inParenNode) {
      this.parent.content = newNode;
    } else {
      this.parent.args[this.index] = newNode;
    }
  }
}

// This is always the top level node of the overall expression the student is
// solving. As we move step by step, the expr is updated.
class RootNode {
  constructor(expr) {
    this.expr = expr;
    this.hasChanged = false;
  }
}

// Returns an array of NodeContext objects, one for each child of `node`.
function getNodeChildrenWithContext(node) {
  // Operation node (and later, function nodes)
  if(node.args) {
    return node.args.map((expr, i) => new NodeContext(expr, node, i, false));
  }
  // Paren nodes
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
      getNodeChildrenWithContext(node).forEach(
        child => removeUnnecessaryParens(child));
      break;
    // parenthesis are uncessary when the content is a constant or also
    // a parenthesis node
    case 'ParenthesisNode':
      switch (node.content.type) {
        // If there is an operation within the parens, then the parens are
        // likely needed. So, recurse.
        case 'OperatorNode':
          removeUnnecessaryParens(getNodeChildrenWithContext(node)[0]);
          // exponent nodes don't need parens around them
          if (node.content.op === "^") {
            nodeContext.replaceNode(node.content);
          }
          break;
        // If the content is also parens, we have doubly nested parens. First
        // recurse on the child node, then set the current node equal to its child
        // to get rid of the extra parens.
        case 'ParenthesisNode':
          removeUnnecessaryParens(getNodeChildrenWithContext(node)[0]);
          nodeContext.replaceNode(node.content);
          break;
        // If the content is just one symbol or constant, the parens are not
        // needed.
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

// Returns if the node represents an expression that can be considered a
// term. e.g. x^2, 2y, z are all terms. 2+x, 3*7, x-z are all not terms.
function isPolynomialTerm(node) {
  switch (node.type) {
    case 'OperatorNode':
      if (node.op === "^") {
        return (node.args[0].type === 'SymbolNode' &&
                node.args[1].type === 'ConstantNode');
      }
      // NOTE: this means that x^2*2 won't be a polynomial term.
      // TODO: make sure the order is rearranged in an earlier step first.
      if (node.op === "*") {
        return (node.args[0].type === 'ConstantNode' &&
                isPolynomialTerm(node.args[1]));
      }
      return false;
    case 'ParenthesisNode':
      return false;
    case 'ConstantNode':
      return false;
    case 'SymbolNode':
      return true;
    default:
      throw Error("Unsupported node type: " + node.type);
  }
  return false;
}

// For storing polynomial terms and performing operations on them.
// Has a name, an exponent, and a coefficient.
class PolynomialTerm {
  constructor(node) {
    if (!isPolynomialTerm(node)) {
     throw Error("The node must be a polynomial term (e.g. x^2, 2y, z are all" +
                 "terms. 2+x, 3*7, x-z are all not terms.");
    }
    switch (node.type) {
      case 'OperatorNode':
        if (node.op === "^") {
          this.name = node.args[0].name;
          this.exp = parseInt(node.args[1].value);
          this.coeff = 1;
        } else { // it's "*" ie it has a coefficient
          this.coeff = node.args[0];
          if (node.args[1].type === 'SymbolNode') {
              this.name = node.args[1].name;
              this.exp = 1;
          } else { // it's a "^" node
            this.name = node.args[1].args[0].name;
            this.exp = parseInt(node.args[1].args[1].value);
          }
        }
        break;
      case 'SymbolNode':
        this.name = node.name;
        this.exp = 1;
        this.coeff = 1;
        break;
      default:
        throw Error("Unsupported node type: " + node.type);
    }
  }
}

// Mutates node, and returns if it did find like terms to collect
function collectLikeTerms(node) {
  // we can collect like terms through + or through *
  // TODO: allow - as well as +
  // ---> maybe by secretly making them all unary minus..? we'd have to
  // differentiate from any unary minuses that are actually in the expression
  const op = node.op;
  if (op !== "+" && op !== "-") {
    return false;
  }

  let terms = {};
  for(let i=0; i < node.args.length; i++) {
    let child = node.args[i];

    if (isPolynomialTerm(child)) {
      const termName = (new PolynomialTerm(child).name +
                        new PolynomialTerm(child).exp.toString());
      if (terms[termName]) {
        terms[termName].push(child);
      } else terms[termName] = [child];
      continue;
    }

    switch(child.type) {
      case 'ConstantNode':
        if (terms['const']) {
          terms['const'].push(child);
        } else terms['const'] = [child];
        break;
      case 'OperatorNode':
      case 'ParenthesisNode':
        if (terms['other']) {
          terms['other'].push(child);
        } else terms['other'] = [child];
        break;
      default:
        // Note that we shouldn't get any symbol nodes in the switch statement
        // since they would have been handled by isPolynomialTerm
        throw Error("Unsupported node type: " + child.type);
    }
  }

  // Conditions we need to meet to decide to to reorganize (collect) the terms:
  // - more than 1 term type (not including other)
  // - more than 1 of at least one type (not including other)
  // (note that this means x^2 + x + x + 2 -> x^2 + (x + x) + 2)
  const termTypes = Object.keys(terms).filter(x => x !== 'other');
  if (termTypes.length === 1 || termTypes.every(x => terms[x].length === 1)) {
    return false;
  }

  // List the symbols alphabetically
  // TODO: when add exponents, go by increasing exponent per symbol too
  let termTypesSorted = Object.keys(terms).filter(
    x => (x !== 'const' && x !== 'other')).sort();
  // Then add const at the end
  if (terms['const']) {
    termTypesSorted.push('const');
  }

  let newArgs = [];
  termTypesSorted.forEach(s => {
    if (terms[s].length === 1) {
      newArgs.push(terms[s][0]);
    } else {
      newArgs.push(new math.expression.node.ParenthesisNode(
        new math.expression.node.OperatorNode(op, node.fn, terms[s])));
    }
  });

  // then stick anything else (paren nodes, operator nodes) at the end
  if (terms['other']) {
    newArgs = newArgs.concat(terms['other']);
  }

  node.args = newArgs;

  return true;
}

// Iterates through the tree looking for like terms to collect. Will prioritize
// deeper expressions. Returns a RootNode object.
function collectLikeTermsDFS(rootNodeObj, node) {
  switch (node.type) {
      case 'OperatorNode':
        // Try reducing any of the sub-expressions
        for(let i=0; i < node.args.length; i++) {
          let ret = collectLikeTermsDFS(rootNodeObj, node.args[i]);
          if (ret.hasChanged) {
            return ret;
          }
        }

        // If they're all fully reduced, maybe this node can be simplified
        rootNodeObj.hasChanged = collectLikeTerms(node);
        return rootNodeObj;
      case 'ParenthesisNode':
        return collectLikeTermsDFS(rootNodeObj, node.content);
      case 'SymbolNode':
      case 'ConstantNode':
        // we can't simplify this any further
        break;
      default:
        throw Error("Unsupported node type: " + node.type);
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

  // Then see if any like terms can be collected at the top level
  ret = collectLikeTermsDFS(rootNodeObj, rootNode);
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


// TODO: can we test these without having them exported to everyone?
module.exports = {
  RootNode: RootNode,
  flattenOps: flattenOps,
  step: step,
  simplify: simplify,
  isPolynomialTerm: isPolynomialTerm,
}
