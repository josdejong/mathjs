import typed from 'typed-function'
import { typeOf as _typeOf } from './is.js'

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
      return tryWithArgs(signature3.implementation, args3)
    }

    const args2 = [value, index]
    const signature2 = typed.resolve(callback, args2)
    if (signature2) {
      return tryWithArgs(signature2.implementation, args2)
    }

    const args1 = [value]
    const signature1 = typed.resolve(callback, args1)
    if (signature1) {
      return tryWithArgs(signature1.implementation, args1)
    }

    // fallback (will throw an exception)
    return tryWithArgs(callback, args3)
  } else {
    // A regular JavaScript function
    return callback(value, index, array)
  }

  /**
   * @param {function} signature The selected signature of the typed-function
   * @param {Array} args List with arguments to apply to the selected signature
   * @returns {*} Returns the return value of the invoked signature
   * @throws {TypeError} Throws an error when no matching signature was found
   */
  function tryWithArgs (signature, args) {
    try {
      return signature.apply(signature, args)
    } catch (err) {
      // Enrich the error message so the user understands that it took place inside the callback function
      if (err instanceof TypeError && err.data?.category === 'wrongType') {
        const argsDesc = []
        argsDesc.push(`value: ${_typeOf(value)}`)
        if (args.length >= 2) { argsDesc.push(`index: ${_typeOf(index)}`) }
        if (args.length >= 3) { argsDesc.push(`array: ${_typeOf(array)}`) }

        throw new TypeError(`Function ${mappingFnName} cannot apply callback arguments ` +
          `${callback.name}(${argsDesc.join(', ')}) at index ${JSON.stringify(index)}`)
      } else {
        throw new TypeError(`Function ${mappingFnName} cannot apply callback arguments ` +
          `to function ${callback.name}: ${err.message}`)
      }
    }
  }
}
