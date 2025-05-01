export const compileDocs = {
  name: 'compile',
  category: 'Expression',
  syntax: [
    'compile(expr) ',
    'compile([expr1, expr2, expr3, ...])'
  ],
  description: 'Parse and compile an expression. Returns a an object with a function evaluate([scope]) to evaluate the compiled expression.',
  examples: [
    'code1 = compile("sqrt(3^2 + 4^2)")',
    'code1.evaluate() ',
    'code2 = compile("a * b")',
    'code2.evaluate({a: 3, b: 4})'
  ],
  seealso: ['parser', 'parse', 'evaluate']
}
