export const parserDocs = {
  name: 'parser',
  category: 'Expression',
  syntax: [
    'myParser = parser()',
    'myParser.set(name, value)',
    'myParser.get(name)',
    'myParser.evaluate(expression)',
    'myParser.evaluate([expr1, expr2, expr3, ...])'
  ],
  description: 'Create a parser. The function creates a new math.Parser object.',
  examples: [
    'myParser = parser()',
    'myParser.evaluate("sqrt(3^2 + 4^2)")',
    'myParser.set("x", 3)',
    'myParser.evaluate("y = x + 3")',
    'myParser.get("y")'
  ],
  seealso: ['evaluate', 'parse', 'compile']
}
