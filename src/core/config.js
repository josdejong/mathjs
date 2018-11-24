export const DEFAULT_CONFIG = {
  // minimum relative difference between two compared values,
  // used by all comparison functions
  epsilon: 1e-12,

  // type of default matrix output. Choose 'matrix' (default) or 'array'
  matrix: 'Matrix',

  // type of default number output. Choose 'number' (default) 'BigNumber', or 'Fraction
  number: 'number',

  // number of significant digits in BigNumbers
  precision: 64,

  // predictable output type of functions. When true, output type depends only
  // on the input types. When false (default), output type can vary depending
  // on input values. For example `math.sqrt(-4)` returns `complex('2i')` when
  // predictable is false, and returns `NaN` when true.
  predictable: false,

  // random seed for seeded pseudo random number generation
  // null = randomly seed
  randomSeed: null
}
