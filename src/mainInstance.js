import { DEFAULT_CONFIG } from './core/config'
import { createCore } from './core/core'
import { values } from './utils/object'
import * as all from './factory'
import { ArgumentsError } from './error/ArgumentsError'
import { DimensionError } from './error/DimensionError'
import { IndexError } from './error/IndexError'
import { embeddedDocs } from './expression/embeddedDocs/embeddedDocs'

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

  // import the factory functions like createAdd as an array instead of object,
  // else they will get a different naming (`createAdd` instead of `add`).
  math['import'](values(all))

  math.expression.docs = embeddedDocs

  // TODO: deprecated since v6.0.0. Clean up some day
  math.expression.parse = function () {
    throw new Error(
      'Function "math.expression.parse" is deprecated since v6.0.0. ' +
      'Use "math.parse" instead.')
  }

  // TODO: deprecated since v6.0.0. Clean up some day
  math.expression.Parser = function () {
    throw new Error(
      'Class "math.expression.Parser" has been moved to ' +
      'math.type.Parser since v6.0.0.')
  }

  math.error = {
    ArgumentsError,
    DimensionError,
    IndexError
  }

  return math
}
