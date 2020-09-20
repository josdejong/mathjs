// configuration
export { config } from './configReadonly.js'

// functions and constants
export * from './pureFunctionsNumber.generated.js'
export * from './impureFunctionsNumber.generated.js'
export * from './typeChecks.js'

// error classes
export { IndexError } from '../error/IndexError.js'
export { DimensionError } from '../error/DimensionError.js'
export { ArgumentsError } from '../error/ArgumentsError.js'

// dependency groups
export * from './dependenciesNumber.generated.js'

// factory functions
export * from '../factoriesNumber.js'

// core
export { create } from '../core/create.js'
export { factory } from '../utils/factory.js'
