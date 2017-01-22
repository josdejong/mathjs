'use strict';

var digits = require('./../../../utils/number').digits;
// TODO this could be improved by simplifying seperated constants under associative and commutative operators
function factory(type, config, load, typed, math) {
  var util = load(require('./util'));
  var isCommutative = util.isCommutative;
  var isAssociative = util.isAssociative;
  var allChildren = util.allChildren;
  var createMakeNodeFunction = util.createMakeNodeFunction;
  var ConstantNode = math.expression.node.ConstantNode;
  var OperatorNode = math.expression.node.OperatorNode;

  function simplifyConstant(expr) {
    var res = foldFraction(expr);
    return res.isNode ? res : _toNode(res);
  }

  function _eval(fnname, args) {
    try {
      return _toNumber(math[fnname].apply(null, args));
    }
    catch (ignore) {
    // sometimes the implicit type conversion causes the evaluation to fail, so we'll try again using just numbers
      args = args.map(function(x){ return x.valueOf(); });
      return _toNumber(math[fnname].apply(null, args));
    }
  }

  var _toNode = typed({
    'Fraction': _fractionToNode,
    'number': _numberToNode,
    'BigNumber': function(s) {
      return _numberToNode(s._toNumber());
    },
    'Complex': function(s) {
      throw 'Cannot convert Complex number to Node';
    }
  });

  var _toNumber = typed({
    'Fraction': function(s) { return s; },
    'BigNumber': function(s) {
      if (s.decimalPlaces() <= 15) {
        return math.fraction(s.toNumber())
      }
      return s.toNumber();
    },
    'number': function(s) {
      if (digits(s) <= 15) {
        return math.fraction(s);
      }
      return s;
    },
    'Complex': function(s) {
      if (s.im !== 0) {
        return s;
      }
      if (digits(s.re) <= 15) {
        return math.fraction(s.re);
      }
      return s.re;
    },
  });

  function _numberToNode(n) {
    if (n < 0) {
      return new OperatorNode('-', 'unaryMinus', [new ConstantNode(-n)])
    }
    return new ConstantNode(n);
  }
  function _fractionToNode(f) {
    var n;
    var vn = f.s*f.n;
    if (vn < 0) {
      n = new OperatorNode('-', 'unaryMinus', [new ConstantNode(-vn)])
    }
    else {
      n = new ConstantNode(vn);
    }

    if (f.d === 1) {
      return n;
    }
    return new OperatorNode('/', 'divide', [n, new ConstantNode(f.d)]);
  }

  /*
   * Create a binary tree from a list of Fractions and Nodes.
   * Tries to fold Fractions by evaluating them until the first Node in the list is hit, so
   * `args` should be sorted to have the Fractions at the start (if the operator is commutative).
   * @param args - list of Fractions and Nodes
   * @param fn - evaluator for the binary operation evaluator that accepts two Fractions
   * @param makeNode - creates a binary OperatorNode/FunctionNode from a list of child Nodes
   * if args.length is 1, returns args[0]
   * @return - Either a Node representing a binary expression or Fraction
   */
  function foldOp(fn, args, makeNode) {
    return args.reduce(function(a, b) {
      if (!a.isNode && !b.isNode) {
        try {
          return _eval(fn, [a,b]);
        }
        catch (ignoreandcontinue) {}
        a = _toNode(a);
        b = _toNode(b);
      }
      else if (!a.isNode) {
        a = _toNode(a);
      }
      else if (!b.isNode) {
        b = _toNode(b);
      }

      return makeNode([a, b]);
    });
  }

  // destroys the original node and returns a folded one
  function foldFraction(node) {
    switch(node.type) {
      case 'SymbolNode':
        return node;
      case 'ConstantNode':
        return _toNumber(node.value);
      case 'FunctionNode':
        if (math[node.name] && math[node.name].rawArgs) {
          return node;
        }
        /* falls through */
      case 'OperatorNode':
        var fn = node.fn.toString();
        var args;
        var res;
        var makeNode = createMakeNodeFunction(node);
        if (node.args.length === 1) {
          args = [foldFraction(node.args[0])];
          if (!args[0].isNode) {
            res = _eval(fn, args);
          }
          else {
            res = makeNode(args);
          }
        }
        else if (isAssociative(node)) {
          args = allChildren(node);
          args = args.map(foldFraction);

          if (isCommutative(fn)) {
            // commutative binary operator
            var consts = [], vars = [];

            for (var i=0; i < args.length; i++) {
              if (!args[i].isNode) {
                consts.push(args[i]);
              }
              else {
                vars.push(args[i]);
              }
            }

            if (consts.length > 1) {
              res = foldOp(fn, consts, makeNode);
              vars.unshift(res);
              res = foldOp(fn, vars, makeNode);
            }
            else {
              // we won't change the children order since it's not neccessary
              res = foldOp(fn, args, makeNode);
            }
          }
          else {
            // non-commutative binary operator
            res = foldOp(fn, args, makeNode);
          }
        }
        else {
          // non-associative binary operator
          args = node.args.map(foldFraction);
          res = foldOp(fn, args, makeNode);
        }
        return res;
      case 'ParenthesisNode':
        // remove the uneccessary parenthesis
        return foldFraction(node.content);
      case 'AccessorNode':
        /* falls through */
      case 'ArrayNode':
        /* falls through */
      case 'AssignmentNode':
        /* falls through */
      case 'BlockNode':
        /* falls through */
      case 'FunctionAssignmentNode':
        /* falls through */
      case 'IndexNode':
        /* falls through */
      case 'ObjectNode':
        /* falls through */
      case 'RangeNode':
        /* falls through */
      case 'UpdateNode':
        /* falls through */
      case 'ConditionalNode':
        /* falls through */
      default:
        throw 'Unimplemented node type in simplifyConstant: '+node.type;
    }
  }

  return simplifyConstant;
}

exports.math = true;
exports.name = 'simplifyConstant';
exports.path = 'algebra.simplify';
exports.factory = factory;
