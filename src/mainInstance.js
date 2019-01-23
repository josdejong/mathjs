import { DEFAULT_CONFIG } from './core/config'
import { createCore } from './core/core'
import all from './index'

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

  // TODO: create a new, flat index file with all functions to be imported
  math['import'](all)

  return math
}
