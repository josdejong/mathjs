export const evaluateDocs = {
  name: 'evaluate',
  category: 'Expression',
  syntax: [
    'evaluate(expression)',
    'evaluate(expression, scope)',
    'evaluate([expr1, expr2, expr3, ...])',
    'evaluate([expr1, expr2, expr3, ...], scope)'
  ],
  description: 'Evaluate an expression or an array with expressions.',
  examples: [
    'evaluate("2 + 3")',
    'evaluate("sqrt(16)")',
    'evaluate("2 inch to cm")',
    'evaluate("sin(x * pi)", { "x": 1/2 })',
    'evaluate(["width=2", "height=4","width*height"])'
  ],
  seealso: ['parser', 'parse', 'compile']
}
