'use strict'

import { createGetMatrixDataType } from './getMatrixDataType'
import { createIdentity } from './identity'
import { createInv } from './inv'

module.exports = [
  require('./concat'),
  require('./cross'),
  require('./ctranspose'),
  require('./det'),
  require('./diag'),
  require('./dot'),
  require('./eye'),
  require('./expm'),
  require('./filter'),
  require('./flatten'),
  require('./forEach'),
  createIdentity,
  createInv,
  require('./kron'),
  require('./map'),
  require('./ones'),
  require('./partitionSelect'),
  require('./range'),
  require('./reshape'),
  require('./resize'),
  require('./size'),
  require('./sort'),
  require('./sqrtm'),
  require('./squeeze'),
  require('./subset'),
  require('./trace'),
  require('./transpose'),
  require('./zeros'),
  createGetMatrixDataType
]
