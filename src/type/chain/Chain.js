import { isChain } from '../../utils/is'
import { format } from '../../utils/string'
import { lazy } from '../../utils/object'
import { factory } from '../../utils/factory'

const name = 'Chain'
const dependencies = ['?on', 'math']

export const createChainClass = /* #__PURE__ */ factory(name, dependencies, ({ on, math }) => {
  /**
   * @constructor Chain
   * Wrap any value in a chain, allowing to perform chained operations on
   * the value.
   *
   * All methods available in the math.js library can be called upon the chain,
   * and then will be evaluated with the value itself as first argument.
   * The chain can be closed by executing chain.done(), which will return
   * the final value.
   *
   * The Chain has a number of special functions:
   * - done()             Finalize the chained operation and return the
   *                      chain's value.
   * - valueOf()          The same as done()
   * - toString()         Returns a string representation of the chain's value.
   *
   * @param {*} [value]
   */
  function Chain (value) {
    if (!(this instanceof Chain)) {
      throw new SyntaxError('Constructor must be called with the new operator')
    }

    if (isChain(value)) {
      this.value = value.value
    } else {
      this.value = value
    }
  }

  /**
   * Attach type information
   */
  Chain.prototype.type = 'Chain'
  Chain.prototype.isChain = true

  /**
   * Close the chain. Returns the final value.
   * Does the same as method valueOf()
   * @returns {*} value
   */
  Chain.prototype.done = function () {
    return this.value
  }

  /**
   * Close the chain. Returns the final value.
   * Does the same as method done()
   * @returns {*} value
   */
  Chain.prototype.valueOf = function () {
    return this.value
  }

  /**
   * Get a string representation of the value in the chain
   * @returns {string}
   */
  Chain.prototype.toString = function () {
    return format(this.value)
  }

  /**
   * Get a JSON representation of the chain
   * @returns {Object}
   */
  Chain.prototype.toJSON = function () {
    return {
      mathjs: 'Chain',
      value: this.value
    }
  }

  /**
   * Instantiate a Chain from its JSON representation
   * @param {Object} json  An object structured like
   *                       `{"mathjs": "Chain", value: ...}`,
   *                       where mathjs is optional
   * @returns {Chain}
   */
  Chain.fromJSON = function (json) {
    return new Chain(json.value)
  }

  /**
   * Create a proxy method for the chain
   * @param {string} name
   * @param {Function} fn      The function to be proxied
   *                           If fn is no function, it is silently ignored.
   * @private
   */
  function createProxy (name, fn) {
    if (typeof fn === 'function') {
      Chain.prototype[name] = chainify(fn)
    }
  }

  /**
   * Create a proxy method for the chain
   * @param {string} name
   * @param {function} resolver   The function resolving with the
   *                              function to be proxied
   * @private
   */
  function createLazyProxy (name, resolver) {
    lazy(Chain.prototype, name, function outerResolver () {
      const fn = resolver()
      if (typeof fn === 'function') {
        return chainify(fn)
      }

      return undefined // if not a function, ignore
    })
  }

  /**
   * Make a function chainable
   * @param {function} fn
   * @return {Function} chain function
   * @private
   */
  function chainify (fn) {
    return function () {
      const args = [this.value] // `this` will be the context of a Chain instance
      for (let i = 0; i < arguments.length; i++) {
        args[i + 1] = arguments[i]
      }

      return new Chain(fn.apply(fn, args))
    }
  }

  /**
   * Create a proxy for a single method, or an object with multiple methods.
   * Example usage:
   *
   *   Chain.createProxy('add', function add (x, y) {...})
   *   Chain.createProxy({
   *     add:      function add (x, y) {...},
   *     subtract: function subtract (x, y) {...}
   *   }
   *
   * @param {string | Object} arg0   A name (string), or an object with
   *                                 functions
   * @param {*} [arg1]               A function, when arg0 is a name
   */
  Chain.createProxy = function (arg0, arg1) {
    if (typeof arg0 === 'string') {
      // createProxy(name, value)
      createProxy(arg0, arg1)
    } else {
      // createProxy(values)
      for (const name in arg0) {
        if (arg0.hasOwnProperty(name) && excludedNames[name] === undefined) {
          createLazyProxy(name, () => arg0[name])
        }
      }
    }
  }

  const excludedNames = {
    expression: true,
    docs: true,
    type: true,
    classes: true,
    json: true,
    error: true,
    isChain: true // conflicts with the property isChain of a Chain instance
  }

  // create proxy for everything that is in math.js
  Chain.createProxy(math)

  // register on the import event, automatically add a proxy for every imported function.
  if (on) {
    on('import', function (name, resolver, path) {
      if (!path) {
        // an imported function (not a data type or something special)
        createLazyProxy(name, resolver)
      }
    })
  }

  return Chain
}, { isClass: true })
