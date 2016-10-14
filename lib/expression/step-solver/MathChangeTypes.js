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
  CONVERT_INTEGER_TO_FRACTION: 'Change the number to a fraction with the same denominator',

  SWAP_SIDES: 'swap sides',
  ADD_TO_BOTH_SIDES: 'Adding term to both sides',
  SUBTRACT_FROM_BOTH_SIDES: 'Subtracting term from both sides',
  MULTIPLY_TO_BOTH_SIDES: 'Multiplying term to both sides',
  DIVIDE_FROM_BOTH_SIDES: 'Dividing term from both sides',
  MULTIPLY_BOTH_SIDES_BY_INVERSE_FRACTION: 'Multiply both sides by inverse of the fraction',
  MULTIPLE_BOTH_SIDES_BY_NEGATIVE_ONE: 'Multiply both sides by -1',

  STATEMENT_IS_TRUE: 'The statement is True',
  STATEMENT_IS_FALSE: 'The statement is False',
}
