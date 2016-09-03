"use strict"

const math = require('../../../index');
const PolynomialTerm = require('./PolynomialTerm');

function getTermsForCollecting(node) {
  const op = node.op;
  let terms = {};

  for(let i=0; i < node.args.length; i++) {
    let child = node.args[i];

    if (PolynomialTerm.isPolynomialTerm(child)) {
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

module.exports = {
	collectLikeTermsDFS,
	canCollectLikeTerms,
}
