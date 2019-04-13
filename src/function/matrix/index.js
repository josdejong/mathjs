'use strict'

import { createGetMatrixDataType } from './getMatrixDataType'
import { createIdentity } from './identity'
import { createInv } from './inv'
import { createColumn } from './column'
import { createConcat } from './concat'
import { createCross } from './cross'
import { createCtranspose } from './ctranspose'
import { createDet } from './det'
import { createDiag } from './diag'
import { createDot } from './dot'
import { createEye } from './eye'
import { createExpm } from './expm'
import { createFilter } from './filter'
import { createFlatten } from './flatten'
import { createForEach } from './forEach'
import { createKron } from './kron'
import { createMap } from './map'
import { createOnes } from './ones'
import { createPartitionSelect } from './partitionSelect'
import { createRange } from './range'
import { createReshape } from './reshape'
import { createResize } from './resize'
import { createRow } from './row'
import { createSize } from './size'
import { createSort } from './sort'
import { createSqrtm } from './sqrtm'
import { createSqueeze } from './squeeze'
import { createSubset } from './subset'
import { createTranspose } from './transpose'
import { createZeros } from './zeros'
import { createTrace } from './trace'
import { createApply } from './apply'

console.log('This index file is deprecated since v6.0.0. Please use factory.js instead')

export default [
  createApply,
  createColumn,
  createConcat,
  createCross,
  createCtranspose,
  createDet,
  createDiag,
  createDot,
  createEye,
  createExpm,
  createFilter,
  createFlatten,
  createForEach,
  createIdentity,
  createInv,
  createKron,
  createMap,
  createOnes,
  createPartitionSelect,
  createRange,
  createReshape,
  createResize,
  createRow,
  createSize,
  createSort,
  createSqrtm,
  createSqueeze,
  createSubset,
  createTrace,
  createTranspose,
  createZeros,
  createGetMatrixDataType
]
