'use strict'

import { createAlgorithm01 } from './utils/algorithm01'
import { createAlgorithm02 } from './utils/algorithm02'
import { createAlgorithm03 } from './utils/algorithm03'
import { createAlgorithm04 } from './utils/algorithm04'
import { createAlgorithm05 } from './utils/algorithm05'
import { createAlgorithm06 } from './utils/algorithm06'
import { createAlgorithm07 } from './utils/algorithm07'
import { createAlgorithm08 } from './utils/algorithm08'
import { createAlgorithm09 } from './utils/algorithm09'
import { createAlgorithm10 } from './utils/algorithm10'
import { createAlgorithm11 } from './utils/algorithm11'
import { createAlgorithm12 } from './utils/algorithm12'
import { createAlgorithm13 } from './utils/algorithm13'
import { createAlgorithm14 } from './utils/algorithm14'
import { createMatrixClass } from './Matrix'
import { createDenseMatrixClass } from './DenseMatrix'
import { createSparseMatrixClass } from './SparseMatrix'
import { createImmutableDenseMatrixClass } from './ImmutableDenseMatrix'
import { createMatrix } from './function/matrix'

module.exports = [
  // types
  createMatrixClass,
  createDenseMatrixClass,
  createSparseMatrixClass,
  require('./Spa'),
  require('./FibonacciHeap'),
  createImmutableDenseMatrixClass,
  require('./MatrixIndex'),
  require('./Range'),

  // construction functions
  require('./function/index'),
  createMatrix,
  require('./function/sparse'),

  // util functions
  createAlgorithm01,
  createAlgorithm02,
  createAlgorithm03,
  createAlgorithm04,
  createAlgorithm05,
  createAlgorithm06,
  createAlgorithm07,
  createAlgorithm08,
  createAlgorithm09,
  createAlgorithm10,
  createAlgorithm11,
  createAlgorithm12,
  createAlgorithm13,
  createAlgorithm14
]
