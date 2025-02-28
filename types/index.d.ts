import { Decimal } from 'decimal.js'
import { Fraction } from 'fraction.js'

export { Fraction }

export as namespace math

export type NoLiteralType<T> = T extends number
  ? number
  : T extends string
    ? string
    : T extends boolean
      ? boolean
      : T

export type MathNumericType = number | BigNumber | bigint | Fraction | Complex
export type MathScalarType = MathNumericType | Unit
export type MathGeneric<T extends MathScalarType = MathNumericType> = T
export type MathArray<T = MathGeneric> = T[] | Array<MathArray<T>>
export type MathCollection<T = MathGeneric> = MathArray<T> | Matrix<T>
export type MathType = MathScalarType | MathCollection
export type MathExpression = string | string[] | MathCollection

// add type for Matrix Callback Function and Matrix Storage Format
export type MatrixStorageFormat = 'dense' | 'sparse'
export type MatrixFromFunctionCallback<T extends MathScalarType> = (
  index: number[]
) => T

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FactoryFunction<T> = (scope: any) => T

// FactoryFunctionMap can be nested; all nested objects will be flattened
export interface FactoryFunctionMap {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: FactoryFunction<any> | FactoryFunctionMap
}

/** Available options for parse */
export interface ParseOptions {
  /** a set of custom nodes */
  nodes?: Record<string, MathNode>
}
/**
 * Parse an expression. Returns a node tree, which can be evaluated by
 * invoking node.evaluate().
 *
 * Note the evaluating arbitrary expressions may involve security risks,
 * see [https://mathjs.org/docs/expressions/security.html](https://mathjs.org/docs/expressions/security.html) for more information.
 *
 * Syntax:
 *
 *     math.parse(expr)
 *     math.parse(expr, options)
 *     math.parse([expr1, expr2, expr3, ...])
 *     math.parse([expr1, expr2, expr3, ...], options)
 *
 * Example:
 *
 *     const node1 = math.parse('sqrt(3^2 + 4^2)')
 *     node1.compile().evaluate() // 5
 *
 *     let scope = {a:3, b:4}
 *     const node2 = math.parse('a * b') // 12
 *     const code2 = node2.compile()
 *     code2.evaluate(scope) // 12
 *     scope.a = 5
 *     code2.evaluate(scope) // 20
 *
 *     const nodes = math.parse(['a = 3', 'b = 4', 'a * b'])
 *     nodes[2].compile().evaluate() // 12
 *
 * See also:
 *
 *     evaluate, compile
 */
export interface ParseFunction {
  /**
   * Parse an expression. Returns a node tree, which can be evaluated by
   * invoking node.evaluate();
   *
   * @param expr Expression to be parsed
   * @param options Available options
   * @returns A node
   */
  (expr: MathExpression, options?: ParseOptions): MathNode

  /**
   * Parse an expression. Returns a node tree, which can be evaluated by
   * invoking node.evaluate();
   *
   * @param exprs Expressions to be parsed
   * @param options Available options
   * @returns An array of nodes
   */
  (exprs: MathExpression[], options?: ParseOptions): MathNode[]

  /**
   * Checks whether the current character `c` is a valid alpha character:
   *
   * - A latin letter (upper or lower case) Ascii: a-z, A-Z
   * - An underscore                        Ascii: _
   * - A dollar sign                        Ascii: $
   * - A latin letter with accents          Unicode: \u00C0 - \u02AF
   * - A greek letter                       Unicode: \u0370 - \u03FF
   * - A mathematical alphanumeric symbol   Unicode: \u{1D400} - \u{1D7FF} excluding invalid code points
   *
   * The previous and next characters are needed to determine whether
   * this character is part of a unicode surrogate pair.
   *
   * @param c      Current character in the expression
   * @param cPrev  Previous character
   * @param cNext  Next character
   */
  isAlpha(c: string, cPrev: string, cNext: string): boolean
  /**
   * Test whether a character is a valid latin, greek, or letter-like character
   *
   * @param c
   */
  isValidLatinOrGreek(c: string): boolean
  /**
   * Test whether two given 16 bit characters form a surrogate pair of a
   * unicode math symbol.
   *
   * https://unicode-table.com/en/
   * https://www.wikiwand.com/en/Mathematical_operators_and_symbols_in_Unicode
   *
   * Note: In ES6 will be unicode aware:
   * https://stackoverflow.com/questions/280712/javascript-unicode-regexes
   * https://mathiasbynens.be/notes/es6-unicode-regex
   *
   * @param high
   * @param low
   */
  isValidMathSymbol(high: string, low: string): boolean
  /**
   * Check whether given character c is a white space character: space, tab, or enter
   *
   * @param c
   * @param nestingLevel
   */
  isWhitespace(c: string, nestingLevel: number): boolean
  /**
   * Test whether the character c is a decimal mark (dot).
   * This is the case when it's not the start of a delimiter '.*', './', or '.^'
   *
   * @param  c
   * @param  cNext
   */
  isDecimalMark(c: string, cNext: string): boolean
  /**
   * checks if the given char c is a digit or dot
   *
   * @param  c   a string with one character
   */
  isDigitDot(c: string): boolean
  /**
   * checks if the given char c is a digit
   *
   * @param  c   a string with one character
   */
  isDigit(c: string): boolean
  /**
   * checks if the given char c is a hex digit
   *
   * @param c   a string with one character
   */
  isHexDigit(c: string): boolean
}

export interface NodeCtor {
  new (): MathNode
}

export interface AccessorNode<TObject extends MathNode = MathNode>
  extends MathNode {
  type: 'AccessorNode'
  isAccessorNode: true
  object: TObject
  index: IndexNode
  name: string
}
export interface AccessorNodeCtor {
  new <TObject extends MathNode = MathNode>(
    object: TObject,
    index: IndexNode
  ): AccessorNode<TObject>
}

export interface ArrayNode<TItems extends MathNode[] = MathNode[]>
  extends MathNode {
  type: 'ArrayNode'
  isArrayNode: true
  items: [...TItems]
}
export interface ArrayNodeCtor {
  new <TItems extends MathNode[] = MathNode[]>(
    items: [...TItems]
  ): ArrayNode<TItems>
}

export interface AssignmentNode<TValue extends MathNode = MathNode>
  extends MathNode {
  type: 'AssignmentNode'
  isAssignmentNode: true
  object: SymbolNode | AccessorNode
  index: IndexNode | null
  value: TValue
  name: string
}
export interface AssignmentNodeCtor {
  new <TValue extends MathNode = MathNode>(
    object: SymbolNode,
    value: TValue
  ): AssignmentNode<TValue>
  new <TValue extends MathNode = MathNode>(
    object: SymbolNode | AccessorNode,
    index: IndexNode,
    value: TValue
  ): AssignmentNode<TValue>
}

export interface BlockNode<TNode extends MathNode = MathNode> extends MathNode {
  type: 'BlockNode'
  isBlockNode: true
  blocks: Array<{ node: TNode; visible: boolean }>
}
export interface BlockNodeCtor {
  new <TNode extends MathNode = MathNode>(
    arr: Array<{ node: TNode } | { node: TNode; visible: boolean }>
  ): BlockNode
}

export interface ConditionalNode<
  TCond extends MathNode = MathNode,
  TTrueNode extends MathNode = MathNode,
  TFalseNode extends MathNode = MathNode
> extends MathNode {
  type: 'ConditionalNode'
  isConditionalNode: boolean
  condition: TCond
  trueExpr: TTrueNode
  falseExpr: TFalseNode
}
export interface ConditionalNodeCtor {
  new <
    TCond extends MathNode = MathNode,
    TTrueNode extends MathNode = MathNode,
    TFalseNode extends MathNode = MathNode
  >(
    condition: TCond,
    trueExpr: TTrueNode,
    falseExpr: TFalseNode
  ): ConditionalNode
}

export interface ConstantNode<
  TValue extends
    | string
    | number
    | boolean
    | null
    | undefined
    | bigint
    | BigNumber
    | Fraction = number
> extends MathNode {
  type: 'ConstantNode'
  isConstantNode: true
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: TValue
}

export interface ConstantNodeCtor {
  new <
    TValue extends
      | string
      | number
      | boolean
      | null
      | undefined
      | bigint
      | BigNumber
      | Fraction = string
  >(
    value: TValue
  ): ConstantNode<TValue>
}

export interface FunctionAssignmentNode<TExpr extends MathNode = MathNode>
  extends MathNode {
  type: 'FunctionAssignmentNode'
  isFunctionAssignmentNode: true
  name: string
  params: string[]
  expr: TExpr
}
export interface FunctionAssignmentNodeCtor {
  new <TExpr extends MathNode = MathNode>(
    name: string,
    params: string[],
    expr: TExpr
  ): FunctionAssignmentNode<TExpr>
}

export interface FunctionNode<
  TFn = SymbolNode,
  TArgs extends MathNode[] = MathNode[]
> extends MathNode {
  type: 'FunctionNode'
  isFunctionNode: true
  fn: TFn
  args: [...TArgs]
}
export interface FunctionNodeCtor {
  new <TFn = SymbolNode, TArgs extends MathNode[] = MathNode[]>(
    fn: TFn,
    args: [...TArgs]
  ): FunctionNode<TFn, TArgs>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUndefinedFunction: (name: string) => any
}

export interface IndexNode<TDims extends MathNode[] = MathNode[]>
  extends MathNode {
  type: 'IndexNode'
  isIndexNode: true
  dimensions: [...TDims]
  dotNotation: boolean
}
export interface IndexNodeCtor {
  new <TDims extends MathNode[] = MathNode[]>(dimensions: [...TDims]): IndexNode
  new <TDims extends MathNode[] = MathNode[]>(
    dimensions: [...TDims],
    dotNotation: boolean
  ): IndexNode<TDims>
}

export interface ObjectNode<
  TProps extends Record<string, MathNode> = Record<string, MathNode>
> extends MathNode {
  type: 'ObjectNode'
  isObjectNode: true
  properties: TProps
}
export interface ObjectNodeCtor {
  new <TProps extends Record<string, MathNode> = Record<string, MathNode>>(
    properties: TProps
  ): ObjectNode<TProps>
}

export type OperatorNodeMap = {
  xor: 'xor'
  and: 'and'
  or: 'or'
  bitOr: '|'
  bitXor: '^|'
  bitAnd: '&'
  equal: '=='
  unequal: '!='
  smaller: '<'
  larger: '>'
  smallerEq: '<='
  largerEq: '>='
  leftShift: '<<'
  rightArithShift: '>>'
  rightLogShift: '>>>'
  to: 'to'
  add: '+'
  subtract: '-'
  multiply: '*'
  divide: '/'
  dotMultiply: '.*'
  dotDivide: './'
  mod: 'mod'
  unaryPlus: '+'
  unaryMinus: '-'
  bitNot: '~'
  not: 'not'
  pow: '^'
  dotPow: '.^'
  factorial: '!'
}

export type OperatorNodeOp = OperatorNodeMap[keyof OperatorNodeMap]
export type OperatorNodeFn = keyof OperatorNodeMap

export interface OperatorNode<
  TOp extends OperatorNodeMap[TFn] = never,
  TFn extends OperatorNodeFn = never,
  TArgs extends MathNode[] = MathNode[]
> extends MathNode {
  type: 'OperatorNode'
  isOperatorNode: true
  op: TOp
  fn: TFn
  args: [...TArgs]
  implicit: boolean
  isUnary(): boolean
  isBinary(): boolean
}

export interface OperatorNodeCtor extends MathNode {
  new <
    TOp extends OperatorNodeMap[TFn],
    TFn extends OperatorNodeFn,
    TArgs extends MathNode[]
  >(
    op: TOp,
    fn: TFn,
    args: [...TArgs],
    implicit?: boolean
  ): OperatorNode<TOp, TFn, TArgs>
}
export interface ParenthesisNode<TContent extends MathNode = MathNode>
  extends MathNode {
  type: 'ParenthesisNode'
  isParenthesisNode: true
  content: TContent
}
export interface ParenthesisNodeCtor {
  new <TContent extends MathNode>(content: TContent): ParenthesisNode<TContent>
}

export interface RangeNode<
  TStart extends MathNode = MathNode,
  TEnd extends MathNode = MathNode,
  TStep extends MathNode = MathNode
> extends MathNode {
  type: 'RangeNode'
  isRangeNode: true
  start: TStart
  end: TEnd
  step: TStep | null
}
export interface RangeNodeCtor {
  new <
    TStart extends MathNode = MathNode,
    TEnd extends MathNode = MathNode,
    TStep extends MathNode = MathNode
  >(
    start: TStart,
    end: TEnd,
    step?: TStep
  ): RangeNode<TStart, TEnd, TStep>
}

export interface RelationalNode<TParams extends MathNode[] = MathNode[]>
  extends MathNode {
  type: 'RelationalNode'
  isRelationalNode: true
  conditionals: string[]
  params: [...TParams]
}
export interface RelationalNodeCtor {
  new <TParams extends MathNode[] = MathNode[]>(
    conditionals: string[],
    params: [...TParams]
  ): RelationalNode<TParams>
}

export interface SymbolNode extends MathNode {
  type: 'SymbolNode'
  isSymbolNode: true
  name: string
}
export interface SymbolNodeCtor {
  new (name: string): SymbolNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUndefinedSymbol: (name: string) => any
}

/**
 * @deprecated since version 11.3. Prefer `MathNode` instead
 */
export type MathNodeCommon = MathNode

export type MathJsFunctionName = keyof MathJsInstance

export interface LUDecomposition {
  L: MathCollection
  U: MathCollection
  p: number[]
}

export interface SLUDecomposition extends LUDecomposition {
  q: number[]
}

export interface QRDecomposition {
  Q: MathCollection
  R: MathCollection
}

export interface SchurDecomposition {
  U: MathCollection
  T: MathCollection
}

export interface FractionDefinition {
  a: number
  b: number
}

export interface MathJsInstance extends MathJsFactory {
  e: number
  pi: number
  i: number
  Infinity: number
  LN2: number
  LN10: number
  LOG2E: number
  LOG10E: number
  NaN: number
  phi: number
  SQRT1_2: number
  SQRT2: number
  tau: number

  // Class-like constructors
  Node: NodeCtor
  AccessorNode: AccessorNodeCtor
  ArrayNode: ArrayNodeCtor
  AssignmentNode: AssignmentNodeCtor
  BlockNode: BlockNodeCtor
  ConditionalNode: ConditionalNodeCtor
  ConstantNode: ConstantNodeCtor
  FunctionAssignmentNode: FunctionAssignmentNodeCtor
  FunctionNode: FunctionNodeCtor
  IndexNode: IndexNodeCtor
  ObjectNode: ObjectNodeCtor
  OperatorNode: OperatorNodeCtor
  ParenthesisNode: ParenthesisNodeCtor
  RangeNode: RangeNodeCtor
  RelationalNode: RelationalNodeCtor
  SymbolNode: SymbolNodeCtor

  Unit: UnitCtor
  Matrix: MatrixCtor

  /**
   * If null were to be included in this interface, it would be
   * auto-suggested as an import in VSCode. This causes issues because
   * `null` is not a valid label.
   *
   * @see https://github.com/josdejong/mathjs/issues/2019
   */
  // null: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  uninitialized: any
  version: string

  expression: MathNode

  /**
   * Returns reviver function that can be used as reviver in JSON.parse function.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reviver(): (key: any, value: any) => any

  /**
   * Returns replacer function that can be used as replacer in JSON.stringify function.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  replacer(): (key: any, value: any) => any

  /*************************************************************************
   * Core functions
   ************************************************************************/

