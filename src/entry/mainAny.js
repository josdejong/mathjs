// configuration
export { config } from './configReadonly'

// functions and constants
export * from './pureFunctionsAny.generated'
export * from './impureFunctionsAny.generated'
export * from './typeChecks'

// error classes
export { IndexError } from '../error/IndexError'
export { DimensionError } from '../error/DimensionError'
export { ArgumentsError } from '../error/ArgumentsError'

// dependency groups
export * from './dependenciesAny.generated'

// factory functions
export * from '../factoriesAny'

// core
export { core, create, factory } from './instance'

// backward compatibility stuff for v5
export * from './deprecatedAny'
