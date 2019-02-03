'use strict'

import functions from './function'
import node from './node'
import { createParse } from './parse'
import transform from './transform'
import { embeddedDocs } from './embeddedDocs/embeddedDocs'
import { createHelpClass } from './Help'
import { createParserClass } from './Parser'
import { factory } from '../utils/factory'

console.log('This index file is deprecated since v6.0.0. Please use factory.js instead')

export default [
  // Note that the docs folder is called "embeddedDocs" and not "docs" to prevent issues
  // with yarn autoclean. See https://github.com/josdejong/mathjs/issues/969
  factory('expression.docs', [], () => embeddedDocs),
  functions,
  node,
  transform,

  createHelpClass,
  createParse,
  createParserClass
]
