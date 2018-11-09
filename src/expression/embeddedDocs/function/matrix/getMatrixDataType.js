export const getMatrixDataTypeDocs = {
  'name': 'getMatrixDataType',
  'category': 'Matrix',
  'syntax': [
    'getMatrixDataType(x)'
  ],
  'description': 'Find the data type of all elements in a matrix or array, ' +
  'for example "number" if all items are a number ' +
  'and "Complex" if all values are complex numbers. ' +
  'If a matrix contains more than one data type, it will return "mixed".',
  'examples': [
    'getMatrixDataType([1, 2, 3])',
    'getMatrixDataType([[5 cm], [2 inch]])',
    'getMatrixDataType([1, "text"])',
    'getMatrixDataType([1, bignumber(4)])'
  ],
  'seealso': ['matrix', 'sparse', 'typeOf']
}
