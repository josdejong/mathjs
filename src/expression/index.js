'use strict'

import functions from './function'
import node from './node'
import { createParseExpression } from './parse'
import { createEmbeddedDocs } from './embeddedDocs'

export default [
  // Note that the docs folder is called "embeddedDocs" and not "docs" to prevent issues
  // with yarn autoclean. See https://github.com/josdejong/mathjs/issues/969
  createEmbeddedDocs,
  functions,
  node,
  require('./transform'),

  require('./Help'),
  createParseExpression,
  require('./Parser')
]
