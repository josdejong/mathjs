'use strict'

import { createAccessorNode } from './AccessorNode'
import { createArrayNode } from './ArrayNode'
import { createAssignmentNode } from './AssignmentNode'
import { createBlockNode } from './BlockNode'
import { createConditionalNode } from './ConditionalNode'
import { createConstantNode } from './ConstantNode'
import { createFunctionAssignmentNode } from './FunctionAssignmentNode'
import { createFunctionNode } from './FunctionNode'
import { createIndexNode } from './IndexNode'
import { createNode } from './Node'
import { createObjectNode } from './ObjectNode'
import { createOperatorNode } from './OperatorNode'
import { createParenthesisNode } from './ParenthesisNode'
import { createRangeNode } from './RangeNode'
import { createRelationalNode } from './RelationalNode'
import { createSymbolNode } from './SymbolNode'

console.log('This index file is deprecated since v6.0.0. Please use factory.js instead')

export default [
  createAccessorNode,
  createArrayNode,
  createAssignmentNode,
  createBlockNode,
  createConditionalNode,
  createConstantNode,
  createFunctionAssignmentNode,
  createFunctionNode,
  createIndexNode,
  createNode,
  createObjectNode,
  createOperatorNode,
  createParenthesisNode,
  createRangeNode,
  createRelationalNode,
  createSymbolNode
]
