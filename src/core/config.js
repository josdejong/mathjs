import { isNumber } from '../utils/is.js'

export const DEFAULT_CONFIG = {
  compatibility: {
    // legacy behavior for matrix subset. When true, the subset function
    // returns a matrix or array with the same size as the index (except for
    // scalars). When false, it returns a matrix or array with a size
    // depending on the type of index.
    subset: false
  },

  compute: {
    // minimum absolute difference between two compared values of
    // floating-point (inexact) types, used by all comparison functions
    defaultAbsTol: 1e-15,

    // minimum relative difference between two compared values of
    // floating-point (inexact) types, used by all comparison functions
    defaultRelTol: 1e-12,

    // type used for floating-point/approximate real values as output
    // when the type is not uniquely determined by the input types (e.g.,
    // square root of a bigint or the value of a mathematical constant)
    numberApproximate: 'number',
    
    // random seed for seeded pseudo random number generation
    // null = randomly seed
    randomSeed: null,

    // Is the output type of each function uniform? When true, output type
    // depends only on the input types. When false (default), output type
    // can vary depending on input values within a type. For example,
    // `math.sqrt(-4)` returns `math.complex('2i')` when
    // uniformType is false, and returns `NaN` when true.
    uniformType: false,

    BigNumber: {
      // Number of significant digits to keep
      precision: 64
    },

    Matrix: {
      // default representation of Matrices to use
      defaultType: 'Matrix'
    }
  },

  parse: {
    // When textual representations of numbers are converted to numeric
    // values in the expression parser, what should their default type be?
    number: 'number',

    // In case a given textual representation cannot be converted to the
    // selected type specified by the `number` option, what type should
    // be tried as an alternative?
    numberFallback: 'number'
  } 
}

function isStringOrNull (s) {
  return s === null | typeof s === 'string'
}

// For each configuration option, either an array of allowed values or
// a boolean predicate specifying whether an option value is allowed.
export const ALLOWED_CONFIG = {
  compatibility: {
    subset: [true, false]
  },
  compute: {
    defaultAbsTol: isNumber,
    defaultRelTol: isNumber,
    // we could conceptually allow Fraction for the following
    // numberApproximate option, but that would involve rational approximation
    // algorithms that we do not currently have implemented (see, for example,
    // https://www.ams.org/journals/mcom/1995-64-211/S0025-5718-1995-1297479-9/S0025-5718-1995-1297479-9.pdf
    numberApproximate: ['number', 'BigNumber'],
    randomSeed: isStringOrNull,
    uniformType: [true, false],
    BigNumber: {
      precision: Number.isInteger
    },
    Matrix: {
      defaultType: ['Array', 'Matrix']
    }
  },
  parse: {
    number: ['bigint', 'BigNumber', 'Fraction', 'number'],
    numberFallback: ['BigNumber', 'Fraction', 'number']
  }
}
