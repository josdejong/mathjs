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

console.log('This index file is deprecated since v6.0.0. Please use factory.js instead')

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
