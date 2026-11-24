import { factory } from '../utils/factory.js'

const name = 'array'
const dependencies = ['typed', 'isInteger', 'number']

export const createArray = /* #__PURE__ */ factory(name, dependencies, ({ typed, isInteger, number }) => {
  /**
   * Create an Array or convert a Matrix, string, or numeric value to an Array.
   *
   * Syntax:
   *
   *   math.array()
   *   math.array(value)
   *
   * Where:
   *
   *   - `value: *`
   *     The value to be converted to Array. Matrices convert by returning
   *     their contents as an array, nested if their dimension was greater than
   *     one. Arrays are shallow-cloned. Strings convert into a 1-dimensional
   *     array of their characters. Complex numbers convert into an array of
   *     their real and imaginary parts. Other integer numeric values convert
   *     into uninitialized 1-dimensional arrays of the corresponding length;
   *     non-integer values throw an error.
   *     If no argument is supplied, an empty array is returned.
   *
   * Examples:
   *
   *   math.array()                             // Returns []
   *   math.array(math.matrix([[1,2], [3,4]]))  // Returns [[1,2], [3,4]]
   *   math.array('Hello')                      // Returns ['H','e','l','l','o']
   *   math.array(3n)                           // Returns [undefined, undefined, undefined]
   *   math.array(math.E)  // throws Error: array length must be an integer
   *
   * See also:
   *
   *   matrix
   *
   * History:
   *
   *   v16  Created
   *
   * @param {MathType} [value]  Value to be converted
   * @return {Array}  The created array
   */
  const array = typed(name, {
    '': () => [],
    null: () => [],
    string: s => Array.from(s),
    Matrix: m => m.toArray(),
    Array: a => a.slice(),
    Complex: z => [z.re, z.im],
    'number | BigNumber | Fraction | bigint': x => {
      if (!isInteger(x)) throw new Error('array length must be an integer')
      return new Array(number(x))
    }
  })
  return array
})
