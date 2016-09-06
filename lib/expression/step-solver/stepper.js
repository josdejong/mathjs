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
    this.rule = '';
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
      getNodeChildrenWithContext(node).forEach(child => removeUnnecessaryParens(child));
      // Sometimes, parens are around expressions that have been simplified
      // all they can be. If that expression is part of an addition
      // operation, we can remove the parenthesis.
      // e.g. (x+4) + (12+7) -> x+4 + 12+7
      if (node.op === '+') {
        node.args.forEach((child, i) => {
          if (child.type === 'ParenthesisNode' &&
              child.content.type === 'OperatorNode' &&
              !canCollectLikeTerms(child.content) &&
              !canResolveMath(child.content) &&
              !canAddPolynomialNodes(child.content.args) &&
              !canMultiplyLikeTermPolynomialNodes(child.content.args)) {
            // get rid of the parens
            node.args[i] = child.content;
          }
        });
      }
      break;
    // Parenthesis are uncessary when the content is a constant or also
    // a parenthesis node. Note that this means that the type of the content
    // of a ParenthesisNode should now always be an OperatorNode. If that
    // changes, things might break!
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
        const newArgs = expandOp(node.op, node);
        if (newArgs.length === 1) {
          node = newArgs[0];
        } else {
          // When collecting multiplication terms, individual args might be
          // implicit, but the top level multiplication of them should never be
          // left implicit.
          if (node.op === "*") {
            node.implicit = false;
          }
          node.args = newArgs;
          node.args.forEach((child, i) => {
            node.args[i] = flattenOps(child);
          });
        }
      }
      break;
    case 'ParenthesisNode':
      node.content = flattenOps(node.content);
      break;
    default:
      throw Error("Unsupported node type: " + node.type);
  }

  return node;
}

// Return true iff node is maybe a candidate for simplifying to a polynomial
// term. This function is a helper function for expandOp.
// Context: Usually we'd flatten 2*2*x to a multiplication node with 3 children
// (2, 2, and x) but if we got 2*2x, we want to keep 2x together.
// (2*y*2)*x in the flattening process should be turned into (2*y*2x) instead of
// (2*y*2*x). So this function would return true for the input (2*y*2)*x.
function isPolynomialTermMultiplication(node) {
  // This concept only applies when we're flattening multiplication operations
  if (node.op !== "*") {
    return false;
  }
  // We can tell that input was entered without a multiplication * with the
  // implicit parameter. 2x is implicit, 2*x is not. We will only make a
  // polynomial term if the multiplication is implicit.
  if (!node.implicit) {
    return false;
  }
  // This only makes sense when we're flattening two arguments
  if (node.args.length !== 2) {
    return false;
  }
  // The second node should be for the form x or x^2 (ie a polynomial term
  // with no coefficient)
  let second = node.args[1];
  if (second.type === 'SymbolNode') {
    return true;
  }
  if (second.type === 'OperatorNode') {
    return second.op === "^" && canResolveMath(second.args[1]);
  }
  return false;
}

