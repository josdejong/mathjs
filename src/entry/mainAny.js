// configuration
export { config } from './configReadonly.js'

// functions and constants
export * from './pureFunctionsAny.generated.js'
export * from './impureFunctionsAny.generated.js'
export * from './typeChecks.js'

// error classes
export { IndexError } from '../error/IndexError.js'
export { DimensionError } from '../error/DimensionError.js'
export { ArgumentsError } from '../error/ArgumentsError.js'

// dependency groups
export * from './dependenciesAny.generated.js'

// factory functions
export * from '../factoriesAny.js'

// core
export { create } from '../core/create.js'
export { factory } from '../utils/factory.js'
