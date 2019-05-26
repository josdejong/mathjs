// TODO this could be improved by simplifying seperated constants under associative and commutative operators
import { isFraction, isNode, isOperatorNode } from '../../../utils/is'
import { factory } from '../../../utils/factory'
import { createUtil } from './util'
import { noBignumber, noFraction } from '../../../utils/noop'

const name = 'simplifyConstant'
const dependencies = [
  'typed',
  'config',
  'mathWithTransform',
  '?fraction',
  '?bignumber',
  'ConstantNode',
  'OperatorNode',
  'FunctionNode',
  'SymbolNode'
]

export const createSimplifyConstant = /* #__PURE__ */ factory(name, dependencies, ({
  typed,
  config,
  mathWithTransform,
  fraction,
  bignumber,
  ConstantNode,
  OperatorNode,
  FunctionNode,
  SymbolNode
}) => {
  const { isCommutative, isAssociative, allChildren, createMakeNodeFunction } =
    createUtil({ FunctionNode, OperatorNode, SymbolNode })

  function simplifyConstant (expr, options) {
    const res = foldFraction(expr, options)
    return isNode(res) ? res : _toNode(res)
  }

  function _eval (fnname, args, options) {
    try {
      return _toNumber(mathWithTransform[fnname].apply(null, args), options)
    } catch (ignore) {
      // sometimes the implicit type conversion causes the evaluation to fail, so we'll try again after removing Fractions
      args = args.map(function (x) {
        if (isFraction(x)) {
          return x.valueOf()
        }
        return x
      })
      return _toNumber(mathWithTransform[fnname].apply(null, args), options)
    }
  }

  const _toNode = typed({
    'Fraction': _fractionToNode,
    'number': function (n) {
      if (n < 0) {
        return unaryMinusNode(new ConstantNode(-n))
      }
      return new ConstantNode(n)
    },
    'BigNumber': function (n) {
      if (n < 0) {
        return unaryMinusNode(new ConstantNode(-n))
      }
      return new ConstantNode(n) // old parameters: (n.toString(), 'number')
    },
    'Complex': function (s) {
      throw new Error('Cannot convert Complex number to Node')
    }
  })

  // convert a number to a fraction only if it can be expressed exactly
  function _exactFraction (n, options) {
    const exactFractions = (options && options.exactFractions !== false)
    if (exactFractions && isFinite(n) && fraction) {
      const f = fraction(n)
      if (f.valueOf() === n) {
        return f
      }
    }
    return n
  }

  // Convert numbers to a preferred number type in preference order: Fraction, number, Complex
  // BigNumbers are left alone
  const _toNumber = typed({
    'string, Object': function (s, options) {
      if (config.number === 'BigNumber') {
        if (bignumber === undefined) {
          noBignumber()
        }
        return bignumber(s)
      } else if (config.number === 'Fraction') {
        if (fraction === undefined) {
          noFraction()
        }
        return fraction(s)
      } else {
        const n = parseFloat(s)
        return _exactFraction(n, options)
      }
    },

    'Fraction, Object': function (s, options) { return s }, // we don't need options here

    'BigNumber, Object': function (s, options) { return s }, // we don't need options here

    'number, Object': function (s, options) {
      return _exactFraction(s, options)
    },

    'Complex, Object': function (s, options) {
      if (s.im !== 0) {
        return s
      }
      return _exactFraction(s.re, options)
    }
  })

  function unaryMinusNode (n) {
    return new OperatorNode('-', 'unaryMinus', [n])
  }

  function _fractionToNode (f) {
    let n
    const vn = f.s * f.n
    if (vn < 0) {
      n = new OperatorNode('-', 'unaryMinus', [new ConstantNode(-vn)])
    } else {
      n = new ConstantNode(vn)
    }

    if (f.d === 1) {
      return n
    }
    return new OperatorNode('/', 'divide', [n, new ConstantNode(f.d)])
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
  function foldOp (fn, args, makeNode, options) {
    return args.reduce(function (a, b) {
      if (!isNode(a) && !isNode(b)) {
        try {
          return _eval(fn, [a, b], options)
        } catch (ignoreandcontinue) {}
        a = _toNode(a)
        b = _toNode(b)
      } else if (!isNode(a)) {
        a = _toNode(a)
      } else if (!isNode(b)) {
        b = _toNode(b)
      }

      return makeNode([a, b])
    })
  }

  // destroys the original node and returns a folded one
  function foldFraction (node, options) {
    switch (node.type) {
      case 'SymbolNode':
        return node
      case 'ConstantNode':
        if (typeof node.value === 'number' || !isNaN(node.value)) {
          return _toNumber(node.value, options)
        }
        return node
      case 'FunctionNode':
        if (mathWithTransform[node.name] && mathWithTransform[node.name].rawArgs) {
          return node
        }

        // Process operators as OperatorNode
        const operatorFunctions = [ 'add', 'multiply' ]
        if (operatorFunctions.indexOf(node.name) === -1) {
          let args = node.args.map(arg => foldFraction(arg, options))

          // If all args are numbers
          if (!args.some(isNode)) {
            try {
              return _eval(node.name, args, options)
            } catch (ignoreandcontine) {}
          }

          // Convert all args to nodes and construct a symbolic function call
          args = args.map(function (arg) {
            return isNode(arg) ? arg : _toNode(arg)
          })
          return new FunctionNode(node.name, args)
        } else {
          // treat as operator
        }
        /* falls through */
      case 'OperatorNode':
        const fn = node.fn.toString()
        let args
        let res
        const makeNode = createMakeNodeFunction(node)
        if (isOperatorNode(node) && node.isUnary()) {
          args = [foldFraction(node.args[0], options)]
          if (!isNode(args[0])) {
            res = _eval(fn, args, options)
          } else {
            res = makeNode(args)
          }
        } else if (isAssociative(node)) {
          args = allChildren(node)
          args = args.map(arg => foldFraction(arg, options))

          if (isCommutative(fn)) {
            // commutative binary operator
            const consts = []
            const vars = []

            for (let i = 0; i < args.length; i++) {
              if (!isNode(args[i])) {
                consts.push(args[i])
              } else {
                vars.push(args[i])
              }
            }

            if (consts.length > 1) {
              res = foldOp(fn, consts, makeNode, options)
              vars.unshift(res)
              res = foldOp(fn, vars, makeNode, options)
            } else {
              // we won't change the children order since it's not neccessary
              res = foldOp(fn, args, makeNode, options)
            }
          } else {
            // non-commutative binary operator
            res = foldOp(fn, args, makeNode, options)
          }
        } else {
          // non-associative binary operator
          args = node.args.map(arg => foldFraction(arg, options))
          res = foldOp(fn, args, makeNode, options)
        }
        return res
      case 'ParenthesisNode':
        // remove the uneccessary parenthesis
        return foldFraction(node.content, options)
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
      case 'ConditionalNode':
        /* falls through */
      default:
        throw new Error(`Unimplemented node type in simplifyConstant: ${node.type}`)
    }
  }

  return simplifyConstant
})
