import { DEFAULT_CONFIG } from './core/config'
import { createCore } from './core/core'
import { lazy, traverse, values } from './utils/object'
import * as all from './factory'
import { ArgumentsError } from './error/ArgumentsError'
import { DimensionError } from './error/DimensionError'
import { IndexError } from './error/IndexError'
import { embeddedDocs } from './expression/embeddedDocs/embeddedDocs'
import { warnOnce } from './utils/log'
import { initial, last } from './utils/array'

export function core (config) {
  const mergedConfig = Object.assign({}, DEFAULT_CONFIG, config)

  return createCore({
    config: mergedConfig
  })
}

export function create (config) {
  const math = core(config)

  math.create = create
  math.core = core

  // Important: load docs before help
  math.docs = embeddedDocs

  // import the factory functions like createAdd as an array instead of object,
  // else they will get a different naming (`createAdd` instead of `add`).
  math['import'](values(all))

  // TODO: deprecated since v6.0.0. Clean up some day
  const movedNames = [
    'type.isNumber',
    'type.isComplex',
    'type.isBigNumber',
    'type.isFraction',
    'type.isUnit',
    'type.isString',
    'type.isArray',
    'type.isMatrix',
    'type.isDenseMatrix',
    'type.isSparseMatrix',
    'type.isRange',
    'type.isIndex',
    'type.isBoolean',
    'type.isResultSet',
    'type.isHelp',
    'type.isFunction',
    'type.isDate',
    'type.isRegExp',
    'type.isObject',
    'type.isNull',
    'type.isUndefined',
    'type.isAccessorNode',
    'type.isArrayNode',
    'type.isAssignmentNode',
    'type.isBlockNode',
    'type.isConditionalNode',
    'type.isConstantNode',
    'type.isFunctionAssignmentNode',
    'type.isFunctionNode',
    'type.isIndexNode',
    'type.isNode',
    'type.isObjectNode',
    'type.isOperatorNode',
    'type.isParenthesisNode',
    'type.isRangeNode',
    'type.isSymbolNode',
    'type.isChain',
    'type.BigNumber',
    'type.Chain',
    'type.Complex',
    'type.Fraction',
    'type.Matrix',
    'type.DenseMatrix',
    'type.SparseMatrix',
    'type.Spa',
    'type.FibonacciHeap',
    'type.ImmutableDenseMatrix',
    'type.Index',
    'type.Range',
    'type.ResultSet',
    'type.Unit',
    'type.Help',
    'type.Parser',
    'expression.parse',
    'expression.Parser',
    'expression.docs',
    'expression.node.AccessorNode',
    'expression.node.ArrayNode',
    'expression.node.AssignmentNode',
    'expression.node.BlockNode',
    'expression.node.ConditionalNode',
    'expression.node.ConstantNode',
    'expression.node.IndexNode',
    'expression.node.FunctionAssignmentNode',
    'expression.node.FunctionNode',
    'expression.node.Node',
    'expression.node.ObjectNode',
    'expression.node.OperatorNode',
    'expression.node.ParenthesisNode',
    'expression.node.RangeNode',
    'expression.node.RelationalNode',
    'expression.node.SymbolNode',
    'json.reviver',
    'error.ArgumentsError',
    'error.DimensionError',
    'error.IndexError'
  ]
  movedNames.forEach(fullName => {
    const parts = fullName.split('.')

    const path = initial(parts)
    const name = last(parts)
    const obj = traverse(math, path)

    lazy(obj, name, () => {
      warnOnce(`Warning: math.${fullName} is moved to math.${name} in v6.0.0. ` +
        'Please use the new location instead.')
      return math[name]
    })
  })

  math.ArgumentsError = ArgumentsError
  math.DimensionError = DimensionError
  math.IndexError = IndexError

  return math
}
