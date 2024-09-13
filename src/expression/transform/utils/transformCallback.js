import { factory } from '../../../utils/factory.js'

const name = 'transformCallback'
const dependencies = ['typed']

export const createTransformCallback = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
         * Transforms the given callback function based on its type and number of arrays.
         *
         * @param {Function} callback - The callback function to transform.
         * @param {number} numberOfArrays - The number of arrays to pass to the callback function.
         * @returns {*} - The transformed callback function.
         */
  return function (callback, numberOfArrays) {
    if (typed.isTypedFunction(callback)) {
      return _transformTypedCallbackFunction(callback, numberOfArrays)
    } else {
      return _transformCallbackFunction(callback, callback.length, numberOfArrays)
    }
  }

  /**
       * Transforms the given typed callback function based on the number of arrays.
       *
       * @param {Function} typedFunction - The typed callback function to transform.
       * @param {number} numberOfArrays - The number of arrays to pass to the callback function.
       * @returns {*} - The transformed callback function.
       */
  function _transformTypedCallbackFunction (typedFunction, numberOfArrays) {
    const signatures = Object.fromEntries(
      Object.entries(typedFunction.signatures)
        .map(([signature, callbackFunction]) => {
          const numberOfCallbackInputs = signature.split(',').length
          if (typed.isTypedFunction(callbackFunction)) {
            return [signature, _transformTypedCallbackFunction(callbackFunction, numberOfArrays)]
          } else {
            return [signature, _transformCallbackFunction(callbackFunction, numberOfCallbackInputs, numberOfArrays)]
          }
        })
    )

    if (typeof typedFunction.name === 'string') {
      return typed(typedFunction.name, signatures)
    } else {
      return typed(signatures)
    }
  }
})

/**
     * Transforms the callback function based on the number of callback inputs and arrays.
     * There are three cases:
     * 1. The callback function has N arguments.
     * 2. The callback function has N+1 arguments.
     * 3. The callback function has 2N+1 arguments.
     *
     * @param {Function} callbackFunction - The callback function to transform.
     * @param {number} numberOfCallbackInputs - The number of callback inputs.
     * @param {number} numberOfArrays - The number of arrays.
     * @returns {Function} The transformed callback function.
     */
function _transformCallbackFunction (callbackFunction, numberOfCallbackInputs, numberOfArrays) {
  if (numberOfCallbackInputs === numberOfArrays) {
    return callbackFunction
  } else if (numberOfCallbackInputs === numberOfArrays + 1) {
    return function (...args) {
      const vals = args.slice(0, numberOfArrays)
      const idx = _transformDims(args[numberOfArrays])
      return callbackFunction(...vals, idx)
    }
  } else if (numberOfCallbackInputs > numberOfArrays + 1) {
    return function (...args) {
      const vals = args.slice(0, numberOfArrays)
      const idx = _transformDims(args[numberOfArrays])
      const rest = args.slice(numberOfArrays + 1)
      return callbackFunction(...vals, idx, ...rest)
    }
  } else {
    return callbackFunction
  }
}

/**
   * Transforms the dimensions by adding 1 to each dimension.
   *
   * @param {Array} dims - The dimensions to transform.
   * @returns {Array} The transformed dimensions.
   */
function _transformDims (dims) {
  return dims.map(dim => dim + 1)
}
