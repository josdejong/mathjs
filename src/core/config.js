export const DEFAULT_CONFIG = {
  // minimum relative difference between two compared values,
  // used by all comparison functions
  relTol: 1e-12,

  // minimum absolute difference between two compared values,
  // used by all comparison functions
  absTol: 1e-15,

  // type of default matrix output. Choose 'matrix' (default) or 'array'
  matrix: 'Matrix',

  // type of default number output. Choose 'number' (default) 'BigNumber', 'bigint', or 'Fraction'
  number: 'number',

  // type of fallback used for config { number: 'bigint' } when a value cannot be represented
  // in the configured numeric type. Choose 'number' (default) or 'BigNumber'.
  numberFallback: 'number',

  // number of significant digits in BigNumbers
  precision: 64,

  // predictable output type of functions. When true, output type depends only
  // on the input types. When false (default), output type can vary depending
  // on input values. For example `math.sqrt(-4)` returns `complex('2i')` when
  // predictable is false, and returns `NaN` when true.
  predictable: false,

  // random seed for seeded pseudo random number generation
  // null = randomly seed
  randomSeed: null,

  // legacy behavior for matrix subset. When true, the subset function
  // returns a matrix or array with the same size as the index (except for scalars).
  // When false, it returns a matrix or array with a size depending on the type of index.
  legacySubset: false
}
