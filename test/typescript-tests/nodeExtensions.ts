import { expectTypeOf } from 'expect-type'
import { MathNode, MathNodeCommon, ConstantNode, Node } from 'mathjs'

declare module 'mathjs' {
  type MyNode = BaseNode

  interface MathNodeTypes {
    MyNode: MyNode
  }
}

/*
MathNode examples
*/
{
  class CustomNode extends Node {
    a: MathNode
    constructor(a: MathNode) {
      super()
      this.a = a
    }
  }

  // Basic node
  const instance1 = new Node()

  // Built-in subclass of Node
  const instance2 = new ConstantNode(2)

  // Custom subclass of node
  const instance3 = new CustomNode(new ConstantNode(2))

  expectTypeOf(instance1).toMatchTypeOf<MathNode>()
  expectTypeOf(instance1).toMatchTypeOf<MathNodeCommon>()

  expectTypeOf(instance2).toMatchTypeOf<MathNode>()
  expectTypeOf(instance2).toMatchTypeOf<MathNodeCommon>()
  expectTypeOf(instance2).toMatchTypeOf<ConstantNode>()

  expectTypeOf(instance3).toMatchTypeOf<MathNode>()
  expectTypeOf(instance3).toMatchTypeOf<MathNodeCommon>()
  expectTypeOf(instance3).toMatchTypeOf<CustomNode>()
}
