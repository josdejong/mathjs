import { clone as objectClone } from '../../utils/object.js'
import { factory } from '../../utils/factory.js'

const name = 'clone'
const dependencies = ['typed']

export const createClone = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Clone an object. Arrays will be deep copied.
   *
   * Syntax:
   *
   *     math.clone(x)
   *
   * Examples:
   *
   *    math.clone(3.5)                   // returns number 3.5
   *    math.clone(math.complex('2-4i') // returns Complex 2 - 4i
   *    math.clone(math.unit(45, 'deg'))  // returns Unit 45 deg
   *    math.clone([[1, 2], [3, 4]])      // returns Array [[1, 2], [3, 4]], as a deep copy
   *    math.clone("hello world")         // returns string "hello world"
   *
   * @param {*} x   Object to be cloned
   * @return {*} A clone of object x
   */
  return typed(name, {
    any: objectClone
  })
})
