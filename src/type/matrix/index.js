'use strict'

import { createDenseMatrixClass } from './DenseMatrix'
import { createFibonacciHeapClass } from './FibonacciHeap'
import { createMatrixClass } from './Matrix'
import { createIndexClass } from './MatrixIndex'
import { createRangeClass } from './Range'
import { createSpaClass } from './Spa'
import { createSparseMatrixClass } from './SparseMatrix'
import { createImmutableDenseMatrixClass } from './ImmutableDenseMatrix'
import { createIndex } from './function/index'
import { createMatrix } from './function/matrix'
import { createSparse } from './function/sparse'

console.log('This index file is deprecated since v6.0.0. Please use factory.js instead')

export default [
  // types
  createMatrixClass,
  createDenseMatrixClass,
  createSparseMatrixClass,
  createSpaClass,
  createFibonacciHeapClass,
  createImmutableDenseMatrixClass,
  createIndexClass,
  createRangeClass,

  // construction functions
  createIndex,
  createMatrix,
  createSparse
]
