'use strict'
import { createMad } from './mad'
import { createMax } from './max'
import { createMean } from './mean'
import { createMedian } from './median'
import { createMin } from './min'
import { createMode } from './mode'
import { createProd } from './prod'
import { createQuantileSeq } from './quantileSeq'
import { createStd } from './std'
import { createSum } from './sum'
import { createDeprecatedVar, createVariance } from './variance'

export default [
  createMad,
  createMax,
  createMean,
  createMedian,
  createMin,
  createMode,
  createProd,
  createQuantileSeq,
  createStd,
  createSum,
  createVariance,
  createDeprecatedVar
]
