// The text to identify rules for each possible step that can be taken

module.exports = {
  NO_CHANGE: 'No change',

  REMOVE_PARENS: 'Remove unnecessary brackets',
  COLLECT_LIKE_TERMS: 'Collect like terms',

  ADD_POLYNOMIAL_TERMS: 'Add terms together',
  MULT_POLYNOMIAL_TERMS: 'Multiply terms together',
  MULT_POLY_BY_CONST: 'Multiply term by a number',

  SIMPLIFY_ARITHMETIC: 'Evaluate math operation',
  SIMPLIFY_DIVISION: 'Simplify chain of division',
  RESOLVE_ADD_UNARY_MINUS: 'Simplify + - to -',
  RESOLVE_DOUBLE_UNARY_MINUS: '- - cancels out',
  DIVSION_BY_NEG_ONE: 'Divide by -1 to make it negative',
  DIVSION_BY_ONE: 'Divide by 1 by getting rid of the 1',

  DISTRIBUTE_NEG_ONE: 'Distribute negative sign into the parentheses',
  DISTRIBUTE: 'Distribute',

  COMMON_DENOMINATOR: 'Make all the denominators the same as the LCD',
  SIMPLIFY_FRACTION: 'Simplify the fraction',
  ADD_FRACTIONS: 'Add fractions together',
  MULTIPLY_FRACTIONS: 'Multiply fractions together',
  CONVERT_INTEGER_TO_FRACTION: 'Change the number to a fraction with the same denominator'

}
