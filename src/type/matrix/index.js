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
