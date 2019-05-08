// configuration
export { config } from './configReadonly'

// functions and constants
export * from './functionsNumber.generated'
export * from './evaluateNumber'
export * from './typeChecks'

// error classes
export { IndexError } from '../error/IndexError'
export { DimensionError } from '../error/DimensionError'
export { ArgumentsError } from '../error/ArgumentsError'

// dependency groups
export * from './dependenciesNumber.generated'

// factory functions
export * from '../factoriesNumber'

// core
export { core, create, factory } from './instance'
