export const concatDocs = {
  name: 'concat',
  category: 'Matrix',
  syntax: [
    'concat(A, B, ...)',
    'concat(A, B, ..., dim)',
    'concat(str1, str2, ...)'
  ],
  description: 'Concatenate two or more arrays/matrices, or two or more strings; one input is also accepted. Only arrays/matrices take an optional final dimension (one-based; default: last).',
  examples: [
    'A = [1, 2; 5, 6]',
    'B = [3, 4; 7, 8]',
    'concat(A, B)',
    'concat(A, B, 1)',
    'concat(A, B, 2)',
    'concat("hello", " ", "world")'
  ],
  seealso: [
    'det', 'diag', 'identity', 'inv', 'ones', 'range', 'size', 'squeeze', 'subset', 'trace', 'transpose', 'zeros'
  ]
}
