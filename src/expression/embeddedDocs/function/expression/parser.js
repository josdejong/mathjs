export const parserDocs = {
  name: 'parser',
  category: 'Expression',
  syntax: [
    'parser()'
  ],
  description: 'Create a parser object that keeps a context of variables and their values, allowing the evaluation of expressions in that context.',
  examples: [
    'myParser = parser()',
    'myParser.evaluate("sqrt(3^2 + 4^2)")',
    'myParser.set("x", 3)',
    'myParser.evaluate("y = x + 3")',
    'myParser.evaluate(["y = x + 3", "y = y + 1"])',
    'myParser.get("y")'
  ],
  seealso: ['evaluate', 'parse', 'compile']
}
