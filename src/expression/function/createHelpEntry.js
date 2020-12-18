import { factory } from '../../utils/factory.js'
import { getSafeProperty, isPlainObject } from '../../utils/customs.js'


export const createNewHelpEntry = factory('createDocs', ['typed', 'Docs'], ({ typed, Docs }) => {
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
      const doc = getSafeProperty(Docs, searchName)
      if (doc) {
        throw new Error('Documentation for "' + searchName + '" already exists')
      }
      Docs[searchName] = newEntry
    }
  })
})