function expandOp(op, node) {
  if (node.type === 'OperatorNode' && node.op === op) {
    // If we're flattening over *, check for a polynomial term (ie a
    // coefficient multiplied by a symbol such as 2x^2 or 3y)
    if (isPolynomialTermMultiplication(node)) {
      let nodesUnderOp = expandOp(op, node.args[0]);
      // If the last node under * was a constant, then it's a polynomial term
      // e.g. 2*5*6x will have 2*5*6 on the left side with a constant (6) last
      const last = nodesUnderOp.pop();
      if (last.type === 'ConstantNode') {
        // we replace the constant (which we popped) with constant*symbol
        nodesUnderOp.push(new math.expression.node.OperatorNode(
          '*', 'multiply', [last, node.args[1]], /*mark as implicit*/true));
        return nodesUnderOp;
      } else {  // Now we know it isn't a polynomial term
        nodesUnderOp.push(last);
        nodesUnderOp.push(node.args[1]);
        return nodesUnderOp;
      }
    }

    let nodesUnderOp = [];
    node.args.forEach((child) => {
      // This will make an array of arrays
      nodesUnderOp.push(expandOp(op, child));
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

// Multiplies a constant node by a polynomial node and returns the result.
function multiplyConstByPolynomialTerm(constNode, polyNode) {
  if (!isPolynomialTerm(polyNode) || constNode.type !== 'ConstantNode') {
    throw Error('bad arguments');
  }
  // check if it already has a coefficient
  if (polyNode.type === 'OperatorNode' && polyNode.op === '*') {
    const newCoeff = new math.expression.node.ConstantNode(
      parseInt(polyNode.args[0].value) * parseInt(constNode.value));
    return new math.expression.node.OperatorNode("*", "multiply", [
          newCoeff, polyNode.args[1]], true /* implicit */);
  } else {
    return new math.expression.node.OperatorNode("*", "multiply", [
      constNode, polyNode], true /* implicit */);
  }
}

// Replaces the current node using it's context, or using the root node obj
// if it is the root node.
function replaceNode(current, rootNodeObj, newVal) {
  if (current.parent) {
    current.replaceNode(newVal);
  } else { // it's the root node
    rootNodeObj.expr = newVal;
  }
}

// If we can do a simplify step (e.g. adding two terms, performing some
// arithmetic). Always returns the updated expression tree and if it was
// updated.
function simplifyStepDFS(rootNodeObj) {
  // An array of expressions to check for reduction, starting with the root.
  let expressions = [new NodeContext(rootNodeObj.expr, null, 0, false)];

  // Run DFS with iteration, so the search stops once something is reduced.
  while (expressions.length !== 0) {
    let current = expressions.shift();
    let expr = current.expr;
    switch (expr.type) {
        case 'ParenthesisNode':
          // This has to be have content that is an OperatorNode (because of
          // removeUncessaryParens)
          expr = expr.content;
          // so we move into the OperatorNode case...
        case 'OperatorNode':
          if (canResolveMath(expr)) {
            replaceNode(current, rootNodeObj, math.parse(manualEval(expr)));
            rootNodeObj.hasChanged = true;
            rootNodeObj.rule = "simplified arithmetic operation"
            return rootNodeObj;
          }
          // We might be able to combine polynomial terms.
          if (expr.op === "+" && canAddPolynomialNodes(expr.args)) {
            replaceNode(current, rootNodeObj, addPolynomialNodes(expr.args));
            rootNodeObj.hasChanged = true;
            rootNodeObj.rule = "added polynomial terms";
            return rootNodeObj;
          }
          if (expr.op === "*" && canMultiplyLikeTermPolynomialNodes(expr.args)) {
            replaceNode(current, rootNodeObj, multiplyLikePolynomialNodes(expr.args));
            rootNodeObj.hasChanged = true;
            rootNodeObj.rule = "multiplied polynomial terms";
            return rootNodeObj;
          }
          // If we have a constant times a polynomial term we can multiply them
          // together e.g. 4y * 3 -> 12y
          if (expr.op === '*' && !expr.implicit && expr.args.length === 2) {
            if (isPolynomialTerm(expr.args[0]) &&
                expr.args[1].type === 'ConstantNode') {
              replaceNode(current, rootNodeObj,
                multiplyConstByPolynomialTerm(expr.args[1], expr.args[0]));
              rootNodeObj.hasChanged = true;
              rootNodeObj.rule = "multiplied polynomial term by constant";
              return rootNodeObj;
            } else if (isPolynomialTerm(expr.args[1]) &&
                expr.args[0].type === 'ConstantNode') {
              replaceNode(current, rootNodeObj,
                multiplyConstByPolynomialTerm(expr.args[0], expr.args[1]));
              rootNodeObj.hasChanged = true;
              rootNodeObj.rule = "multiplied polynomial term by constant";
              return rootNodeObj;
            }
          }
          // Check for x^1 which should be reduced to x
          if (expr.op === "^" &&
              expr.args[0].type === 'SymbolNode' &&
              expr.args[1].type === 'ConstantNode' &&
              expr.args[1].value === "1") {
            replaceNode(current, rootNodeObj, expr.args[0]);
            rootNodeObj.hasChanged = true;
            rootNodeObj.rule = expr.args[0].name + "^1 -> " + expr.args[0].name;
            return rootNodeObj;
          }
          // since this is a DFS, children are put at the front of the queue
          const children = getNodeChildrenWithContext(current.expr);
          expressions = children.concat(expressions);
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
// If allowCoeff is false, 2y or 2z^2 would now return false
function isPolynomialTerm(node, allowCoeff = true) {
  switch (node.type) {
    case 'OperatorNode':
      if (node.op === "^") {
        return (node.args[0].type === 'SymbolNode' &&
                node.args[1].type === 'ConstantNode');
      }
      // NOTE: this means that x^2*2 won't be a polynomial term.
      // TODO: make sure the order is rearranged in an earlier step first.
      if (node.op === "*") {
        return (allowCoeff &&
                node.args[0].type === 'ConstantNode' &&
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
// Has a name, an exponent, and a coefficient. Note that this doesn't include
// constants.
class PolynomialTerm {
  constructor(node) {
    if (!isPolynomialTerm(node)) {
     throw Error("PolynomialTerm constructor called with a node that is not" +
                 " a polynomial term.");
    }
    switch (node.type) {
      case 'OperatorNode':
        if (node.op === "^") {
          this.name = node.args[0].name;
          this.exp = parseInt(node.args[1].value);
          this.coeff = 1;
        } else { // it's "*" ie it has a coefficient
          this.coeff = parseInt(node.args[0].value);
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

// Returns true if the nodes are polynomial terms that can be added together
function canAddPolynomialNodes(nodes) {
  if (!nodes.every(n => isPolynomialTerm(n))) {
    return false;
  }

  if (nodes.length === 1) {
    return false;
  }
  const first = new PolynomialTerm(nodes[0]);
  const rest = nodes.slice(1).map(n => new PolynomialTerm(n));
  return rest.every(n => first.name === n.name && first.exp === n.exp);
}

// Adds a list of nodes that are polynomial terms. Returns a node.
function addPolynomialNodes(nodes) {
  if (!canAddPolynomialNodes(nodes)) {
    throw Error("Can't add two polynomial terms of different types");
  }

  const newCoefficient = nodes.map(n => {
    let p = new PolynomialTerm(n);
    return p.coeff;
  }).reduce((a,b) => a+b, 0);

  // use this to get the exponent and name they all share
  let first = new PolynomialTerm(nodes[0]);

  // no exponent
  if (first.exp === 1) {
    return new math.expression.node.OperatorNode("*", "multiply", [
      math.parse(newCoefficient), math.parse(first.name)
    ], true /* implicit, since it's a term */);
  }
  return new math.expression.node.OperatorNode("*", "multiply", [
    math.parse(newCoefficient), math.parse(
      first.name + "^" + first.exp.toString())
  ], true /* implicit, since it's a term */);
}

// Returns true if the nodes are like terms and can be multiplied together.
function canMultiplyLikeTermPolynomialNodes(nodes) {
  if (!nodes.every(n => isPolynomialTerm(n))) {
    return false;
  }

  if (nodes.length === 1) {
    return false;
  }
  const first = new PolynomialTerm(nodes[0]);
  const rest = nodes.slice(1).map(n => new PolynomialTerm(n));
  return rest.every(n => first.name === n.name);
}

// multiplies a list of nodes that are polynomial like terms. Returns a node.
function multiplyLikePolynomialNodes(nodes) {
  if (!canMultiplyLikeTermPolynomialNodes(nodes)) {
    throw Error("Can't multiply like terms - terms are not alike");
  }

  const newCoefficient = nodes.map(n => {
    let p = new PolynomialTerm(n);
    return p.coeff;
  }).reduce((a,b) => a*b, 1);

  // use this to get the name they all share
  let first = new PolynomialTerm(nodes[0]);

  const newExponent = new math.expression.node.ParenthesisNode(
    new math.expression.node.OperatorNode(
      "+", "add", nodes.map(n => { // map exponents to constant nodes
        let p = new PolynomialTerm(n);
        return math.parse(p.exp);
      }
    )
  ));

  if (newCoefficient === 1) {
    return new math.expression.node.OperatorNode(
      "^", "pow", [math.parse(first.name), newExponent]);
  }
  return new math.expression.node.OperatorNode("*", "multiply", [
      math.parse(newCoefficient),
      new math.expression.node.OperatorNode(
        "^", "pow", [math.parse(first.name), newExponent]
    )], true /*implicit*/);
}

function getTermsForCollecting(node) {
  const op = node.op;
  let terms = {};

  for(let i=0; i < node.args.length; i++) {
    let child = node.args[i];

    if (isPolynomialTerm(child)) {
      let termName = new PolynomialTerm(child).name;
      if (op === "+") {
        termName += "^" + new PolynomialTerm(child).exp.toString();
      }
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
  return terms;
}

function canCollectLikeTerms(node) {
  // we can collect like terms through + or through *
  // TODO: allow - as well as +
  if (node.type !== 'OperatorNode' || (node.op !== "+" && node.op !== "*")) {
    return false;
  }

  const terms = getTermsForCollecting(node);

  // Conditions we need to meet to decide to to reorganize (collect) the terms:
  // - more than 1 term type (not including other)
  // - more than 1 of at least one type (not including other)
  // (note that this means x^2 + x + x + 2 -> x^2 + (x + x) + 2)
  const termTypes = Object.keys(terms).filter(x => x !== 'other');
  return (termTypes.length > 1 && termTypes.some(x => terms[x].length > 1));
}

// Mutates node, and returns if it did find like terms to collect
function collectLikeTerms(node) {
  if (!canCollectLikeTerms(node)) {
    throw Error("Cant collect like terms");
  }

  const op = node.op;
  const terms = getTermsForCollecting(node);

  // List the symbols alphabetically
  // TODO: when add exponents, go by increasing exponent per symbol too
  let termTypesSorted = Object.keys(terms).filter(
    x => (x !== 'const' && x !== 'other')).sort((a,b) => {
      if (a === b) {
        return 0;
      }
      if (op === "*") { // exponents weren't appended, so sort alphabetically
        return a < b ? -1 : 1;
      }
      // if op is + we want to sort by symbol, but then exponent decreasing
      else {
        const symbA = a.split('^')[0];
        const expA = a.split('^')[1];
        const symbB = b.split('^')[0];
        const expB = b.split('^')[1];
        if (symbA !== symbB) {
          return symbA < symbB ? -1 : 1;
        } else {
          return expA > expB ? -1 : 1;
        }
      }
    });

  // Then add const
  if (terms['const']) {
    // at the end for addition
    if (op === "+") {
      termTypesSorted.push('const');
    }
    // for multipliation it should be at the front
    if (op === "*") {
      termTypesSorted.unshift('const');
    }
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
        if (canCollectLikeTerms(node)) {
          collectLikeTerms(node);
          rootNodeObj.hasChanged = true;
          rootNodeObj.rule = "collected like terms";
        }
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
    rootNodeObj.rule = "removed uncessary parens around root node";
  }

  const before = rootNodeObj.expr.toString();
  removeUnnecessaryParens(new NodeContext(rootNodeObj.expr, null, 0, false));
  if (rootNodeObj.expr.toString() !== before) {
    rootNodeObj.rule = "removed uncessary parens";
    rootNodeObj.hasChanged = true;
    return rootNodeObj;
  }

  if (!canBeSimplifiedFurther(rootNode)) {
    rootNodeObj.expr = rootNode;
    rootNodeObj.hasChanged = false;
    rootNodeObj.rule = "nochange";
    return rootNodeObj;
  }

  rootNode = flattenOps(rootNode);

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

  rootNodeObj.rule = "nochange";
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
      console.log("\nStep " + iter + ": " + ret.rule);
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


// TODO: can we test these without having them exported to everyone?
module.exports = {
  RootNode: RootNode,
  flattenOps: flattenOps,
  step: step,
  simplify: simplify,
  isPolynomialTerm: isPolynomialTerm,
}



// FOR DEMO

// keep this function though it's pretty sweet
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