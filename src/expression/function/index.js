'use strict'

import { createParse } from './parse'
import { createCompile } from './compile'
import { createHelp } from './help'
import { createEvaluate } from './evaluate'
import { createParser } from './parser'
import { createDeprecatedEval } from './eval'

console.log('This index file is deprecated since v6.0.0. Please use factory.js instead')

export default [
  createCompile,
  createEvaluate,
  createDeprecatedEval,
  createHelp,
  createParse,
  createParser
]
