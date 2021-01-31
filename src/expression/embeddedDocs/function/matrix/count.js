export const countDocs = {
  name: 'count',
  category: 'Matrix',
  syntax: [
    'count(x)'
  ],
  description: 'Count the number of elements of a matrix, array or string.',
  examples: [
    'a = [1, 2; 3, 4; 5, 6]',
    'count(a)',
    'size(a)',
    'count("hello world")'
  ],
  seealso: [
    'size'
  ]
}
