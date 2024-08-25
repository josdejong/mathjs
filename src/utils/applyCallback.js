import typed from 'typed-function'
import { get, arraySize } from './array.js'
import { typeOf as _typeOf } from './is.js'

export function findNumberOfArguments (callback, value, index, array) {
  const testArgs = [value, index, array]
  for (let i = 3; i > 0; i--) {
    const args = testArgs.slice(0,i)
    if (typed.resolve(callback, args) !== null) {
      return i
    }
  }
}

export function reduceCallback (callback, array, name) {
  // TODO: replace hasSingleSignature to singleSignatureFound for this number of elements
  if (typed.isTypedFunction(callback)) {
    const firstIndex = arraySize(array).map(() => 0)
    const firstValue = get(array, firstIndex)
    const hasSingleSignature = Object.keys(callback.signatures).length === 1
    const numberOfArguments = findNumberOfArguments(callback, firstValue, firstIndex, array)
    const reducedCallback = hasSingleSignature ? Object.values(callback.signatures)[0] : callback

    switch (numberOfArguments) {
      case 1:
        return (value) => tryWithArgs(reducedCallback, [value], name, callback.name)
      case 2:
        return (value, index) => tryWithArgs(reducedCallback, [value, index], name, callback.name)
      case 3:
        return (value, index, array) => tryWithArgs(reducedCallback, [value, index, array], name, callback.name)
      default:
        return (...args) => tryWithArgs(reducedCallback, args, name, callback.name)
    }
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
      return tryWithArgs(signature3, args3, mappingFnName, callback.name)
    }

    const args2 = [value, index]
    const signature2 = typed.resolve(callback, args2)
    if (signature2) {
      return tryWithArgs(signature2, args2, mappingFnName, callback.name)
    }

    const args1 = [value]
    const signature1 = typed.resolve(callback, args1)
    if (signature1) {
      return tryWithArgs(signature1, args1, mappingFnName, callback.name)
    }

    // fallback (will throw an exception)
    return tryWithArgs(callback, args3, mappingFnName, callback.name)
  } else {
    // A regular JavaScript function
    return callback(value, index, array)
  }
}

/**
   * @param {function} signature The selected signature of the typed-function
   * @param {Array} args List with arguments to apply to the selected signature
   * @returns {*} Returns the return value of the invoked signature
   * @throws {TypeError} Throws an error when no matching signature was found
   */
export function tryWithArgs (signature, args, mappingFnName, callbackName) {
  try {
    if (signature.implementation) {
      return signature.implementation.apply(signature.implementation, args)
    }
    return signature(...args)
  } catch (err) {
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
}
