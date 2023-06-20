export const evaluateDocs = {
  name: 'evaluate',
  category: 'Expression',
  syntax: [
    'evaluate(expression)',
    'evaluate([expr1, expr2, expr3, ...])'
  ],
  description: 'Evaluate an expression or an array with expressions.',
  examples: [
    'evaluate("2 + 3")',
    'evaluate(concat("sqrt(", string(4), ")"))'
  ],
  seealso: []
}
