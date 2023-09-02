import { createPrint } from '../../function/string/print.js'
import { factory } from '../../utils/factory.js'
import { printTemplate } from '../../utils/print.js'

const name = 'print'
const dependencies = ['typed', 'matrix', 'zeros', 'add']

export const createPrintTransform = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, zeros, add }) => {
  const print = createPrint({ typed, matrix, zeros, add })
  return typed(name, {
    'string, Object | Array': function (template, values) { return print(_convertTemplateToZeroBasedIndex(template), values) },
    'string, Object | Array, number | Object': function (template, values, options) { return print(_convertTemplateToZeroBasedIndex(template), values, options) }
  })

  function _convertTemplateToZeroBasedIndex (template) {
    return template.replace(printTemplate, (x) => {
      const parts = x.slice(1).split('.')
      const result = parts.map(function (part) {
        if (!isNaN(part) && part.length > 0) {
          return parseInt(part) - 1
        } else {
          return part
        }
      })
      return '$' + result.join('.')
    })
  }
}, { isTransformFunction: true })
