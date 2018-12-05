// For backward compatibility, deprecated since version 6.0.0. Date: 2018-12-05
import { factory } from '../../utils/factory'

export const createDeprecatedEval = /* #__PURE__ */ factory('eval', ['evaluate'], ({ evaluate }) => {
  let warned = false

  return function (...args) {
    if (!warned) {
      warned = true
      console.warn('Function "eval" has been renamed to "evaluate", please use the new function instead.')
    }

    return evaluate.apply(evaluate, args)
  }
})