  /**
   * Set configuration options for math.js, and get current options. Will
   * emit a ‘config’ event, with arguments (curr, prev, changes).
   * @param options Available options: {number} relTol Minimum relative
   * difference between two compared values, used by all comparison
   * functions. {number} absTol Minimum absolute
   * difference between two compared values, used by all comparison
   * functions. {string} matrix A string ‘Matrix’ (default) or ‘Array’.
   * {string} number A string ‘number’ (default), ‘BigNumber’, or
   * ‘Fraction’ {number} precision The number of significant digits for
   * BigNumbers. Not applicable for Numbers. {string} parenthesis How to
   * display parentheses in LaTeX and string output. {string} randomSeed
   * Random seed for seeded pseudo random number generator. Set to null to
   * randomly seed.
   * @returns Returns the current configuration
   */
  config: (options: ConfigOptions) => ConfigOptions
  /**
   * Create a typed-function which checks the types of the arguments and
   * can match them against multiple provided signatures. The
   * typed-function automatically converts inputs in order to find a
   * matching signature. Typed functions throw informative errors in case
   * of wrong input arguments.
   * @param name Optional name for the typed-function
   * @param signatures Object with one or multiple function signatures
   * @returns The created typed-function.
   */
  typed: (
    name: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    signatures: Record<string, (...args: any[]) => any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => (...args: any[]) => any

  /*************************************************************************
   * Construction functions
   ************************************************************************/

  /**
   * Create a BigNumber, which can store numbers with arbitrary precision.
   * When a matrix is provided, all elements will be converted to
   * BigNumber.
   * @param x Value for the big number, 0 by default.
   * @returns The created bignumber
   */
  bignumber(
    x?: number | string | Fraction | BigNumber | bigint | Unit | boolean | null
  ): BigNumber
  bignumber<T extends MathCollection>(x: T): T

  /**
   * Create a bigint, which can store integers with arbitrary precision.
   * When a matrix is provided, all elements will be converted to
   * bigint.
   * @param x Value for the integer, 0 by default.
   * @returns The created bigint
   */
  bigint(
    x?: number | string | Fraction | BigNumber | bigint | boolean | null
  ): bigint
  bigint<T extends MathCollection>(x: T): T

  /**
   * Create a boolean or convert a string or number to a boolean. In case
   * of a number, true is returned for non-zero numbers, and false in case
   * of zero. Strings can be 'true' or 'false', or can contain a number.
   * When value is a matrix, all elements will be converted to boolean.
   * @param x A value of any type
   * @returns The boolean value
   */
  boolean(x: string | number | boolean | null): boolean
  boolean(x: MathCollection): MathCollection

  /**
   * Wrap any value in a chain, allowing to perform chained operations on
   * the value. All methods available in the math.js library can be called
   * upon the chain, and then will be evaluated with the value itself as
   * first argument. The chain can be closed by executing chain.done(),
   * which returns the final value. The chain has a number of special
   * functions: done() Finalize the chain and return the chain's value.
   * valueOf() The same as done() toString() Executes math.format() onto
   * the chain's value, returning a string representation of the value.
   * @param value A value of any type on which to start a chained
   * operation.
   * @returns The created chain
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chain<TValue>(value?: TValue): MathJsChain<TValue>

  /**
   * Create a complex value or convert a value to a complex value.
   * @param args Arguments specifying the real and imaginary part of the
   * complex number
   * @returns Returns a complex value
   */
  complex(arg?: MathNumericType | string | PolarCoordinates): Complex
  complex(arg?: MathCollection): MathCollection
  /**
   * @param re Argument specifying the real part of the complex number
   * @param im Argument specifying the imaginary part of the complex
   * number
   * @returns Returns a complex value
   */
  complex(re: number, im: number): Complex

  /**
   * Create a user-defined unit and register it with the Unit type.
   * @param name The name of the new unit. Must be unique. Example: ‘knot’
   * @param definition Definition of the unit in terms of existing units.
   * For example, ‘0.514444444 m / s’.
   * @param options (optional) An object containing any of the following
   * properties:</br>- prefixes {string} “none”, “short”, “long”,
   * “binary_short”, or “binary_long”. The default is “none”.</br>-
   * aliases {Array} Array of strings. Example: [‘knots’, ‘kt’,
   * ‘kts’]</br>- offset {Numeric} An offset to apply when converting from
   * the unit. For example, the offset for celsius is 273.15. Default is
   * 0.
   * @returns The new unit
   */
  createUnit(
    name: string,
    definition?: string | UnitDefinition | Unit,
    options?: CreateUnitOptions
  ): Unit
  /**
   * Create a user-defined unit and register it with the Unit type.
   * @param units Definition of the unit
   * @param options
   * @returns The new unit
   */
  createUnit(
    units: Record<string, string | UnitDefinition | Unit>,
    options?: CreateUnitOptions
  ): Unit

  /**
   * Create a fraction convert a value to a fraction.
   * @param value Arguments specifying the numerator and denominator of the
   * fraction
   * @returns Returns a fraction
   */
  fraction(
    value:
      | number
      | string
      | BigNumber
      | bigint
      | Unit
      | Fraction
      | FractionDefinition
  ): Fraction
  fraction(values: MathCollection): MathCollection
  /**
   * @param numerator Argument specifying the numerator of the fraction
   * @param denominator Argument specifying the denominator of the
   * fraction
   * @returns Returns a fraction
   */
  fraction(numerator: bigint, denominator: bigint): Fraction
  fraction(numerator: number, denominator: number): Fraction

  /**
   * Create an index. An Index can store ranges having start, step, and
   * end for multiple dimensions. Matrix.get, Matrix.set, and math.subset
   * accept an Index as input.
   * @param ranges Zero or more ranges or numbers.
   * @returns Returns the created index
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  index(...ranges: any[]): Index

  /**
   * Create a Matrix. The function creates a new math.type.Matrix object
   * from an Array. A Matrix has utility functions to manipulate the data
   * in the matrix, like getting the size and getting or setting values in
   * the matrix. Supported storage formats are 'dense' and 'sparse'.
   * @param format The Matrix storage format
   * @returns The created Matrix
   */
  matrix(format?: MatrixStorageFormat): Matrix
  /**
   * @param data A multi dimensional array
   * @param format The Matrix storage format
   * @param dataType The Matrix data type
   * @returns The created Matrix
   */
  matrix(
    data: MathCollection | string[],
    format?: MatrixStorageFormat,
    dataType?: string
  ): Matrix
  matrix<T extends MathScalarType>(
    data: MathCollection<T>,
    format?: MatrixStorageFormat,
    dataType?: string
  ): Matrix<T>

  /**
   * Create a number or convert a string, boolean, or unit to a number.
   * When value is a matrix, all elements will be converted to number.
   * @param value Value to be converted
   * @returns The created number
   */
  number(
    value?:
      | string
      | number
      | BigNumber
      | bigint
      | Fraction
      | boolean
      | Unit
      | null
  ): number
  number(value?: MathCollection): number | MathCollection
  /**
   * @param value Value to be converted
   * @param valuelessUnit A valueless unit, used to convert a unit to a
   * number
   * @returns The created number
   */
  number(unit: Unit, valuelessUnit: Unit | string): number

  /**
   * Convert a numeric input to a specific numeric type: number, BigNumber, bigint, or Fraction.
   * @param value The value to be converted
   * @param outputType The desired numeric output type
   */
  numeric(
    value: string | number | BigNumber | bigint | Fraction,
    outputType: 'number'
  ): number
  numeric(
    value: string | number | BigNumber | bigint | Fraction,
    outputType: 'BigNumber'
  ): BigNumber
  numeric(
    value: string | number | BigNumber | bigint | Fraction,
    outputType: 'bigint'
  ): bigint
  numeric(
    value: string | number | BigNumber | bigint | Fraction,
    outputType: 'Fraction'
  ): Fraction

  /**
   * Create a Sparse Matrix. The function creates a new math.type.Matrix
   * object from an Array. A Matrix has utility functions to manipulate
   * the data in the matrix, like getting the size and getting or setting
   * values in the matrix.
   * @param data A two dimensional array
   * @param dataType Sparse Matrix data type
   * @returns The created matrix
   */
  sparse(data?: MathCollection, dataType?: string): Matrix

  /**
   * Split a unit in an array of units whose sum is equal to the original
   * unit.
   * @param unit A unit to be split
   * @param parts An array of strings or valueless units
   * @returns An array of units
   */
  splitUnit(unit: Unit, parts: Unit[]): Unit[]

  /**
   * Create a string or convert any object into a string. Elements of
   * Arrays and Matrices are processed element wise.
   * @param value A value to convert to a string
   * @returns The created string
   */
  string(value: MathNumericType | string | Unit | null): string
  string(value: MathCollection): MathCollection

  /**
   * Create a unit. Depending on the passed arguments, the function will
   * create and return a new math.type.Unit object. When a matrix is
   * provided, all elements will be converted to units.
   * @param unit The unit to be created
   * @returns The created unit
   */
  unit(unit: string): Unit
  /**
   * @param unit The unit to be created
   * @returns The created unit
   */
  unit(unit: Unit): Unit
  /**
   * @param value The value of the unit to be created
   * @param unit The unit to be created
   * @returns The created unit
   */
  unit(value: MathNumericType, unit: string): Unit
  unit(value: MathCollection, unit: string): Unit[]

  /*************************************************************************
   * Expression functions
   ************************************************************************/

  /**
   * Parse and compile an expression. Returns a an object with a function
   * evaluate([scope]) to evaluate the compiled expression.
   * @param expr The expression to be compiled
   * @returns An object with the compiled expression
   */
  compile(expr: MathExpression): EvalFunction
  /**
   * @param exprs The expressions to be compiled
   * @returns An array of objects with the compiled expressions
   */
  compile(exprs: MathExpression[]): EvalFunction[]

  // TODO properly type this
  /**
   * Evaluate an expression.
   * @param expr The expression to be evaluated
   * @param scope Scope to read/write variables
   * @returns The result of the expression
   */
  evaluate(
    expr: MathExpression | Matrix,
    scope?: object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any
  evaluate(
    expr: MathExpression[],
    scope?: object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any[]

  /**
   * Retrieve help on a function or data type. Help files are retrieved
   * from the documentation in math.expression.docs.
   * @param search A function or function name for which to get help
   * @returns A help object
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  help(search: () => any): Help

  /**
   * Parse an expression. Returns a node tree, which can be evaluated by
   * invoking node.evaluate();
   */
  parse: ParseFunction

  /**
   * Create a parser. The function creates a new math.expression.Parser
   * object.
   * @returns A Parser object
   */
  parser(): Parser

  /*************************************************************************
   * Algebra functions
   ************************************************************************/
  /**
   * @param expr The expression to differentiate
   * @param variable The variable over which to differentiate
   * @param options There is one option available, simplify, which is true
   * by default. When false, output will not be simplified.
   * @returns The derivative of expr
   */
  derivative(
    expr: MathNode | string,
    variable: MathNode | string,
    options?: { simplify: boolean }
  ): MathNode

  /**
   * Solves the linear equation system by forwards substitution. Matrix
   * must be a lower triangular matrix.
   * @param L A N x N matrix or array (L)
   * @param b A column vector with the b values
   * @returns A column vector with the linear system solution (x)
   */
  lsolve(L: Matrix, b: MathCollection): Matrix
  lsolve(L: MathArray, b: MathCollection): MathArray

  /**
   * Calculate the Matrix LU decomposition with partial pivoting. Matrix A
   * is decomposed in two matrices (L, U) and a row permutation vector p
   * where A[p,:] = L * U
   * @param A A two dimensional matrix or array for which to get the LUP
   * decomposition.
   * @returns The lower triangular matrix, the upper triangular matrix and
   * the permutation matrix.
   */
  lup(A?: MathCollection): LUDecomposition

  /**
   * Solves the linear system A * x = b where A is an [n x n] matrix and b
   * is a [n] column vector.
   * @param A Invertible Matrix or the Matrix LU decomposition
   * @param b Column Vector
   * @param order The Symbolic Ordering and Analysis order, see slu for
   * details. Matrix must be a SparseMatrix
   * @param threshold Partial pivoting threshold (1 for partial pivoting),
   * see slu for details. Matrix must be a SparseMatrix.
   * @returns Column vector with the solution to the linear system A * x =
   * b
   */
  lusolve(
    A: Matrix,
    b: MathCollection,
    order?: number,
    threshold?: number
  ): Matrix

  lusolve(
    A: MathArray,
    b: MathCollection,
    order?: number,
    threshold?: number
  ): MathArray

  lusolve(A: LUDecomposition, b: MathCollection): Matrix

  /* Finds the roots of a polynomial of degree three or less. Coefficients are given constant first
   * followed by linear and higher powers in order; coefficients beyond the degree of the polynomial
   * need not be specified.
   * @param {number|Complex} constantCoeff
   * @param {number|Complex} linearCoeff
   * @param {number|Complex} quadraticCoeff
   * @param {number|Complex} cubicCoeff
   * @returns {Array<number|Complex>} array of roots of specified polynomial
   */
  polynomialRoot(
    constantCoeff: number | Complex,
    linearCoeff: number | Complex,
    quadraticCoeff?: number | Complex,
    cubicCoeff?: number | Complex
  ): (number | Complex)[]

  /**
   * Calculate the Matrix QR decomposition. Matrix A is decomposed in two
   * matrices (Q, R) where Q is an orthogonal matrix and R is an upper
   * triangular matrix.
   * @param A A two dimensional matrix or array for which to get the QR
   * decomposition.
   * @returns Q: the orthogonal matrix and R: the upper triangular matrix
   */
  qr(A: MathCollection): QRDecomposition

  rationalize(
    expr: MathNode | string,
    optional?: object | boolean,
    detailed?: false
  ): MathNode
  /**
   * Transform a rationalizable expression in a rational fraction. If
   * rational fraction is one variable polynomial then converts the
   * numerator and denominator in canonical form, with decreasing
   * exponents, returning the coefficients of numerator.
   * @param expr The expression to check if is a polynomial expression
   * @param optional scope of expression or true for already evaluated
   * rational expression at input
   * @param detailed  optional True if return an object, false if return
   * expression node (default)
   * @returns The rational polynomial of expr
   */
  rationalize(
    expr: MathNode | string,
    optional?: object | boolean,
    detailed?: true
  ): {
    expression: MathNode | string
    variables: string[]
    coefficients: MathType[]
  }

  /**
   * Simplify an expression tree.
   * @param expr The expression to be simplified
   * @param [rules] (optional) A list of rules are applied to an expression, repeating
   * over the list until no further changes are made. It’s possible to
   * pass a custom set of rules to the function as second argument. A rule
   * can be specified as an object, string, or function.
   * @param [scope] (optional) Scope to variables
   * @param [options] (optional) An object with simplify options
   * @returns Returns the simplified form of expr
   */
  simplify: Simplify

  simplifyConstant(expr: MathNode | string, options?: SimplifyOptions): MathNode
  simplifyCore(expr: MathNode | string, options?: SimplifyOptions): MathNode

  /**
   * Gives the number of “leaf nodes” in the parse tree of the given
   * expression. A leaf node is one that has no subexpressions, essentially
   * either a symbol or a constant. Note that `5!` has just one leaf, the `5`;
   * the unary factorial operator does not add a leaf. On the other hand,
   * function symbols do add leaves, so `sin(x)/cos(x)` has four leaves.
   */
  leafCount(expr: MathNode): number

  /**
   *  Replaces variable nodes with their scoped values
   * @param node Tree to replace variable nodes in
   * @param scope Scope to read/write variables
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve(node: MathNode | string, scope?: Record<string, any>): MathNode
  resolve(
    node: (MathNode | string)[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scope?: Record<string, any>
  ): MathNode[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve(node: Matrix, scope?: Record<string, any>): Matrix

  /**
   * Calculate the Sparse Matrix LU decomposition with full pivoting.
   * Sparse Matrix A is decomposed in two matrices (L, U) and two
   * permutation vectors (pinv, q) where P * A * Q = L * U
   * @param A A two dimensional sparse matrix for which to get the LU
   * decomposition.
   * @param order The Symbolic Ordering and Analysis order: 0 - Natural
   * ordering, no permutation vector q is returned 1 - Matrix must be
   * square, symbolic ordering and analisis is performed on M = A + A' 2 -
   * Symbolic ordering and analysis is performed on M = A' * A. Dense
   * columns from A' are dropped, A recreated from A'. This is appropriate
   * for LU factorization of non-symmetric matrices. 3 - Symbolic ordering
   * and analysis is performed on M = A' * A. This is best used for LU
   * factorization is matrix M has no dense rows. A dense row is a row
   * with more than 10*sqr(columns) entries.
   * @param threshold Partial pivoting threshold (1 for partial pivoting)
   * @returns The lower triangular matrix, the upper triangular matrix and
   * the permutation vectors.
   */
  slu(A: Matrix, order: number, threshold: number): SLUDecomposition

  /**
   * Solves the linear equation system by backward substitution. Matrix
   * must be an upper triangular matrix. U * x = b
   * @param U A N x N matrix or array (U)
   * @param b A column vector with the b values
   * @returns A column vector with the linear system solution (x)
   */
  usolve(U: Matrix, b: MathCollection): Matrix
  usolve(U: MathArray, b: MathCollection): MathArray

  /*************************************************************************
   * Arithmetic functions
   ************************************************************************/

  /**
   * Calculate the absolute value of a number. For matrices, the function
   * is evaluated element wise.
   * @param x A number or matrix for which to get the absolute value
   * @returns Absolute value of x
   */
  abs<T extends MathType>(x: T): T

  /**
   * Add two values, x + y. For matrices, the function is evaluated
   * element wise.
   * @param x First value to add
   * @param y Second value to add
   * @returns Sum of x and y
   */
  add<T extends MathType>(x: T, y: T): T
  add<T extends MathType>(...values: T[]): T
  add(x: MathType, y: MathType): MathType
  add(...values: MathType[]): MathType

  /**
   * Calculate the cubic root of a value.
   * @param x Value for which to calculate the cubic root.
   * @param allRoots Optional, false by default. Only applicable when x is
   * a number or complex number. If true, all complex roots are returned,
   * if false (default) the principal root is returned.
   * @returns Returns the cubic root of x
   */
  cbrt(x: Complex, allRoots?: boolean): Complex
  cbrt<T extends number | BigNumber | Unit>(x: T): T

  // Rounding functions, grouped for similarity, even though it breaks
  // the alphabetic order among arithmetic functions.

  /**
   * Round a value towards plus infinity If x is complex, both real and
   * imaginary part are rounded towards plus infinity. For matrices, the
   * function is evaluated element wise.
   * @param x Number to be rounded
   * @param n Number of decimals Default value: 0.
   * @returns Rounded value
   */
  ceil<T extends MathNumericType | MathCollection>(
    x: T,
    n?: number | BigNumber
  ): NoLiteralType<T>
  ceil<U extends MathCollection>(x: MathNumericType, n: U): U
  ceil<U extends MathCollection<Unit>>(x: U, unit: Unit): U
  ceil(x: Unit, unit: Unit): Unit
  ceil(x: Unit, n: number | BigNumber, unit: Unit): Unit
  ceil<U extends MathCollection<Unit>>(
    x: U,
    n: number | BigNumber,
    unit: Unit
  ): U

  /**
   * Round a value towards zero. For matrices, the function is evaluated
   * element wise.
   * @param x Number to be rounded
   * @param n Number of decimals Default value: 0.
   * @returns Rounded value
   */
  fix<T extends MathNumericType | MathCollection>(
    x: T,
    n?: number | BigNumber
  ): NoLiteralType<T>
  fix<U extends MathCollection>(x: MathNumericType, n: U): U
  fix<U extends MathCollection<Unit>>(x: U, unit: Unit): U
  fix(x: Unit, unit: Unit): Unit
  fix(x: Unit, n: number | BigNumber, unit: Unit): Unit
  fix<U extends MathCollection<Unit>>(
    x: U,
    n: number | BigNumber,
    unit: Unit
  ): U

  /**
   * Round a value towards minus infinity. For matrices, the function is
   * evaluated element wise.
   * @param x Number to be rounded
   * @param n Number of decimals Default value: 0.
   * @returns Rounded value
   */
  floor<T extends MathNumericType | MathCollection>(
    x: T,
    n?: number | BigNumber
  ): NoLiteralType<T>
  floor<U extends MathCollection>(x: MathNumericType, n: U): U
  floor<U extends MathCollection<Unit>>(x: U, unit: Unit): U
  floor(x: Unit, unit: Unit): Unit
  floor(x: Unit, n: number | BigNumber, unit: Unit): Unit
  floor<U extends MathCollection<Unit>>(
    x: U,
    n: number | BigNumber,
    unit: Unit
  ): U

  /**
   * Round a value towards the nearest integer. For matrices, the function
   * is evaluated element wise.
   * @param x Number to be rounded
   * @param n Number of decimals Default value: 0.
   * @returns Rounded value of x
   */
  round<T extends MathNumericType | MathCollection>(
    x: T,
    n?: number | BigNumber
  ): NoLiteralType<T>
  round<U extends MathCollection>(x: MathNumericType, n: U): U
  round<U extends MathCollection<Unit>>(x: U, unit: Unit): U
  round(x: Unit, unit: Unit): Unit
  round(x: Unit, n: number | BigNumber, unit: Unit): Unit
  round<U extends MathCollection<Unit>>(
    x: U,
    n: number | BigNumber,
    unit: Unit
  ): U

  // End of group of rounding functions

  /**
   * Compute the cube of a value, x * x * x. For matrices, the function is
   * evaluated element wise.
   * @param x Number for which to calculate the cube
   * @returns Cube of x
   */
  cube<T extends MathNumericType | Unit>(x: T): T

  /**
   * Divide two values, x / y. To divide matrices, x is multiplied with
   * the inverse of y: x * inv(y).
   * @param x Numerator
   * @param y Denominator
   * @returns Quotient, x / y
   */
  divide(x: Unit, y: Unit): Unit | number
  divide(x: Unit, y: number): Unit
  divide(x: number, y: number): number
  divide(x: MathType, y: MathType): MathType

  /**
   * Divide two matrices element wise. The function accepts both matrices
   * and scalar values.
   * @param x Numerator
   * @param y Denominator
   * @returns Quotient, x ./ y
   */
  dotDivide<T extends MathCollection>(x: T, y: MathType): T
  dotDivide<T extends MathCollection>(x: MathType, y: T): T
  dotDivide(x: Unit, y: MathType): Unit
  dotDivide(x: MathType, y: Unit): Unit
  dotDivide(x: MathNumericType, y: MathNumericType): MathNumericType

  /**
   * Multiply two matrices element wise. The function accepts both
   * matrices and scalar values.
   * @param x Left hand value
   * @param y Right hand value
   * @returns Multiplication of x and y
   */
  dotMultiply<T extends MathCollection>(x: T, y: MathType): T
  dotMultiply<T extends MathCollection>(x: MathType, y: T): T
  dotMultiply(x: Unit, y: MathType): Unit
  dotMultiply(x: MathType, y: Unit): Unit
  dotMultiply(x: MathNumericType, y: MathNumericType): MathNumericType

  /**
   * Calculates the power of x to y element wise.
   * @param x The base
   * @param y The exponent
   * @returns The value of x to the power y
   */
  dotPow<T extends MathType>(x: T, y: MathType): T

  /**
   * Calculate the exponent of a value. For matrices, the function is
   * evaluated element wise.
   * @param x A number or matrix to exponentiate
   * @returns Exponent of x
   */
  exp<T extends number | BigNumber | Complex>(x: T): T

  /**
   * Calculate the value of subtracting 1 from the exponential value. For
   * matrices, the function is evaluated element wise.
   * @param x A number or matrix to apply expm1
   * @returns Exponent of x
   */
  expm1<T extends number | BigNumber | Complex>(x: T): T

  /**
   * Calculate the greatest common divisor for two or more values or
   * arrays. For matrices, the function is evaluated element wise.
   * @param args Two or more integer numbers
   * @returns The greatest common divisor
   */
  gcd<T extends number | BigNumber | Fraction | MathCollection>(...args: T[]): T
  gcd<T extends number | BigNumber | Fraction | Matrix>(args: T[]): T

  /**
   * Calculate the hypotenuse of a list with values. The hypotenuse is
   * defined as: hypot(a, b, c, ...) = sqrt(a^2 + b^2 + c^2 + ...) For
   * matrix input, the hypotenuse is calculated for all values in the
   * matrix.
   * @param args A list with numeric values or an Array or Matrix. Matrix
   * and Array input is flattened and returns a single number for the
   * whole matrix.
   * @returns Returns the hypothenuse of the input values.
   */
  hypot<T extends number | BigNumber>(...args: T[]): T
  hypot<T extends number | BigNumber>(args: T[]): T

  /**
   * Create a dense matrix from vectors as individual rows. If you pass column vectors, they will be transposed (but not conjugated!)
   * @param rows - a multi-dimensional number array or matrix
   */
  matrixFromRows(...rows: Matrix[]): Matrix
  matrixFromRows<T extends MathScalarType>(
    ...rows: (T[] | [T][] | Matrix)[]
  ): T[][]

  /**
   * Create a dense matrix from vectors as individual columns. If you pass row vectors, they will be transposed (but not conjugated!)
   * @param cols - a multi-dimensional number array or matrix
   */
  matrixFromColumns(...cols: Matrix[]): Matrix
  matrixFromColumns<T extends MathScalarType>(
    ...cols: (T[] | [T][] | Matrix)[]
  ): T[][]
  /**
   * Create a matrix by evaluating a generating function at each index. The simplest overload returns a multi-dimensional array as long as size is an array. Passing size as a Matrix or specifying a format will result in returning a Matrix.
   * @param size - the size of the matrix to be created
   * @param fn - Callback function invoked for every entry in the matrix
   * @param format - The Matrix storage format, either 'dense' or 'sparse'
   * @param datatype - Type of the values
   */
  matrixFromFunction<T extends MathScalarType>(
    size: [number],
    fn: MatrixFromFunctionCallback<T>
  ): T[]
  matrixFromFunction<T extends MathScalarType>(
    size: [number, number],
    fn: MatrixFromFunctionCallback<T>
  ): T[][]
  matrixFromFunction<T extends MathScalarType>(
    size: number[],
    fn: MatrixFromFunctionCallback<T>
  ): MathArray<T>
  matrixFromFunction(
    size: Matrix<number>,
    fn: MatrixFromFunctionCallback<MathScalarType>
  ): Matrix
  matrixFromFunction(
    size: number[] | Matrix<number>,
    fn: MatrixFromFunctionCallback<MathScalarType>,
    format: MatrixStorageFormat,
    datatype?: string
  ): Matrix
  matrixFromFunction(
    size: number[] | Matrix<number>,
    format: MatrixStorageFormat,
    fn: MatrixFromFunctionCallback<MathScalarType>,
    datatype?: string
  ): Matrix
  /**
   * Calculate the least common multiple for two or more values or arrays.
   * lcm is defined as: lcm(a, b) = abs(a * b) / gcd(a, b) For matrices,
   * the function is evaluated element wise.
   * @param a An integer number
   * @param b An integer number
   * @returns The least common multiple
   */
  lcm<T extends number | BigNumber | MathCollection>(a: T, b: T): T

  /**
   * Calculate the logarithm of a value.
   * @param x Value for which to calculate the logarithm.
   * @param base Optional base for the logarithm. If not provided, the
   * natural logarithm of x is calculated. Default value: e.
   * @returns Returns the logarithm of x
   */
  log<T extends number | BigNumber | Complex>(
    x: T,
    base?: number | BigNumber | Complex
  ): NoLiteralType<T>

  /**
   * Calculate the 10-base of a value. This is the same as calculating
   * log(x, 10). For matrices, the function is evaluated element wise.
   * @param x Value for which to calculate the logarithm.
   * @returns Returns the 10-base logarithm of x
   */
  log10<T extends number | BigNumber | Complex | MathCollection>(x: T): T

  /**
   * Calculate the logarithm of a value+1. For matrices, the function is
   * evaluated element wise.
   * @param x Value for which to calculate the logarithm.
   * @returns Returns the logarithm of x+1
   */
  log1p<T extends number | BigNumber | Complex | MathCollection>(
    x: T,
    base?: number | BigNumber | Complex
  ): T

  /**
   * Calculate the 2-base of a value. This is the same as calculating
   * log(x, 2). For matrices, the function is evaluated element wise.
   * @param x Value for which to calculate the logarithm.
   * @returns Returns the 2-base logarithm of x
   */
  log2<T extends number | BigNumber | Complex | MathCollection>(x: T): T

  /**
   * Calculates the modulus, the remainder of an integer division. For
   * matrices, the function is evaluated element wise. The modulus is
   * defined as: x - y * floor(x / y)
   * @see http://en.wikipedia.org/wiki/Modulo_operation.
   * @param x Dividend
   * @param y Divisor
   * @returns Returns the remainder of x divided by y
   */
  mod<T extends number | BigNumber | bigint | Fraction | MathCollection>(
    x: T,
    y: number | BigNumber | bigint | Fraction | MathCollection
  ): NoLiteralType<T>

  /**
   * Multiply two values, x * y. The result is squeezed. For matrices, the
   * matrix product is calculated.
   * @param x The first value to multiply
   * @param y The second value to multiply
   * @returns Multiplication of x and y
   */

  multiply<T extends Matrix>(x: T, y: MathType): Matrix
  multiply<T extends Matrix>(x: MathType, y: T): Matrix

  multiply<T extends MathArray>(x: T, y: T[]): T
  multiply<T extends MathArray>(x: T[], y: T): T
  multiply<T extends MathArray>(x: T[], y: T[]): T[]
  multiply<T extends MathArray>(x: T, y: T): MathScalarType
  multiply(x: Unit, y: Unit): Unit
  multiply(x: number, y: number): number
  multiply(x: MathType, y: MathType): MathType
  multiply<T extends MathType>(...values: T[]): T
  multiply(...values: MathType[]): MathType

  /**
   * Calculate the norm of a number, vector or matrix. The second
   * parameter p is optional. If not provided, it defaults to 2.
   * @param x Value for which to calculate the norm
   * @param p Vector space. Supported numbers include Infinity and
   * -Infinity. Supported strings are: 'inf', '-inf', and 'fro' (The
   * Frobenius norm) Default value: 2.
   * @returns the p-norm
   */
  norm(
    x: number | BigNumber | Complex | MathCollection,
    p?: number | BigNumber | string
  ): number | BigNumber

  /**
   * Calculate the nth root of a value. The principal nth root of a
   * positive real number A, is the positive real solution of the equation
   * x^root = A For matrices, the function is evaluated element wise.
   * @param a Value for which to calculate the nth root
   * @param root The root. Default value: 2.
   * @return The nth root of a
   */
  nthRoot(
    a: number | BigNumber | MathCollection | Complex,
    root?: number | BigNumber
  ): number | Complex | MathCollection

  /**
   * Calculates the power of x to y, x ^ y. Matrix exponentiation is
   * supported for square matrices x, and positive integer exponents y.
   * @param x The base
   * @param y The exponent
   * @returns x to the power y
   */
  pow(x: MathType, y: number | BigNumber | bigint | Complex): MathType

  /**
   * Compute the sign of a value. The sign of a value x is: 1 when x > 1
   * -1 when x < 0 0 when x == 0 For matrices, the function is evaluated
   * element wise.
   * @param x The number for which to determine the sign
   * @returns The sign of x
   */
  sign<T extends MathType>(x: T): T

  /**
   * Calculate the square root of a value. For matrices, use either
   * sqrtm for the matrix square root, or map(M, sqrt) to take the
   * square root element wise.
   * @param x Value for which to calculate the square root
   * @returns Returns the square root of x
   */
  sqrt(x: number): number | Complex
  sqrt<T extends BigNumber | Complex | Unit>(x: T): T

  /**
   * Compute the square of a value, x * x.
   * @param x Number for which to calculate the square
   * @returns Squared value
   */
  square<T extends MathNumericType | Unit>(x: T): T

  /**
   * Subtract two values, x - y. For matrices, the function is evaluated
   * element wise.
   * @param x Initial value
   * @param y Value to subtract from x
   * @returns Subtraction of x and y
   */
  subtract<T extends MathType>(x: T, y: T): T
  subtract(x: MathType, y: MathType): MathType

  /**
   * Inverse the sign of a value, apply a unary minus operation. For
   * matrices, the function is evaluated element wise. Boolean values and
   * strings will be converted to a number. For complex numbers, both real
   * and complex value are inverted.
   * @param x Number to be inverted
   * @returns Retursn the value with inverted sign
   */
  unaryMinus<T extends MathType>(x: T): T

  /**
   * Unary plus operation. Boolean values and strings will be converted to
   * a number, numeric values will be returned as is. For matrices, the
   * function is evaluated element wise.
   * @param x Input value
   * @returns Returns the input value when numeric, converts to a number
   * when input is non-numeric.
   */
  unaryPlus<T extends string | MathType>(x: T): T

  /**
   * Calculate the extended greatest common divisor for two values. See
   * http://en.wikipedia.org/wiki/Extended_Euclidean_algorithm.
   * @param a An integer number
   * @param b An integer number
   * @returns Returns an array containing 3 integers [div, m, n] where div
   * = gcd(a, b) and a*m + b*n = div
   */
  xgcd(a: number | BigNumber, b: number | BigNumber): MathArray

  /*************************************************************************
   * Bitwise functions
   ************************************************************************/

  /**
   * Bitwise AND two values, x & y. For matrices, the function is
   * evaluated element wise.
   * @param x First value to and
   * @param y Second value to and
   * @returns AND of x and y
   */
  bitAnd<T extends number | BigNumber | bigint | MathCollection>(
    x: T,
    y: number | BigNumber | bigint | MathCollection
  ): NoLiteralType<T>

  /**
   * Bitwise NOT value, ~x. For matrices, the function is evaluated
   * element wise. For units, the function is evaluated on the best prefix
   * base.
   * @param x Value to not
   * @returns NOT of x
   */
  bitNot<T extends number | BigNumber | bigint | MathCollection>(x: T): T

  /**
   * Bitwise OR two values, x | y. For matrices, the function is evaluated
   * element wise. For units, the function is evaluated on the lowest
   * print base.
   * @param x First value to or
   * @param y Second value to or
   * @returns OR of x and y
   */
  bitOr<T extends number | BigNumber | bigint | MathCollection>(x: T, y: T): T

  /**
   * Bitwise XOR two values, x ^ y. For matrices, the function is
   * evaluated element wise.
   * @param x First value to xor
   * @param y Second value to xor
   * @returns XOR of x and y
   */
  bitXor<T extends number | BigNumber | bigint | MathCollection>(
    x: T,
    y: number | BigNumber | bigint | MathCollection
  ): NoLiteralType<T>

  /**
   * Bitwise left logical shift of a value x by y number of bits, x << y.
   * For matrices, the function is evaluated element wise. For units, the
   * function is evaluated on the best prefix base.
   * @param x Value to be shifted
   * @param y Amount of shifts
   * @returns x shifted left y times
   */
  leftShift<T extends number | BigNumber | bigint | MathCollection>(
    x: T,
    y: number | BigNumber | bigint
  ): NoLiteralType<T>

  /**
   * Bitwise right arithmetic shift of a value x by y number of bits, x >>
   * y. For matrices, the function is evaluated element wise. For units,
   * the function is evaluated on the best prefix base.
   * @param x Value to be shifted
   * @param y Amount of shifts
   * @returns x sign-filled shifted right y times
   */
  rightArithShift<T extends number | BigNumber | bigint | MathCollection>(
    x: T,
    y: number | BigNumber | bigint
  ): NoLiteralType<T>

  /**
   * Bitwise right logical shift of value x by y number of bits, x >>> y.
   * For matrices, the function is evaluated element wise. For units, the
   * function is evaluated on the best prefix base.
   * @param x Value to be shifted
   * @param y Amount of shifts
   * @returns x zero-filled shifted right y times
   */
  rightLogShift<T extends number | MathCollection>(
    x: T,
    y: number
  ): NoLiteralType<T>

  /*************************************************************************
   * Combinatorics functions
   ************************************************************************/

  /**
   * The Bell Numbers count the number of partitions of a set. A partition
   * is a pairwise disjoint subset of S whose union is S. bellNumbers only
   * takes integer arguments. The following condition must be enforced: n
   * >= 0
   * @param n Total number of objects in the set
   * @returns B(n)
   */
  bellNumbers<T extends number | BigNumber>(n: T): T

  /**
   * The Catalan Numbers enumerate combinatorial structures of many
   * different types. catalan only takes integer arguments. The following
   * condition must be enforced: n >= 0
   * @param n nth Catalan number
   * @returns Cn(n)
   */
  catalan<T extends number | BigNumber>(n: T): T

  /**
   * The composition counts of n into k parts. Composition only takes
   * integer arguments. The following condition must be enforced: k <= n.
   * @param n Total number of objects in the set
   * @param k Number of objects in the subset
   * @returns Returns the composition counts of n into k parts.
   */
  composition<T extends number | BigNumber>(
    n: T,
    k: number | BigNumber
  ): NoLiteralType<T>

  /**
   * The Stirling numbers of the second kind, counts the number of ways to
   * partition a set of n labelled objects into k nonempty unlabelled
   * subsets. stirlingS2 only takes integer arguments. The following
   * condition must be enforced: k <= n. If n = k or k = 1, then s(n,k) =
   * 1
   * @param n Total number of objects in the set
   * @param k Number of objects in the subset
   * @returns S(n,k)
   */
  stirlingS2<T extends number | BigNumber>(
    n: T,
    k: number | BigNumber
  ): NoLiteralType<T>

  /*************************************************************************
   * Complex functions
   ************************************************************************/

  /**
   * Compute the argument of a complex value. For a complex number a + bi,
   * the argument is computed as atan2(b, a). For matrices, the function
   * is evaluated element wise.
   * @param x A complex number or array with complex numbers
   * @returns The argument of x
   */
  arg(x: number | Complex): number
  arg(x: BigNumber | Complex): BigNumber
  arg<T extends MathCollection>(x: T): T

  /**
   * Compute the complex conjugate of a complex value. If x = a+bi, the
   * complex conjugate of x is a - bi. For matrices, the function is
   * evaluated element wise.
   * @param x A complex number or array with complex numbers
   * @returns The complex conjugate of x
   */
  conj<T extends number | BigNumber | Complex | MathCollection>(
    x: T
  ): NoLiteralType<T>

  /**
   * Get the imaginary part of a complex number. For a complex number a +
   * bi, the function returns b. For matrices, the function is evaluated
   * element wise.
   * @param x A complex number or array with complex numbers
   * @returns The imaginary part of x
   */
  im(x: MathJsChain<number | Complex>): MathJsChain<number>
  im<T extends BigNumber | MathCollection>(x: MathJsChain<T>): MathJsChain<T>

  /**
   * Get the real part of a complex number. For a complex number a + bi,
   * the function returns a. For matrices, the function is evaluated
   * element wise.
   * @param x A complex number or array of complex numbers
   * @returns The real part of x
   */
  re(x: MathJsChain<number | Complex>): MathJsChain<number>
  re<T extends BigNumber | MathCollection>(x: MathJsChain<T>): MathJsChain<T>

  /*************************************************************************
   * Geometry functions
   ************************************************************************/

  /**
   * Calculates: The eucledian distance between two points in 2 and 3
   * dimensional spaces. Distance between point and a line in 2 and 3
   * dimensional spaces. Pairwise distance between a set of 2D or 3D
   * points NOTE: When substituting coefficients of a line(a, b and c),
   * use ax + by + c = 0 instead of ax + by = c For parametric equation of
   * a 3D line, x0, y0, z0, a, b, c are from: (x−x0, y−y0, z−z0) = t(a, b,
   * c)
   * @param x Coordinates of the first point
   * @param y Coordinates of the second point OR coefficients of a line in 3D OR first end-point of a line if the calculation is for distance between point and a line in 2D
   * @param z Coordinates of second end-point of a line if the calculation is for distance between point and a line in 2D
   * @returns Returns the distance from two/three points
   */
  distance(
    x: MathCollection | object,
    y: MathCollection | object,
    z?: MathCollection | object
  ): number | BigNumber

  /**
   * Calculates the point of intersection of two lines in two or three
   * dimensions and of a line and a plane in three dimensions. The inputs
   * are in the form of arrays or 1 dimensional matrices. The line
   * intersection functions return null if the lines do not meet. Note:
   * Fill the plane coefficients as x + y + z = c and not as x + y + z + c
   * = 0.
   * @param w Co-ordinates of first end-point of first line
   * @param x Co-ordinates of second end-point of first line
   * @param y Co-ordinates of first end-point of second line OR
   * Coefficients of the plane's equation
   * @param z Co-ordinates of second end-point of second line OR null if
   * the calculation is for line and plane
   * @returns Returns the point of intersection of lines/lines-planes
   */
  intersect(
    w: MathCollection,
    x: MathCollection,
    y: MathCollection,
    z?: MathCollection
  ): MathArray

  /*************************************************************************
   * Logical functions
   ************************************************************************/

  /**
   * Logical and. Test whether two values are both defined with a
   * nonzero/nonempty value. For matrices, the function is evaluated
   * element wise.
   * @param x First value to and
   * @param y Second value to and
   * @returns Returns true when both inputs are defined with a
   * nonzero/nonempty value.
   */
  and(
    x: number | BigNumber | bigint | Complex | Unit | MathCollection,
    y: number | BigNumber | bigint | Complex | Unit | MathCollection
  ): boolean | MathCollection

  /**
   * Logical not. Flips boolean value of a given parameter. For matrices,
   * the function is evaluated element wise.
   * @param x First value to not
   * @returns Returns true when input is a zero or empty value.
   */
  not(
    x: number | BigNumber | bigint | Complex | Unit | MathCollection
  ): boolean | MathCollection

  /**
   * Logical or. Test if at least one value is defined with a
   * nonzero/nonempty value. For matrices, the function is evaluated
   * element wise.
   * @param x First value to or
   * @param y Second value to or
   * @returns Returns true when one of the inputs is defined with a
   * nonzero/nonempty value.
   */
  or(
    x: number | BigNumber | bigint | Complex | Unit | MathCollection,
    y: number | BigNumber | bigint | Complex | Unit | MathCollection
  ): boolean | MathCollection

  /**
   * Logical xor. Test whether one and only one value is defined with a
   * nonzero/nonempty value. For matrices, the function is evaluated
   * element wise.
   * @param x First value to xor
   * @param y Second value to xor
   * @returns Returns true when one and only one input is defined with a
   * nonzero/nonempty value.
   */
  xor(
    x: number | BigNumber | bigint | Complex | Unit | MathCollection,
    y: number | BigNumber | bigint | Complex | Unit | MathCollection
  ): boolean | MathCollection

  /*************************************************************************
   * Matrix functions
   ************************************************************************/

  /**
   * Apply a function that maps an array to a scalar along a given axis of a
   * matrix or array. Returns a new matrix or array with one less dimension
   * than the input.
   * @param array The input Matrix
   * @param dim The dimension along which the callback is applied
   * @param callback The callback function that is applied. This Function should take an
   * array or 1-d matrix as an input and return a number.
   * @returns The residual matrix with the function applied over some dimension.
   */
  mapSlices<T extends MathCollection>(
    array: T,
    dim: number,
    callback: (array: MathCollection) => number
  ): T
  /**
   * @deprecated backwards-compatibility old name of mapSlices
   */
  apply: MathJsInstance['mapSlices']

  /**
   * Concatenate two or more matrices. dim: number is a zero-based
   * dimension over which to concatenate the matrices. By default the last
   * dimension of the matrices.
   * @param args Two or more matrices
   * @returns Concatenated matrix
   */
  concat(...args: Array<MathCollection | number | BigNumber>): MathCollection

  /**
   * Calculate the cross product for two vectors in three dimensional
   * space. The cross product of A = [a1, a2, a3] and B =[b1, b2, b3] is
   * defined as: cross(A, B) = [ a2 * b3 - a3 * b2, a3 * b1 - a1 * b3, a1
   * * b2 - a2 * b1 ]
   * @param x First vector
   * @param y Second vector
   * @returns Returns the cross product of x and y
   */
  cross(x: MathCollection, y: MathCollection): MathCollection

  /**
   * Calculate the determinant of a matrix.
   * @param x A Matrix
   * @returns the determinant of x
   */
  det(x: MathCollection): number

  /**
   * Create a diagonal matrix or retrieve the diagonal of a matrix. When x
   * is a vector, a matrix with vector x on the diagonal will be returned.
   * When x is a two dimensional matrix, the matrixes kth diagonal will be
   * returned as vector. When k is positive, the values are placed on the
   * super diagonal. When k is negative, the values are placed on the sub
   * diagonal.
   * @param X A two dimensional matrix or a vector
   * @param k The diagonal where the vector will be filled in or
   * retrieved. Default value: 0.
   * @param format The matrix storage format. Default value: 'dense'.
   * @returns Diagonal matrix from input vector, or diagonal from input
   * matrix
   */
  diag(X: MathCollection, format?: string): Matrix
  diag(
    X: MathCollection,
    k: number | BigNumber,
    format?: string
  ): MathCollection

  /**
   * Calculate the dot product of two vectors. The dot product of A = [a1,
   * a2, a3, ..., an] and B = [b1, b2, b3, ..., bn] is defined as: dot(A,
   * B) = a1 * b1 + a2 * b2 + a3 * b3 + ... + an * bn
   * @param x First vector
   * @param y Second vector
   * @returns Returns the dot product of x and y
   */
  dot(x: MathCollection, y: MathCollection): number

  /**
   * Compute eigenvalues and eigenvectors of a matrix.
   * The eigenvalues are sorted by their absolute value, ascending.
   * An eigenvalue with multiplicity k will be listed k times.
   * The eigenvectors are returned as an array of objects, each with a
   * `value` and a `vector`. If the algorithm fails to converge,
   * it will throw an error – in that case, however, you may still find useful
   * information in err.values and err.vectors
   * @param x Matrix to be diagonalized
   * @param prec Precision, default value: 1e-15
   * @returns Object containing an array of eigenvalues and a matrix with eigenvectors as columns.
   */
  eigs(
    x: MathCollection,
    opts?:
      | number
      | BigNumber
      | { precision?: number | BigNumber; eigenvectors?: true }
  ): {
    values: MathCollection
    eigenvectors: {
      value: number | BigNumber
      vector: MathCollection
    }[]
  }
  eigs(
    x: MathCollection,
    opts: { eigenvectors: false; precision?: number | BigNumber }
  ): { values: MathCollection }
  /**
   * Compute the matrix exponential, expm(A) = e^A. The matrix must be
   * square. Not to be confused with exp(a), which performs element-wise
   * exponentiation. The exponential is calculated using the Padé
   * approximant with scaling and squaring; see “Nineteen Dubious Ways to
   * Compute the Exponential of a Matrix,” by Moler and Van Loan.
   * @param x A square matrix
   * @returns The exponential of x
   */
  expm(x: Matrix): Matrix

  /**
   * Solves the real-valued Sylvester equation AX-XB=C for X, where A, B and C are
   * matrices of appropriate dimensions, being A and B squared. The method used is
   * the Bartels-Stewart algorithm.
   * https://en.wikipedia.org/wiki/Sylvester_equation
   * @param A  Matrix A
   * @param B  Matrix B
   * @param C  Matrix C
   * @returns  Matrix X, solving the Sylvester equation
   */
  sylvester(
    A: MathCollection,
    B: MathCollection,
    C: MathCollection
  ): MathCollection

  /**
   * Performs a real Schur decomposition of the real matrix A = UTU' where U is orthogonal
   * and T is upper quasi-triangular.
   * https://en.wikipedia.org/wiki/Schur_decomposition
   * @param A  Matrix A
   * @returns Object containing both matrix U and T of the Schur Decomposition A=UTU'
   */
  schur(A: MathCollection): SchurDecomposition

  /**
   * Solves the Continuous-time Lyapunov equation AP+PA'=Q for P, where Q is a positive semidefinite
   * matrix.
   * https://en.wikipedia.org/wiki/Lyapunov_equation
   * @param A  Matrix A
   * @param Q  Matrix Q
   * @returns  Matrix P solution to the Continuous-time Lyapunov equation AP+PA'=Q
   */
  lyap(A: MathCollection, Q: MathCollection): MathCollection

  /**
   * Create a 2-dimensional identity matrix with size m x n or n x n. The
   * matrix has ones on the diagonal and zeros elsewhere.
   * @param size The size for the matrix
   * @param format The Matrix storage format
   * @returns A matrix with ones on the diagonal
   */
  identity(
    size: number | number[] | MathCollection,
    format?: string
  ): MathCollection | number
  /**
   * @param m The x dimension for the matrix
   * @param n The y dimension for the matrix
   * @param format The Matrix storage format
   * @returns A matrix with ones on the diagonal
   */
  identity(m: number, n: number, format?: string): MathCollection | number

  /**
   * Filter the items in an array or one dimensional matrix.
   * @param x A one dimensional matrix or array to filter
   * @param test A function or regular expression to test items. All
   * entries for which test returns true are returned. When test is a
   * function, it is invoked with three parameters: the value of the
   * element, the index of the element, and the matrix/array being
   * traversed. The function must return a boolean.
   */
  filter(
    x: MathCollection | string[],
    test:
      | ((
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          value: any,
          index: number[],
          matrix: MathCollection | string[]
        ) => boolean)
      | RegExp
  ): MathCollection

  /**
   * Flatten a multi dimensional matrix into a single dimensional matrix.
   * @param x Matrix to be flattened
   * @returns Returns the flattened matrix
   */
  flatten<T extends MathCollection>(x: T): T

  /**
   * Iterate over all elements of a matrix/array, and executes the given
   * callback function.
   * @param x The matrix to iterate on.
   * @param callback The callback function is invoked with three
   * parameters: the value of the element, the index of the element, and
   * the Matrix/array being traversed.
   */
  forEach<T extends MathCollection>(
    x: T,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (value: any, index: number[], matrix: T) => void
  ): void

  /**
   * Calculate the inverse of a square matrix.
   * @param x Matrix to be inversed
   * @returns The inverse of x
   */
  inv<T extends number | Complex | MathCollection>(x: T): NoLiteralType<T>

  /**
   * Calculate the Kronecker product of two matrices or vectors
   * @param x First vector
   * @param y Second vector
   * @returns Returns the Kronecker product of x and y
   */
  kron(x: MathCollection, y: MathCollection): Matrix

  /**
   * Iterate over all elements of a matrix/array, and executes the given
   * callback function.
   * @param x The matrix to iterate on.
   * @param callback The callback function is invoked with three
   * parameters: the value of the element, the index of the element, and
   * the Matrix/array being traversed.
   * @returns Transformed map of x
   */
  map<T extends MathCollection>(
    x: T,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (value: any, index: number[], matrix: T) => MathType | string
  ): T

  /**
   * Iterate over all elements of multiple matrices/arrays, and executes the given
   * callback function.
   * @param x The first matrix to iterate on.
   * @param args The rest of the matrices and at the end the callback function is invoked with multiple
   * parameters: the values of the elements, the indices of the elements, and
   * the matrices/arrays being traversed.
   * @returns Transformed map of matrices
   */
  map<T extends MathCollection>(
    x: T,
    ...args: Array<
      | T
      | ((
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          value: any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...args: Array<any | number[] | T>
        ) => MathType | string)
    >
  ): T

  /**
   * Create a matrix filled with ones. The created matrix can have one or
   * multiple dimensions.
   * @param size The size of each dimension of the matrix
   * @param format The matrix storage format
   * @returns A matrix filled with ones
   */
  ones(
    size?: number | number[] | BigNumber | BigNumber[],
    format?: string
  ): MathCollection
  /**
   * @param m The x dimension of the matrix
   * @param n The y dimension of the matrix
   * @param format The matrix storage format
   * @returns A matrix filled with ones
   */
  ones(
    m: number | BigNumber,
    n: number | BigNumber,
    format?: string
  ): MathCollection
  /**
   * @param m The x dimension of the matrix
   * @param n The y dimension of the matrix
   * @param p The z dimension of the matrix
   * @param format The matrix storage format
   * @returns A matrix filled with ones
   */
  ones(
    m: number | BigNumber,
    n: number | BigNumber,
    p: number | BigNumber,
    format?: string
  ): MathCollection
  /** Actually ones can take an arbitrary number of dimensions before the
   ** optional format, not sure how to write that in TypeScript
   **/

  /**
   * Partition-based selection of an array or 1D matrix. Will find the kth
   * smallest value, and mutates the input array. Uses Quickselect.
   * @param x A one dimensional matrix or array to sort
   * @param k The kth smallest value to be retrieved; zero-based index
   * @param compare  An optional comparator function. The function is
   * called as compare(a, b), and must return 1 when a > b, -1 when a < b,
   * and 0 when a == b. Default value: 'asc'.
   * @returns Returns the kth lowest value.
   */
  partitionSelect(
    x: MathCollection,
    k: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    compare?: 'asc' | 'desc' | ((a: any, b: any) => number)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any

  /**
   * Calculate the Moore–Penrose inverse of a matrix.
   * @param x Matrix to be inversed
   * @return The inverse of `x`.
   */
  pinv<T extends MathType>(x: T): T

  /**
   * Create an array from a range. By default, the range end is excluded.
   * This can be customized by providing an extra parameter includeEnd.
   * @param str A string 'start:end' or 'start:step:end'
   * @param start Start of the range
   * @param end End of the range, excluded by default, included when
   * parameter includeEnd=true
   * @param step Step size. Default value is 1.
   * @param includeEnd: Option to specify whether to include the end or
   * not. False by default
   * @returns Parameters describing the ranges start, end, and optional
   * step.
   */
  range(str: string, includeEnd?: boolean): Matrix
  range(
    start: number | BigNumber,
    end: number | BigNumber,
    includeEnd?: boolean
  ): Matrix
  range(
    start: number | BigNumber | Unit,
    end: number | BigNumber | Unit,
    step: number | BigNumber | Unit,
    includeEnd?: boolean
  ): Matrix

  /**
   * Reshape a multi dimensional array to fit the specified dimensions
   * @param x Matrix to be reshaped
   * @param sizes One dimensional array with integral sizes for each
   * dimension
   * @returns A reshaped clone of matrix x
   */
  reshape<T extends MathCollection>(x: T, sizes: number[]): T

  /**
   * Resize a matrix
   * @param x Matrix to be resized
   * @param size One dimensional array with numbers
   * @param defaultValue Zero by default, except in case of a string, in
   * that case defaultValue = ' ' Default value: 0.
   * @returns A resized clone of matrix x
   */
  resize<T extends MathCollection>(
    x: T,
    size: MathCollection,
    defaultValue?: number | string
  ): T

  /**
   * Return a Rotation Matrix for a given angle in radians
   * @param {number | BigNumber | Complex | Unit} theta    Rotation angle
   * @param {Array | Matrix} [v]                           Rotation axis
   * @param {string} [format]                              Result Matrix storage format. Default value: 'dense'.
   * @return {Matrix}                                      Rotation Matrix
   */
  rotationMatrix<T extends MathCollection>(
    theta?: number | BigNumber | Complex | Unit,
    axis?: T,
    format?: 'sparse' | 'dense'
  ): T

  /**
   * Return a row from a Matrix.
   * @param value An array or matrix
   * @param row The index of the row
   * @returns The retrieved row
   */
  row<T extends MathCollection>(value: T, row: number): T

  /**
   * Return a column from a Matrix.
   * @param value An array or matrix
   * @param column The index of the column
   * @returns The retrieved column
   */
  column<T extends MathCollection>(value: T, column: number): T

  /**
   * Return a rotated matrix.
   * @param {Array | Matrix} w                             Vector to rotate
   * @param {number | BigNumber | Complex | Unit} theta    Rotation angle
   * @param {Array | Matrix} [v]                           Rotation axis
   * @return {Array | Matrix}                              Multiplication of the rotation matrix and w
   */
  rotate<T extends MathCollection>(
    w: T,
    theta: number | BigNumber | Complex | Unit,
    v?: T
  ): T

  /**
   * Calculate the size of a matrix or scalar.
   * @param A matrix
   * @returns A vector with the size of x
   */
  size(
    x: boolean | number | Complex | Unit | string | MathCollection
  ): MathCollection

  /**
   * Sort the items in a matrix
   * @param x A one dimensional matrix or array to sort
   * @param compare An optional _comparator function or name. The function
   * is called as compare(a, b), and must return 1 when a > b, -1 when a <
   * b, and 0 when a == b. Default value: ‘asc’
   * @returns Returns the sorted matrix
   */
  sort<T extends MathCollection>(
    x: T,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    compare: ((a: any, b: any) => number) | 'asc' | 'desc' | 'natural'
  ): T

  /**
   * Calculate the principal square root of a square matrix. The principal
   * square root matrix X of another matrix A is such that X * X = A.
   * @param A The square matrix A
   * @returns The principal square root of matrix A
   */
  sqrtm<T extends MathCollection>(A: T): T

  /**
   * Squeeze a matrix, remove inner and outer singleton dimensions from a
   * matrix.
   * @param x Matrix to be squeezed
   * @returns Squeezed matrix
   */
  squeeze<T extends MathCollection>(x: T): T

  /**
   * Get or set a subset of a matrix or string.
   * @param value An array, matrix, or string
   * @param index For each dimension, an index or list of indices to get or set.
   * @param replacement An array, matrix, or scalar. If provided, the
   * subset is replaced with replacement. If not provided, the subset is
   * returned
   * @param defaultValue Default value, filled in on new entries when the
   * matrix is resized. If not provided, math.matrix elements will be left
   * undefined. Default value: undefined.
   * @returns Either the retrieved subset or the updated matrix
   */
  subset<T extends MathCollection | string>(
    value: T,
    index: Index,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    replacement?: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValue?: any
  ): T

  /**
   * Calculate the trace of a matrix: the sum of the elements on the main
   * diagonal of a square matrix.
   * @param x A matrix
   * @returns The trace of x
   */
  trace(x: MathCollection): number

  /**
   * Transpose a matrix. All values of the matrix are reflected over its
   * main diagonal. Only two dimensional matrices are supported.
   * @param x Matrix to be transposed
   * @returns The transposed matrix
   */
  transpose<T extends MathCollection>(x: T): T

  /**
   * Create a matrix filled with zeros. The created matrix can have one or
   * multiple dimensions.
   * @param size The size of each dimension of the matrix
   * @param format The matrix storage format
   * @returns A matrix filled with zeros
   */
  zeros(
    size?: number | number[] | BigNumber | BigNumber[],
    format?: string
  ): MathCollection
  /**
   * @param m The x dimension of the matrix
   * @param n The y dimension of the matrix
   * @param format The matrix storage format
   * @returns A matrix filled with zeros
   */
  zeros(
    m: number | BigNumber,
    n: number | BigNumber,
    format?: string
  ): MathCollection
  /**
   * @param m The x dimension of the matrix
   * @param n The y dimension of the matrix
   * @param p The z dimension of the matrix
   * @param format The matrix storage format
   * @returns A matrix filled with zeros
   */
  zeros(
    m: number | BigNumber,
    n: number | BigNumber,
    p: number | BigNumber,
    format?: string
  ): MathCollection
  /** Actually zeros can take any number of dimensions before the
   ** optional format, not sure how to write that in TypeScript
   **/

  /**
   * Calculate N-dimensional Fourier transform
   * @param {Array | Matrix} arr    An array or matrix
   * @return {Array | Matrix}       N-dimensional Fourier transformation of the array
   */
  fft<T extends MathCollection>(arr: T): T

  /**
   * Calculate N-dimensional inverse Fourier transform
   * @param {Array | Matrix} arr    An array or matrix
   * @return {Array | Matrix}       N-dimensional Fourier transformation of the array
   */
  ifft<T extends MathCollection>(arr: T): T

  /*************************************************************************
   * Probability functions
   ************************************************************************/

  /**
   * Compute the number of ways of picking k unordered outcomes from n
   * possibilities. Combinations only takes integer arguments. The
   * following condition must be enforced: k <= n.
   * @param n Total number of objects in the set
   * @param k Number of objects in the subset
   * @returns Number of possible combinations
   */
  combinations<T extends number | BigNumber>(
    n: T,
    k: number | BigNumber
  ): NoLiteralType<T>

  /**
   * Compute the factorial of a value Factorial only supports an integer
   * value as argument. For matrices, the function is evaluated element
   * wise.
   * @param n An integer number
   * @returns The factorial of n
   */
  factorial<T extends number | BigNumber | MathCollection>(
    n: T
  ): NoLiteralType<T>

  /**
   * Compute the gamma function of a value using Lanczos approximation for
   * small values, and an extended Stirling approximation for large
   * values.
   * @param n A real or complex number
   * @returns The gamma of n
   */
  gamma<T extends number | BigNumber | Complex>(n: T): NoLiteralType<T>

  /**
   * Calculate the Kullback-Leibler (KL) divergence between two
   * distributions
   * @param q First vector
   * @param p Second vector
   * @returns Returns disance between q and p
   */
  kldivergence(q: MathCollection, p: MathCollection): number

  /**
   * Compute the log gamma function of a value, using Lanczos approximation for numbers and Stirling series for complex numbers.
   * @param n A real or complex number
   * @returns The log gamma of `n`
   */
  lgamma<T extends number | Complex>(n: T): NoLiteralType<T>

  /**
   * Multinomial Coefficients compute the number of ways of picking a1,
   * a2, ..., ai unordered outcomes from n possibilities. multinomial
   * takes one array of integers as an argument. The following condition
   * must be enforced: every ai <= 0
   * @param a Integer number of objects in the subset
   * @returns multinomial coefficent
   */
  multinomial<T extends number | BigNumber>(a: T[]): NoLiteralType<T>

  /**
   * Compute the number of ways of obtaining an ordered subset of k
   * elements from a set of n elements. Permutations only takes integer
   * arguments. The following condition must be enforced: k <= n.
   * @param n The number of objects in total
   * @param k The number of objects in the subset
   * @returns The number of permutations
   */
  permutations<T extends number | BigNumber>(
    n: T,
    k?: number | BigNumber
  ): NoLiteralType<T>

  /**
   * Random pick a value from a one dimensional array. Array element is
   * picked using a random function with uniform distribution.
   * @param array A one dimensional array
   * @param number An int or float
   * @param weights An array of ints or floats
   * @returns Returns a single random value from array when number is undefined.
   * Returns an array with the configured number of elements when number is defined.
   */
  pickRandom<T>(array: T[]): T
  pickRandom<T>(array: T[], number: number): T[]
  pickRandom<T>(array: T[], number: number, weights: number[]): T[]

  /**
   * Return a random number larger or equal to min and smaller than max
   * using a uniform distribution.
   * @param size If provided, an array or matrix with given size and
   * filled with random values is returned
   * @param min Minimum boundary for the random value, included
   * @param max Maximum boundary for the random value, excluded
   * @returns A random number
   */
  random(min?: number, max?: number): number
  random<T extends MathCollection>(size: T, min?: number, max?: number): T

  /**
   * Return a random integer number larger or equal to min and smaller
   * than max using a uniform distribution.
   * @param size If provided, an array or matrix with given size and
   * filled with random values is returned
   * @param min Minimum boundary for the random value, included
   * @param max Maximum boundary for the random value, excluded
   * @returns A random number
   */
  randomInt(min: number, max?: number): number
  randomInt<T extends MathCollection>(size: T, min?: number, max?: number): T

  /*************************************************************************
   * Relational functions
   ************************************************************************/

  /**
   * Compare two values. Returns 1 when x > y, -1 when x < y, and 0 when x
   * == y. x and y are considered equal when the relative difference
   * between x and y is smaller than the configured relTol and absTol. The function
   * cannot be used to compare values smaller than approximately 2.22e-16.
   * For matrices, the function is evaluated element wise.
   * @param x First value to compare
   * @param y Second value to compare
   * @returns Returns the result of the comparison: 1 when x > y, -1 when
   * x < y, and 0 when x == y.
   */
  compare(
    x: MathType | string,
    y: MathType | string
  ): number | BigNumber | Fraction | MathCollection

  /**
   * Compare two values of any type in a deterministic, natural way. For
   * numeric values, the function works the same as math.compare. For
   * types of values that can’t be compared mathematically, the function
   * compares in a natural way.
   * @param x First value to compare
   * @param y Second value to compare
   * @returns Returns the result of the comparison: 1 when x > y, -1 when
   * x < y, and 0 when x == y.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  compareNatural(x: any, y: any): number

  /**
   * Compare two strings lexically. Comparison is case sensitive. Returns
   * 1 when x > y, -1 when x < y, and 0 when x == y. For matrices, the
   * function is evaluated element wise.
   * @param x First string to compare
   * @param y Second string to compare
   * @returns Returns the result of the comparison: 1 when x > y, -1 when
   * x < y, and 0 when x == y.
   */
  compareText(
    x: string | MathCollection,
    y: string | MathCollection
  ): number | MathCollection

  /**
   * Test element wise whether two matrices are equal. The function
   * accepts both matrices and scalar values.
   * @param x First matrix to compare
   * @param y Second amtrix to compare
   * @returns Returns true when the input matrices have the same size and
   * each of their elements is equal.
   */
  deepEqual(x: MathType, y: MathType): MathType

  /**
   * Test whether two values are equal.
   *
   * The function tests whether the relative difference between x and y is
   * smaller than the configured relTol and absTol. The function cannot be used to
   * compare values smaller than approximately 2.22e-16. For matrices, the
   * function is evaluated element wise. In case of complex numbers, x.re
   * must equal y.re, and x.im must equal y.im. Values null and undefined
   * are compared strictly, thus null is only equal to null and nothing
   * else, and undefined is only equal to undefined and nothing else.
   * @param x First value to compare
   * @param y Second value to compare
   * @returns Returns true when the compared values are equal, else
   * returns false
   */
  equal(x: MathType | string, y: MathType | string): boolean | MathCollection

  /**
   * Check equality of two strings. Comparison is case sensitive. For
   * matrices, the function is evaluated element wise.
   * @param x First string to compare
   * @param y Second string to compare
   * @returns Returns true if the values are equal, and false if not.
   */
  equalText(
    x: string | MathCollection,
    y: string | MathCollection
  ): number | MathCollection

  /**
   * Test whether value x is larger than y. The function returns true when
   * x is larger than y and the relative difference between x and y is
   * larger than the configured relTol and absTol. The function cannot be used to
   * compare values smaller than approximately 2.22e-16. For matrices, the
   * function is evaluated element wise.
   * @param x First value to compare
   * @param y Second value to vcompare
   * @returns Returns true when x is larger than y, else returns false
   */
  larger(x: MathType | string, y: MathType | string): boolean | MathCollection

  /**
   * Test whether value x is larger or equal to y. The function returns
   * true when x is larger than y or the relative difference between x and
   * y is smaller than the configured relTol and absTol. The function cannot be used
   * to compare values smaller than approximately 2.22e-16. For matrices,
   * the function is evaluated element wise.
   * @param x First value to compare
   * @param y Second value to vcompare
   * @returns Returns true when x is larger than or equal to y, else
   * returns false
   */
  largerEq(x: MathType | string, y: MathType | string): boolean | MathCollection

  /**
   * Test whether value x is smaller than y. The function returns true
   * when x is smaller than y and the relative difference between x and y
   * is smaller than the configured relTol and absTol. The function cannot be used
   * to compare values smaller than approximately 2.22e-16. For matrices,
   * the function is evaluated element wise.
   * @param x First value to compare
   * @param y Second value to vcompare
   * @returns Returns true when x is smaller than y, else returns false
   */
  smaller(x: MathType | string, y: MathType | string): boolean | MathCollection

  /**
   * Test whether value x is smaller or equal to y. The function returns
   * true when x is smaller than y or the relative difference between x
   * and y is smaller than the configured relTol and absTol. The function cannot be
   * used to compare values smaller than approximately 2.22e-16. For
   * matrices, the function is evaluated element wise.
   * @param x First value to compare
   * @param y Second value to vcompare
   * @returns Returns true when x is smaller than or equal to y, else
   * returns false
   */
  smallerEq(
    x: MathType | string,
    y: MathType | string
  ): boolean | MathCollection

  /**
   * Determines if two expressions are symbolically equal, i.e. one is the
   * result of valid algebraic manipulations on the other.
   * @param {Node} expr1 The first expression to compare
   * @param {Node} expr2 The second expression to compare
   * @param {Object} [options] Optional option object, passed to simplify
   * @returns {boolean} Returns true if a valid manipulation making the
   * expressions equal is found.
   */
  symbolicEqual(
    expr1: MathNode,
    expr2: MathNode,
    options?: SimplifyOptions
  ): boolean

  /**
   * Test whether two values are unequal. The function tests whether the
   * relative difference between x and y is larger than the configured
   * relTol and absTol. The function cannot be used to compare values smaller than
   * approximately 2.22e-16. For matrices, the function is evaluated
   * element wise. In case of complex numbers, x.re must unequal y.re, or
   * x.im must unequal y.im. Values null and undefined are compared
   * strictly, thus null is unequal with everything except null, and
   * undefined is unequal with everything except undefined.
   * @param x First value to compare
   * @param y Second value to vcompare
   * @returns Returns true when the compared values are unequal, else
   * returns false
   */
  unequal(x: MathType | string, y: MathType | string): boolean | MathCollection

  /*************************************************************************
   * Set functions
   ************************************************************************/

  /**
   * Create the cartesian product of two (multi)sets. Multi-dimension
   * arrays will be converted to single-dimension arrays and the values
   * will be sorted in ascending order before the operation.
   * @param a1 A (multi)set
   * @param a2 A (multi)set
   * @returns The cartesian product of two (multi)sets
   */
  setCartesian<T extends MathCollection>(a1: T, a2: MathCollection): T

  /**
   * Create the difference of two (multi)sets: every element of set1, that
   * is not the element of set2. Multi-dimension arrays will be converted
   * to single-dimension arrays before the operation
   * @param a1 A (multi)set
   * @param a2 A (multi)set
   * @returns The difference of two (multi)sets
   */
  setDifference<T extends MathCollection>(a1: T, a2: MathCollection): T

  /**
   * Collect the distinct elements of a multiset. A multi-dimension array
   * will be converted to a single-dimension array before the operation.
   * @param a A multiset
   * @returns A set containing the distinct elements of the multiset
   */
  setDistinct<T extends MathCollection>(a: T): T

  /**
   * Create the intersection of two (multi)sets. Multi-dimension arrays
   * will be converted to single-dimension arrays before the operation.
   * @param a1 A (multi)set
   * @param a2 A (multi)set
   * @returns The intersection of two (multi)sets
   */
  setIntersect<T extends MathCollection>(a1: T, a2: MathCollection): T

  /**
   * Check whether a (multi)set is a subset of another (multi)set. (Every
   * element of set1 is the element of set2.) Multi-dimension arrays will
   * be converted to single-dimension arrays before the operation.
   * @param a1 A (multi)set
   * @param a2 A (multi)set
   * @returns True if a1 is subset of a2, else false
   */
  setIsSubset(a1: MathCollection, a2: MathCollection): boolean

  /**
   * Count the multiplicity of an element in a multiset. A multi-dimension
   * array will be converted to a single-dimension array before the
   * operation.
   * @param e An element in the multiset
   * @param a A multiset
   * @returns The number of how many times the multiset contains the
   * element
   */
  setMultiplicity(e: MathNumericType, a: MathCollection): number

  /**
   * Create the powerset of a (multi)set. (The powerset contains very
   * possible subsets of a (multi)set.) A multi-dimension array will be
   * converted to a single-dimension array before the operation.
   * @param a A multiset
   * @returns The powerset of the (multi)set
   */
  setPowerset<T extends MathCollection>(a: T): T

  /**
   * Count the number of elements of a (multi)set. When a second parameter
   * is ‘true’, count only the unique values. A multi-dimension array will
   * be converted to a single-dimension array before the operation.
   * @param a A multiset
   * @returns The number of elements of the (multi)set
   */
  setSize(a: MathCollection): number

  /**
   * Create the symmetric difference of two (multi)sets. Multi-dimension
   * arrays will be converted to single-dimension arrays before the
   * operation.
   * @param a1 A (multi)set
   * @param a2 A (multi)set
   * @returns The symmetric difference of two (multi)sets
   */
  setSymDifference<T extends MathCollection>(a1: T, a2: MathCollection): T

  /**
   * Create the union of two (multi)sets. Multi-dimension arrays will be
   * converted to single-dimension arrays before the operation.
   * @param a1 A (multi)set
   * @param a2 A (multi)set
   * @returns The union of two (multi)sets
   */
  setUnion<T extends MathCollection>(a1: T, a2: MathCollection): T

  /*************************************************************************
   * Signal functions
   ************************************************************************/
  /**
   * Compute the transfer function of a zero-pole-gain model.
   * @param z Zeroes of the model
   * @param p Poles of the model
   * @param k Gain of the model
   * @returns The transfer function as array of numerator and denominator
   */
  zpk2tf<T extends MathCollection>(z: T, p: T, k?: number): T

  /**
   * Calculates the frequency response of a filter given its numerator and denominator coefficients.
   * @param b The numerator polynomial of the filter
   * @param a The denominator polynomial of the filter
   * @param w The range of frequencies in which the response is to be calculated
   * @returns The frequency response
   *
   */
  freqz<T extends MathCollection>(b: T, a: T, w?: number | T): { w: T; h: T }

  /*************************************************************************
   * Special functions
   ************************************************************************/

  /**
   * Compute the erf function of a value using a rational Chebyshev
   * approximations for different intervals of x.
   * @param x A real number
   * @returns The erf of x
   */
  erf<T extends number | MathCollection>(x: T): NoLiteralType<T>

  /**
   * Compute the Riemann Zeta function of a value using an infinite series
   * and Riemann's Functional equation.
   * @param s A real, complex or BigNumber
   * @returns The Riemann Zeta of s
   */
  zeta<T extends number | Complex | BigNumber>(s: T): T

  /*************************************************************************
   * Statistics functions
   ************************************************************************/

  /**
   * Compute the median absolute deviation of a matrix or a list with
   * values. The median absolute deviation is defined as the median of the
   * absolute deviations from the median.
   * @param array A single matrix or multiple scalar values.
   * @returns The median absolute deviation
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mad(array: MathCollection): any

  /**
   * Compute the maximum value of a matrix or a list with values. In case
   * of a multi dimensional array, the maximum of the flattened array will
   * be calculated. When dim is provided, the maximum over the selected
   * dimension will be calculated. Parameter dim is zero-based.
   * @param args Multiple scalar values
   * @returns The maximum value
   */
  max<T extends MathScalarType>(...args: T[]): T
  /**
   * @param args Multiple scalar values
   * @returns The maximum value
   */
  max(...args: MathScalarType[]): MathScalarType
  /**
   * @param A A single matrix
   * @param dimension The maximum over the selected dimension
   * @returns The maximum value
   */
  max<T extends MathScalarType>(
    A: T[] | T[][],
    dimension?: number | BigNumber
  ): T
  /**
   * @param A A single matrix
   * @param dimension The maximum over the selected dimension
   * @returns The maximum value
   */
  max(A: MathCollection, dimension?: number | BigNumber): MathScalarType

  /**
   * Compute the mean value of matrix or a list with values. In case of a
   * multi dimensional array, the mean of the flattened array will be
   * calculated. When dim is provided, the maximum over the selected
   * dimension will be calculated. Parameter dim is zero-based.
   * @param args Multiple scalar values
   * @returns The mean of all values
   */
  mean<T extends MathScalarType>(...args: T[]): T
  /**
   * @param args Multiple scalar values
   * @returns The mean value
   */
  mean(...args: MathScalarType[]): MathScalarType
  /**
   * @param A A single matrix
   * @param dimension The mean over the selected dimension
   * @returns The mean value
   */
  mean<T extends MathScalarType>(
    A: T[] | T[][],
    dimension?: number | BigNumber
  ): T
  /**
   * @param A A single matrix
   * @param dimension The mean over the selected dimension
   * @returns The mean value
   */
  mean(A: MathCollection, dimension?: number | BigNumber): MathScalarType

  /**
   * Compute the median of a matrix or a list with values. The values are
   * sorted and the middle value is returned. In case of an even number of
   * values, the average of the two middle values is returned. Supported
   * types of values are: Number, BigNumber, Unit In case of a (multi
   * dimensional) array or matrix, the median of all elements will be
   * calculated.
   * @param args Multiple scalar values
   * @returns The median value
   */
  median<T extends MathScalarType>(...args: T[]): T
  /**
   * @param args Multiple scalar values
   * @returns The median value
   */
  median(...args: MathScalarType[]): MathScalarType
  /**
   * @param A A single matrix
   * @returns The median value
   */
  median<T extends MathScalarType>(A: T[] | T[][]): T
  /**
   * @param A A single matrix
   * @returns The median value
   */
  median(A: MathCollection): MathScalarType

  /**
   * Compute the minimum value of a matrix or a list of values. In case of
   * a multi dimensional array, the minimum of the flattened array will be
   * calculated. When dim is provided, the minimum over the selected
   * dimension will be calculated. Parameter dim is zero-based.
   * @param args multiple scalar values
   * @returns The minimum value
   */
  min<T extends MathScalarType>(...args: T[]): T
  /**
   * @param args Multiple scalar values
   * @returns The minimum value
   */
  min(...args: MathScalarType[]): MathScalarType
  /**
   * @param A A single matrix
   * @param dimension The minimum over the selected dimension
   * @returns The minimum value
   */
  min<T extends MathScalarType>(
    A: T[] | T[][],
    dimension?: number | BigNumber
  ): T
  /**
   * @param A A single matrix
   * @param dimension The minimum over the selected dimension
   * @returns The minimum value
   */
  min(A: MathCollection, dimension?: number | BigNumber): MathScalarType

  /**
   * Computes the mode of a set of numbers or a list with values(numbers
   * or characters). If there are more than one modes, it returns a list
   * of those values.
   * @param args Multiple scalar values
   * @returns The mode of all values
   */
  mode<T extends MathScalarType>(...args: T[]): T[]
  /**
   * @param args Multiple scalar values
   * @returns The mode of all values
   */
  mode(...args: MathScalarType[]): MathScalarType[]
  /**
   * @param A A single matrix
   * @returns The mode value
   */
  mode<T extends MathScalarType>(A: T[] | T[][]): T[]
  /**
   * @param A A single matrix
   * @returns The mode of all values
   */
  mode(A: MathCollection): MathScalarType[]

  /**
   * Compute the product of a matrix or a list with values. In case of a
   * (multi dimensional) array or matrix, the sum of all elements will be
   * calculated.
   * @param args Multiple scalar values
   * @returns The product of all values
   */
  prod<T extends MathScalarType>(...args: T[]): T
  /**
   * @param args Multiple scalar values
   * @returns The product of all values
   */
  prod(...args: MathScalarType[]): MathScalarType
  /**
   * @param A A single matrix
   * @returns The product of all values
   */
  prod<T extends MathScalarType>(A: T[] | T[][]): T
  /**
   * @param A A single matrix
   * @returns The product of all values
   */
  prod(A: MathCollection): MathScalarType

  /**
   * @param A A single matrix
   * @param probOrN prob is the order of the quantile, while N is the
   * amount of evenly distributed steps of probabilities; only one of
   * these options can be provided
   * @param sorted =false is data sorted in ascending order
   * @returns Quantile(s)
   */
  quantileSeq<T extends MathScalarType>(
    A: T[] | T[][],
    prob: number | BigNumber,
    sorted?: boolean
  ): T
  /**
   * Compute the prob order quantile of a matrix or a list with values.
   * The sequence is sorted and the middle value is returned. Supported
   * types of sequence values are: Number, BigNumber, Unit Supported types
   * of probability are: Number, BigNumber In case of a (multi
   * dimensional) array or matrix, the prob order quantile of all elements
   * will be calculated.
   * @param A A single matrix or array
   * @param probOrN prob is the order of the quantile, while N is the
   * amount of evenly distributed steps of probabilities; only one of
   * these options can be provided
   * @param sorted =false is data sorted in ascending order
   * @returns Quantile(s)
   */
  quantileSeq(
    A: MathCollection,
    prob: number | BigNumber | MathArray,
    sorted?: boolean
  ): MathScalarType | MathArray

  /**
   * Compute the standard deviation of a matrix or a list with values. The
   * standard deviations is defined as the square root of the variance:
   * std(A) = sqrt(variance(A)). In case of a (multi dimensional) array or
   * matrix, the standard deviation over all elements will be calculated.
   * Optionally, the type of normalization can be specified as second
   * parameter. The parameter normalization can be one of the following
   * values: 'unbiased' (default) The sum of squared errors is divided by
   * (n - 1) 'uncorrected' The sum of squared errors is divided by n
   * 'biased' The sum of squared errors is divided by (n + 1)
   * @param args variadic argument of number to calculate standard deviation
   * @returns The standard deviation
   */
  std<T extends MathScalarType>(...args: T[]): T
  /**
   * @param args Multiple scalar values
   * @returns The standard deviation
   */
  std(...args: MathScalarType[]): MathScalarType
  /**
   * Compute the standard deviation of a matrix or a list with values. The
   * standard deviations is defined as the square root of the variance:
   * std(A) = sqrt(variance(A)). In case of a (multi dimensional) array or
   * matrix, the standard deviation over all elements will be calculated.
   * Optionally, the type of normalization can be specified as second
   * parameter. The parameter normalization can be one of the following
   * values: 'unbiased' (default) The sum of squared errors is divided by
   * (n - 1) 'uncorrected' The sum of squared errors is divided by n
   * 'biased' The sum of squared errors is divided by (n + 1)
   * @param array A single matrix to compute standard deviation.
   * @param dimension A dimension to calculate standard deviation
   * @param normalization Determines how to normalize the variance. Choose
   * ‘unbiased’ (default), ‘uncorrected’, or ‘biased’. Default value:
   * ‘unbiased’.
   * @returns The standard deviation array
   */
  std(
    array: MathCollection,
    dimension?: number,
    normalization?: 'unbiased' | 'uncorrected' | 'biased'
  ): MathNumericType[]
  /**
   * Compute the standard deviation of a matrix or a list with values. The
   * standard deviations is defined as the square root of the variance:
   * std(A) = sqrt(variance(A)). In case of a (multi dimensional) array or
   * matrix, the standard deviation over all elements will be calculated.
   * Optionally, the type of normalization can be specified as second
   * parameter. The parameter normalization can be one of the following
   * values: 'unbiased' (default) The sum of squared errors is divided by
   * (n - 1) 'uncorrected' The sum of squared errors is divided by n
   * 'biased' The sum of squared errors is divided by (n + 1)
   * @param array A single matrix or multiple scalar values
   * @param normalization Determines how to normalize the variance. Choose
   * ‘unbiased’ (default), ‘uncorrected’, or ‘biased’. Default value:
   * ‘unbiased’.
   * @returns The standard deviation
   */
  std(
    array: MathCollection,
    normalization: 'unbiased' | 'uncorrected' | 'biased'
  ): MathNumericType

  /**
   * Compute the sum of a matrix or a list with values. In case of a
   * (multi dimensional) array or matrix, the sum of all elements will be
   * calculated.
   * @param args A single matrix or multiple scalar values
   * @returns The sum of all values
   */
  sum<T extends MathScalarType>(...args: T[]): T
  /**
   * @param args Multiple scalar values
   * @returns The sum of all values
   */
  sum(...args: MathScalarType[]): MathScalarType
  /**
   * @param A A single matrix
   * @param dimension The sum over the selected dimension
   * @returns The sum of all values
   */
  sum<T extends MathScalarType>(
    A: T[] | T[][],
    dimension?: number | BigNumber
  ): T
  /**
   * @param A A single matrix
   * @param dimension The sum over the selected dimension
   * @returns The sum of all values
   */
  sum(A: MathCollection, dimension?: number | BigNumber): MathScalarType

  /**
   * Count the number of elements of a matrix, array or string.
   * @param x A matrix, array or string.
   * @returns The number of members passed in parameters
   */
  count(x: MathCollection | string): number

  /**
   * Compute the cumulative sum of a matrix or a list with values.
   * In case of a (multi dimensional) array or matrix, the cumulative sums
   * along a specified dimension (defaulting to the first) will be calculated.
   * @param args A single matrix or multiple scalar values
   * @returns The cumulative sums of the the values.
   */
  cumsum(...args: MathType[]): MathType[]
  /**
   * @param array A single matrix
   * @param dim The dimension along which to sum (defaults to 0)
   * @returns The cumulative sums along the given dimension
   */
  cumsum(array: MathCollection, dim?: number): MathCollection

  /**
   * Compute the variance of a matrix or a list with values. In case of a
   * (multi dimensional) array or matrix, the variance over all elements
   * will be calculated. Optionally, the type of normalization can be
   * specified as second parameter. The parameter normalization can be one
   * of the following values: 'unbiased' (default) The sum of squared
   * errors is divided by (n - 1) 'uncorrected' The sum of squared errors
   * is divided by n 'biased' The sum of squared errors is divided by (n +
   * 1) Note that older browser may not like the variable name var. In
   * that case, the function can be called as math['var'](...) instead of
   * math.variance(...).
   * @param args A single matrix or multiple scalar values
   * @returns The variance
   */
  variance(...args: MathNumericType[]): MathNumericType
  /**
   * Compute the variance of a matrix or a list with values. In case of a
   * (multi dimensional) array or matrix, the variance over all elements
   * will be calculated. Optionally, the type of normalization can be
   * specified as second parameter. The parameter normalization can be one
   * of the following values: 'unbiased' (default) The sum of squared
   * errors is divided by (n - 1) 'uncorrected' The sum of squared errors
   * is divided by n 'biased' The sum of squared errors is divided by (n +
   * 1) Note that older browser may not like the variable name var. In
   * that case, the function can be called as math['var'](...) instead of
   * math.variance(...).
   * @param array A matrix to compute variance.
   * @param dimension A dimension to compute variance on
   * @param normalization normalization Determines how to normalize the
   * variance. Choose ‘unbiased’ (default), ‘uncorrected’, or ‘biased’.
   * Default value: ‘unbiased’.
   * @returns variance matrix.
   */
  variance(
    array: MathCollection,
    dimension?: number,
    normalization?: 'unbiased' | 'uncorrected' | 'biased'
  ): MathNumericType[]
  /**
   * @param array A single matrix
   * @param normalization normalization Determines how to normalize the
   * variance. Choose ‘unbiased’ (default), ‘uncorrected’, or ‘biased’.
   * Default value: ‘unbiased’.
   * @returns The variance
   */
  variance(
    array: MathCollection,
    normalization: 'unbiased' | 'uncorrected' | 'biased'
  ): MathNumericType

  /**
   * Calculate the correlation coefficient between two matrix.
   * @param {Array | Matrix} x The first array or matrix to compute correlation coefficient
   * @param {Array | Matrix} y The second array or matrix to compute correlation coefficient
   * @returns correlation coefficient
   */
  corr(x: MathCollection, y: MathCollection): MathType

  /*************************************************************************
   * String functions
   ************************************************************************/

  /**
   * Format a value of any type into a string.
   * @param value The value to be formatted
   * @param options An object with formatting options.
   * @param callback A custom formatting function, invoked for all numeric
   * elements in value, for example all elements of a matrix, or the real
   * and imaginary parts of a complex number. This callback can be used to
   * override the built-in numeric notation with any type of formatting.
   * Function callback is called with value as parameter and must return a
   * string.
   * @see http://mathjs.org/docs/reference/functions/format.html
   * @returns The formatted value
   */
  format(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: FormatOptions | number | BigNumber | ((item: any) => string),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback?: (value: any) => string
  ): string

  /**
   * Interpolate values into a string template.
   * @param template A string containing variable placeholders.
   * @param values An object containing variables which will be filled in
   * in the template.
   * @param precision Number of digits to format numbers. If not provided,
   * the value will not be rounded.
   * @param options Formatting options, or the number of digits to format
   * numbers. See function math.format for a description of all options.
   * @returns Interpolated string
   */
  print(
    template: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    values: any,
    precision?: number,
    options?: number | object
  ): void

  /*************************************************************************
   * Trigonometry functions
   ************************************************************************/

  /**
   * Calculate the inverse cosine of a value.
   * @param x Function input
   * @returns The arc cosine of x
   */
  acos(x: number): number | Complex
  acos<T extends BigNumber | Complex>(x: T): T

  /**
   * Calculate the hyperbolic arccos of a value, defined as acosh(x) =
   * ln(sqrt(x^2 - 1) + x).
   * @param x Function input
   * @returns The hyperbolic arccosine of x
   */
  acosh(x: number): number | Complex
  acosh<T extends BigNumber | Complex>(x: T): T

  /**
   * Calculate the inverse cotangent of a value.
   * @param x Function input
   * @returns The arc cotangent of x
   */
  acot(x: number): number
  acot<T extends BigNumber | Complex>(x: T): T

  /**
   * Calculate the inverse hyperbolic tangent of a value, defined as acoth(x)
   * = (ln((x+1)/x) + ln(x/(x-1))) / 2.
   * @param x Function input
   * @returns The inverse hyperbolic tangent of x
   */
  acoth(x: number): number
  acoth<T extends BigNumber | Complex>(x: T): T

  /**
   * Calculate the inverse cosecant of a value.
   * @param x Function input
   * @returns The arc cosecant of x
   */
  acsc(x: number): number | Complex
  acsc<T extends BigNumber | Complex>(x: T): T

  /**
   * Calculate the inverse hyperbolic cosecant of a value, defined as acsch(x)
   * = ln(1/x + sqrt(1/x^2 + 1)).
   * @param x Function input
   * @returns The inverse hyperbolic cosecant of x
   */
  acsch(x: number): number
  acsch<T extends BigNumber | Complex>(x: T): T

  /**
   * Calculate the inverse secant of a value.
   * @param x Function input
   * @returns The arc secant of x
   */
  asec(x: number): number | Complex
  asec<T extends BigNumber | Complex>(x: T): T

  /**
   * Calculate the hyperbolic arcsecant of a value, defined as asech(x) =
   * ln(sqrt(1/x^2 - 1) + 1/x).
   * @param x Function input
   * @returns The hyperbolic arcsecant of x
   */
  asech(x: number): number | Complex
  asech<T extends BigNumber | Complex>(x: T): T

  /**
   * Calculate the inverse sine of a value.
   * @param x Function input
   * @returns The arc sine of x
   */
  asin(x: number): number | Complex
  asin<T extends BigNumber | Complex>(x: T): T

  /**
   * Calculate the hyperbolic arcsine of a value, defined as asinh(x) =
   * ln(x + sqrt(x^2 + 1)).
   * @param x Function input
   * @returns The hyperbolic arcsine of x
   */
  asinh<T extends number | BigNumber | Complex>(x: T): T

  /**
   * Calculate the inverse tangent of a value.
   * @param x Function input
   * @returns The arc tangent of x
   */
  atan<T extends number | BigNumber | Complex>(x: T): T

  /**
   * Calculate the inverse tangent function with two arguments, y/x. By
   * providing two arguments, the right quadrant of the computed angle can
   * be determined. For matrices, the function is evaluated element wise.
   * @param x Function input
   * @returns Four quadrant inverse tangent
   */
  atan2<T extends number | MathCollection>(y: T, x: T): T

  /**
   * Calculate the hyperbolic arctangent of a value, defined as atanh(x) =
   * ln((1 + x)/(1 - x)) / 2.
   * @param x Function input
   * @returns The hyperbolic arctangent of x
   */
  atanh(x: number): number | Complex
  atanh<T extends BigNumber | Complex>(x: T): T

  /**
   * Calculate the cosine of a value.
   * @param x Function input
   * @returns The cosine of x
   */
  cos(x: number | Unit): number
  cos<T extends BigNumber | Complex>(x: T): T

  /**
   * Calculate the hyperbolic cosine of a value, defined as cosh(x) = 1/2
   * * (exp(x) + exp(-x)).
   * @param x Function input
   * @returns The hyperbolic cosine of x
   */
  cosh(x: number | Unit): number
  cosh<T extends BigNumber | Complex>(x: T): T

  /**
   * Calculate the cotangent of a value. cot(x) is defined as 1 / tan(x).
   * @param x Function input
   * @returns The cotangent of x
   */
  cot(x: number | Unit): number
  cot<T extends BigNumber | Complex>(x: T): T

  /**
   * Calculate the hyperbolic cotangent of a value, defined as coth(x) = 1
   * / tanh(x).
   * @param x Function input
   * @returns The hyperbolic cotangent of x
   */
  coth(x: number | Unit): number
  coth<T extends BigNumber | Complex>(x: T): T

  /**
   * Calculate the cosecant of a value, defined as csc(x) = 1/sin(x).
   * @param x Function input
   * @returns The cosecant hof x
   */
  csc(x: number | Unit): number
  csc<T extends BigNumber | Complex>(x: T): T

  /**
   * Calculate the hyperbolic cosecant of a value, defined as csch(x) = 1
   * / sinh(x).
   * @param x Function input
   * @returns The hyperbolic cosecant of x
   */
  csch(x: number | Unit): number
  csch<T extends BigNumber | Complex>(x: T): T

  /**
   * Calculate the secant of a value, defined as sec(x) = 1/cos(x).
   * @param x Function input
   * @returns The secant of x
   */
  sec(x: number | Unit): number
  sec<T extends BigNumber | Complex>(x: T): T

  /**
   * Calculate the hyperbolic secant of a value, defined as sech(x) = 1 /
   * cosh(x).
   * @param x Function input
   * @returns The hyperbolic secant of x
   */
  sech(x: number | Unit): number
  sech<T extends BigNumber | Complex>(x: T): T

  /**
   * Calculate the sine of a value.
   * @param x Function input
   * @returns The sine of x
   */
  sin(x: number | Unit): number
  sin<T extends BigNumber | Complex>(x: T): T

  /**
   * Calculate the hyperbolic sine of a value, defined as sinh(x) = 1/2 *
   * (exp(x) - exp(-x)).
   * @param x Function input
   * @returns The hyperbolic sine of x
   */
  sinh(x: number | Unit): number
  sinh<T extends BigNumber | Complex>(x: T): T

  /**
   * Calculate the tangent of a value. tan(x) is equal to sin(x) / cos(x).
   * @param x Function input
   * @returns The tangent of x
   */
  tan(x: number | Unit): number
  tan<T extends BigNumber | Complex>(x: T): T

  /**
   * Calculate the hyperbolic tangent of a value, defined as tanh(x) =
   * (exp(2 * x) - 1) / (exp(2 * x) + 1).
   * @param x Function input
   * @returns The hyperbolic tangent of x
   */
  tanh(x: number | Unit): number
  tanh<T extends BigNumber | Complex>(x: T): T

  /*************************************************************************
   * Unit functions
   ************************************************************************/

  /**
   * Change the unit of a value. For matrices, the function is evaluated
   * element wise.
   * @param x The unit to be converted.
   * @param unit New unit. Can be a string like "cm" or a unit without
   * value.
   * @returns Value with changed, fixed unit
   */
  to(x: Unit | MathCollection, unit: Unit | string): Unit | MathCollection

  /*************************************************************************
   * Utils
   ************************************************************************/
  isNumber(x: unknown): x is number

  isBigNumber(x: unknown): x is BigNumber

  isBigInt(x: unknown): x is bigint

  isComplex(x: unknown): x is Complex

  isFraction(x: unknown): x is Fraction

  isUnit(x: unknown): x is Unit

  isString(x: unknown): x is string

  isArray: ArrayConstructor['isArray']

  isMatrix(x: unknown): x is Matrix

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isCollection(x: unknown): x is Matrix | any[]

  isDenseMatrix(x: unknown): x is Matrix

  isSparseMatrix(x: unknown): x is Matrix

  isRange(x: unknown): boolean

  isIndex(x: unknown): x is Index

  isBoolean(x: unknown): x is boolean

  isResultSet(x: unknown): boolean

  isHelp(x: unknown): x is Help

  isFunction(x: unknown): boolean

  isDate(x: unknown): x is Date

  isRegExp(x: unknown): x is RegExp

  isObject(x: unknown): boolean

  isMap<T, U>(x: unknown): x is Map<T, U>

  isPartitionedMap<T, U>(x: unknown): x is PartitionedMap<T, U>

  isObjectWrappingMap<T extends string | number | symbol, U>(
    x: unknown
  ): x is ObjectWrappingMap<T, U>

  isNull(x: unknown): x is null

  isUndefined(x: unknown): x is undefined

  isAccessorNode(x: unknown): x is AccessorNode

  isArrayNode(x: unknown): x is ArrayNode

  isAssignmentNode(x: unknown): x is AssignmentNode

  isBlockNode(x: unknown): x is BlockNode

  isConditionalNode(x: unknown): x is ConditionalNode

  isConstantNode(x: unknown): x is ConstantNode

  isFunctionAssignmentNode(x: unknown): x is FunctionAssignmentNode

  isFunctionNode(x: unknown): x is FunctionNode

  isIndexNode(x: unknown): x is IndexNode

  isNode(x: unknown): x is MathNode

  isObjectNode(x: unknown): x is ObjectNode

  isOperatorNode(x: unknown): x is OperatorNode<OperatorNodeOp, OperatorNodeFn>

  isParenthesisNode(x: unknown): x is ParenthesisNode

  isRangeNode(x: unknown): x is RangeNode

  isRelationalNode(x: unknown): x is RelationalNode

  isSymbolNode(x: unknown): x is SymbolNode

  isChain(x: unknown): x is MathJsChain<unknown>

  /*************************************************************************
   * Functions -> Utils
   ************************************************************************/

  /**
   * Clone an object.
   * @param x Object to be cloned
   * @returns A clone of object x
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clone<TType>(x: TType): TType

  /**
   * Test whether a value is an numeric value. In case of a string,
   *  true is returned if the string contains a numeric value.
   * @param x Value to be tested
   * @returns Returns true when x is a number, BigNumber, bigint, Fraction, Boolean, or a String containing number.
   * Returns false for other types.
   * Throws an error in case of unknown types.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hasNumericValue(x: any): boolean | boolean[]

  /**
   * Test whether a value is an integer number. The function supports
   * number, BigNumber, and Fraction. The function is evaluated
   * element-wise in case of Array or Matrix input.
   * @param x Value to be tested
   * @returns Returns true when x contains a numeric, integer value.
   * Throws an error in case of an unknown data type.
   */
  isInteger(x: number | BigNumber | Fraction | MathCollection): boolean

  /**
   * Test whether a value is NaN (not a number). The function supports
   * types number, BigNumber, Fraction, Unit and Complex. The function is
   * evaluated element-wise in case of Array or Matrix input.
   * @param x Value to be tested
   * @returns Returns true when x is NaN. Throws an error in case of an
   * unknown data type.
   */
  isNaN(
    x: number | BigNumber | bigint | Fraction | MathCollection | Unit
  ): boolean

  /**
   * Test whether a value is negative: smaller than zero. The function
   * supports types number, BigNumber, Fraction, and Unit. The function is
   * evaluated element-wise in case of Array or Matrix input.
   * @param x Value to be tested
   * @returns Returns true when x is larger than zero. Throws an error in
   * case of an unknown data type.
   */
  isNegative(
    x: number | BigNumber | bigint | Fraction | MathCollection | Unit
  ): boolean

  /**
   * Test whether a value is an numeric value. The function is evaluated
   * element-wise in case of Array or Matrix input.
   * @param x Value to be tested
   * @returns Returns true when x is a number, BigNumber, bigint, Fraction, or
   * boolean. Returns false for other types. Throws an error in case of
   * unknown types.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isNumeric(x: any): x is number | BigNumber | bigint | Fraction | boolean

  /**
   * Test whether a value is positive: larger than zero. The function
   * supports types number, BigNumber, Fraction, and Unit. The function is
   * evaluated element-wise in case of Array or Matrix input.
   * @param x Value to be tested
   * @returns Returns true when x is larger than zero. Throws an error in
   * case of an unknown data type.
   */
  isPositive(
    x: number | BigNumber | bigint | Fraction | MathCollection | Unit
  ): boolean

  /**
   * Test whether a value is prime: has no divisors other than itself and
   * one. The function supports type number, bignumber. The function is
   * evaluated element-wise in case of Array or Matrix input.
   * @param x Value to be tested
   * @returns Returns true when x is larger than zero. Throws an error in
   * case of an unknown data type.
   */
  isPrime(x: number | BigNumber | MathCollection): boolean

  /**
   * Test whether a value is zero. The function can check for zero for
   * types number, BigNumber, Fraction, Complex, and Unit. The function is
   * evaluated element-wise in case of Array or Matrix input.
   * @param x Value to be tested
   * @returns Returns true when x is zero. Throws an error in case of an
   * unknown data type.
   */
  isZero(x: MathType): boolean

  /**
   * Determine the type of a variable.
   * @param x The variable for which to test the type
   * @returns Returns the name of the type. Primitive types are lower
   * case, non-primitive types are upper-camel-case. For example ‘number’,
   * ‘string’, ‘Array’, ‘Date’.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  typeOf(x: any): string

  /**
   * Import functions from an object or a module
   * To avoid errors when using one of the imported functions extend module like this:
   *
   * @example
   * // imported_math_functions.ts
   * declare module 'mathjs' {
   *      interface MathJsInterface {
   *          hello(a: number): number;
   *      }
   * }
   *
   * @param object An object with functions to be imported.
   * @param options An object with import options.
   */
  import(object: ImportObject | ImportObject[], options?: ImportOptions): void
}

/**
 * @deprecated since v12.0.0. The interface MathJsStatic has been renamed to MathJsInstance
 */
export type MathJsStatic = MathJsInstance

/**
 * @deprecated since v12.0.0. Use MathJsFactory instead and import dependency maps directly from the library
 */
export type FactoryDependencies = void

/*************************************************************************
 * Factory and Dependencies
 ************************************************************************/
export interface MathJsFactory {
  create: (
    factories: FactoryFunctionMap,
    config?: ConfigOptions
  ) => MathJsInstance

  factory: <T, TDeps extends readonly MathJsFunctionName[]>(
    name: string,
    dependencies: TDeps,
    create: (
      injected: Pick<MathJsInstance, Extract<MathJsFunctionName, TDeps[number]>>
    ) => T,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    meta?: any
  ) => FactoryFunction<T>
}

export const {
  all,
  typedDependencies,
  ResultSetDependencies,
  BigNumberDependencies,
  ComplexDependencies,
  FractionDependencies,
  RangeDependencies,
  MatrixDependencies,
  DenseMatrixDependencies,
  cloneDependencies,
  isIntegerDependencies,
  isNegativeDependencies,
  isNumericDependencies,
  hasNumericValueDependencies,
  isPositiveDependencies,
  isZeroDependencies,
  isNaNDependencies,
  typeOfDependencies,
  typeofDependencies,
  equalScalarDependencies,
  SparseMatrixDependencies,
  numberDependencies,
  stringDependencies,
  booleanDependencies,
  bignumberDependencies,
  complexDependencies,
  fractionDependencies,
  matrixDependencies,
  splitUnitDependencies,
  unaryMinusDependencies,
  unaryPlusDependencies,
  absDependencies,
  mapSlicesDependencies,
  addScalarDependencies,
  cbrtDependencies,
  ceilDependencies,
  cubeDependencies,
  expDependencies,
  expm1Dependencies,
  fixDependencies,
  floorDependencies,
  gcdDependencies,
  lcmDependencies,
  log10Dependencies,
  log2Dependencies,
  modDependencies,
  multiplyScalarDependencies,
  multiplyDependencies,
  nthRootDependencies,
  signDependencies,
  sqrtDependencies,
  squareDependencies,
  subtractDependencies,
  xgcdDependencies,
  dotMultiplyDependencies,
  bitAndDependencies,
  bitNotDependencies,
  bitOrDependencies,
  bitXorDependencies,
  argDependencies,
  conjDependencies,
  imDependencies,
  reDependencies,
  notDependencies,
  orDependencies,
  xorDependencies,
  concatDependencies,
  columnDependencies,
  crossDependencies,
  diagDependencies,
  eyeDependencies,
  filterDependencies,
  flattenDependencies,
  forEachDependencies,
  getMatrixDataTypeDependencies,
  identityDependencies,
  kronDependencies,
  mapDependencies,
  onesDependencies,
  rangeDependencies,
  reshapeDependencies,
  resizeDependencies,
  rowDependencies,
  sizeDependencies,
  squeezeDependencies,
  subsetDependencies,
  transposeDependencies,
  ctransposeDependencies,
  zerosDependencies,
  erfDependencies,
  modeDependencies,
  prodDependencies,
  formatDependencies,
  printDependencies,
  toDependencies,
  isPrimeDependencies,
  numericDependencies,
  divideScalarDependencies,
  powDependencies,
  roundDependencies,
  logDependencies,
  log1pDependencies,
  nthRootsDependencies,
  dotPowDependencies,
  dotDivideDependencies,
  lsolveDependencies,
  usolveDependencies,
  leftShiftDependencies,
  rightArithShiftDependencies,
  rightLogShiftDependencies,
  andDependencies,
  compareDependencies,
  compareNaturalDependencies,
  compareTextDependencies,
  equalDependencies,
  equalTextDependencies,
  smallerDependencies,
  smallerEqDependencies,
  largerDependencies,
  largerEqDependencies,
  deepEqualDependencies,
  unequalDependencies,
  partitionSelectDependencies,
  sortDependencies,
  maxDependencies,
  minDependencies,
  ImmutableDenseMatrixDependencies,
  IndexDependencies,
  FibonacciHeapDependencies,
  SpaDependencies,
  UnitDependencies,
  unitDependencies,
  sparseDependencies,
  createUnitDependencies,
  acosDependencies,
  acoshDependencies,
  acotDependencies,
  acothDependencies,
  acscDependencies,
  acschDependencies,
  asecDependencies,
  asechDependencies,
  asinDependencies,
  asinhDependencies,
  atanDependencies,
  atan2Dependencies,
  atanhDependencies,
  cosDependencies,
  coshDependencies,
  cotDependencies,
  cothDependencies,
  cscDependencies,
  cschDependencies,
  secDependencies,
  sechDependencies,
  sinDependencies,
  sinhDependencies,
  tanDependencies,
  tanhDependencies,
  setCartesianDependencies,
  setDifferenceDependencies,
  setDistinctDependencies,
  setIntersectDependencies,
  setIsSubsetDependencies,
  setMultiplicityDependencies,
  setPowersetDependencies,
  setSizeDependencies,
  setSymDifferenceDependencies,
  setUnionDependencies,
  zpk2tfDependencies,
  freqzDependencies,
  addDependencies,
  hypotDependencies,
  normDependencies,
  dotDependencies,
  traceDependencies,
  indexDependencies,
  NodeDependencies,
  AccessorNodeDependencies,
  ArrayNodeDependencies,
  AssignmentNodeDependencies,
  BlockNodeDependencies,
  ConditionalNodeDependencies,
  ConstantNodeDependencies,
  FunctionAssignmentNodeDependencies,
  IndexNodeDependencies,
  ObjectNodeDependencies,
  OperatorNodeDependencies,
  ParenthesisNodeDependencies,
  RangeNodeDependencies,
  RelationalNodeDependencies,
  SymbolNodeDependencies,
  FunctionNodeDependencies,
  parseDependencies,
  compileDependencies,
  evaluateDependencies,
  evalDependencies,
  ParserDependencies,
  parserDependencies,
  lupDependencies,
  qrDependencies,
  sluDependencies,
  lusolveDependencies,
  HelpDependencies,
  ChainDependencies,
  helpDependencies,
  chainDependencies,
  detDependencies,
  invDependencies,
  expmDependencies,
  sqrtmDependencies,
  sylvesterDependencies,
  schurDependencies,
  lyapDependencies,
  divideDependencies,
  distanceDependencies,
  intersectDependencies,
  sumDependencies,
  meanDependencies,
  medianDependencies,
  madDependencies,
  varianceDependencies,
  varDependencies,
  quantileSeqDependencies,
  stdDependencies,
  combinationsDependencies,
  gammaDependencies,
  factorialDependencies,
  kldivergenceDependencies,
  multinomialDependencies,
  permutationsDependencies,
  pickRandomDependencies,
  randomDependencies,
  randomIntDependencies,
  stirlingS2Dependencies,
  bellNumbersDependencies,
  catalanDependencies,
  compositionDependencies,
  simplifyDependencies,
  derivativeDependencies,
  rationalizeDependencies,
  reviverDependencies,
  eDependencies,
  EDependencies,
  falseDependencies,
  iDependencies,
  InfinityDependencies,
  LN10Dependencies,
  LN2Dependencies,
  LOG10EDependencies,
  LOG2EDependencies,
  NaNDependencies,
  nullDependencies,
  phiDependencies,
  piDependencies,
  PIDependencies,
  SQRT1_2Dependencies,
  SQRT2Dependencies,
  tauDependencies,
  trueDependencies,
  versionDependencies,
  atomicMassDependencies,
  avogadroDependencies,
  bohrMagnetonDependencies,
  bohrRadiusDependencies,
  boltzmannDependencies,
  classicalElectronRadiusDependencies,
  conductanceQuantumDependencies,
  coulombDependencies,
  deuteronMassDependencies,
  efimovFactorDependencies,
  eigsDependencies,
  electricConstantDependencies,
  electronMassDependencies,
  elementaryChargeDependencies,
  faradayDependencies,
  fermiCouplingDependencies,
  fineStructureDependencies,
  firstRadiationDependencies,
  gasConstantDependencies,
  gravitationConstantDependencies,
  gravityDependencies,
  hartreeEnergyDependencies,
  inverseConductanceQuantumDependencies,
  klitzingDependencies,
  loschmidtDependencies,
  magneticConstantDependencies,
  magneticFluxQuantumDependencies,
  molarMassDependencies,
  molarMassC12Dependencies,
  molarPlanckConstantDependencies,
  molarVolumeDependencies,
  neutronMassDependencies,
  nuclearMagnetonDependencies,
  planckChargeDependencies,
  planckConstantDependencies,
  planckLengthDependencies,
  planckMassDependencies,
  planckTemperatureDependencies,
  planckTimeDependencies,
  protonMassDependencies,
  quantumOfCirculationDependencies,
  reducedPlanckConstantDependencies,
  rydbergDependencies,
  sackurTetrodeDependencies,
  secondRadiationDependencies,
  speedOfLightDependencies,
  stefanBoltzmannDependencies,
  thomsonCrossSectionDependencies,
  vacuumImpedanceDependencies,
  weakMixingAngleDependencies,
  wienDisplacementDependencies,
  mapSlicesTransformDependencies,
  columnTransformDependencies,
  filterTransformDependencies,
  forEachTransformDependencies,
  indexTransformDependencies,
  mapTransformDependencies,
  maxTransformDependencies,
  meanTransformDependencies,
  minTransformDependencies,
  rangeTransformDependencies,
  rowTransformDependencies,
  subsetTransformDependencies,
  concatTransformDependencies,
  stdTransformDependencies,
  sumTransformDependencies,
  varianceTransformDependencies
}: Record<string, FactoryFunctionMap>

export interface Matrix<T = MathGeneric> {
  type: string
  storage(): string
  datatype(): string
  create(data: MathArray, datatype?: string): void
  density(): number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subset(index: Index, replacement?: any, defaultValue?: any): Matrix
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(index: number[]): any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set(index: number[], value: any, defaultValue?: number | string): Matrix
  resize(size: MathCollection, defaultValue?: number | string): Matrix
  clone(): Matrix<T>
  size(): number[]
  map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (a: any, b: number[], c: Matrix) => any,
    skipZeros?: boolean
  ): Matrix
  forEach(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (a: any, b: number[], c: Matrix) => void,
    skipZeros?: boolean
  ): void
  toArray(): MathArray<T>
  valueOf(): MathArray<T>
  format(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: FormatOptions | number | BigNumber | ((value: any) => string)
  ): string
  toString(): string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toJSON(): any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  diagonal(k?: number | BigNumber): any[]
  swapRows(i: number, j: number): Matrix<T>
}

export interface MatrixCtor {
  new (): Matrix
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface BigNumber extends Decimal {}

export interface Complex {
  re: number
  im: number
  clone(): Complex
  equals(other: Complex): boolean
  format(precision?: number): string
  fromJSON(json: object): Complex
  fromPolar(polar: object): Complex
  fromPolar(r: number, phi: number): Complex
  toJSON(): object
  toPolar(): PolarCoordinates
  toString(): string
  compare(a: Complex, b: Complex): number
}

export interface PolarCoordinates {
  r: number
  phi: number
}

export interface MathJSON {
  mathjs?: string
  value: number
  unit: string
  fixPrefix?: boolean
}

export interface BaseUnit {
  dimensions: number[]
  key: string
}

export interface UnitComponent {
  power: number
  prefix: string
  unit: {
    name: string
    base: BaseUnit
    prefixes: Record<string, UnitPrefix>
    value: number
    offset: number
    dimensions: number[]
  }
}

export interface UnitPrefix {
  name: string
  value: number
  scientific: boolean
}

export interface Unit {
  valueOf(): string
  clone(): Unit
  hasBase(base: BaseUnit | string | undefined): boolean
  equalBase(unit: Unit): boolean
  equals(unit: Unit): boolean
  multiply(unit: Unit): Unit
  divide(unit: Unit): Unit | number
  pow(unit: Unit): Unit
  abs(unit: Unit): Unit
  to(unit: string): Unit
  toNumber(unit?: string): number
  toNumeric(unit?: string): number | Fraction | BigNumber
  toSI(): Unit
  toString(): string
  toJSON(): MathJSON
  formatUnits(): string
  format(options: FormatOptions): string
  simplify(): Unit
  splitUnit(parts: ReadonlyArray<string | Unit>): Unit[]

  units: UnitComponent[]
  dimensions: number[]
  value: number
  fixPrefix: boolean
  skipAutomaticSimplification: true
}

export type UnitSystemName = 'si' | 'cgs' | 'us' | 'auto'

export interface UnitStatic {
  PREFIXES: Record<string, UnitPrefix>
  BASE_DIMENSIONS: string[]
  BASE_UNITS: Record<string, BaseUnit>
  UNIT_SYSTEMS: Record<
    UnitSystemName,
    Record<string, { unit: Unit; prefix: UnitPrefix }>
  >
  UNITS: Record<string, Unit>
  parse(str: string): Unit
  isValuelessUnit(name: string): boolean
  fromJSON(json: MathJSON): Unit
  isValidAlpha(c: string): boolean
  createUnit(
    obj: Record<string, string | Unit | UnitDefinition>,
    options?: { override: boolean }
  ): Unit
  createUnitSingle(
    name: string,
    definition: string | Unit | UnitDefinition
  ): Unit
  getUnitSystem(): UnitSystemName
  setUnitSystem(name: UnitSystemName): void
}

export interface UnitCtor extends UnitStatic {
  new (
    value: number | BigNumber | Fraction | Complex | boolean,
    name: string
  ): Unit
}

export interface CreateUnitOptions {
  prefixes?: 'none' | 'short' | 'long' | 'binary_short' | 'binary_long'
  aliases?: string[]
  offset?: number
  override?: boolean
}

export type SimplifyContext = Partial<
  Record<
    OperatorNodeFn,
    {
      trivial: boolean
      total: boolean
      commutative: boolean
      associative: boolean
    }
  >
>

export interface SimplifyOptions {
  /** A boolean which is `true` by default. */
  exactFractions?: boolean
  /**
   * When `exactFractions` is true, a fraction will be returned only
   * when both numerator and denominator are smaller than `fractionsLimit`.
   * Default value is 10000.
   */
  fractionsLimit?: number
  /** A boolean which is `false` by default. */
  consoleDebug?: boolean
  /**
   * gives properties of each operator, which determine what simplifications
   * are allowed. Properties are commutative, associative, total (whether
   * the operation is defined for all arguments), and trivial (whether
   * the operation applied to a single argument leaves that argument
   * unchanged).
   */
  context?: SimplifyContext
}

export type SimplifyRule =
  | {
      l: string
      r: string
      repeat?: boolean
      assuming?: SimplifyContext
      imposeContext?: SimplifyContext
    }
  | {
      s: string
      repeat?: boolean
      assuming?: SimplifyContext
      imposeContext?: SimplifyContext
    }
  | string
  | ((node: MathNode) => MathNode)

export interface Simplify {
  (expr: MathNode | string): MathNode
  (
    expr: MathNode | string,
    rules: SimplifyRule[],
    scope?: object,
    options?: SimplifyOptions
  ): MathNode
  (expr: MathNode | string, scope: object, options?: SimplifyOptions): MathNode

  rules: SimplifyRule[]
}

export interface UnitDefinition {
  definition?: string | Unit
  prefixes?: string
  offset?: number
  aliases?: string[]
  baseName?: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Index {}

export interface PartitionedMap<T, U> {
  a: Map<T, U>
  b: Map<T, U>
}

export interface ObjectWrappingMap<T extends string | number | symbol, U> {
  wrappedObject: Record<T, U>
}

export interface EvalFunction {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  evaluate(scope?: any): any
}

export interface MathNode {
  isNode: true
  comment: string
  type: string

  isUpdateNode?: boolean

  /**
   * Create a shallow clone of the node. The node itself is cloned, its
   * childs are not cloned.
   */
  clone(): this
  /**
   * Create a deep clone of the node. Both the node as well as all its
   * childs are cloned recursively.
   */
  cloneDeep(): this
  /**
   * Compile an expression into optimized JavaScript code. compile returns
   * an object with a function evaluate([scope]) to evaluate. Example:
   */
  compile(): EvalFunction
  /**
   * Compile and eval an expression, this is the equivalent of doing
   * node.compile().evaluate(scope). Example:
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  evaluate(expr?: any): any
  /**
   * Test whether this node equals an other node. Does a deep comparison
   * of the values of both nodes.
   */
  equals(other: MathNode): boolean
  /**
   *
   * Filter nodes in an expression tree. The callback function is called
   * as callback(node: MathNode, path: string, parent: MathNode) : boolean
   * for every node in the tree, and must return a boolean. The function
   * filter returns an array with nodes for which the test returned true.
   * Parameter path is a string containing a relative JSON Path.
   *
   * Example:
   *
   * ```
   * var node = math.parse('x^2 + x/4 + 3*y');
   * var filtered = node.filter(function (node) {
   * return node.isSymbolMathNode && node.name == 'x';
   * });
   * // returns an array with two entries: two SymbolMathNodes 'x'
   * ```
   *
   * The callback function is called as callback(node: MathNode, path:
   * string, parent: MathNode) : boolean for every node in the tree, and
   * must return a boolean. The function filter returns an array with
   * nodes for which the test returned true. Parameter path is a string
   * containing a relative JSON Path.
   * @return Returns an array with nodes for which test returned true
   */
  filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (node: MathNode, path: string, parent: MathNode) => any
  ): MathNode[]

  /**
   * [forEach description]
   */
  forEach(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (node: MathNode, path: string, parent: MathNode) => void
  ): void

  /**
   * Transform a node. Creates a new MathNode having it’s child's be the
   * results of calling the provided callback function for each of the
   * child's of the original node. The callback function is called as
   * `callback(child: MathNode, path: string, parent: MathNode)` and must
   * return a MathNode. Parameter path is a string containing a relative
   * JSON Path.
   *
   *
   * See also transform, which is a recursive version of map.
   */
  map(
    callback: (node: MathNode, path: string, parent: MathNode) => MathNode
  ): MathNode

  /**
   * Get a HTML representation of the parsed expression.
   */
  toHTML(options?: object): string

  /**
   * Get a string representation of the parsed expression. This is not
   * exactly the same as the original input.
   */
  toString(options?: object): string

  /**
   * Get a LaTeX representation of the expression.
   */
  toTex(options?: object): string

  /**
   * Recursively transform an expression tree via a transform function.
   * Similar to Array.map, but recursively executed on all nodes in the
   * expression tree. The callback function is a mapping function
   * accepting a node, and returning a replacement for the node or the
   * original node. Function callback is called as callback(node:
   * MathNode, path: string, parent: MathNode) for every node in the tree,
   * and must return a MathNode. Parameter path is a string containing a
   * relative JSON Path.
   *
   * For example, to replace all nodes of type SymbolMathNode having name
   * ‘x’ with a ConstantMathNode with value 3:
   * ```js
   * var node = math.parse('x^2 + 5*x');
   * var transformed = node.transform(function (node, path, parent) {
   *   if (node.SymbolMathNode && node.name == 'x') {
   *     return new math.expression.node.ConstantMathNode(3);
   *   }
   *   else {
   *     return node;
   *   }
   * });
   * transformed.toString(); // returns '(3 ^ 2) + (5 * 3)'
   * ```
   */
  transform<TResult>(
    callback: (node: this, path: string, parent: MathNode) => TResult
  ): TResult

  /**
   * `traverse(callback)`
   *
   * Recursively traverse all nodes in a node tree. Executes given
   * callback for this node and each of its child nodes. Similar to
   * Array.forEach, except recursive. The callback function is a mapping
   * function accepting a node, and returning a replacement for the node
   * or the original node. Function callback is called as callback(node:
   * MathNode, path: string, parent: MathNode) for every node in the tree.
   * Parameter path is a string containing a relative JSON Path. Example:
   *
   * ```
   * var node = math.parse('3 * x + 2');
   * node.traverse(function (node, path, parent) {
   * switch (node.type) {
   * case 'OperatorMathNode': console.log(node.type, node.op);    break;
   * case 'ConstantMathNode': console.log(node.type, node.value); break;
   * case 'SymbolMathNode':   console.log(node.type, node.name);  break;
   * default:             console.log(node.type);
   * }
   * });
   * // outputs:
   * //   OperatorMathNode +
   * //   OperatorMathNode *
   * //   ConstantMathNode 3
   * //   SymbolMathNode x
   * //   ConstantMathNode 2
   * ```
   */
  traverse(
    callback: (node: MathNode, path: string, parent: MathNode) => void
  ): void
}

export interface Parser {
  /**
   * Evaluate an expression. Returns the result of the expression.
   * @param expr The expression to evaluate
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  evaluate(expr: string | string[]): any
  /**
   * Retrieve a variable or function from the parser’s scope.
   * @param name The name of the variable or function to be retrieved
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(name: string): any
  /**
   * Retrieve an object with all defined variables in the parser’s scope.
   * @returns An object with all defined variables
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAll(): { [key: string]: any }
  /**
   * Retrieve a map with all defined variables in the parser’s scope.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAllAsMap(): Map<string, any>
  /**
   * Set a variable or function in the parser’s scope.
   * @param name The name of the variable or function to be set
   * @param value The value of the variable or function to be set
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set: (name: string, value: any) => void
  /**
   * Remove a variable or function from the parser’s scope.
   * @param name The name of the variable or function to be removed
   */
  remove: (name: string) => void
  /**
   * Completely clear the parser’s scope.
   */
  clear: () => void
}

export interface Distribution {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  random(size: any, min?: any, max?: any): any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  randomInt(min: any, max?: any): any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pickRandom(array: any): any
}

export interface FormatOptions {
  /**
   * Number notation. Choose from: 'fixed' Always use regular number
   * notation. For example '123.40' and '14000000' 'exponential' Always
   * use exponential notation. For example '1.234e+2' and '1.4e+7' 'auto'
   * (default) Regular number notation for numbers having an absolute
   * value between lower and upper bounds, and uses exponential notation
   * elsewhere. Lower bound is included, upper bound is excluded. For
   * example '123.4' and '1.4e7'.
   */
  notation?:
    | 'fixed'
    | 'exponential'
    | 'engineering'
    | 'auto'
    | 'hex'
    | 'bin'
    | 'oct'

  /**
   * A number between 0 and 16 to round the digits of the number. In case
   * of notations 'exponential' and 'auto', precision defines the total
   * number of significant digits returned and is undefined by default. In
   * case of notation 'fixed', precision defines the number of significant
   * digits after the decimal point, and is 0 by default.
   */
  precision?: number | BigNumber

  /**
   * Exponent determining the lower boundary for formatting a value with
   * an exponent when notation='auto. Default value is -3.
   */
  lowerExp?: number | BigNumber

  /**
   * Exponent determining the upper boundary for formatting a value with
   * an exponent when notation='auto. Default value is 5.
   */
  upperExp?: number | BigNumber

  /**
   * Available values: 'ratio' (default) or 'decimal'. For example
   * format(fraction(1, 3)) will output '1/3' when 'ratio' is configured,
   * and will output 0.(3) when 'decimal' is configured.
   */
  fraction?: string

  /**
   * The word size in bits to use for formatting in binary, octal, or
   * hexadecimal notation. To be used only with `'bin'`, `'oct'`, or `'hex'`
   * values for `notation` option. When this option is defined the value
   * is formatted as a signed twos complement integer of the given word
   * size and the size suffix is appended to the output.
   */
  wordSize?: number | BigNumber
}

export interface Help {
  toString(): string
  toJSON(): string
}

export interface ConfigOptions {
  relTol?: number
  absTol?: number
  /**
   * @deprecated Use `relTol` and `absTol` instead
   */
  epsilon?: number
  matrix?: 'Matrix' | 'Array'
  number?: 'number' | 'BigNumber' | 'bigint' | 'Fraction'
  numberFallback?: 'number' | 'BigNumber'
  precision?: number
  predictable?: boolean
  randomSeed?: string | null
}

export interface MathJsChain<TValue> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  done(): TValue

  /*************************************************************************
   * Construction functions
   ************************************************************************/

  /**
   * Create a BigNumber, which can store numbers with arbitrary precision.
   * When a matrix is provided, all elements will be converted to
   * BigNumber.
   */
  bignumber(
    this: MathJsChain<
      number | string | Fraction | BigNumber | bigint | Unit | boolean | null
    >
  ): MathJsChain<BigNumber>
  bignumber<T extends MathCollection>(this: MathJsChain<T>): MathJsChain<T>

  /**
   * Create a bigint, which can store integers with arbitrary precision.
   * When a matrix is provided, all elements will be converted to bigint.
   */
  bigint(
    this: MathJsChain<
      number | string | Fraction | BigNumber | bigint | boolean | null
    >
  ): MathJsChain<bigint>
  bigint<T extends MathCollection>(this: MathJsChain<T>): MathJsChain<T>

  /**
   * Create a boolean or convert a string or number to a boolean. In case
   * of a number, true is returned for non-zero numbers, and false in case
   * of zero. Strings can be 'true' or 'false', or can contain a number.
   * When value is a matrix, all elements will be converted to boolean.
   */
  boolean(
    this: MathJsChain<string | number | boolean | null>
  ): MathJsChain<boolean>
  boolean(this: MathJsChain<MathCollection>): MathJsChain<MathCollection>

  /**
   * Create a complex value or convert a value to a complex value.
   * @param im Argument specifying the imaginary part of the complex
   * number
   */
  complex(
    this: MathJsChain<Complex | string | PolarCoordinates>,
    im?: number
  ): MathJsChain<Complex>
  complex(this: MathJsChain<MathCollection>): MathJsChain<MathCollection>

  /**
   * Create a user-defined unit and register it with the Unit type.
   * @param definition Definition of the unit in terms of existing units.
   * For example, ‘0.514444444 m / s’.
   * @param options (optional) An object containing any of the following
   * properties:</br>- prefixes {string} “none”, “short”, “long”,
   * “binary_short”, or “binary_long”. The default is “none”.</br>-
   * aliases {Array} Array of strings. Example: [‘knots’, ‘kt’,
   * ‘kts’]</br>- offset {Numeric} An offset to apply when converting from
   * the unit. For example, the offset for celsius is 273.15. Default is
   * 0.
   */
  createUnit(
    this: MathJsChain<string>,
    definition?: string | UnitDefinition | Unit,
    options?: CreateUnitOptions
  ): MathJsChain<Unit>
  /**
   * Create a user-defined unit and register it with the Unit type.
   * @param options (optional) An object containing any of the following
   * properties:</br>- prefixes {string} “none”, “short”, “long”,
   * “binary_short”, or “binary_long”. The default is “none”.</br>-
   * aliases {Array} Array of strings. Example: [‘knots’, ‘kt’,
   * ‘kts’]</br>- offset {Numeric} An offset to apply when converting from
   * the unit. For example, the offset for celsius is 273.15. Default is
   * 0.
   */
  createUnit(
    this: MathJsChain<Record<string, string | UnitDefinition | Unit>>,
    options?: CreateUnitOptions
  ): MathJsChain<Unit>

  /**
   * Create a fraction convert a value to a fraction.
   * @param denominator Argument specifying the denominator of the
   * fraction
   */
  fraction(
    this: MathJsChain<
      | number
      | string
      | BigNumber
      | bigint
      | Unit
      | Fraction
      | FractionDefinition
    >,
    denominator?: number
  ): MathJsChain<Fraction>
  fraction(this: MathJsChain<MathCollection>): MathJsChain<MathCollection>

  /**
   * Create an index. An Index can store ranges having start, step, and
   * end for multiple dimensions. Matrix.get, Matrix.set, and math.subset
   * accept an Index as input.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  index(this: MathJsChain<any[]>): MathJsChain<Index>

  /**
   * Create a Matrix. The function creates a new math.type.Matrix object
   * from an Array. A Matrix has utility functions to manipulate the data
   * in the matrix, like getting the size and getting or setting values in
   * the matrix. Supported storage formats are 'dense' and 'sparse'.
   */
  matrix(
    this: MathJsChain<MathCollection>,
    format?: 'sparse' | 'dense',
    dataType?: string
  ): MathJsChain<Matrix>

  /**
   * Create a number or convert a string, boolean, or unit to a number.
   * When value is a matrix, all elements will be converted to number.
   * @param valuelessUnit A valueless unit, used to convert a unit to a
   * number
   */
  number(
    this: MathJsChain<
      string | number | BigNumber | bigint | Fraction | boolean | Unit | null
    >,
    valuelessUnit?: Unit | string
  ): MathJsChain<number>
  number(
    this: MathJsChain<MathCollection>,
    valuelessUnit?: Unit | string
  ): MathJsChain<MathCollection>

  /**
   * Convert a numeric input to a specific numeric type: number, BigNumber, bigint, or Fraction.
   * @param outputType The desired numeric output type
   */
  numeric(
    this: MathJsChain<string | number | BigNumber | bigint | Fraction>,
    outputType: 'number'
  ): MathJsChain<number>
  numeric(
    this: MathJsChain<string | number | BigNumber | bigint | Fraction>,
    outputType: 'BigNumber'
  ): MathJsChain<BigNumber>
  numeric(
    this: MathJsChain<string | number | BigNumber | bigint | Fraction>,
    outputType: 'bigint'
  ): MathJsChain<bigint>
  numeric(
    this: MathJsChain<string | number | BigNumber | bigint | Fraction>,
    outputType: 'Fraction'
  ): MathJsChain<Fraction>

  /**
   * Create a Sparse Matrix. The function creates a new math.type.Matrix
   * object from an Array. A Matrix has utility functions to manipulate
   * the data in the matrix, like getting the size and getting or setting
   * values in the matrix.
   * @param dataType Sparse Matrix data type
   */
  sparse(
    this: MathJsChain<MathCollection>,
    dataType?: string
  ): MathJsChain<Matrix>

  /**
   * Split a unit in an array of units whose sum is equal to the original
   * unit.
   * @param parts An array of strings or valueless units
   */
  splitUnit(this: MathJsChain<Unit>, parts: Unit[]): MathJsChain<Unit[]>

  /**
   * Create a string or convert any object into a string. Elements of
   * Arrays and Matrices are processed element wise.
   */
  string(
    this: MathJsChain<MathNumericType | string | Unit | null>
  ): MathJsChain<string>
  string(this: MathJsChain<MathCollection>): MathJsChain<MathCollection>

  /**
   * Create a unit. Depending on the passed arguments, the function will
   * create and return a new math.type.Unit object. When a matrix is
   * provided, all elements will be converted to units.
   * @param unit The unit to be created
   */
  unit(this: MathJsChain<string>, unit?: string): MathJsChain<Unit>
  unit(this: MathJsChain<MathNumericType>, unit?: string): MathJsChain<Unit>
  unit(this: MathJsChain<MathCollection>, unit?: string): MathJsChain<Unit[]>

  /*************************************************************************
   * Expression functions
   ************************************************************************/

  /**
   * Parse and compile an expression. Returns a an object with a function
   * evaluate([scope]) to evaluate the compiled expression.
   */
  compile(this: MathJsChain<MathExpression>): MathJsChain<EvalFunction>

  // TODO properly type this
  /**
   * Evaluate an expression.
   * @param scope Scope to read/write variables
   */
  evaluate(
    this: MathJsChain<MathExpression | Matrix>,
    scope?: object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): MathJsChain<any>
  evaluate(
    this: MathJsChain<MathExpression[]>,
    scope?: object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): MathJsChain<any[]>

  /**
   * Retrieve help on a function or data type. Help files are retrieved
   * from the documentation in math.expression.docs.
   */
  help(this: MathJsChain<unknown>): MathJsChain<unknown>

  /**
   * @param options Available options: nodes - a set of custome nodes
   */
  parse(
    this: MathJsChain<MathExpression[]>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: any
  ): MathJsChain<MathNode[]>

  /**
   * Parse an expression. Returns a node tree, which can be evaluated by
   * invoking node.evaluate();
   * @param options Available options: nodes - a set of custome nodes
   */
  parse(
    this: MathJsChain<MathExpression>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: any
  ): MathJsChain<MathNode>

  /**
   *  Replaces variable nodes with their scoped values
   * @param scope Scope to read/write variables
   */
  resolve(
    this: MathJsChain<MathNode>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scope?: Record<string, any>
  ): MathJsChain<MathNode>
  resolve(
    this: MathJsChain<MathNode[]>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scope?: Record<string, any>
  ): MathJsChain<MathNode[]>

  /*************************************************************************
   * Algebra functions
   ************************************************************************/
  /**
   * @param variable The variable over which to differentiate
   * @param options There is one option available, simplify, which is true
   * by default. When false, output will not be simplified.
   */
  derivative(
    this: MathJsChain<MathNode | string>,
    variable: MathNode | string,
    options?: { simplify: boolean }
  ): MathJsChain<MathNode>

  /**
   * Solves the linear equation system by forwards substitution. Matrix
   * must be a lower triangular matrix.
   * @param b A column vector with the b values
   */
  lsolve(this: MathJsChain<Matrix>, b: MathCollection): MathJsChain<Matrix>
  lsolve(
    this: MathJsChain<MathArray>,
    b: MathCollection
  ): MathJsChain<MathArray>

  /**
   * Calculate the Matrix LU decomposition with partial pivoting. Matrix A
   * is decomposed in two matrices (L, U) and a row permutation vector p
   * where A[p,:] = L * U
   */
  lup(this: MathJsChain<MathCollection>): MathJsChain<LUDecomposition>

  /**
   * Solves the linear system A * x = b where A is an [n x n] matrix and b
   * is a [n] column vector.
   * @param b Column Vector
   * @param order The Symbolic Ordering and Analysis order, see slu for
   * details. Matrix must be a SparseMatrix
   * @param threshold Partial pivoting threshold (1 for partial pivoting),
   * see slu for details. Matrix must be a SparseMatrix.
   */
  lusolve(
    this: MathJsChain<Matrix>,
    b: MathCollection,
    order?: number,
    threshold?: number
  ): MathJsChain<Matrix>

  lusolve(
    this: MathJsChain<MathArray>,
    b: MathCollection,
    order?: number,
    threshold?: number
  ): MathJsChain<MathArray>

  lusolve(
    this: MathJsChain<LUDecomposition>,
    b: MathCollection
  ): MathJsChain<Matrix>

  /**
   * Calculate the Matrix QR decomposition. Matrix A is decomposed in two
   * matrices (Q, R) where Q is an orthogonal matrix and R is an upper
   * triangular matrix.
   */
  qr(this: MathJsChain<MathCollection>): MathJsChain<QRDecomposition>

  /**
   * Transform a rationalizable expression in a rational fraction. If
   * rational fraction is one variable polynomial then converts the
   * numerator and denominator in canonical form, with decreasing
   * exponents, returning the coefficients of numerator.
   * @param optional scope of expression or true for already evaluated
   * rational expression at input
   * @param detailed  optional True if return an object, false if return
   * expression node (default)
   */
  rationalize(
    this: MathJsChain<MathNode | string>,
    optional?: object | boolean,
    detailed?: boolean
  ): MathJsChain<MathNode>

  /**
   * Simplify an expression tree.
   * @param rules A list of rules are applied to an expression, repeating
   * over the list until no further changes are made. It’s possible to
   * pass a custom set of rules to the function as second argument. A rule
   * can be specified as an object, string, or function.
   * @param scope Scope to variables
   * @param options Options to configure the behavior of simplify
   */
  simplify(
    this: MathJsChain<MathNode | string>,
    rules?: SimplifyRule[],
    scope?: Map<string, MathType> | object,
    options?: SimplifyOptions
  ): MathJsChain<MathNode>

  simplifyConstant(
    this: MathJsChain<MathNode | string>,
    options?: SimplifyOptions
  ): MathJsChain<MathNode>
  simplifyCore(
    this: MathJsChain<MathNode | string>,
    options?: SimplifyOptions
  ): MathJsChain<MathNode>

  /**
   * Gives the number of “leaf nodes” in the parse tree of the given
   * expression. A leaf node is one that has no subexpressions, essentially
   * either a symbol or a constant. Note that `5!` has just one leaf, the `5`;
   * the unary factorial operator does not add a leaf. On the other hand,
   * function symbols do add leaves, so `sin(x)/cos(x)` has four leaves.
   */
  leafCount(this: MathJsChain<MathNode>): MathJsChain<number>

  /**
   * Calculate the Sparse Matrix LU decomposition with full pivoting.
   * Sparse Matrix A is decomposed in two matrices (L, U) and two
   * permutation vectors (pinv, q) where P * A * Q = L * U
   * @param order The Symbolic Ordering and Analysis order: 0 - Natural
   * ordering, no permutation vector q is returned 1 - Matrix must be
   * square, symbolic ordering and analisis is performed on M = A + A' 2 -
   * Symbolic ordering and analysis is performed on M = A' * A. Dense
   * columns from A' are dropped, A recreated from A'. This is appropriate
   * for LU factorization of non-symmetric matrices. 3 - Symbolic ordering
   * and analysis is performed on M = A' * A. This is best used for LU
   * factorization is matrix M has no dense rows. A dense row is a row
   * with more than 10*sqr(columns) entries.
   * @param threshold Partial pivoting threshold (1 for partial pivoting)
   */
  slu(
    this: MathJsChain<Matrix>,
    order: number,
    threshold: number
  ): MathJsChain<SLUDecomposition>

  /**
   * Solves the linear equation system by backward substitution. Matrix
   * must be an upper triangular matrix. U * x = b
   * @param b A column vector with the b values
   */
  usolve(this: MathJsChain<Matrix>, b: MathCollection): MathJsChain<Matrix>
  usolve(
    this: MathJsChain<MathArray>,
    b: MathCollection
  ): MathJsChain<MathArray>

  /*************************************************************************
   * Arithmetic functions
   ************************************************************************/

  /**
   * Calculate the absolute value of a number. For matrices, the function
   * is evaluated element wise.
   */
  abs<T extends MathType>(this: MathJsChain<T>): MathJsChain<T>

  /**
   * Add two values, x + y. For matrices, the function is evaluated
   * element wise.
   * @param y Second value to add
   */
  add<T extends MathType>(this: MathJsChain<T>, y: T): MathJsChain<T>
  add(this: MathJsChain<MathType>, y: MathType): MathJsChain<MathType>

  /**
   * Apply a function that maps an array to a scalar along a given axis of the
   * matrix or array. Returns a new matrix or array with one less dimension
   * than the input.
   * @param dim The dimension along which the callback is applied
   * @param callback The callback function that is applied. This Function should take an
   * array or 1-d matrix as an input and return a number.
   * @returns The residual matrix with the function applied over some dimension.
   */
  mapSlices<T extends MathCollection>(
    this: MathJsChain<T>,
    dim: number,
    callback: (array: Array<MathType> | Matrix) => number
  ): MathJsChain<T>
  /**
   * @deprecated backwards-compatibility old name of mapSlices
   **/
  apply: MathJsChain<TValue>['mapSlices']

  /**
   * Calculate the cubic root of a value. For matrices, the function is
   * evaluated element wise.
   * @param allRoots Optional, false by default. Only applicable when x is
   * a number or complex number. If true, all complex roots are returned,
   * if false (default) the principal root is returned.
   */
  cbrt<T extends number | BigNumber | Complex | Unit>(
    this: MathJsChain<T>,
    allRoots?: boolean
  ): MathJsChain<T>

  // Rounding functions grouped for similarity

  /**
   * Round a value towards plus infinity If x is complex, both real and
   * imaginary part are rounded towards plus infinity. For matrices, the
   * function is evaluated element wise.
   * @param n Number of decimals Default value: 0.
   */
  ceil<T extends MathNumericType | MathCollection>(
    this: MathJsChain<T>,
    n?: number | BigNumber | MathCollection
  ): MathJsChain<T>
  ceil<U extends MathCollection>(
    this: MathJsChain<MathNumericType | U>,
    n: U
  ): MathJsChain<U>
  ceil(this: MathJsChain<Unit>, unit: Unit): MathJsChain<Unit>
  ceil<U extends MathCollection<Unit>>(
    this: MathJsChain<U>,
    unit: Unit
  ): MathJsChain<U>
  ceil(
    this: MathJsChain<Unit>,
    n: number | BigNumber,
    unit: Unit
  ): MathJsChain<Unit>
  ceil<U extends MathCollection<Unit>>(
    this: MathJsChain<U>,
    n: number | BigNumber,
    unit: Unit
  ): MathJsChain<U>

  /**
   * Round a value towards zero. For matrices, the function is evaluated
   * element wise.
   * @param n Number of decimals Default value: 0.
   */
  fix<T extends MathNumericType | MathCollection>(
    this: MathJsChain<T>,
    n?: number | BigNumber | MathCollection
  ): MathJsChain<T>
  fix<U extends MathCollection>(
    this: MathJsChain<MathNumericType | U>,
    n: U
  ): MathJsChain<U>
  fix(this: MathJsChain<Unit>, unit: Unit): MathJsChain<Unit>
  fix<U extends MathCollection<Unit>>(
    this: MathJsChain<U>,
    unit: Unit
  ): MathJsChain<U>
  fix(
    this: MathJsChain<Unit>,
    n: number | BigNumber,
    unit: Unit
  ): MathJsChain<Unit>
  fix<U extends MathCollection<Unit>>(
    this: MathJsChain<U>,
    n: number | BigNumber,
    unit: Unit
  ): MathJsChain<U>

  /**
   * Round a value towards minus infinity. For matrices, the function is
   * evaluated element wise.
   * @param n Number of decimals Default value: 0.
   */
  floor<T extends MathNumericType | MathCollection>(
    this: MathJsChain<T>,
    n?: number | BigNumber | MathCollection
  ): MathJsChain<T>
  floor<U extends MathCollection>(
    this: MathJsChain<MathNumericType | U>,
    n: U
  ): MathJsChain<U>
  floor(this: MathJsChain<Unit>, unit: Unit): MathJsChain<Unit>
  floor<U extends MathCollection<Unit>>(
    this: MathJsChain<U>,
    unit: Unit
  ): MathJsChain<U>
  floor(
    this: MathJsChain<Unit>,
    n: number | BigNumber,
    unit: Unit
  ): MathJsChain<Unit>
  floor<U extends MathCollection<Unit>>(
    this: MathJsChain<U>,
    n: number | BigNumber,
    unit: Unit
  ): MathJsChain<U>

  /**
   * Round a value towards the nearest integer. For matrices, the function
   * is evaluated element wise.
   * @param n Number of decimals Default value: 0.
   */
  round<T extends MathNumericType | MathCollection>(
    this: MathJsChain<T>,
    n?: number | BigNumber | MathCollection
  ): MathJsChain<T>
  round<U extends MathCollection>(
    this: MathJsChain<MathNumericType | U>,
    n: U
  ): MathJsChain<U>
  round(this: MathJsChain<Unit>, unit: Unit): MathJsChain<Unit>
  round<U extends MathCollection<Unit>>(
    this: MathJsChain<U>,
    unit: Unit
  ): MathJsChain<U>
  round(
    this: MathJsChain<Unit>,
    n: number | BigNumber,
    unit: Unit
  ): MathJsChain<Unit>
  round<U extends MathCollection<Unit>>(
    this: MathJsChain<U>,
    n: number | BigNumber,
    unit: Unit
  ): MathJsChain<U>

  // End of rounding group

  /**
   * Compute the cube of a value, x * x * x. For matrices, the function is
   * evaluated element wise.
   */
  cube<T extends MathNumericType | Unit>(this: MathJsChain<T>): MathJsChain<T>

  /**
   * Divide two values, x / y. To divide matrices, x is multiplied with
   * the inverse of y: x * inv(y).
   * @param y Denominator
   */
  divide(this: MathJsChain<Unit>, y: Unit): MathJsChain<Unit | number>
  divide(this: MathJsChain<Unit>, y: number): MathJsChain<Unit>
  divide(this: MathJsChain<number>, y: number): MathJsChain<number>
  divide(this: MathJsChain<MathType>, y: MathType): MathJsChain<MathType>

  /**
   * Divide two matrices element wise. The function accepts both matrices
   * and scalar values.
   * @param y Denominator
   */
  dotDivide<T extends MathCollection>(
    this: MathJsChain<T>,
    y: MathType
  ): MathJsChain<T>
  dotDivide<T extends MathCollection>(
    this: MathJsChain<MathType>,
    y: T
  ): MathJsChain<T>
  dotDivide(this: MathJsChain<Unit>, y: MathType): MathJsChain<Unit>
  dotDivide(this: MathJsChain<MathType>, y: Unit): MathJsChain<Unit>
  dotDivide(
    this: MathJsChain<MathNumericType>,
    y: MathNumericType
  ): MathJsChain<MathNumericType>

  /**
   * Multiply two matrices element wise. The function accepts both
   * matrices and scalar values.
   * @param y Right hand value
   */
  dotMultiply<T extends MathCollection>(
    this: MathJsChain<T>,
    y: MathType
  ): MathJsChain<T>
  dotMultiply<T extends MathCollection>(
    this: MathJsChain<MathType>,
    y: T
  ): MathJsChain<T>
  dotMultiply(this: MathJsChain<Unit>, y: MathType): MathJsChain<Unit>
  dotMultiply(this: MathJsChain<MathType>, y: Unit): MathJsChain<Unit>
  dotMultiply(
    this: MathJsChain<MathNumericType>,
    y: MathNumericType
  ): MathJsChain<MathNumericType>

  /**
   * Calculates the power of x to y element wise.
   * @param y The exponent
   */
  dotPow<T extends MathType>(this: MathJsChain<T>, y: MathType): MathJsChain<T>

  /**
   * Calculate the exponent of a value. For matrices, the function is
   * evaluated element wise.
   */
  exp<T extends number | BigNumber | Complex>(
    this: MathJsChain<T>
  ): MathJsChain<T>

  /**
   * Calculate the value of subtracting 1 from the exponential value. For
   * matrices, the function is evaluated element wise.
   */
  expm1<T extends number | BigNumber | Complex>(
    this: MathJsChain<T>
  ): MathJsChain<T>

  /**
   * Calculate the greatest common divisor for two or more values or
   * arrays. For matrices, the function is evaluated element wise.
   */
  gcd<T extends number | BigNumber | Fraction | Matrix>(
    this: MathJsChain<T[]>,
    ...args: T[]
  ): MathJsChain<T>

  /**
   * Calculate the hypotenuse of a list with values. The hypotenuse is
   * defined as: hypot(a, b, c, ...) = sqrt(a^2 + b^2 + c^2 + ...) For
   * matrix input, the hypotenuse is calculated for all values in the
   * matrix.
   */
  hypot<T extends number | BigNumber>(this: MathJsChain<T[]>): MathJsChain<T>

  /**
   * Calculate the least common multiple for two or more values or arrays.
   * lcm is defined as: lcm(a, b) = abs(a * b) / gcd(a, b) For matrices,
   * the function is evaluated element wise.
   * @param b An integer number
   */
  lcm<T extends number | BigNumber | MathCollection>(
    this: MathJsChain<T>,
    b: T
  ): MathJsChain<T>

  /**
   * Calculate the logarithm of a value. For matrices, the function is
   * evaluated element wise.
   * @param base Optional base for the logarithm. If not provided, the
   * natural logarithm of x is calculated. Default value: e.
   */
  log<T extends number | BigNumber | Complex | MathCollection>(
    this: MathJsChain<T>,
    base?: number | BigNumber | Complex
  ): MathJsChain<NoLiteralType<T>>

  /**
   * Calculate the 10-base of a value. This is the same as calculating
   * log(x, 10). For matrices, the function is evaluated element wise.
   */

  log10<T extends number | BigNumber | Complex | MathCollection>(
    this: MathJsChain<T>
  ): MathJsChain<T>

  /**
   * Calculate the logarithm of a value+1. For matrices, the function is
   * evaluated element wise.
   */
  log1p(
    this: MathJsChain<number>,
    base?: number | BigNumber | Complex
  ): MathJsChain<number>
  log1p(
    this: MathJsChain<BigNumber>,
    base?: number | BigNumber | Complex
  ): MathJsChain<BigNumber>
  log1p(
    this: MathJsChain<Complex>,
    base?: number | BigNumber | Complex
  ): MathJsChain<Complex>
  log1p(
    this: MathJsChain<MathArray>,
    base?: number | BigNumber | Complex
  ): MathJsChain<MathArray>
  log1p(
    this: MathJsChain<Matrix>,
    base?: number | BigNumber | Complex
  ): MathJsChain<Matrix>

  /**
   * Calculate the 2-base of a value. This is the same as calculating
   * log(x, 2). For matrices, the function is evaluated element wise.
   */

  log2<T extends number | BigNumber | Complex | MathCollection>(
    this: MathJsChain<T>
  ): MathJsChain<T>

  /**
   * Calculates the modulus, the remainder of an integer division. For
   * matrices, the function is evaluated element wise. The modulus is
   * defined as: x - y * floor(x / y)
   * @see http://en.wikipedia.org/wiki/Modulo_operation.
   * @param y Divisor
   */
  mod<T extends number | BigNumber | bigint | Fraction | MathCollection>(
    this: MathJsChain<T>,
    y: number | BigNumber | bigint | Fraction | MathCollection
  ): MathJsChain<NoLiteralType<T>>

  /**
   * Multiply two values, x * y. The result is squeezed. For matrices, the
   * matrix product is calculated.
   * @param y The second value to multiply
   */
  multiply<T extends MathCollection>(
    this: MathJsChain<T>,
    y: MathType
  ): MathJsChain<T>
  multiply(this: MathJsChain<Unit>, y: Unit): MathJsChain<Unit>
  multiply(this: MathJsChain<number>, y: number): MathJsChain<number>
  multiply(this: MathJsChain<MathType>, y: MathType): MathJsChain<MathType>

  /**
   * Calculate the norm of a number, vector or matrix. The second
   * parameter p is optional. If not provided, it defaults to 2.
   * @param p Vector space. Supported numbers include Infinity and
   * -Infinity. Supported strings are: 'inf', '-inf', and 'fro' (The
   * Frobenius norm) Default value: 2.
   */
  norm(
    this: MathJsChain<number | BigNumber | Complex | MathCollection>,
    p?: number | BigNumber | string
  ): MathJsChain<number | BigNumber>

  /**
   * Calculate the nth root of a value. The principal nth root of a
   * positive real number A, is the positive real solution of the equation
   * x^root = A For matrices, the function is evaluated element wise.
   * @param root The root. Default value: 2.
   */
  nthRoot(
    this: MathJsChain<number | BigNumber | MathCollection | Complex>,
    root?: number | BigNumber
  ): MathJsChain<number | Complex | MathCollection>

  /**
   * Calculates the power of x to y, x ^ y. Matrix exponentiation is
   * supported for square matrices x, and positive integer exponents y.
   * @param y The exponent
   */
  pow(
    this: MathJsChain<MathType>,
    y: number | BigNumber | bigint | Complex
  ): MathJsChain<MathType>

  /**
   * Compute the sign of a value. The sign of a value x is: 1 when x > 1
   * -1 when x < 0 0 when x == 0 For matrices, the function is evaluated
   * element wise.
   * @param x The number for which to determine the sign
   * @returns The sign of x
   */
  sign<T extends MathType>(this: MathJsChain<T>): MathJsChain<T>

  /**
   * Calculate the square root of a value. For matrices, the function is
   * evaluated element wise.
   */

  sqrt<T extends number | BigNumber | Complex | MathCollection | Unit>(
    this: MathJsChain<T>
  ): MathJsChain<T>

  /**
   * Compute the square of a value, x * x. For matrices, the function is
   * evaluated element wise.
   */

  square<T extends MathType>(this: MathJsChain<T>): MathJsChain<T>

  /**
   * Subtract two values, x - y. For matrices, the function is evaluated
   * element wise.
   * @param y Value to subtract from x
   */
  subtract<T extends MathType>(this: MathJsChain<T>, y: T): MathJsChain<T>

  /**
   * Inverse the sign of a value, apply a unary minus operation. For
   * matrices, the function is evaluated element wise. Boolean values and
   * strings will be converted to a number. For complex numbers, both real
   * and complex value are inverted.
   */

  unaryMinus<T extends MathType>(this: MathJsChain<T>): MathJsChain<T>

  /**
   * Unary plus operation. Boolean values and strings will be converted to
   * a number, numeric values will be returned as is. For matrices, the
   * function is evaluated element wise.
   */

  unaryPlus<T extends string | MathType>(this: MathJsChain<T>): MathJsChain<T>

  /**
   * Calculate the extended greatest common divisor for two values. See
   * http://en.wikipedia.org/wiki/Extended_Euclidean_algorithm.
   * @param b An integer number
   */
  xgcd(
    this: MathJsChain<number | BigNumber>,
    b: number | BigNumber
  ): MathJsChain<MathArray>

  /**
   * Count the number of elements of a matrix, array or string.
   */
  count(this: MathJsChain<MathCollection>): MathJsChain<number>
  count(this: MathJsChain<string>): MathJsChain<number>

  /**
   * Compute the sum of a matrix or a list with values. In case of a
   * (multi dimensional) array or matrix, the sum of all elements will be
   * calculated.
   */
  sum(
    this: MathJsChain<Array<number | BigNumber | Fraction>>
  ): MathJsChain<number>
  sum(this: MathJsChain<MathCollection>): MathJsChain<number>
  /*************************************************************************
   * Bitwise functions
   ************************************************************************/

  /**
   * Bitwise AND two values, x & y. For matrices, the function is
   * evaluated element wise.
   * @param y Second value to and
   */
  bitAnd<T extends number | BigNumber | bigint | MathCollection>(
    this: MathJsChain<T>,
    y: number | BigNumber | bigint | MathCollection
  ): MathJsChain<NoLiteralType<T>>

  /**
   * Bitwise NOT value, ~x. For matrices, the function is evaluated
   * element wise. For units, the function is evaluated on the best prefix
   * base.
   */

  bitNot<T extends number | BigNumber | bigint | MathCollection>(
    this: MathJsChain<T>
  ): MathJsChain<T>

  /**
   * Bitwise OR two values, x | y. For matrices, the function is evaluated
   * element wise. For units, the function is evaluated on the lowest
   * print base.
   * @param y Second value to or
   */
  bitOr<T extends number | BigNumber | bigint | MathCollection>(
    this: MathJsChain<T>,
    y: T
  ): MathJsChain<T>

  /**
   * Bitwise XOR two values, x ^ y. For matrices, the function is
   * evaluated element wise.
   * @param y Second value to xor
   */
  bitXor<T extends number | BigNumber | bigint | MathCollection>(
    this: MathJsChain<T>,
    y: number | BigNumber | bigint | MathCollection
  ): MathJsChain<NoLiteralType<T>>

  /**
   * Bitwise left logical shift of a value x by y number of bits, x << y.
   * For matrices, the function is evaluated element wise. For units, the
   * function is evaluated on the best prefix base.
   * @param y Amount of shifts
   */
  leftShift<T extends number | BigNumber | bigint | MathCollection>(
    this: MathJsChain<T>,
    y: number | BigNumber | bigint
  ): MathJsChain<NoLiteralType<T>>

  /**
   * Bitwise right arithmetic shift of a value x by y number of bits, x >>
   * y. For matrices, the function is evaluated element wise. For units,
   * the function is evaluated on the best prefix base.
   * @param y Amount of shifts
   */
  rightArithShift<T extends number | BigNumber | bigint | MathCollection>(
    this: MathJsChain<T>,
    y: number | BigNumber | bigint
  ): MathJsChain<NoLiteralType<T>>

  /**
   * Bitwise right logical shift of value x by y number of bits, x >>> y.
   * For matrices, the function is evaluated element wise. For units, the
   * function is evaluated on the best prefix base.
   * @param y Amount of shifts
   */
  rightLogShift<T extends number | MathCollection>(
    this: MathJsChain<T>,
    y: number
  ): MathJsChain<NoLiteralType<T>>

  /*************************************************************************
   * Combinatorics functions
   ************************************************************************/

  /**
   * The Bell Numbers count the number of partitions of a set. A partition
   * is a pairwise disjoint subset of S whose union is S. bellNumbers only
   * takes integer arguments. The following condition must be enforced: n
   * >= 0
   */

  bellNumbers(this: MathJsChain<number>): MathJsChain<number>
  bellNumbers(this: MathJsChain<BigNumber>): MathJsChain<BigNumber>

  /**
   * The Catalan Numbers enumerate combinatorial structures of many
   * different types. catalan only takes integer arguments. The following
   * condition must be enforced: n >= 0
   */

  catalan(this: MathJsChain<number>): MathJsChain<number>
  catalan(this: MathJsChain<BigNumber>): MathJsChain<BigNumber>

  /**
   * The composition counts of n into k parts. Composition only takes
   * integer arguments. The following condition must be enforced: k <= n.
   * @param k Number of objects in the subset
   */
  composition<T extends number | BigNumber>(
    this: MathJsChain<T>,
    k: number | BigNumber
  ): MathJsChain<NoLiteralType<T>>

  /**
   * The Stirling numbers of the second kind, counts the number of ways to
   * partition a set of n labelled objects into k nonempty unlabelled
   * subsets. stirlingS2 only takes integer arguments. The following
   * condition must be enforced: k <= n. If n = k or k = 1, then s(n,k) =
   * 1
   * @param k Number of objects in the subset
   */
  stirlingS2<T extends number | BigNumber>(
    this: MathJsChain<T>,
    k: number | BigNumber
  ): MathJsChain<NoLiteralType<T>>

  /*************************************************************************
   * Complex functions
   ************************************************************************/

  /**
   * Compute the argument of a complex value. For a complex number a + bi,
   * the argument is computed as atan2(b, a). For matrices, the function
   * is evaluated element wise.
   */

  arg(this: MathJsChain<number | Complex>): MathJsChain<number>
  arg(this: MathJsChain<BigNumber | Complex>): MathJsChain<BigNumber>
  arg(this: MathJsChain<MathArray>): MathJsChain<MathArray>
  arg(this: MathJsChain<Matrix>): MathJsChain<Matrix>

  /**
   * Compute the complex conjugate of a complex value. If x = a+bi, the
   * complex conjugate of x is a - bi. For matrices, the function is
   * evaluated element wise.
   */
  conj<T extends number | BigNumber | Complex | MathCollection>(
    this: MathJsChain<T>
  ): MathJsChain<NoLiteralType<T>>

  /**
   * Get the imaginary part of a complex number. For a complex number a +
   * bi, the function returns b. For matrices, the function is evaluated
   * element wise.
   */
  im(this: MathJsChain<number | Complex>): MathJsChain<number>
  im(this: MathJsChain<BigNumber>): MathJsChain<BigNumber>
  im(this: MathJsChain<MathCollection>): MathJsChain<MathCollection>

  /**
   * Get the real part of a complex number. For a complex number a + bi,
   * the function returns a. For matrices, the function is evaluated
   * element wise.
   */
  re(this: MathJsChain<number | Complex>): MathJsChain<number>
  re(this: MathJsChain<BigNumber>): MathJsChain<BigNumber>
  re(this: MathJsChain<MathCollection>): MathJsChain<MathCollection>

  /*************************************************************************
   * Geometry functions
   ************************************************************************/

  /**
   * Calculates: The eucledian distance between two points in 2 and 3
   * dimensional spaces. Distance between point and a line in 2 and 3
   * dimensional spaces. Pairwise distance between a set of 2D or 3D
   * points NOTE: When substituting coefficients of a line(a, b and c),
   * use ax + by + c = 0 instead of ax + by = c For parametric equation of
   * a 3D line, x0, y0, z0, a, b, c are from: (x−x0, y−y0, z−z0) = t(a, b,
   * c)
   * @param y Coordinates of the second point
   */
  distance(
    this: MathJsChain<MathCollection | object>,
    y: MathCollection | object
  ): MathJsChain<number | BigNumber>

  /**
   * Calculates the point of intersection of two lines in two or three
   * dimensions and of a line and a plane in three dimensions. The inputs
   * are in the form of arrays or 1 dimensional matrices. The line
   * intersection functions return null if the lines do not meet. Note:
   * Fill the plane coefficients as x + y + z = c and not as x + y + z + c
   * = 0.
   * @param x Co-ordinates of second end-point of first line
   * @param y Co-ordinates of first end-point of second line OR
   * Coefficients of the plane's equation
   * @param z Co-ordinates of second end-point of second line OR null if
   * the calculation is for line and plane
   */
  intersect(
    this: MathJsChain<MathCollection>,
    x: MathCollection,
    y: MathCollection,
    z?: MathCollection
  ): MathJsChain<MathArray>

  /*************************************************************************
   * Logical functions
   ************************************************************************/

  /**
   * Logical and. Test whether two values are both defined with a
   * nonzero/nonempty value. For matrices, the function is evaluated
   * element wise.
   * @param y Second value to and
   */
  and(
    this: MathJsChain<
      number | BigNumber | bigint | Complex | Unit | MathCollection
    >,
    y: number | BigNumber | bigint | Complex | Unit | MathCollection
  ): MathJsChain<boolean | MathCollection>

  /**
   * Logical not. Flips boolean value of a given parameter. For matrices,
   * the function is evaluated element wise.
   */
  not(
    this: MathJsChain<
      number | BigNumber | bigint | Complex | Unit | MathCollection
    >
  ): MathJsChain<boolean | MathCollection>

  /**
   * Logical or. Test if at least one value is defined with a
   * nonzero/nonempty value. For matrices, the function is evaluated
   * element wise.
   * @param y Second value to or
   */
  or(
    this: MathJsChain<
      number | BigNumber | bigint | Complex | Unit | MathCollection
    >,
    y: number | BigNumber | bigint | Complex | Unit | MathCollection
  ): MathJsChain<boolean | MathCollection>

  /**
   * Logical xor. Test whether one and only one value is defined with a
   * nonzero/nonempty value. For matrices, the function is evaluated
   * element wise.
   * @param y Second value to xor
   */
  xor(
    this: MathJsChain<
      number | BigNumber | bigint | Complex | Unit | MathCollection
    >,
    y: number | BigNumber | bigint | Complex | Unit | MathCollection
  ): MathJsChain<boolean | MathCollection>

  /*************************************************************************
   * Matrix functions
   ************************************************************************/

  /**
   * Concatenate two or more matrices. dim: number is a zero-based
   * dimension over which to concatenate the matrices. By default the last
   * dimension of the matrices.
   */

  concat(
    this: MathJsChain<Array<MathCollection | number | BigNumber>>
  ): MathJsChain<MathCollection>

  /**
   * Calculate the cross product for two vectors in three dimensional
   * space. The cross product of A = [a1, a2, a3] and B =[b1, b2, b3] is
   * defined as: cross(A, B) = [ a2 * b3 - a3 * b2, a3 * b1 - a1 * b3, a1
   * * b2 - a2 * b1 ]
   * @param y Second vector
   */
  cross(
    this: MathJsChain<MathCollection>,
    y: MathCollection
  ): MathJsChain<MathCollection>

  /**
   * Calculate the determinant of a matrix.
   */

  det(this: MathJsChain<MathCollection>): MathJsChain<number>

  /**
   * Create a diagonal matrix or retrieve the diagonal of a matrix. When x
   * is a vector, a matrix with vector x on the diagonal will be returned.
   * When x is a two dimensional matrix, the matrixes kth diagonal will be
   * returned as vector. When k is positive, the values are placed on the
   * super diagonal. When k is negative, the values are placed on the sub
   * diagonal.
   * @param k The diagonal where the vector will be filled in or
   * retrieved. Default value: 0.
   * @param format The matrix storage format. Default value: 'dense'.
   */
  diag(this: MathJsChain<MathCollection>, format?: string): MathJsChain<Matrix>
  diag(
    this: MathJsChain<MathCollection>,
    k: number | BigNumber,
    format?: string
  ): MathJsChain<MathCollection>

  /**
   * Calculate the dot product of two vectors. The dot product of A = [a1,
   * a2, a3, ..., an] and B = [b1, b2, b3, ..., bn] is defined as: dot(A,
   * B) = a1 * b1 + a2 * b2 + a3 * b3 + ... + an * bn
   * @param y Second vector
   */
  dot(this: MathJsChain<MathCollection>, y: MathCollection): MathJsChain<number>

  /**
   * Compute the matrix exponential, expm(A) = e^A. The matrix must be
   * square. Not to be confused with exp(a), which performs element-wise
   * exponentiation. The exponential is calculated using the Padé
   * approximant with scaling and squaring; see “Nineteen Dubious Ways to
   * Compute the Exponential of a Matrix,” by Moler and Van Loan.
   */

  expm(this: MathJsChain<Matrix>): MathJsChain<Matrix>

  /**
   * Performs a real Schur decomposition of the real matrix A = UTU' where U is orthogonal
   * and T is upper quasi-triangular.
   * https://en.wikipedia.org/wiki/Schur_decomposition
   * @returns Object containing both matrix U and T of the Schur Decomposition A=UTU'
   */
  schur(this: MathJsChain<MathCollection>): SchurDecomposition

  /**
   * Solves the Continuous-time Lyapunov equation AP+PA'=Q for P, where Q is a positive semidefinite
   * matrix.
   * https://en.wikipedia.org/wiki/Lyapunov_equation
   * @param Q  Matrix Q
   * @returns  Matrix P solution to the Continuous-time Lyapunov equation AP+PA'=Q
   */
  lyap(
    this: MathJsChain<MathCollection>,
    Q: MathCollection
  ): MathJsChain<MathCollection>

  /**
   * Create a 2-dimensional identity matrix with size m x n or n x n. The
   * matrix has ones on the diagonal and zeros elsewhere.
   * @param format The Matrix storage format
   */
  identity(
    this: MathJsChain<number | number[] | MathCollection>,
    format?: string
  ): MathJsChain<MathCollection | number>

  /**
   * @param n The y dimension for the matrix
   * @param format The Matrix storage format
   */
  identity(
    this: MathJsChain<number>,
    n: number,
    format?: string
  ): MathJsChain<MathCollection | number>

  /**
   * Filter the items in an array or one dimensional matrix.
   */
  filter(
    this: MathJsChain<MathCollection | string[]>,
    test:
      | ((
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          value: any,
          index: number[],
          matrix: MathCollection | string[]
        ) => boolean)
      | RegExp
  ): MathJsChain<MathCollection>

  /**
   * Flatten a multi dimensional matrix into a single dimensional matrix.
   */

  flatten<T extends MathCollection>(x: MathJsChain<T>): MathJsChain<T>

  /**
   * Iterate over all elements of a matrix/array, and executes the given
   * callback function.
   */
  forEach<T extends MathCollection>(
    this: MathJsChain<T>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (value: any, index: number[], matrix: T) => void
  ): void

  /**
   * Calculate the inverse of a square matrix.
   */

  inv<T extends number | Complex | MathCollection>(
    this: MathJsChain<T>
  ): MathJsChain<NoLiteralType<T>>

  /**
   * Calculate the Kronecker product of two matrices or vectors
   * @param y Second vector
   */
  kron(
    this: MathJsChain<MathCollection>,
    y: MathCollection
  ): MathJsChain<Matrix>

  /**
   * Iterate over all elements of a matrix/array, and executes the given
   * callback function.
   * @param callback The callback function is invoked with three
   * parameters: the value of the element, the index of the element, and
   * the Matrix/array being traversed.
   */
  map<T extends MathCollection>(
    this: MathJsChain<T>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (value: any, index: number[], matrix: T) => MathType | string
  ): MathJsChain<T>

  /**
   * Create a matrix filled with ones. The created matrix can have one or
   * multiple dimensions.
   * @param format The matrix storage format
   */
  ones(
    this: MathJsChain<number | number[] | BigNumber | BigNumber[]>,
    format?: string
  ): MathJsChain<MathCollection>

  /**
   * Partition-based selection of an array or 1D matrix. Will find the kth
   * smallest value, and mutates the input array. Uses Quickselect.
   * @param k The kth smallest value to be retrieved; zero-based index
   * @param compare  An optional comparator function. The function is
   * called as compare(a, b), and must return 1 when a > b, -1 when a < b,
   * and 0 when a == b. Default value: 'asc'.
   */
  partitionSelect(
    this: MathJsChain<MathCollection>,
    k: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    compare?: 'asc' | 'desc' | ((a: any, b: any) => number)
  ): MathJsChain<MathCollection>

  /**
   * Create an array from a range. By default, the range end is excluded.
   * This can be customized by providing an extra parameter includeEnd.
   * @param end End of the range, excluded by default, included when
   * parameter includeEnd=true
   * @param step Step size. Default value is 1.
   * @param includeEnd: Option to specify whether to include the end or
   * not. False by default
   */
  range(this: MathJsChain<string>, includeEnd?: boolean): MathJsChain<Matrix>
  range(
    this: MathJsChain<number | BigNumber>,
    end: number | BigNumber,
    includeEnd?: boolean
  ): MathJsChain<Matrix>
  range(
    this: MathJsChain<number | BigNumber | Unit>,
    end: number | BigNumber | Unit,
    step: number | BigNumber | Unit,
    includeEnd?: boolean
  ): MathJsChain<Matrix>

  /**
   * Reshape a multi dimensional array to fit the specified dimensions
   * @param sizes One dimensional array with integral sizes for each
   * dimension
   */
  reshape<T extends MathCollection>(
    this: MathJsChain<T>,
    sizes: number[]
  ): MathJsChain<T>

  /**
   * Resize a matrix
   * @param size One dimensional array with numbers
   * @param defaultValue Zero by default, except in case of a string, in
   * that case defaultValue = ' ' Default value: 0.
   */
  resize<T extends MathCollection>(
    this: MathJsChain<T>,
    size: MathCollection,
    defaultValue?: number | string
  ): MathJsChain<T>

  /**
   * Calculate the size of a matrix or scalar.
   */
  size(
    this: MathJsChain<
      boolean | number | Complex | Unit | string | MathCollection
    >
  ): MathJsChain<MathCollection>

  /**
   * Sort the items in a matrix
   * @param compare An optional _comparator function or name. The function
   * is called as compare(a, b), and must return 1 when a > b, -1 when a <
   * b, and 0 when a == b. Default value: ‘asc’
   */
  sort<T extends MathCollection>(
    this: MathJsChain<T>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    compare: ((a: any, b: any) => number) | 'asc' | 'desc' | 'natural'
  ): MathJsChain<T>

  /**
   * Calculate the principal square root of a square matrix. The principal
   * square root matrix X of another matrix A is such that X * X = A.
   */

  sqrtm<T extends MathCollection>(A: MathJsChain<T>): MathJsChain<T>

  /**
   * Squeeze a matrix, remove inner and outer singleton dimensions from a
   * matrix.
   */

  squeeze<T extends MathCollection>(x: MathJsChain<T>): MathJsChain<T>

  /**
   * Get or set a subset of a matrix or string.
   * @param index For each dimension, an index or list of indices to get or set
   * @param replacement An array, matrix, or scalar. If provided, the
   * subset is replaced with replacement. If not provided, the subset is
   * returned
   * @param defaultValue Default value, filled in on new entries when the
   * matrix is resized. If not provided, math.matrix elements will be left
   * undefined. Default value: undefined.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subset<T extends MathCollection | string>(
    this: MathJsChain<T>,
    index: Index,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    replacement?: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValue?: any
  ): MathJsChain<T>

  /**
   * Calculate the trace of a matrix: the sum of the elements on the main
   * diagonal of a square matrix.
   */

  trace(this: MathJsChain<MathCollection>): MathJsChain<number>

  /**
   * Transpose a matrix. All values of the matrix are reflected over its
   * main diagonal. Only two dimensional matrices are supported.
   */

  transpose<T extends MathCollection>(x: MathJsChain<T>): MathJsChain<T>

  /**
   * Create a matrix filled with zeros. The created matrix can have one or
   * multiple dimensions.
   * @param format The matrix storage format
   * @returns A matrix filled with zeros
   */
  zeros(
    this: MathJsChain<number | number[] | BigNumber | BigNumber[]>,
    format?: string
  ): MathJsChain<MathCollection>

  /*************************************************************************
   * Probability functions
   ************************************************************************/

  /**
   * Compute the number of ways of picking k unordered outcomes from n
   * possibilities. Combinations only takes integer arguments. The
   * following condition must be enforced: k <= n.
   * @param k Number of objects in the subset
   */
  combinations<T extends number | BigNumber>(
    n: MathJsChain<T>,
    k: number | BigNumber
  ): MathJsChain<NoLiteralType<T>>

  /**
   * Compute the factorial of a value Factorial only supports an integer
   * value as argument. For matrices, the function is evaluated element
   * wise.
   */

  factorial<T extends number | BigNumber | MathCollection>(
    n: MathJsChain<T>
  ): MathJsChain<NoLiteralType<T>>

  /**
   * Compute the gamma function of a value using Lanczos approximation for
   * small values, and an extended Stirling approximation for large
   * values. For matrices, the function is evaluated element wise.
   */

  gamma<T extends number | BigNumber | Complex | MathCollection>(
    n: MathJsChain<T>
  ): MathJsChain<NoLiteralType<T>>

  /**
   * Calculate the Kullback-Leibler (KL) divergence between two
   * distributions
   * @param p Second vector
   */
  kldivergence(
    this: MathJsChain<MathCollection>,
    p: MathCollection
  ): MathJsChain<number>

  /**
   * Multinomial Coefficients compute the number of ways of picking a1,
   * a2, ..., ai unordered outcomes from n possibilities. multinomial
   * takes one array of integers as an argument. The following condition
   * must be enforced: every ai <= 0
   */

  multinomial<T extends number | BigNumber>(
    a: MathJsChain<T[]>
  ): MathJsChain<NoLiteralType<T>>

  /**
   * Compute the number of ways of obtaining an ordered subset of k
   * elements from a set of n elements. Permutations only takes integer
   * arguments. The following condition must be enforced: k <= n.
   * @param k The number of objects in the subset
   */
  permutations<T extends number | BigNumber>(
    n: MathJsChain<T>,
    k?: number | BigNumber
  ): MathJsChain<NoLiteralType<T>>

  /**
   * Random pick a value from a one dimensional array. Array element is
   * picked using a random function with uniform distribution.
   * @param number An int or float
   * @param weights An array of ints or floats
   */
  pickRandom<T>(this: MathJsChain<T[]>): MathJsChain<T>
  pickRandom<T>(this: MathJsChain<T[]>, number: number): MathJsChain<T[]>
  pickRandom<T>(
    this: MathJsChain<T[]>,
    number: number,
    weights: number[]
  ): MathJsChain<T[]>

  /**
   * Return a random number larger or equal to min and smaller than max
   * using a uniform distribution.
   * @param min Minimum boundary for the random value, included
   * @param max Maximum boundary for the random value, excluded
   */
  random(this: MathJsChain<number>, max?: number): MathJsChain<number>

  // tslint:disable-next-line unified-signatures
  random<T extends MathCollection>(
    this: MathJsChain<T>,
    min?: number,
    max?: number
  ): MathJsChain<T>

  /**
   * Return a random integer number larger or equal to min and smaller
   * than max using a uniform distribution.
   * @param min Minimum boundary for the random value, included
   * @param max Maximum boundary for the random value, excluded
   */
  randomInt<T extends MathCollection>(
    this: MathJsChain<T>,
    max?: number
  ): MathJsChain<T>
  randomInt<T extends MathCollection>(
    this: MathJsChain<T>,
    max?: number
  ): MathJsChain<T>
  // tslint:disable-next-line unified-signatures
  randomInt<T extends MathCollection>(
    this: MathJsChain<T>,
    min: number,
    max: number
  ): MathJsChain<T>

  /*************************************************************************
   * Relational functions
   ************************************************************************/

  /**
   * Compare two values. Returns 1 when x > y, -1 when x < y, and 0 when x
   * == y. x and y are considered equal when the relative difference
   * between x and y is smaller than the configured relTol and absTol. The function
   * cannot be used to compare values smaller than approximately 2.22e-16.
   * For matrices, the function is evaluated element wise.
   * @param y Second value to compare
   */
  compare(
    this: MathJsChain<MathType | string>,
    y: MathType | string
  ): MathJsChain<number | BigNumber | Fraction | MathCollection>

  /**
   * Compare two values of any type in a deterministic, natural way. For
   * numeric values, the function works the same as math.compare. For
   * types of values that can’t be compared mathematically, the function
   * compares in a natural way.
   * @param y Second value to compare
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  compareNatural(this: MathJsChain<any>, y: any): MathJsChain<number>

  /**
   * Compare two strings lexically. Comparison is case sensitive. Returns
   * 1 when x > y, -1 when x < y, and 0 when x == y. For matrices, the
   * function is evaluated element wise.
   * @param y Second string to compare
   */
  compareText(
    this: MathJsChain<string | MathCollection>,
    y: string | MathCollection
  ): MathJsChain<number | MathCollection>

  /**
   * Test element wise whether two matrices are equal. The function
   * accepts both matrices and scalar values.
   * @param y Second amtrix to compare
   */
  deepEqual(this: MathJsChain<MathType>, y: MathType): MathJsChain<MathType>

  /**
   * Test whether two values are equal.
   *
   * The function tests whether the relative difference between x and y is
   * smaller than the configured relTol and absTol. The function cannot be used to
   * compare values smaller than approximately 2.22e-16. For matrices, the
   * function is evaluated element wise. In case of complex numbers, x.re
   * must equal y.re, and x.im must equal y.im. Values null and undefined
   * are compared strictly, thus null is only equal to null and nothing
   * else, and undefined is only equal to undefined and nothing else.
   * @param y Second value to compare
   */
  equal(
    this: MathJsChain<MathType | string>,
    y: MathType | string
  ): MathJsChain<boolean | MathCollection>

  /**
   * Check equality of two strings. Comparison is case sensitive. For
   * matrices, the function is evaluated element wise.
   * @param y Second string to compare
   */
  equalText(
    this: MathJsChain<string | MathCollection>,
    y: string | MathCollection
  ): MathJsChain<number | MathCollection>

  /**
   * Test whether value x is larger than y. The function returns true when
   * x is larger than y and the relative difference between x and y is
   * larger than the configured relTol and absTol. The function cannot be used to
   * compare values smaller than approximately 2.22e-16. For matrices, the
   * function is evaluated element wise.
   * @param y Second value to compare
   */
  larger(
    this: MathJsChain<MathType | string>,
    y: MathType | string
  ): MathJsChain<boolean | MathCollection>

  /**
   * Test whether value x is larger or equal to y. The function returns
   * true when x is larger than y or the relative difference between x and
   * y is smaller than the configured relTol and absTol. The function cannot be used
   * to compare values smaller than approximately 2.22e-16. For matrices,
   * the function is evaluated element wise.
   * @param y Second value to vcompare
   */
  largerEq(
    this: MathJsChain<MathType | string>,
    y: MathType | string
  ): MathJsChain<boolean | MathCollection>

  /**
   * Test whether value x is smaller than y. The function returns true
   * when x is smaller than y and the relative difference between x and y
   * is smaller than the configured relTol and absTol. The function cannot be used
   * to compare values smaller than approximately 2.22e-16. For matrices,
   * the function is evaluated element wise.
   * @param y Second value to vcompare
   */
  smaller(
    this: MathJsChain<MathType | string>,
    y: MathType | string
  ): MathJsChain<boolean | MathCollection>

  /**
   * Test whether value x is smaller or equal to y. The function returns
   * true when x is smaller than y or the relative difference between x
   * and y is smaller than the configured relTol and absTol. The function cannot be
   * used to compare values smaller than approximately 2.22e-16. For
   * matrices, the function is evaluated element wise.
   * @param y Second value to compare
   */
  smallerEq(
    this: MathJsChain<MathType | string>,
    y: MathType | string
  ): MathJsChain<boolean | MathCollection>

  /**
   * Determines if two expressions are symbolically equal, i.e. one is the
   * result of valid algebraic manipulations on the other.
   * @param {Node} expr2 The second expression to compare
   * @param {Object} [options] Optional option object, passed to simplify
   * @returns {boolean} Returns true if a valid manipulation making the
   * expressions equal is found.
   */
  symbolicEqual(
    this: MathJsChain<MathNode>,
    expr2: MathNode,
    options?: SimplifyOptions
  ): MathJsChain<boolean>

  /**
   * Test whether two values are unequal. The function tests whether the
   * relative difference between x and y is larger than the configured
   * relTol and absTol. The function cannot be used to compare values smaller than
   * approximately 2.22e-16. For matrices, the function is evaluated
   * element wise. In case of complex numbers, x.re must unequal y.re, or
   * x.im must unequal y.im. Values null and undefined are compared
   * strictly, thus null is unequal with everything except null, and
   * undefined is unequal with everything except undefined.
   * @param y Second value to vcompare
   */
  unequal(
    this: MathJsChain<MathType | string>,
    y: MathType | string
  ): MathJsChain<boolean | MathCollection>

  /*************************************************************************
   * Set functions
   ************************************************************************/

  /**
   * Create the cartesian product of two (multi)sets. Multi-dimension
   * arrays will be converted to single-dimension arrays and the values
   * will be sorted in ascending order before the operation.
   * @param a2 A (multi)set
   */
  setCartesian<T extends MathCollection>(
    this: MathJsChain<T>,
    a2: MathCollection
  ): MathJsChain<T>

  /**
   * Create the difference of two (multi)sets: every element of set1, that
   * is not the element of set2. Multi-dimension arrays will be converted
   * to single-dimension arrays before the operation
   * @param a2 A (multi)set
   */
  setDifference<T extends MathCollection>(
    this: MathJsChain<T>,
    a2: MathCollection
  ): MathJsChain<T>

  /**
   * Collect the distinct elements of a multiset. A multi-dimension array
   * will be converted to a single-dimension array before the operation.
   */

  setDistinct<T extends MathCollection>(a: MathJsChain<T>): MathJsChain<T>

  /**
   * Create the intersection of two (multi)sets. Multi-dimension arrays
   * will be converted to single-dimension arrays before the operation.
   * @param a2 A (multi)set
   */
  setIntersect<T extends MathCollection>(
    this: MathJsChain<T>,
    a2: MathCollection
  ): MathJsChain<T>

  /**
   * Check whether a (multi)set is a subset of another (multi)set. (Every
   * element of set1 is the element of set2.) Multi-dimension arrays will
   * be converted to single-dimension arrays before the operation.
   * @param a2 A (multi)set
   */
  setIsSubset(
    this: MathJsChain<MathCollection>,
    a2: MathCollection
  ): MathJsChain<boolean>

  /**
   * Count the multiplicity of an element in a multiset. A multi-dimension
   * array will be converted to a single-dimension array before the
   * operation.
   * @param a A multiset
   */
  setMultiplicity(
    e: MathJsChain<MathNumericType>,
    a: MathCollection
  ): MathJsChain<number>

  /**
   * Create the powerset of a (multi)set. (The powerset contains very
   * possible subsets of a (multi)set.) A multi-dimension array will be
   * converted to a single-dimension array before the operation.
   */

  setPowerset<T extends MathCollection>(a: MathJsChain<T>): MathJsChain<T>

  /**
   * Count the number of elements of a (multi)set. When a second parameter
   * is ‘true’, count only the unique values. A multi-dimension array will
   * be converted to a single-dimension array before the operation.
   */

  setSize(this: MathJsChain<MathCollection>): MathJsChain<number>

  /**
   * Create the symmetric difference of two (multi)sets. Multi-dimension
   * arrays will be converted to single-dimension arrays before the
   * operation.
   * @param a2 A (multi)set
   */
  setSymDifference<T extends MathCollection>(
    this: MathJsChain<T>,
    a2: MathCollection
  ): MathJsChain<T>

  /**
   * Create the union of two (multi)sets. Multi-dimension arrays will be
   * converted to single-dimension arrays before the operation.
   * @param a2 A (multi)set
   */
  setUnion<T extends MathCollection>(
    this: MathJsChain<T>,
    a2: MathCollection
  ): MathJsChain<T>

  /*************************************************************************
   * Signal functions
   ************************************************************************/
  /**
   * Compute the transfer function of a zero-pole-gain model.
   */
  zpk2tf<T extends MathCollection>(
    this: MathJsChain<T>, // chained variable will be used as z
    p: T,
    k?: number
  ): MathJsChain<T>

  /**
   * Calculates the frequency response of a filter given its numerator and denominator coefficients.
   */
  freqz<T extends number | MathArray | MathArray[]>(
    this: MathJsChain<T>,
    a: T,
    w?: T | number
  ): MathJsChain<{ w: T; h: T }>

  /*************************************************************************
   * Special functions
   ************************************************************************/

  /**
   * Compute the erf function of a value using a rational Chebyshev
   * approximations for different intervals of x.
   */
  erf<T extends number | MathCollection>(
    this: MathJsChain<T>
  ): MathJsChain<NoLiteralType<T>>

  /**
   * Compute the Riemann Zeta function of a value using an infinite series
   * and Riemann's Functional equation.
   */
  zeta<T extends number | Complex | BigNumber>(
    this: MathJsChain<T>
  ): MathJsChain<T>

  /*************************************************************************
   * Statistics functions
   ************************************************************************/

  /**
   * Compute the median absolute deviation of a matrix or a list with
   * values. The median absolute deviation is defined as the median of the
   * absolute deviations from the median.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mad(this: MathJsChain<MathCollection>): MathJsChain<any>

  /**
   * Compute the maximum value of a matrix or a list with values. In case
   * of a multi dimensional array, the maximum of the flattened array will
   * be calculated. When dim is provided, the maximum over the selected
   * dimension will be calculated. Parameter dim is zero-based.
   * @param dim The maximum over the selected dimension
   */

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  max(this: MathJsChain<MathType[]>, dim?: number): MathJsChain<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  max(this: MathJsChain<MathCollection>, dim?: number): MathJsChain<any>

  /**
   * Compute the mean value of matrix or a list with values. In case of a
   * multi dimensional array, the mean of the flattened array will be
   * calculated. When dim is provided, the maximum over the selected
   * dimension will be calculated. Parameter dim is zero-based.
   * @param dim The mean over the selected dimension
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mean(this: MathJsChain<MathType[]>, dim?: number): MathJsChain<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mean(this: MathJsChain<MathCollection>, dim?: number): MathJsChain<any>

  /**
   * Compute the median of a matrix or a list with values. The values are
   * sorted and the middle value is returned. In case of an even number of
   * values, the average of the two middle values is returned. Supported
   * types of values are: Number, BigNumber, Unit In case of a (multi
   * dimensional) array or matrix, the median of all elements will be
   * calculated.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  median(this: MathJsChain<MathType[]>, dim?: number): MathJsChain<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  median(this: MathJsChain<MathCollection>, dim?: number): MathJsChain<any>

  /**
   * Compute the minimum value of a matrix or a list of values. In case of
   * a multi dimensional array, the minimum of the flattened array will be
   * calculated. When dim is provided, the minimum over the selected
   * dimension will be calculated. Parameter dim is zero-based.
   * @param dim The minimum over the selected dimension
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  min(this: MathJsChain<MathType[]>): MathJsChain<MathType[]>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  min(this: MathJsChain<MathCollection>, dim?: number): MathJsChain<any>

  /**
   * Computes the mode of a set of numbers or a list with values(numbers
   * or characters). If there are more than one modes, it returns a list
   * of those values.
   */

  mode(this: MathJsChain<MathType[]>): MathJsChain<MathType[]>

  /**
   * Compute the product of a matrix or a list with values. In case of a
   * (multi dimensional) array or matrix, the sum of all elements will be
   * calculated.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prod(this: MathJsChain<MathType[]>): MathJsChain<any>

  /**
   * Compute the prob order quantile of a matrix or a list with values.
   * The sequence is sorted and the middle value is returned. Supported
   * types of sequence values are: Number, BigNumber, Unit Supported types
   * of probability are: Number, BigNumber In case of a (multi
   * dimensional) array or matrix, the prob order quantile of all elements
   * will be calculated.
   * @param probOrN prob is the order of the quantile, while N is the
   * amount of evenly distributed steps of probabilities; only one of
   * these options can be provided
   * @param sorted =false is data sorted in ascending order
   */
  quantileSeq(
    A: MathJsChain<MathCollection>,
    prob: number | BigNumber | MathArray,
    sorted?: boolean
  ): MathJsChain<number | BigNumber | Unit | MathArray>

  /**
   * Compute the standard deviation of a matrix or a list with values. The
   * standard deviations is defined as the square root of the variance:
   * std(A) = sqrt(variance(A)). In case of a (multi dimensional) array or
   * matrix, the standard deviation over all elements will be calculated.
   * Optionally, the type of normalization can be specified as second
   * parameter. The parameter normalization can be one of the following
   * values: 'unbiased' (default) The sum of squared errors is divided by
   * (n - 1) 'uncorrected' The sum of squared errors is divided by n
   * 'biased' The sum of squared errors is divided by (n + 1)
   * @param dim A dimension to compute standard deviation.
   * @param normalization Determines how to normalize the variance. Choose
   * ‘unbiased’ (default), ‘uncorrected’, or ‘biased’. Default value:
   * ‘unbiased’.
   * @returns The standard deviation
   */
  std(
    this: MathJsChain<number[]>,
    dim?: number,
    normalization?: 'unbiased' | 'uncorrected' | 'biased'
  ): MathJsChain<number>

  /**
   * Compute the standard deviation of a matrix or a list with values. The
   * standard deviations is defined as the square root of the variance:
   * std(A) = sqrt(variance(A)). In case of a (multi dimensional) array or
   * matrix, the standard deviation over all elements will be calculated.
   * Optionally, the type of normalization can be specified as second
   * parameter. The parameter normalization can be one of the following
   * values: 'unbiased' (default) The sum of squared errors is divided by
   * (n - 1) 'uncorrected' The sum of squared errors is divided by n
   * 'biased' The sum of squared errors is divided by (n + 1)
   * @param normalization Determines how to normalize the variance. Choose
   * ‘unbiased’ (default), ‘uncorrected’, or ‘biased’. Default value:
   * ‘unbiased’.
   * @returns The standard deviation
   */
  std(
    this: MathJsChain<MathCollection>,
    dimension?: number,
    normalization?: 'unbiased' | 'uncorrected' | 'biased'
  ): MathJsChain<number[]>

  /**
   * Compute the sum of a matrix or a list with values. In case of a
   * (multi dimensional) array or matrix, the sum of all elements will be
   * calculated.
   */
  std(
    this: MathJsChain<MathCollection>,
    normalization: 'unbiased' | 'uncorrected' | 'biased'
  ): MathJsChain<number>

  /**
   * Compute the variance of a matrix or a list with values. In case of a
   * (multi dimensional) array or matrix, the variance over all elements
   * will be calculated. Optionally, the type of normalization can be
   * specified as second parameter. The parameter normalization can be one
   * of the following values: 'unbiased' (default) The sum of squared
   * errors is divided by (n - 1) 'uncorrected' The sum of squared errors
   * is divided by n 'biased' The sum of squared errors is divided by (n +
   * 1) Note that older browser may not like the variable name var. In
   * that case, the function can be called as math['var'](...) instead of
   * math.variance(...).
   * @param dim a dimension to compute variance.
   * @param normalization normalization Determines how to normalize the
   * variance. Choose ‘unbiased’ (default), ‘uncorrected’, or ‘biased’.
   * Default value: ‘unbiased’.
   * @returns The variance
   */
  variance(
    this: MathJsChain<Array<Array<number | BigNumber | Fraction>>>
  ): MathJsChain<number>

  /**
   * Compute the variance of a matrix or a list with values. In case of a
   * (multi dimensional) array or matrix, the variance over all elements
   * will be calculated. Optionally, the type of normalization can be
   * specified as second parameter. The parameter normalization can be one
   * of the following values: 'unbiased' (default) The sum of squared
   * errors is divided by (n - 1) 'uncorrected' The sum of squared errors
   * is divided by n 'biased' The sum of squared errors is divided by (n +
   * 1) Note that older browser may not like the variable name var. In
   * that case, the function can be called as math['var'](...) instead of
   * math.variance(...).
   * @param normalization normalization Determines how to normalize the
   * variance. Choose ‘unbiased’ (default), ‘uncorrected’, or ‘biased’.
   * Default value: ‘unbiased’.
   * @returns The variance
   */
  variance(
    this: MathJsChain<MathCollection>,
    dimension?: number,
    normalization?: 'unbiased' | 'uncorrected' | 'biased'
  ): MathJsChain<number[]>

  variance(
    this: MathJsChain<MathCollection>,
    normalization: 'unbiased' | 'uncorrected' | 'biased'
  ): MathJsChain<number>

  /*************************************************************************
   * String functions
   ************************************************************************/

  /**
   * Format a value of any type into a string.
   * @param options An object with formatting options.
   * @param callback A custom formatting function, invoked for all numeric
   * elements in value, for example all elements of a matrix, or the real
   * and imaginary parts of a complex number. This callback can be used to
   * override the built-in numeric notation with any type of formatting.
   * Function callback is called with value as parameter and must return a
   * string.
   * @see http://mathjs.org/docs/reference/functions/format.html
   */
  format(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this: MathJsChain<any>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: FormatOptions | number | ((item: any) => string),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback?: (value: any) => string
  ): MathJsChain<string>

  /**
   * Interpolate values into a string template.
   * @param values An object containing variables which will be filled in
   * in the template.
   * @param precision Number of digits to format numbers. If not provided,
   * the value will not be rounded.
   * @param options Formatting options, or the number of digits to format
   * numbers. See function math.format for a description of all options.
   */
  print(
    this: MathJsChain<string>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    values: any,
    precision?: number,
    options?: number | object
  ): MathJsChain<string>

  /*************************************************************************
   * Trigonometry functions
   ************************************************************************/

  /**
   * Calculate the inverse cosine of a value. For matrices, the function
   * is evaluated element wise.
   */

  acos<T extends number | BigNumber | Complex | MathCollection>(
    this: MathJsChain<T>
  ): MathJsChain<T>

  /**
   * Calculate the hyperbolic arccos of a value, defined as acosh(x) =
   * ln(sqrt(x^2 - 1) + x). For matrices, the function is evaluated
   * element wise.
   */

  acosh<T extends number | BigNumber | Complex | MathCollection>(
    this: MathJsChain<T>
  ): MathJsChain<T>

  /**
   * Calculate the inverse cotangent of a value. For matrices, the
   * function is evaluated element wise.
   */

  acot<T extends number | BigNumber | Complex | MathCollection>(
    this: MathJsChain<T>
  ): MathJsChain<T>

  /**
   * Calculate the inverse hyperbolic tangent of a value, defined as acoth(x)
   * = (ln((x+1)/x) + ln(x/(x-1))) / 2. For matrices, the function is
   * evaluated element wise.
   */

  acoth<T extends number | BigNumber | Complex | MathCollection>(
    this: MathJsChain<T>
  ): MathJsChain<T>

  /**
   * Calculate the inverse cosecant of a value. For matrices, the function
   * is evaluated element wise.
   */

  acsc<T extends number | BigNumber | Complex | MathCollection>(
    this: MathJsChain<T>
  ): MathJsChain<T>

  /**
   * Calculate the inverse hyperbolic cosecant of a value, defined as acsch(x)
   * = ln(1/x + sqrt(1/x^2 + 1)). For matrices, the function is evaluated
   * element wise.
   */

  acsch<T extends number | BigNumber | Complex | MathCollection>(
    this: MathJsChain<T>
  ): MathJsChain<T>

  /**
   * Calculate the inverse secant of a value. For matrices, the function
   * is evaluated element wise.
   */

  asec<T extends number | BigNumber | Complex | MathCollection>(
    this: MathJsChain<T>
  ): MathJsChain<T>

  /**
   * Calculate the hyperbolic arcsecant of a value, defined as asech(x) =
   * ln(sqrt(1/x^2 - 1) + 1/x). For matrices, the function is evaluated
   * element wise.
   */

  asech<T extends number | BigNumber | Complex | MathCollection>(
    this: MathJsChain<T>
  ): MathJsChain<T>

  /**
   * Calculate the inverse sine of a value. For matrices, the function is
   * evaluated element wise.
   */

  asin<T extends number | BigNumber | Complex | MathCollection>(
    this: MathJsChain<T>
  ): MathJsChain<T>

  /**
   * Calculate the hyperbolic arcsine of a value, defined as asinh(x) =
   * ln(x + sqrt(x^2 + 1)). For matrices, the function is evaluated
   * element wise.
   */

  asinh<T extends number | BigNumber | Complex | MathCollection>(
    this: MathJsChain<T>
  ): MathJsChain<T>

  /**
   * Calculate the inverse tangent of a value. For matrices, the function
   * is evaluated element wise.
   */

  atan<T extends number | BigNumber | Complex | MathCollection>(
    this: MathJsChain<T>
  ): MathJsChain<T>

  /**
   * Calculate the inverse tangent function with two arguments, y/x. By
   * providing two arguments, the right quadrant of the computed angle can
   * be determined. For matrices, the function is evaluated element wise.
   */

  atan2<T extends number | BigNumber | Complex | MathCollection>(
    this: MathJsChain<T>,
    x: number
  ): MathJsChain<T>

  /**
   * Calculate the hyperbolic arctangent of a value, defined as atanh(x) =
   * ln((1 + x)/(1 - x)) / 2. For matrices, the function is evaluated
   * element wise.
   */

  atanh<T extends number | BigNumber | Complex | MathCollection>(
    this: MathJsChain<T>
  ): MathJsChain<T>

  /**
   * Calculate the cosine of a value. For matrices, the function is
   * evaluated element wise.
   */

  cos<T extends number | BigNumber | Complex | MathCollection>(
    this: MathJsChain<T>
  ): MathJsChain<T>

  /**
   * Calculate the hyperbolic cosine of a value, defined as cosh(x) = 1/2
   * * (exp(x) + exp(-x)). For matrices, the function is evaluated element
   * wise.
   */

  cosh<T extends number | BigNumber | Complex | MathCollection>(
    this: MathJsChain<T>
  ): MathJsChain<T>

  /**
   * Calculate the cotangent of a value. cot(x) is defined as 1 / tan(x).
   * For matrices, the function is evaluated element wise.
   */

  cot<T extends number | BigNumber | Complex | MathCollection>(
    this: MathJsChain<T>
  ): MathJsChain<T>

  /**
   * Calculate the hyperbolic cotangent of a value, defined as coth(x) = 1
   * / tanh(x). For matrices, the function is evaluated element wise.
   */

  coth<T extends number | BigNumber | Complex | MathCollection>(
    this: MathJsChain<T>
  ): MathJsChain<T>

  /**
   * Calculate the cosecant of a value, defined as csc(x) = 1/sin(x). For
   * matrices, the function is evaluated element wise.
   */

  csc<T extends number | BigNumber | Complex | MathCollection>(
    this: MathJsChain<T>
  ): MathJsChain<T>

  /**
   * Calculate the hyperbolic cosecant of a value, defined as csch(x) = 1
   * / sinh(x). For matrices, the function is evaluated element wise.
   */

  csch<T extends number | BigNumber | Complex | MathCollection>(
    this: MathJsChain<T>
  ): MathJsChain<T>

  /**
   * Calculate the secant of a value, defined as sec(x) = 1/cos(x). For
   * matrices, the function is evaluated element wise.
   */

  sec<T extends number | BigNumber | Complex | MathCollection>(
    this: MathJsChain<T>
  ): MathJsChain<T>

  /**
   * Calculate the hyperbolic secant of a value, defined as sech(x) = 1 /
   * cosh(x). For matrices, the function is evaluated element wise.
   */

  sech<T extends number | BigNumber | Complex | MathCollection>(
    this: MathJsChain<T>
  ): MathJsChain<T>

  /**
   * Calculate the sine of a value. For matrices, the function is
   * evaluated element wise.
   */

  sin<T extends number | BigNumber | Complex | MathCollection>(
    this: MathJsChain<T>
  ): MathJsChain<T>

  /**
   * Calculate the hyperbolic sine of a value, defined as sinh(x) = 1/2 *
   * (exp(x) - exp(-x)). For matrices, the function is evaluated element
   * wise.
   */

  sinh<T extends number | BigNumber | Complex | MathCollection>(
    this: MathJsChain<T>
  ): MathJsChain<T>

  /**
   * Calculate the tangent of a value. tan(x) is equal to sin(x) / cos(x).
   * For matrices, the function is evaluated element wise.
   */

  tan<T extends number | BigNumber | Complex | MathCollection>(
    this: MathJsChain<T>
  ): MathJsChain<T>

  /**
   * Calculate the hyperbolic tangent of a value, defined as tanh(x) =
   * (exp(2 * x) - 1) / (exp(2 * x) + 1). For matrices, the function is
   * evaluated element wise.
   */

  tanh<T extends number | BigNumber | Complex | MathCollection>(
    this: MathJsChain<T>
  ): MathJsChain<T>

  /*************************************************************************
   * Unit functions
   ************************************************************************/

  /**
   * Change the unit of a value. For matrices, the function is evaluated
   * element wise.
   * @param unit New unit. Can be a string like "cm" or a unit without
   * value.
   */
  to(
    this: MathJsChain<Unit | MathCollection>,
    unit: Unit | string
  ): MathJsChain<Unit | MathCollection>

  /*************************************************************************
   * Utils functions
   ************************************************************************/

  /**
   * Clone an object.
   */

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clone<TValue>(this: MathJsChain<TValue>): MathJsChain<TValue>

  /**
   * Test whether a value is an integer number. The function supports
   * number, BigNumber, and Fraction. The function is evaluated
   * element-wise in case of Array or Matrix input.
   */

  isInteger(
    this: MathJsChain<number | BigNumber | bigint | Fraction | MathCollection>
  ): MathJsChain<boolean>

  /**
   * Test whether a value is NaN (not a number). The function supports
   * types number, BigNumber, Fraction, Unit and Complex. The function is
   * evaluated element-wise in case of Array or Matrix input.
   */

  isNaN(
    this: MathJsChain<number | BigNumber | Fraction | MathCollection | Unit>
  ): MathJsChain<boolean>

  /**
   * Test whether a value is negative: smaller than zero. The function
   * supports types number, BigNumber, Fraction, and Unit. The function is
   * evaluated element-wise in case of Array or Matrix input.
   */

  isNegative(
    this: MathJsChain<number | BigNumber | Fraction | MathCollection | Unit>
  ): MathJsChain<boolean>

  /**
   * Test whether a value is a numeric value. The function is evaluated
   * element-wise in case of Array or Matrix input.
   */

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isNumeric(this: MathJsChain<any>): MathJsChain<boolean>

  /**
   * Test whether a value is positive: larger than zero. The function
   * supports types number, BigNumber, Fraction, and Unit. The function is
   * evaluated element-wise in case of Array or Matrix input.
   */

  isPositive(
    this: MathJsChain<
      number | BigNumber | bigint | Fraction | MathCollection | Unit
    >
  ): MathJsChain<boolean>

  /**
   * Test whether a value is prime: has no divisors other than itself and
   * one. The function supports type number, bignumber. The function is
   * evaluated element-wise in case of Array or Matrix input.
   */

  isPrime(
    this: MathJsChain<number | BigNumber | bigint | MathCollection>
  ): MathJsChain<boolean>

  /**
   * Test whether a value is zero. The function can check for zero for
   * types number, BigNumber, Fraction, Complex, and Unit. The function is
   * evaluated element-wise in case of Array or Matrix input.
   */

  isZero(this: MathJsChain<MathType>): MathJsChain<boolean>

  /**
   * Determine the type of a variable.
   */

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  typeOf(this: MathJsChain<any>): MathJsChain<string>
}

export interface ImportOptions {
  override?: boolean
  silent?: boolean
  wrap?: boolean
}

export interface ImportObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export const {
  // config // Don't export config: no config available in the static instance

  // core functions
  create,
  factory,
  typed,

  // constants
  e,
  pi,
  i,
  // Infinity // not needed: is available as global variable too
  LN2,
  LN10,
  LOG2E,
  LOG10E,
  // NaN, // not needed: is available as global variable too
  phi,
  SQRT1_2,
  SQRT2,
  tau,

  // Class-like constructors
  Node,
  AccessorNode,
  ArrayNode,
  AssignmentNode,
  BlockNode,
  ConditionalNode,
  ConstantNode,
  FunctionAssignmentNode,
  FunctionNode,
  IndexNode,
  ObjectNode,
  OperatorNode,
  ParenthesisNode,
  RangeNode,
  RelationalNode,
  SymbolNode,
  Matrix,
  Unit,

  uninitialized,
  version,
  expression,
  reviver,
  replacer,

  bignumber,
  boolean,
  chain,
  complex,
  createUnit,
  fraction,
  index,
  matrix,
  number,
  sparse,
  splitUnit,
  string,
  unit,
  compile,
  evaluate,
  help,
  parse,
  parser,

  // algebra
  derivative,
  lsolve,
  lup,
  lusolve,
  polynomialRoot,
  qr,
  rationalize,
  simplify,
  simplifyConstant,
  simplifyCore,
  symbolicEqual,
  leafCount,
  resolve,
  slu,
  usolve,

  // arithmetic functions
  abs,
  add,
  cbrt,
  ceil,
  fix,
  floor,
  round,
  cube,
  divide,
  dotDivide,
  dotMultiply,
  dotPow,
  exp,
  expm1,
  gcd,
  hypot,
  lcm,
  log,
  log10,
  log1p,
  log2,
  mod,
  multiply,
  norm,
  nthRoot,
  pow,
  sign,
  sqrt,
  square,
  subtract,
  unaryMinus,
  unaryPlus,
  xgcd,

  // bitwise
  bitAnd,
  bitNot,
  bitOr,
  bitXor,
  leftShift,
  rightArithShift,
  rightLogShift,

  // combinatorics
  bellNumbers,
  catalan,
  composition,
  stirlingS2,

  // complex
  arg,
  conj,
  im,
  re,

  // geometry
  distance,
  intersect,

  // logical
  and,
  not,
  or,
  xor,

  // matrix functions
  mapSlices,
  apply, // @deprecated prior name of mapSlices
  concat,
  cross,
  det,
  diag,
  dot,
  eigs,
  expm,
  sylvester,
  schur,
  lyap,
  identity,
  filter,
  flatten,
  forEach,
  inv,
  kron,
  map,
  ones,
  partitionSelect,
  pinv,
  range,
  reshape,
  resize,
  rotationMatrix,
  row,
  column,
  rotate,
  size,
  sort,
  sqrtm,
  squeeze,
  subset,
  trace,
  transpose,
  zeros,
  fft,
  ifft,

  // probability
  combinations,
  factorial,
  gamma,
  kldivergence,
  lgamma,
  multinomial,
  permutations,
  pickRandom,
  random,
  randomInt,

  // relational functions
  compare,
  compareNatural,
  compareText,
  deepEqual,
  equal,
  equalText,
  larger,
  largerEq,
  smaller,
  smallerEq,
  unequal,

  // set functions
  setCartesian,
  setDifference,
  setDistinct,
  setIntersect,
  setIsSubset,
  setMultiplicity,
  setPowerset,
  setSize,
  setSymDifference,
  setUnion,

  // special functions
  zpk2tf,
  freqz,
  erf,
  zeta,

  // Statistics functions
  mad,
  max,
  mean,
  median,
  min,
  mode,
  prod,
  quantileSeq,
  std,
  sum,
  count,
  cumsum,
  variance,
  corr,

  // String functions
  format,
  print,

  // Trigonometry functions
  acos,
  acosh,
  acot,
  acoth,
  acsc,
  acsch,
  asec,
  asech,
  asin,
  asinh,
  atan,
  atan2,
  atanh,
  cos,
  cosh,
  cot,
  coth,
  csc,
  csch,
  sec,
  sech,
  sin,
  sinh,
  tan,
  tanh,

  // unit functions
  to,

  // util functions
  isNumber,
  isBigNumber,
  isComplex,
  isFraction,
  isUnit,
  isString,
  isArray,
  isMatrix,
  isCollection,
  isDenseMatrix,
  isSparseMatrix,
  isRange,
  isIndex,
  isBoolean,
  isResultSet,
  isHelp,
  isFunction,
  isDate,
  isRegExp,
  isObject,
  isNull,
  isUndefined,
  isAccessorNode,
  isArrayNode,
  isAssignmentNode,
  isBlockNode,
  isConditionalNode,
  isConstantNode,
  isFunctionAssignmentNode,
  isFunctionNode,
  isIndexNode,
  isNode,
  isObjectNode,
  isOperatorNode,
  isParenthesisNode,
  isRangeNode,
  isRelationalNode,
  isSymbolNode,
  isChain,
  clone,
  hasNumericValue,
  isInteger,
  isNaN,
  isNegative,
  isNumeric,
  isPositive,
  isPrime,
  isZero,
  typeOf
}: MathJsInstance
