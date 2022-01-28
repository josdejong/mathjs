import { isFunctionNode, isOperatorNode, isParenthesisNode } from '../../../utils/is.js'
import { factory } from '../../../utils/factory.js'
import { hasOwnProperty } from '../../../utils/object.js'

const name = 'simplifyUtil'
const dependencies = [
  'FunctionNode',
  'OperatorNode',
  'SymbolNode'
]

export const createUtil = /* #__PURE__ */ factory(name, dependencies, ({ FunctionNode, OperatorNode, SymbolNode }) => {
  // TODO commutative/associative properties rely on the arguments
  // e.g. multiply is not commutative for matrices
  // The properties should be calculated from an argument to simplify, or possibly something in math.config
  // the other option is for typed() to specify a return type so that we can evaluate the type of arguments

  /* So that properties of an operator fit on one line: */
  const T = true
  const F = false

  const defaultName = 'defaultF'
  const defaultContext = {
    /*      */ add: { trivial: T, total: T, commutative: T, associative: T },
    /**/ unaryPlus: { trivial: T, total: T, commutative: T, associative: T },
    /* */ subtract: { trivial: F, total: T, commutative: F, associative: F },
    /* */ multiply: { trivial: T, total: T, commutative: T, associative: T },
    /*   */ divide: { trivial: F, total: T, commutative: F, associative: F },
    /*    */ paren: { trivial: T, total: T, commutative: T, associative: F },
    /* */ defaultF: { trivial: F, total: T, commutative: F, associative: F }
  }
  const realContext = { divide: { total: F }, log: { total: F } }
  const positiveContext = {
    subtract: { total: F },
    abs: { trivial: T },
    log: { total: T }
  }

  function hasProperty (nodeOrName, property, context = defaultContext) {
    let name = defaultName
    if (typeof nodeOrName === 'string') {
      name = nodeOrName
    } else if (isOperatorNode(nodeOrName)) {
      name = nodeOrName.fn.toString()
    } else if (isFunctionNode(nodeOrName)) {
      name = nodeOrName.name
    } else if (isParenthesisNode(nodeOrName)) {
      name = 'paren'
    }
    if (hasOwnProperty(context, name)) {
      const properties = context[name]
      if (hasOwnProperty(properties, property)) {
        return properties[property]
      }
      if (hasOwnProperty(defaultContext, name)) {
        return defaultContext[name][property]
      }
    }
    if (hasOwnProperty(context, defaultName)) {
      const properties = context[defaultName]
      if (hasOwnProperty(properties, property)) {
        return properties[property]
      }
      return defaultContext[defaultName][property]
    }
    /* name not found in context and context has no global default */
    /* So use default context. */
    if (hasOwnProperty(defaultContext, name)) {
      const properties = defaultContext[name]
      if (hasOwnProperty(properties, property)) {
        return properties[property]
      }
    }
    return defaultContext[defaultName][property]
  }

  function isCommutative (node, context = defaultContext) {
    return hasProperty(node, 'commutative', context)
  }

  function isAssociative (node, context = defaultContext) {
    return hasProperty(node, 'associative', context)
  }

  /**
   * Merge the given contexts, with primary overriding secondary
   * wherever they might conflict
   */
  function mergeContext (primary, secondary) {
    const merged = { ...primary }
    for (const prop in secondary) {
      if (hasOwnProperty(primary, prop)) {
        merged[prop] = { ...secondary[prop], ...primary[prop] }
      } else {
        merged[prop] = secondary[prop]
      }
    }
    return merged
  }

  /**
   * Flatten all associative operators in an expression tree.
   * Assumes parentheses have already been removed.
   */
  function flatten (node, context) {
    if (!node.args || node.args.length === 0) {
      return node
    }
    node.args = allChildren(node, context)
    for (let i = 0; i < node.args.length; i++) {
      flatten(node.args[i], context)
    }
  }

  /**
   * Get the children of a node as if it has been flattened.
   * TODO implement for FunctionNodes
   */
  function allChildren (node, context) {
    let op
    const children = []
    const findChildren = function (node) {
      for (let i = 0; i < node.args.length; i++) {
        const child = node.args[i]
        if (isOperatorNode(child) && op === child.op) {
          findChildren(child)
        } else {
          children.push(child)
        }
      }
    }

    if (isAssociative(node, context)) {
      op = node.op
      findChildren(node)
      return children
    } else {
      return node.args
    }
  }

  /**
   *  Unflatten all flattened operators to a right-heavy binary tree.
   */
  function unflattenr (node, context) {
    if (!node.args || node.args.length === 0) {
      return
    }
    const makeNode = createMakeNodeFunction(node)
    const l = node.args.length
    for (let i = 0; i < l; i++) {
      unflattenr(node.args[i], context)
    }
    if (l > 2 && isAssociative(node, context)) {
      let curnode = node.args.pop()
      while (node.args.length > 0) {
        curnode = makeNode([node.args.pop(), curnode])
      }
      node.args = curnode.args
    }
  }

  /**
   *  Unflatten all flattened operators to a left-heavy binary tree.
   */
  function unflattenl (node, context) {
    if (!node.args || node.args.length === 0) {
      return
    }
    const makeNode = createMakeNodeFunction(node)
    const l = node.args.length
    for (let i = 0; i < l; i++) {
      unflattenl(node.args[i], context)
    }
    if (l > 2 && isAssociative(node, context)) {
      let curnode = node.args.shift()
      while (node.args.length > 0) {
        curnode = makeNode([curnode, node.args.shift()])
      }
      node.args = curnode.args
    }
  }

  function createMakeNodeFunction (node) {
    if (isOperatorNode(node)) {
      return function (args) {
        try {
          return new OperatorNode(node.op, node.fn, args, node.implicit)
        } catch (err) {
          console.error(err)
          return []
        }
      }
    } else {
      return function (args) {
        return new FunctionNode(new SymbolNode(node.name), args)
      }
    }
  }

  return {
    createMakeNodeFunction,
    hasProperty,
    isCommutative,
    isAssociative,
    mergeContext,
    flatten,
    allChildren,
    unflattenr,
    unflattenl,
    defaultContext,
    realContext,
    positiveContext
  }
})
