import { factory } from '../../utils/factory.js'
import { getSafeProperty, isPlainObject } from '../../utils/customs.js'
import { embeddedDocs as defaultEmbeddedDocs } from '../embeddedDocs/embeddedDocs.js'
import { hasOwnProperty } from '../../utils/object.js'

const createDocsInstance = function () {
  /**
   * Documentation instance.
   * Documentations of different mathjs instance are independent.
   */

  const embeddedDocs = Object.assign({}, defaultEmbeddedDocs)

  const createHelp = /* #__PURE__ */ factory('help', ['typed', 'mathWithTransform', 'Help'], ({ typed, mathWithTransform, Help }) => {
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

    return typed('help', {
      any: function (search) {
        let prop
        let searchName = search

        if (typeof search !== 'string') {
          for (prop in mathWithTransform) {
            // search in functions and constants
            if (hasOwnProperty(mathWithTransform, prop) && (search === mathWithTransform[prop])) {
              searchName = prop
              break
            }
          }

          /* TODO: implement help for data types
           if (!text) {
           // search data type
           for (prop in math.type) {
           if (hasOwnProperty(math, prop)) {
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

  const createNewHelpEntry = factory('createDocs', ['typed'], ({ typed }) => {
    /**
     * Retrieve help on a function or data type.
     * Help files are retrieved from the embedded documentation in math.docs.
     *
     * Syntax:
     *
     *    math.createDocs(newHelpEntry)
     *
     * Examples:
     *
     *    math.createDocs({
     *      name: 'area',
     *      category: 'Utils',
     *      syntax: [
     *        'area(x, y)'
     *      ],
     *      description: 'Calculate the area of a rectangle with width x and height y',
     *      examples: [
     *        'area(2, 3)',
     *        'area(2.5, 5)'
     *       ],
     *      seealso: ['multiply']
     *     })
     *
     * @param {Object} newHelpEntry   A new documentation entry,  used to initialize a Help object
     */

    const isValidDocObject = function (doc) {
      if (!isPlainObject(doc)) {
        return false
      }
      const mandatoryKeys = {
        name: 'string',
        category: 'string',
        syntax: 'object',
        description: 'string'
      }
      if (doc.name === '') {
        return false
      }
      if (!Object.entries(mandatoryKeys).every(([key, value]) => {
        return (doc[key] && typeof doc[key] === value) || // eslint-disable-line valid-typeof
          (doc[key] === '' && value === 'string')
      })) {
        return false
      }
      if (!Array.isArray(doc.syntax)) {
        return false
      }
      if (doc.seealso && !Array.isArray(doc.seealso)) {
        return false
      }
      if (doc.examples && !Array.isArray(doc.examples)) {
        return false
      }
      return true
    }

    return typed('createDocs', {
      Object: function (newHelpEntry) {
        const newEntry = {
          name: newHelpEntry.name,
          category: newHelpEntry.category,
          syntax: newHelpEntry.syntax,
          description: newHelpEntry.description,
          examples: newHelpEntry.examples || [],
          seealso: newHelpEntry.seealso || []
        }

        if (!isValidDocObject(newEntry)) {
          throw new Error('Help Entry must be in correct format: { name: string, category: string, syntax: string[],' +
            'description: string, examples: string[], seealso: string[]}')
        }

        const searchName = newEntry.name
        const doc = getSafeProperty(embeddedDocs, searchName)
        if (doc) {
          throw new Error('Documentation for "' + searchName + '" already exists')
        }
        embeddedDocs[searchName] = newEntry
      }
    })
  })

  return {
    createNewHelpEntry: createNewHelpEntry,
    createHelp: createHelp
  }
}

export { createDocsInstance }
