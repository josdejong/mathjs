export const typedDocs = {
  name: 'typed',
  category: 'Core',
  syntax: [
    'typed(signatures)',
    'typed(name, signatures)'
  ],
  description: 'Create a typed function.',
  examples: [
    'double = typed({ "number": f(x)=x+x, "string": f(x)=concat(x,x) })',
    'double(2)',
    'double("hello")'
  ],
  seealso: []
}
