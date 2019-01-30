'use strict'

import { createArg } from './arg'
import { createConj } from './conj'
import { createIm } from './im'
import { createRe } from './re'

console.log('This index file is deprecated since v6.0.0. Please use factory.js instead')

export default [
  createArg,
  createConj,
  createIm,
  createRe
]
