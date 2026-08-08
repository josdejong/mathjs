import { isAccessorNode, isFunctionNode } from '../../../utils/is.js'

/**
 * The shared state of a single optional chain like `a?.b.c`: as soon as one of
 * its links short-circuits, all the links after it must return undefined too.
 *
 * This state is passed along the chain instead of being stored in the
 * evaluation context, since the context of an index expression is the object
 * that is being indexed, like `A` in `A[a?.b]`.
 */
export class OptionalChain {
  constructor () {
    this.shortCircuited = false
  }
}

/**
 * Get the optional chain that a given evaluation context belongs to, or start
 * a new one when the context is not part of a chain.
 * @param {*} context
 * @return {OptionalChain}
 */
export function optionalChainOf (context) {
  return context instanceof OptionalChain ? context : new OptionalChain()
}

/**
 * Get the evaluation context to use outside of an optional chain, like in the
 * arguments of a function call: a short-circuit there belongs to a chain of
 * its own, like `y?.z` does in `x?.f(y?.z).g`.
 * @param {*} context
 * @return {*}
 */
export function detachOptionalChain (context) {
  return context instanceof OptionalChain ? undefined : context
}

/**
 * Short-circuit the optional chain of a given evaluation context, so the links
 * after it return undefined instead of accessing a property of undefined.
 * @param {*} context
 * @return {undefined}
 */
export function shortCircuitOptionalChain (context) {
  if (context instanceof OptionalChain) {
    context.shortCircuited = true
  }

  return undefined
}

/**
 * Test whether a node continues an optional chain, like `a?.b` does in
 * `a?.b.c` and `a?.b()`: accessing or invoking the result of such a node must
 * return undefined when the chain short-circuited.
 * @param {Node} node
 * @return {boolean}
 */
export function continuesOptionalChain (node) {
  if (isAccessorNode(node)) {
    return node.optionalChaining || continuesOptionalChain(node.object)
  }

  if (isFunctionNode(node)) {
    return node.optional || continuesOptionalChain(node.fn)
  }

  return false
}
