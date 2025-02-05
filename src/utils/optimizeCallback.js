import typed from 'typed-function'
import { get, arraySize } from './array.js'
import { typeOf as _typeOf } from './is.js'

/**
 * Simplifies a callback function by reducing its complexity and potentially improving its performance.
 *
 * @param {Function} callback The original callback function to simplify.
 * @param {Array|Matrix} array The array that will be used with the callback function.
 * @param {string} name The name of the function that is using the callback.
 * @returns {Array} Returns an array with the simplified version of the callback function and it's number of arguments
 */
export function optimizeCallback (callback, array, name, options) {
  if (typed.isTypedFunction(callback)) {
    const [firstValue, firstIndex] = findFirstValueAndIndex(array)
    const hasSingleSignature = Object.keys(callback.signatures).length === 1
    const numberOfArguments = _typedFindNumberOfArguments(callback, firstValue, firstIndex, array)
    if (options && options.detailedError) {
      const fastCallback = hasSingleSignature ? Object.values(callback.signatures)[0] : callback
      switch (numberOfArguments) {
        case 1:
          return (val) => tryFunctionWithArgs(fastCallback, [val], name, callback.name)
        case 2:
          return (val, idx) => tryFunctionWithArgs(fastCallback, [val, idx], name, callback.name)
        default:
          return (...args) => tryFunctionWithArgs(fastCallback, args, name, callback.name)
      }
    } else if (hasSingleSignature) {
      return Object.values(callback.signatures)[0]
    } else {
      switch (numberOfArguments) {
        case 1:
          return val => callback(val)
        case 2:
          return (val, idx) => callback(val, idx)
        default:
          return callback
      }
    }
  }
  return callback
}

function findFirstValueAndIndex (array) {
  if((array.isMatrix && array.valueOf().length === 0) || (Array.isArray(array) && array.length === 0)) {
    return [undefined, []]
  }
  const firstIndex = (array.isMatrix ? array.size() : arraySize(array)).map(() => 0)
  const firstValue = array.isMatrix ? array.get(firstIndex) : get(array, firstIndex)

  return [firstValue, firstIndex]
}

export function findNumberOfArguments (callback, array) {
  const [firstValue, firstIndex] = findFirstValueAndIndex(array)
  if (typed.isTypedFunction(callback)) {
    return _typedFindNumberOfArguments(callback, firstValue, firstIndex, array)
  } else {
    return _fnFindNumberOfArguments(callback, firstValue, firstIndex)
  }
}

function _fnFindNumberOfArguments (callback, value, index) {
  if (callback.length === 0) return 3
  try {
    callback(value)
    return 1
  } catch {}
  try {
    callback(value, index)
    return 2
  } catch {}
  return 3
}

function _typedFindNumberOfArguments (callback, value, index, array) {
  const testArgs = [value, index, array]
  for (let i = 3; i > 0; i--) {
    const args = testArgs.slice(0, i)
    if (typed.resolve(callback, args) !== null) {
      return i
    }
  }
}

/**
   * @param {function} func The selected function taken from one of the signatures of the callback function
   * @param {Array} args List with arguments to apply to the selected signature
   * @param {string} mappingFnName the name of the function that is using the callback
   * @param {string} callbackName the name of the callback function
   * @returns {*} Returns the return value of the invoked signature
   * @throws {TypeError} Throws an error when no matching signature was found
   */
export function tryFunctionWithArgs (func, args, mappingFnName, callbackName) {
  try {
    return func(...args)
  } catch (err) {
    _createCallbackError(err, args, mappingFnName, callbackName)
  }
}

/**
 * Creates and throws a detailed TypeError when a callback function fails.
 *
 * @param {Error} err The original error thrown by the callback function.
 * @param {Array} args The arguments that were passed to the callback function.
 * @param {string} mappingFnName The name of the function that is using the callback.
 * @param {string} callbackName The name of the callback function.
 * @throws {TypeError} Throws a detailed TypeError with enriched error message.
 */
function _createCallbackError (err, args, mappingFnName, callbackName) {
  // Enrich the error message so the user understands that it took place inside the callback function
  if (err instanceof TypeError && err.data?.category === 'wrongType') {
    const argsDesc = []
    argsDesc.push(`value: ${_typeOf(args[0])}`)
    if (args.length >= 2) { argsDesc.push(`index: ${_typeOf(args[1])}`) }
    if (args.length >= 3) { argsDesc.push(`array: ${_typeOf(args[2])}`) }

    throw new TypeError(`Function ${mappingFnName} cannot apply callback arguments ` +
      `${callbackName}(${argsDesc.join(', ')}) at index ${JSON.stringify(args[1])}`)
  } else {
    throw new TypeError(`Function ${mappingFnName} cannot apply callback arguments ` +
      `to function ${callbackName}: ${err.message}`)
  }
}
