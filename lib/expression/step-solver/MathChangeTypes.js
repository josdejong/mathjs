// The text to identify rules for each possible step that can be taken

module.exports = {
  NO_CHANGE: 'no change',

  REMOVE_PARENS: 'remove unnecessary parens',
  COLLECT_LIKE_TERMS: 'collect like terms',

  ADD_POLYNOMIAL_TERMS: 'add polynomial terms',
  MULT_POLYNOMIAL_TERMS: 'multiply polynomial terms',
  MULT_POLY_BY_CONST: 'multiply polynomial term by constant',
  DIVIDE_POLY_TERM: 'simplify fraction coefficient of a polynomial term',

  SIMPLIFY_ARITHMETIC: 'simplify arithmetic operation',
  SIMPLIFY_DIVISION: 'simplify division',
  RESOLVE_ADD_UNARY_MINUS: 'resolve adding unary minus: + -  --> -',
  RESOLVE_DOUBLE_UNARY_MINUS: 'resolve subtracting unary minus: - - cancels out',
  DIVSION_BY_NEG_ONE: 'divide by negative one',
  DIVSION_BY_ONE: 'divide by one',

  DISTRIBUTE_NEG_ONE: 'distribute negative one',
  DISTRIBUTE: 'distribute',

  COMMON_DENOMINATOR: 'make all the denominators the same as the LCD',
  ADD_FRACTIONS: 'add fractions together',
  MULTIPLY_FRACTIONS: 'multiply fractions together',

}
