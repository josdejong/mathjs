import { factory } from '../utils/factory'

const name = 'reviver'
const dependencies = [
  'classes'
]

export const createReviver = /* #__PURE__ */ factory(name, dependencies, ({ classes }) => {
  /**
   * Instantiate mathjs data types from their JSON representation
   * @param {string} key
   * @param {*} value
   * @returns {*} Returns the revived object
   */
  return function reviver (key, value) {
    const constructor = classes[value && value.mathjs]

    if (constructor && typeof constructor.fromJSON === 'function') {
      return constructor.fromJSON(value)
    }

    return value
  }
})
