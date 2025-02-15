import typed from 'typed-function'
import { typeOf as _typeOf } from './is.js'
import { findFirst } from './collection.js'

/**
 * Simplifies a callback function by reducing its complexity and potentially improving its performance.
 *
 * @param {Function} callback The original callback function to simplify.
 * @param {Array|Matrix} array The array that will be used with the callback function.
 * @param {string} name The name of the function that is using the callback.
 * @returns {Object} Returns an object with the limited version of the callback function and information about its arity.
 */
export function optimizeCallback(callback, array, name, options) {
  const {value:firstValue, index:firstIndex} = findFirst(array)
  const arity = typed.isTypedFunction(callback) 
  ? _findArityOfTypedFunction(callback, firstValue, firstIndex, array)
  : callback.length
  const isIndexed = arity > 1
  if (typed.isTypedFunction(callback)) {
    if (options && options.detailedError) {
        return {
          func: (...args) => tryFunctionWithArgs(callback, args.slice(0, arity), name, callback.name),
          isIndexed,
          hasEhancedError: true,
          isLimited: true
        }
    } else {
      return {
        func: (...args) => callback(...args.slice(0, arity)),
        isIndexed,
        hasEhancedError: false,
        isLimited: true
      }
    }
  }
  return {func:callback, isIndexed, hasEhancedError: false, isLimited: false}
}

/**
 * Determine the arity of a given callback function based on the provided arguments.
 * 
 * @param {Function} callback - The callback function whose arity is to be determined.
 * @param {*} value - The value to be passed as the first argument to the callback.
 * @param {number} index - The index to be passed as the second argument to the callback.
 * @param {Array} array - The array to be passed as the third argument to the callback.
 * @returns {number} - The arity of the callback function (1, 2, or 3).
 */
function _findArityOfTypedFunction (callback, value, index, array) {
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
export function tryFunctionWithArgs(func, args, mappingFnName, callbackName) {
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
function _createCallbackError(err, args, mappingFnName, callbackName) {
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
