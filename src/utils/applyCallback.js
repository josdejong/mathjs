import typed from 'typed-function'
import { get, arraySize } from './array.js'
import { typeOf as _typeOf } from './is.js'

/**
 * Simplifies a callback function by reducing its complexity and potentially improving its performance.
 *
 * @param {Function} callback The original callback function to simplify.
 * @param {Array} array The array that will be used with the callback function.
 * @param {string} name The name of the function that is using the callback.
 * @returns {Function} Returns a simplified version of the callback function.
 */
export function simplifyCallback (callback, array, name) {
  if (typed.isTypedFunction(callback)) {
    const firstIndex = arraySize(array).map(() => 0)
    const firstValue = get(array, firstIndex)
    const hasSingleSignature = Object.keys(callback.signatures).length === 1
    const numberOfArguments = _findNumberOfArguments(callback, firstValue, firstIndex, array)
    const reducedCallback = hasSingleSignature ? Object.values(callback.signatures)[0] : callback
    if (numberOfArguments >= 1 && numberOfArguments <= 3) {
      return (...args) => _tryFunctionWithArgs(reducedCallback, args.slice(0, numberOfArguments), name, callback.name)
    }
    return (...args) => _tryFunctionWithArgs(reducedCallback, args, name, callback.name)
  }
  return callback
}

/**
 * Invoke a callback for functions like map and filter with a matching number of arguments
 * @param {function} callback
 * @param {any} value
 * @param {number | number[]} index
 * @param {Array} array
 * @param {string} mappingFnName   The name of the function that is invoking these callbacks, for example "map" or "filter"
 * @returns {*}
 */
export function applyCallback (callback, value, index, array, mappingFnName) {
  if (typed.isTypedFunction(callback)) {
    // invoke the typed callback function with the matching number of arguments only

    const args3 = [value, index, array]
    const signature3 = typed.resolve(callback, args3)
    if (signature3) {
      return _trySignatureWithArgs(signature3, args3, mappingFnName, callback.name)
    }

    const args2 = [value, index]
    const signature2 = typed.resolve(callback, args2)
    if (signature2) {
      return _trySignatureWithArgs(signature2, args2, mappingFnName, callback.name)
    }

    const args1 = [value]
    const signature1 = typed.resolve(callback, args1)
    if (signature1) {
      return _trySignatureWithArgs(signature1, args1, mappingFnName, callback.name)
    }

    // fallback (will throw an exception)
    return _trySignatureWithArgs(callback, args3, mappingFnName, callback.name)
  } else {
    // A regular JavaScript function
    return callback(value, index, array)
  }
}

function _findNumberOfArguments (callback, value, index, array) {
  const testArgs = [value, index, array]
  for (let i = 3; i > 0; i--) {
    const args = testArgs.slice(0, i)
    if (typed.resolve(callback, args) !== null) {
      return i
    }
  }
}

/**
   * @param {function} signature The selected signature of the typed-function
   * @param {Array} args List with arguments to apply to the selected signature
   * @param {string} mappingFnName the name of the function that is using the callback
   * @param {string} callbackName the name of the callback function
   * @returns {*} Returns the return value of the invoked signature
   * @throws {TypeError} Throws an error when no matching signature was found
   */
function _trySignatureWithArgs (signature, args, mappingFnName, callbackName) {
  try {
    return signature.implementation.apply(signature.implementation, args)
  } catch (err) {
    _createCallbackError(err, args, mappingFnName, callbackName)
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
function _tryFunctionWithArgs (func, args, mappingFnName, callbackName) {
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
