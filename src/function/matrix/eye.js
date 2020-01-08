// TODO: function eye is removed since v5.0.0 (June 2018). Remove it some day.

import { factory } from '../../utils/factory'

export const createEye = /* #__PURE__ */ factory('eye', [], () => {
  return function eye () {
    throw new Error('Function "eye" is renamed to "identity" since mathjs version 5.0.0. ' +
        'To keep eye working, create an alias for it using "math.import({eye: math.identity}, {override: true})"')
  }
})
