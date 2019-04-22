// For backward compatibility, deprecated since version 6.0.0. Date: 2018-12-05
import { factory } from '../../utils/factory'
import { warnOnce } from '../../utils/log'

export const createDeprecatedEval = /* #__PURE__ */ factory('eval', ['evaluate'], ({ evaluate }) => {
  return function (...args) {
    warnOnce('Function "eval" has been renamed to "evaluate" in v6.0.0, please use the new function instead.')

    return evaluate.apply(evaluate, args)
  }
})
