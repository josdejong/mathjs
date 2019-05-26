import { factory } from '../../utils/factory'
import { getSafeProperty } from '../../utils/customs'
import { embeddedDocs } from '../embeddedDocs/embeddedDocs'

const name = 'help'
const dependencies = ['typed', 'mathWithTransform', 'Help']

export const createHelp = /* #__PURE__ */ factory(name, dependencies, ({ typed, mathWithTransform, Help }) => {
  /**
   * Retrieve help on a function or data type.
   * Help files are retrieved from the embedded documentation in math.docs.
   *
   * Syntax:
   *
   *    math.help(search)
   *
   * Examples:
   *
   *    console.log(math.help('sin').toString())
   *    console.log(math.help(math.add).toString())
   *    console.log(math.help(math.add).toJSON())
   *
   * @param {Function | string | Object} search   A function or function name
   *                                              for which to get help
   * @return {Help} A help object
   */
  return typed(name, {
    'any': function (search) {
      let prop
      let searchName = search

      if (typeof search !== 'string') {
        for (prop in mathWithTransform) {
          // search in functions and constants
          if (mathWithTransform.hasOwnProperty(prop) && (search === mathWithTransform[prop])) {
            searchName = prop
            break
          }
        }

        /* TODO: implement help for data types
         if (!text) {
         // search data type
         for (prop in math.type) {
         if (math.hasOwnProperty(prop)) {
         if (search === math.type[prop]) {
         text = prop
         break
         }
         }
         }
         }
         */
      }

      const doc = getSafeProperty(embeddedDocs, searchName)
      if (!doc) {
        const searchText = typeof searchName === 'function' ? searchName.name : searchName
        throw new Error('No documentation found on "' + searchText + '"')
      }
      return new Help(doc)
    }
  })
})
