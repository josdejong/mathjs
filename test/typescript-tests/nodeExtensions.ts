import { expectTypeOf } from 'expect-type'
import {
  MathNode,
  BaseNode,
  MathNodeCommon,
  ConstantNode,
  Node,
  FunctionAssignmentNode,
} from 'mathjs'

interface MyNode extends BaseNode {
  type: 'MyNode'
  a: MathNode
}
declare module 'mathjs' {
  interface MathNodeTypes {
    MyNode: MyNode
  }
}

/*
MathNode examples
*/
{
  class CustomNode extends Node implements MyNode {
    a: MathNode
    type: 'MyNode'
    constructor(a: MathNode) {
      super()
      this.a = a
    }
  }

  // Built-in subclass of Node
  const instance1 = new ConstantNode(2)

  // Custom subclass of node
  const instance2 = new CustomNode(new ConstantNode(2))

  expectTypeOf(instance1).toMatchTypeOf<MathNode>()
  expectTypeOf(instance1).toMatchTypeOf<MathNodeCommon>()
  expectTypeOf(instance1).toMatchTypeOf<ConstantNode>()

  expectTypeOf(instance2).toMatchTypeOf<MathNode>()
  expectTypeOf(instance2).toMatchTypeOf<MathNodeCommon>()
  expectTypeOf(instance2).toMatchTypeOf<CustomNode>()

  let instance3: MathNode
  if (instance3.type === 'FunctionAssignmentNode') {
    expectTypeOf(instance3).toMatchTypeOf<FunctionAssignmentNode>()
  }
}
