export const parseDocs = {
  name: 'parse',
  category: 'Expression',
  syntax: [
    'node1 = parse(expression)',
    'node1.compile().evaluate()'
  ],
  description: 'Parse an expression. Returns a node tree, which can be evaluated by invoking node.evaluate().',
  examples: [
    'node1 = parse("sqrt(3^2 + 4^2)")',
    'node1.compile().evaluate()',
    'node2 = parse("a * b")',
    'node2.compile().evaluate({a:3, b:4})'
  ],
  seealso: ['parser', 'evaluate', 'compile']
}
