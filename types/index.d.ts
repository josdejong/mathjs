import { Decimal } from 'decimal.js'

declare const math: math.MathJsStatic
export as namespace math
export = math

type NoLiteralType<T> = T extends number
  ? number
  : T extends string
  ? string
  : T extends boolean
  ? boolean
  : T

declare namespace math {
  type MathNumericType = number | BigNumber | Fraction | Complex
  type MathArray = MathNumericType[] | MathNumericType[][]
  type MathCollection = MathArray | Matrix
  type MathType = MathNumericType | Unit | MathCollection
  type MathExpression = string | string[] | MathCollection

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type FactoryFunction<T> = (scope: any) => T

  // FactoryFunctionMap can be nested; all nested objects will be flattened
  interface FactoryFunctionMap {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: FactoryFunction<any> | FactoryFunctionMap
  }

  /** Available options for parse */
  interface ParseOptions {
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
  interface ParseFunction {
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

  interface NodeCtor {
    new (): MathNodeCommon
  }

  interface AccessorNode extends MathNodeCommon {
    type: 'AccessorNode'
    isAccessorNode: true
    object: MathNode
    index: IndexNode
    name: string
  }
  interface AccessorNodeCtor {
    new (object: MathNode, index: IndexNode): AccessorNode
  }

  interface ArrayNode extends MathNodeCommon {
    type: 'ArrayNode'
    isArrayNode: true
    items: MathNode[]
  }
  interface ArrayNodeCtor {
    new (items: MathNode[]): ArrayNode
  }

  interface AssignmentNode extends MathNodeCommon {
    type: 'AssignmentNode'
    isAssignmentNode: true
    object: SymbolNode | AccessorNode
    index: IndexNode | null
    value: MathNode
    name: string
  }
  interface AssignmentNodeCtor {
    new (object: SymbolNode, value: MathNode): AssignmentNode
    new (
      object: SymbolNode | AccessorNode,
      index: IndexNode,
      value: MathNode
    ): AssignmentNode
  }

  interface BlockNode extends MathNodeCommon {
    type: 'BlockNode'
    isBlockNode: true
    blocks: Array<{ node: MathNode; visible: boolean }>
  }
  interface BlockNodeCtor {
    new (
      arr: Array<{ node: MathNode } | { node: MathNode; visible: boolean }>
    ): BlockNode
  }

  interface ConditionalNode extends MathNodeCommon {
    type: 'ConditionalNode'
    isConditionalNode: boolean
    condition: MathNode
    trueExpr: MathNode
    falseExpr: MathNode
  }
  interface ConditionalNodeCtor {
    new (
      condition: MathNode,
      trueExpr: MathNode,
      falseExpr: MathNode
    ): ConditionalNode
  }

  interface ConstantNode extends MathNodeCommon {
    type: 'ConstantNode'
    isConstantNode: true
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
  }

  interface ConstantNodeCtor {
    new (constant: number): ConstantNode
  }

  interface FunctionAssignmentNode extends MathNodeCommon {
    type: 'FunctionAssignmentNode'
    isFunctionAssignmentNode: true
    name: string
    params: string[]
    expr: MathNode
  }
  interface FunctionAssignmentNodeCtor {
    new (name: string, params: string[], expr: MathNode): FunctionAssignmentNode
  }

  interface FunctionNode extends MathNodeCommon {
    type: 'FunctionNode'
    isFunctionNode: true
    fn: SymbolNode
    args: MathNode[]
  }
  interface FunctionNodeCtor {
    new (fn: MathNode | string, args: MathNode[]): FunctionNode
  }

  interface IndexNode extends MathNodeCommon {
    type: 'IndexNode'
    isIndexNode: true
    dimensions: MathNode[]
    dotNotation: boolean
  }
  interface IndexNodeCtor {
    new (dimensions: MathNode[]): IndexNode
    new (dimensions: MathNode[], dotNotation: boolean): IndexNode
  }

  interface ObjectNode extends MathNodeCommon {
    type: 'ObjectNode'
    isObjectNode: true
    properties: Record<string, MathNode>
  }
  interface ObjectNodeCtor {
    new (properties: Record<string, MathNode>): ObjectNode
  }

  type OperatorNodeMap = {
    xor: 'xor'
    and: 'and'
    bitOr: '|'
    bitXor: '^|'
    bitAnd: '&'
    equal: '=='
    unequal: '!='
    smaller: '<'
    larger: '>'
    smallerEq: '<='
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

  type OperatorNodeOp = OperatorNodeMap[keyof OperatorNodeMap]
  type OperatorNodeFn = keyof OperatorNodeMap

  interface OperatorNode<
    TOp extends OperatorNodeMap[TFn] = never,
    TFn extends OperatorNodeFn = never,
    TArgs extends MathNode[] = MathNode[]
  > extends MathNodeCommon {
    type: 'OperatorNode'
    isOperatorNode: true
    op: TOp
    fn: TFn
    args: TArgs
    implicit: boolean
    isUnary(): boolean
    isBinary(): boolean
  }

  interface OperatorNodeCtor extends MathNodeCommon {
    new <
      TOp extends OperatorNodeMap[TFn],
      TFn extends OperatorNodeFn,
      TArgs extends MathNode[]
    >(
      op: TOp,
      fn: TFn,
      args: TArgs,
      implicit?: boolean
    ): OperatorNode<TOp, TFn, TArgs>
  }
  interface ParenthesisNode<TContent extends MathNode = MathNode>
    extends MathNodeCommon {
    type: 'ParenthesisNode'
    isParenthesisNode: true
    content: TContent
  }
  interface ParenthesisNodeCtor {
    new <TContent extends MathNode>(
      content: TContent
    ): ParenthesisNode<TContent>
  }

  interface RangeNode extends MathNodeCommon {
    type: 'RangeNode'
    isRangeNode: true
    start: MathNode
    end: MathNode
    step: MathNode | null
  }
  interface RangeNodeCtor {
    new (start: MathNode, end: MathNode, step?: MathNode): RangeNode
  }

  interface RelationalNode extends MathNodeCommon {
    type: 'RelationalNode'
    isRelationalNode: true
    conditionals: string[]
    params: MathNode[]
  }
  interface RelationalNodeCtor {
    new (conditionals: string[], params: MathNode[]): RelationalNode
  }

  interface SymbolNode extends MathNodeCommon {
    type: 'SymbolNode'
    isSymbolNode: true
    name: string
  }
  interface SymbolNodeCtor {
    new (name: string): SymbolNode
  }

  type MathNode =
    | AccessorNode
    | ArrayNode
    | AssignmentNode
    | BlockNode
    | ConditionalNode
    | ConstantNode
    | FunctionAssignmentNode
    | FunctionNode
    | IndexNode
    | ObjectNode
    | OperatorNode<OperatorNodeOp, OperatorNodeFn>
    | ParenthesisNode
    | RangeNode
    | RelationalNode
    | SymbolNode

  type MathJsFunctionName = keyof MathJsStatic

  interface LUDecomposition {
    L: MathCollection
    U: MathCollection
    p: number[]
  }

  interface SLUDecomposition extends LUDecomposition {
    q: number[]
  }

  interface QRDecomposition {
    Q: MathCollection
    R: MathCollection
  }

  interface FractionDefinition {
    a: number
    b: number
  }

  interface MathJsStatic extends FactoryDependencies {
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

    /*************************************************************************
     * Core functions
     ************************************************************************/

    /**
     * Set configuration options for math.js, and get current options. Will
     * emit a ‘config’ event, with arguments (curr, prev, changes).
     * @param options Available options: {number} epsilon Minimum relative
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
      x?: number | string | Fraction | BigNumber | boolean | Fraction | null
    ): BigNumber
    bignumber<T extends MathCollection>(x: T): T

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
    complex(arg?: Complex | string | PolarCoordinates): Complex
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
     * @param args Arguments specifying the numerator and denominator of the
     * fraction
     * @returns Returns a fraction
     */
    fraction(
      value: number | string | BigNumber | Fraction | FractionDefinition
    ): Fraction
    fraction(values: MathCollection): MathCollection
    /**
     * @param numerator Argument specifying the numerator of the fraction
     * @param denominator Argument specifying the denominator of the
     * fraction
     * @returns Returns a fraction
     */
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
    matrix(format?: 'sparse' | 'dense'): Matrix
    /**
     * @param data A multi dimensional array
     * @param format The Matrix storage format
     * @param dataType The Matrix data type
     * @returns The created Matrix
     */
    matrix(
      data: MathCollection | string[],
      format?: 'sparse' | 'dense',
      dataType?: string
    ): Matrix

    /**
     * Create a number or convert a string, boolean, or unit to a number.
     * When value is a matrix, all elements will be converted to number.
     * @param value Value to be converted
     * @returns The created number
     */
    number(
      value?: string | number | BigNumber | Fraction | boolean | Unit | null
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
    unit(value: number | BigNumber, unit: string): Unit
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
    lsolve(L: Matrix, b: Matrix | MathArray): Matrix
    lsolve(L: MathArray, b: Matrix | MathArray): MathArray

    /**
     * Calculate the Matrix LU decomposition with partial pivoting. Matrix A
     * is decomposed in two matrices (L, U) and a row permutation vector p
     * where A[p,:] = L * U
     * @param A A two dimensional matrix or array for which to get the LUP
     * decomposition.
     * @returns The lower triangular matrix, the upper triangular matrix and
     * the permutation matrix.
     */
    lup(A?: Matrix | MathArray): LUDecomposition

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
      b: Matrix | MathArray,
      order?: number,
      threshold?: number
    ): Matrix

    lusolve(
      A: MathArray,
      b: Matrix | MathArray,
      order?: number,
      threshold?: number
    ): MathArray

    /**
     * Calculate the Matrix QR decomposition. Matrix A is decomposed in two
     * matrices (Q, R) where Q is an orthogonal matrix and R is an upper
     * triangular matrix.
     * @param A A two dimensional matrix or array for which to get the QR
     * decomposition.
     * @returns Q: the orthogonal matrix and R: the upper triangular matrix
     */
    qr(A: Matrix | MathArray): QRDecomposition

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

    simplifyConstant(
      expr: MathNode | string,
      options?: SimplifyOptions
    ): MathNode
    simplifyCore(expr: MathNode | string, options?: SimplifyOptions): MathNode

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
    usolve(U: Matrix, b: Matrix | MathArray): Matrix
    usolve(U: MathArray, b: Matrix | MathArray): MathArray

    /*************************************************************************
     * Arithmetic functions
     ************************************************************************/

    /**
     * Calculate the absolute value of a number. For matrices, the function
     * is evaluated element wise.
     * @param x A number or matrix for which to get the absolute value
     * @returns Absolute value of x
     */
    abs(x: number): number
    abs(x: BigNumber): BigNumber
    abs(x: Fraction): Fraction
    abs(x: Complex): Complex
    abs(x: MathArray): MathArray
    abs(x: Matrix): Matrix
    abs(x: Unit): Unit

    /**
     * Add two values, x + y. For matrices, the function is evaluated
     * element wise.
     * @param x First value to add
     * @param y Second value to add
     * @returns Sum of x and y
     */
    add<T extends MathType>(x: T, y: T): T
    add(x: MathType, y: MathType): MathType

    /**
     * Calculate the cubic root of a value.
     * @param x Value for which to calculate the cubic root.
     * @param allRoots Optional, false by default. Only applicable when x is
     * a number or complex number. If true, all complex roots are returned,
     * if false (default) the principal root is returned.
     * @returns Returns the cubic root of x
     */
    cbrt(x: number, allRoots?: boolean): number
    cbrt(x: BigNumber): BigNumber
    cbrt(x: Complex, allRoots?: boolean): Complex
    cbrt(x: Unit): Unit

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

    // End of group of rounding functions

    /**
     * Compute the cube of a value, x * x * x. For matrices, the function is
     * evaluated element wise.
     * @param x Number for which to calculate the cube
     * @returns Cube of x
     */
    cube(x: number): number
    cube(x: BigNumber): BigNumber
    cube(x: Fraction): Fraction
    cube(x: Complex): Complex
    cube(x: Unit): Unit

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
    dotDivide(x: MathType, y: MathType): MathType

    /**
     * Multiply two matrices element wise. The function accepts both
     * matrices and scalar values.
     * @param x Left hand value
     * @param y Right hand value
     * @returns Multiplication of x and y
     */
    dotMultiply(x: MathType, y: MathType): MathType

    /**
     * Calculates the power of x to y element wise.
     * @param x The base
     * @param y The exponent
     * @returns The value of x to the power y
     */
    dotPow(x: MathType, y: MathType): MathType

    /**
     * Calculate the exponent of a value. For matrices, the function is
     * evaluated element wise.
     * @param x A number or matrix to exponentiate
     * @returns Exponent of x
     */
    exp(x: number): number
    exp(x: BigNumber): BigNumber
    exp(x: Complex): Complex

    /**
     * Calculate the value of subtracting 1 from the exponential value. For
     * matrices, the function is evaluated element wise.
     * @param x A number or matrix to apply expm1
     * @returns Exponent of x
     */
    expm1(x: number): number
    expm1(x: BigNumber): BigNumber
    expm1(x: Complex): Complex

    /**
     * Calculate the greatest common divisor for two or more values or
     * arrays. For matrices, the function is evaluated element wise.
     * @param args Two or more integer numbers
     * @returns The greatest common divisor
     */
    gcd(...args: number[]): number
    gcd(...args: BigNumber[]): BigNumber
    gcd(...args: Fraction[]): Fraction
    gcd(...args: MathArray[]): MathArray
    gcd(...args: Matrix[]): Matrix

    /**
     * Calculate the hypotenusa of a list with values. The hypotenusa is
     * defined as: hypot(a, b, c, ...) = sqrt(a^2 + b^2 + c^2 + ...) For
     * matrix input, the hypotenusa is calculated for all values in the
     * matrix.
     * @param args A list with numeric values or an Array or Matrix. Matrix
     * and Array input is flattened and returns a single number for the
     * whole matrix.
     * @returns Returns the hypothenuse of the input values.
     */
    hypot(...args: number[]): number
    hypot(...args: BigNumber[]): BigNumber

    /**
     * Calculate the least common multiple for two or more values or arrays.
     * lcm is defined as: lcm(a, b) = abs(a * b) / gcd(a, b) For matrices,
     * the function is evaluated element wise.
     * @param a An integer number
     * @param b An integer number
     * @returns The least common multiple
     */
    lcm(a: number, b: number): number
    lcm(a: BigNumber, b: BigNumber): BigNumber
    lcm(a: MathArray, b: MathArray): MathArray
    lcm(a: Matrix, b: Matrix): Matrix

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
    log10(x: number): number
    log10(x: BigNumber): BigNumber
    log10(x: Complex): Complex
    log10(x: MathArray): MathArray
    log10(x: Matrix): Matrix

    /**
     * Calculate the logarithm of a value+1. For matrices, the function is
     * evaluated element wise.
     * @param x Value for which to calculate the logarithm.
     * @returns Returns the logarithm of x+1
     */
    log1p(x: number, base?: number | BigNumber | Complex): number
    log1p(x: BigNumber, base?: number | BigNumber | Complex): BigNumber
    log1p(x: Complex, base?: number | BigNumber | Complex): Complex
    log1p(x: MathArray, base?: number | BigNumber | Complex): MathArray
    log1p(x: Matrix, base?: number | BigNumber | Complex): Matrix

    /**
     * Calculate the 2-base of a value. This is the same as calculating
     * log(x, 2). For matrices, the function is evaluated element wise.
     * @param x Value for which to calculate the logarithm.
     * @returns Returns the 2-base logarithm of x
     */
    log2(x: number): number
    log2(x: BigNumber): BigNumber
    log2(x: Complex): Complex
    log2(x: MathArray): MathArray
    log2(x: Matrix): Matrix

    /**
     * Calculates the modulus, the remainder of an integer division. For
     * matrices, the function is evaluated element wise. The modulus is
     * defined as: x - y * floor(x / y)
     * @see http://en.wikipedia.org/wiki/Modulo_operation.
     * @param x Dividend
     * @param y Divisor
     * @returns Returns the remainder of x divided by y
     */
    mod<T extends number | BigNumber | Fraction | MathCollection>(
      x: T,
      y: number | BigNumber | Fraction | MathCollection
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

    multiply(x: Unit, y: Unit): Unit
    multiply(x: number, y: number): number
    multiply(x: MathArray, y: MathArray): MathArray
    multiply(x: MathType, y: MathType): MathType

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
    pow(x: MathType, y: number | BigNumber | Complex): MathType

    /**
     * Compute the sign of a value. The sign of a value x is: 1 when x > 1
     * -1 when x < 0 0 when x == 0 For matrices, the function is evaluated
     * element wise.
     * @param x The number for which to determine the sign
     * @returns The sign of x
     */
    sign(x: number): number
    sign(x: BigNumber): BigNumber
    sign(x: Fraction): Fraction
    sign(x: Complex): Complex
    sign(x: MathArray): MathArray
    sign(x: Matrix): Matrix
    sign(x: Unit): Unit

    /**
     * Calculate the square root of a value. For matrices, use either
     * sqrtm for the matrix square root, or map(M, sqrt) to take the
     * square root element wise.
     * @param x Value for which to calculate the square root
     * @returns Returns the square root of x
     */
    sqrt(x: number): number | Complex
    sqrt(x: BigNumber): BigNumber
    sqrt(x: Complex): Complex
    sqrt(x: Unit): Unit

    /**
     * Compute the square of a value, x * x.
     * @param x Number for which to calculate the square
     * @returns Squared value
     */
    square(x: number): number
    square(x: BigNumber): BigNumber
    square(x: Fraction): Fraction
    square(x: Complex): Complex
    square(x: Unit): Unit

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
    unaryMinus(x: number): number
    unaryMinus(x: BigNumber): BigNumber
    unaryMinus(x: Fraction): Fraction
    unaryMinus(x: Complex): Complex
    unaryMinus(x: MathArray): MathArray
    unaryMinus(x: Matrix): Matrix
    unaryMinus(x: Unit): Unit

    /**
     * Unary plus operation. Boolean values and strings will be converted to
     * a number, numeric values will be returned as is. For matrices, the
     * function is evaluated element wise.
     * @param x Input value
     * @returns Returns the input value when numeric, converts to a number
     * when input is non-numeric.
     */
    unaryPlus(x: number): number
    unaryPlus(x: BigNumber): BigNumber
    unaryPlus(x: Fraction): Fraction
    unaryPlus(x: string): string
    unaryPlus(x: Complex): Complex
    unaryPlus(x: MathArray): MathArray
    unaryPlus(x: Matrix): Matrix
    unaryPlus(x: Unit): Unit

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
    bitAnd<T extends number | BigNumber | MathCollection>(
      x: T,
      y: number | BigNumber | MathCollection
    ): NoLiteralType<T>

    /**
     * Bitwise NOT value, ~x. For matrices, the function is evaluated
     * element wise. For units, the function is evaluated on the best prefix
     * base.
     * @param x Value to not
     * @returns NOT of x
     */
    bitNot(x: number): number
    bitNot(x: BigNumber): BigNumber
    bitNot(x: MathArray): MathArray
    bitNot(x: Matrix): Matrix

    /**
     * Bitwise OR two values, x | y. For matrices, the function is evaluated
     * element wise. For units, the function is evaluated on the lowest
     * print base.
     * @param x First value to or
     * @param y Second value to or
     * @returns OR of x and y
     */
    bitOr(x: number, y: number): number
    bitOr(x: BigNumber, y: BigNumber): BigNumber
    bitOr(x: MathArray, y: MathArray): MathArray
    bitOr(x: Matrix, y: Matrix): Matrix

    /**
     * Bitwise XOR two values, x ^ y. For matrices, the function is
     * evaluated element wise.
     * @param x First value to xor
     * @param y Second value to xor
     * @returns XOR of x and y
     */
    bitXor<T extends number | BigNumber | MathCollection>(
      x: T,
      y: number | BigNumber | MathCollection
    ): NoLiteralType<T>

    /**
     * Bitwise left logical shift of a value x by y number of bits, x << y.
     * For matrices, the function is evaluated element wise. For units, the
     * function is evaluated on the best prefix base.
     * @param x Value to be shifted
     * @param y Amount of shifts
     * @returns x shifted left y times
     */
    leftShift<T extends number | BigNumber | MathCollection>(
      x: T,
      y: number | BigNumber
    ): NoLiteralType<T>

    /**
     * Bitwise right arithmetic shift of a value x by y number of bits, x >>
     * y. For matrices, the function is evaluated element wise. For units,
     * the function is evaluated on the best prefix base.
     * @param x Value to be shifted
     * @param y Amount of shifts
     * @returns x sign-filled shifted right y times
     */
    rightArithShift<T extends number | BigNumber | MathCollection>(
      x: T,
      y: number | BigNumber
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
    bellNumbers(n: number): number
    bellNumbers(n: BigNumber): BigNumber

    /**
     * The Catalan Numbers enumerate combinatorial structures of many
     * different types. catalan only takes integer arguments. The following
     * condition must be enforced: n >= 0
     * @param n nth Catalan number
     * @returns Cn(n)
     */
    catalan(n: number): number
    catalan(n: BigNumber): BigNumber

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
    arg(x: MathArray): MathArray
    arg(x: Matrix): Matrix

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
    im(x: MathJsChain<BigNumber>): MathJsChain<BigNumber>
    im(x: MathJsChain<MathCollection>): MathJsChain<MathCollection>

    /**
     * Get the real part of a complex number. For a complex number a + bi,
     * the function returns a. For matrices, the function is evaluated
     * element wise.
     * @param x A complex number or array of complex numbers
     * @returns The real part of x
     */
    re(x: MathJsChain<number | Complex>): MathJsChain<number>
    re(x: MathJsChain<BigNumber>): MathJsChain<BigNumber>
    re(x: MathJsChain<MathCollection>): MathJsChain<MathCollection>

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
     * @param y Coordinates of the second point
     * @returns Returns the distance from two/three points
     */
    distance(
      x: MathCollection | object,
      y: MathCollection | object
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
      z: MathCollection
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
      x: number | BigNumber | Complex | Unit | MathCollection,
      y: number | BigNumber | Complex | Unit | MathCollection
    ): boolean | MathCollection

    /**
     * Logical not. Flips boolean value of a given parameter. For matrices,
     * the function is evaluated element wise.
     * @param x First value to not
     * @returns Returns true when input is a zero or empty value.
     */
    not(
      x: number | BigNumber | Complex | Unit | MathCollection
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
      x: number | BigNumber | Complex | Unit | MathCollection,
      y: number | BigNumber | Complex | Unit | MathCollection
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
      x: number | BigNumber | Complex | Unit | MathCollection,
      y: number | BigNumber | Complex | Unit | MathCollection
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
    apply<T extends MathCollection>(
      array: T,
      dim: number,
      callback: (array: MathCollection) => number
    ): T

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
    cross(x: MathCollection, y: MathCollection): Matrix | MathArray

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
    ): Matrix | MathArray

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
     * The eigenvectors are returned as columns of a matrix – the eigenvector
     * that belongs to the j-th eigenvalue in the list (eg. values[j]) is the
     * j-th column (eg. column(vectors, j)). If the algorithm fails to converge,
     * it will throw an error – in that case, however, you may still find useful
     * information in err.values and err.vectors
     * @param x Matrix to be diagonalized
     * @param prec Precision, default value: 1e-15
     * @returns Object containing an array of eigenvalues and a matrix with eigenvectors as columns.
     */
    eigs(
      x: MathCollection,
      prec?: number | BigNumber
    ): { values: MathCollection; vectors: MathCollection }

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
     * Create a 2-dimensional identity matrix with size m x n or n x n. The
     * matrix has ones on the diagonal and zeros elsewhere.
     * @param size The size for the matrix
     * @param format The Matrix storage format
     * @returns A matrix with ones on the diagonal
     */
    identity(
      size: number | number[] | Matrix | MathArray,
      format?: string
    ): Matrix | MathArray | number
    /**
     * @param m The x dimension for the matrix
     * @param n The y dimension for the matrix
     * @param format The Matrix storage format
     * @returns A matrix with ones on the diagonal
     */
    identity(m: number, n: number, format?: string): Matrix | MathArray | number

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
      x: Matrix | MathArray | string[],
      test:
        | ((
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            value: any,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            index: any,
            matrix: Matrix | MathArray | string[]
          ) => boolean)
        | RegExp
    ): Matrix | MathArray

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
    forEach<T extends Matrix | MathArray>(
      x: T,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      callback: (value: any, index: any, matrix: T) => void
    ): void

    /**
     * Calculate the inverse of a square matrix.
     * @param x Matrix to be inversed
     * @returns The inverse of x
     */
    inv<T extends number | Complex | MathCollection>(x: T): NoLiteralType<T>

    /**
     * Calculate the kronecker product of two matrices or vectors
     * @param x First vector
     * @param y Second vector
     * @returns Returns the kronecker product of x and y
     */
    kron(x: Matrix | MathArray, y: Matrix | MathArray): Matrix

    /**
     * Iterate over all elements of a matrix/array, and executes the given
     * callback function.
     * @param x The matrix to iterate on.
     * @param callback The callback function is invoked with three
     * parameters: the value of the element, the index of the element, and
     * the Matrix/array being traversed.
     * @returns Transformed map of x
     */
    map<T extends Matrix | MathArray>(
      x: T,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      callback: (value: any, index: any, matrix: T) => MathType | string
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
      start: number | BigNumber,
      end: number | BigNumber,
      step: number | BigNumber,
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
    sort<T extends Matrix | MathArray>(
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
     * Calculate N-dimensional fourier transform
     * @param {Array | Matrix} arr    An array or matrix
     * @return {Array | Matrix}       N-dimensional fourier transformation of the array
     */
    fft<T extends MathCollection>(arr: T): T

    /**
     * Calculate N-dimensional inverse fourier transform
     * @param {Array | Matrix} arr    An array or matrix
     * @return {Array | Matrix}       N-dimensional fourier transformation of the array
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
     * @returns Returns a single random value from array when number is 1 or
     * undefined. Returns an array with the configured number of elements
     * when number is > 1.
     */
    pickRandom(
      array: number[],
      number?: number,
      weights?: number[]
    ): number | number[]

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
     * between x and y is smaller than the configured epsilon. The function
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
    deepEqual(
      x: MathType,
      y: MathType
    ): number | BigNumber | Fraction | Complex | Unit | MathCollection

    /**
     * Test whether two values are equal.
     *
     * The function tests whether the relative difference between x and y is
     * smaller than the configured epsilon. The function cannot be used to
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
     * larger than the configured epsilon. The function cannot be used to
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
     * y is smaller than the configured epsilon. The function cannot be used
     * to compare values smaller than approximately 2.22e-16. For matrices,
     * the function is evaluated element wise.
     * @param x First value to compare
     * @param y Second value to vcompare
     * @returns Returns true when x is larger than or equal to y, else
     * returns false
     */
    largerEq(
      x: MathType | string,
      y: MathType | string
    ): boolean | MathCollection

    /**
     * Test whether value x is smaller than y. The function returns true
     * when x is smaller than y and the relative difference between x and y
     * is smaller than the configured epsilon. The function cannot be used
     * to compare values smaller than approximately 2.22e-16. For matrices,
     * the function is evaluated element wise.
     * @param x First value to compare
     * @param y Second value to vcompare
     * @returns Returns true when x is smaller than y, else returns false
     */
    smaller(
      x: MathType | string,
      y: MathType | string
    ): boolean | MathCollection

    /**
     * Test whether value x is smaller or equal to y. The function returns
     * true when x is smaller than y or the relative difference between x
     * and y is smaller than the configured epsilon. The function cannot be
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
     * Test whether two values are unequal. The function tests whether the
     * relative difference between x and y is larger than the configured
     * epsilon. The function cannot be used to compare values smaller than
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
    unequal(
      x: MathType | string,
      y: MathType | string
    ): boolean | MathCollection

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
    setMultiplicity(
      e: number | BigNumber | Fraction | Complex,
      a: MathCollection
    ): number

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
     * Special functions
     ************************************************************************/

    /**
     * Compute the erf function of a value using a rational Chebyshev
     * approximations for different intervals of x.
     * @param x A real number
     * @returns The erf of x
     */
    erf<T extends number | MathCollection>(x: T): NoLiteralType<T>

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
     * @param args A single matrix or multiple scalar values
     * @returns The maximum value
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    max(...args: MathType[]): any
    /**
     * @param A A single matrix
     * @param dim The maximum over the selected dimension
     * @returns The maximum value
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    max(A: MathCollection, dim?: number): any

    /**
     * Compute the mean value of matrix or a list with values. In case of a
     * multi dimensional array, the mean of the flattened array will be
     * calculated. When dim is provided, the maximum over the selected
     * dimension will be calculated. Parameter dim is zero-based.
     * @param args A single matrix or multiple scalar values
     * @returns The mean of all values
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mean(...args: MathType[]): any
    /**
     * @param A A single matrix
     * @param dim The mean over the selected dimension
     * @returns The mean of all values
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mean(A: MathCollection, dim?: number): any

    /**
     * Compute the median of a matrix or a list with values. The values are
     * sorted and the middle value is returned. In case of an even number of
     * values, the average of the two middle values is returned. Supported
     * types of values are: Number, BigNumber, Unit In case of a (multi
     * dimensional) array or matrix, the median of all elements will be
     * calculated.
     * @param args A single matrix or or multiple scalar values
     * @returns The median
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    median(...args: MathType[]): any

    /**
     * Compute the maximum value of a matrix or a list of values. In case of
     * a multi dimensional array, the maximum of the flattened array will be
     * calculated. When dim is provided, the maximum over the selected
     * dimension will be calculated. Parameter dim is zero-based.
     * @param args A single matrix or or multiple scalar values
     * @returns The minimum value
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    min(...args: MathType[]): any
    /**
     * @param A A single matrix
     * @param dim The minimum over the selected dimension
     * @returns The minimum value
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    min(A: MathCollection, dim?: number): any

    /**
     * Computes the mode of a set of numbers or a list with values(numbers
     * or characters). If there are more than one modes, it returns a list
     * of those values.
     * @param args A single matrix
     * @returns The mode of all values
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mode(...args: MathType[]): any

    /**
     * Compute the product of a matrix or a list with values. In case of a
     * (multi dimensional) array or matrix, the sum of all elements will be
     * calculated.
     * @param args A single matrix or multiple scalar values
     * @returns The product of all values
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prod(...args: MathType[]): any

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
    ): number | BigNumber | Unit | MathArray

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
     * @param a variadic argument of number to calculate standard deviation
     * @returns The standard deviation array
     */
    std(...values: number[]): number
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
    ): number[]
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
    ): number

    /**
     * Compute the sum of a matrix or a list with values. In case of a
     * (multi dimensional) array or matrix, the sum of all elements will be
     * calculated.
     * @param args A single matrix or multiple scalar values
     * @returns The sum of all values
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sum(...args: Array<number | BigNumber | Fraction>): any
    /**
     * @param array A single matrix
     * @returns The sum of all values
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sum(array: MathCollection): any

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
    variance(...args: Array<number | BigNumber | Fraction>): number

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
    ): number[]
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
    ): number

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
      options?: FormatOptions | number | ((item: any) => string),
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
    acos(x: BigNumber): BigNumber
    acos(x: Complex): Complex

    /**
     * Calculate the hyperbolic arccos of a value, defined as acosh(x) =
     * ln(sqrt(x^2 - 1) + x).
     * @param x Function input
     * @returns The hyperbolic arccosine of x
     */
    acosh(x: number): number | Complex
    acosh(x: BigNumber): BigNumber
    acosh(x: Complex): Complex

    /**
     * Calculate the inverse cotangent of a value.
     * @param x Function input
     * @returns The arc cotangent of x
     */
    acot(x: number): number
    acot(x: BigNumber): BigNumber
    acot(x: Complex): Complex

    /**
     * Calculate the hyperbolic arccotangent of a value, defined as acoth(x)
     * = (ln((x+1)/x) + ln(x/(x-1))) / 2.
     * @param x Function input
     * @returns The hyperbolic arccotangent of x
     */
    acoth(x: number): number
    acoth(x: BigNumber): BigNumber
    acoth(x: Complex): Complex

    /**
     * Calculate the inverse cosecant of a value.
     * @param x Function input
     * @returns The arc cosecant of x
     */
    acsc(x: number): number | Complex
    acsc(x: BigNumber): BigNumber
    acsc(x: Complex): Complex

    /**
     * Calculate the hyperbolic arccosecant of a value, defined as acsch(x)
     * = ln(1/x + sqrt(1/x^2 + 1)).
     * @param x Function input
     * @returns The hyperbolic arccosecant of x
     */
    acsch(x: number): number
    acsch(x: BigNumber): BigNumber
    acsch(x: Complex): Complex

    /**
     * Calculate the inverse secant of a value.
     * @param x Function input
     * @returns The arc secant of x
     */
    asec(x: number): number | Complex
    asec(x: BigNumber): BigNumber
    asec(x: Complex): Complex

    /**
     * Calculate the hyperbolic arcsecant of a value, defined as asech(x) =
     * ln(sqrt(1/x^2 - 1) + 1/x).
     * @param x Function input
     * @returns The hyperbolic arcsecant of x
     */
    asech(x: number): number | Complex
    asech(x: BigNumber): BigNumber
    asech(x: Complex): Complex

    /**
     * Calculate the inverse sine of a value.
     * @param x Function input
     * @returns The arc sine of x
     */
    asin(x: number): number | Complex
    asin(x: BigNumber): BigNumber
    asin(x: Complex): Complex

    /**
     * Calculate the hyperbolic arcsine of a value, defined as asinh(x) =
     * ln(x + sqrt(x^2 + 1)).
     * @param x Function input
     * @returns The hyperbolic arcsine of x
     */
    asinh(x: number): number
    asinh(x: BigNumber): BigNumber
    asinh(x: Complex): Complex

    /**
     * Calculate the inverse tangent of a value.
     * @param x Function input
     * @returns The arc tangent of x
     */
    atan(x: number): number
    atan(x: BigNumber): BigNumber
    atan(x: Complex): Complex

    /**
     * Calculate the inverse tangent function with two arguments, y/x. By
     * providing two arguments, the right quadrant of the computed angle can
     * be determined. For matrices, the function is evaluated element wise.
     * @param x Function input
     * @returns Four quadrant inverse tangent
     */
    atan2(y: number, x: number): number
    atan2(y: MathCollection, x: MathCollection): MathCollection

    /**
     * Calculate the hyperbolic arctangent of a value, defined as atanh(x) =
     * ln((1 + x)/(1 - x)) / 2.
     * @param x Function input
     * @returns The hyperbolic arctangent of x
     */
    atanh(x: number): number | Complex
    atanh(x: BigNumber): BigNumber
    atanh(x: Complex): Complex

    /**
     * Calculate the cosine of a value.
     * @param x Function input
     * @returns The cosine of x
     */
    cos(x: number | Unit): number
    cos(x: BigNumber): BigNumber
    cos(x: Complex): Complex

    /**
     * Calculate the hyperbolic cosine of a value, defined as cosh(x) = 1/2
     * * (exp(x) + exp(-x)).
     * @param x Function input
     * @returns The hyperbolic cosine of x
     */
    cosh(x: number | Unit): number
    cosh(x: BigNumber): BigNumber
    cosh(x: Complex): Complex

    /**
     * Calculate the cotangent of a value. cot(x) is defined as 1 / tan(x).
     * @param x Function input
     * @returns The cotangent of x
     */
    cot(x: number | Unit): number
    cot(x: BigNumber): BigNumber
    cot(x: Complex): Complex

    /**
     * Calculate the hyperbolic cotangent of a value, defined as coth(x) = 1
     * / tanh(x).
     * @param x Function input
     * @returns The hyperbolic cotangent of x
     */
    coth(x: number | Unit): number
    coth(x: BigNumber): BigNumber
    coth(x: Complex): Complex

    /**
     * Calculate the cosecant of a value, defined as csc(x) = 1/sin(x).
     * @param x Function input
     * @returns The cosecant hof x
     */
    csc(x: number | Unit): number
    csc(x: BigNumber): BigNumber
    csc(x: Complex): Complex

    /**
     * Calculate the hyperbolic cosecant of a value, defined as csch(x) = 1
     * / sinh(x).
     * @param x Function input
     * @returns The hyperbolic cosecant of x
     */
    csch(x: number | Unit): number
    csch(x: BigNumber): BigNumber
    csch(x: Complex): Complex

    /**
     * Calculate the secant of a value, defined as sec(x) = 1/cos(x).
     * @param x Function input
     * @returns The secant of x
     */
    sec(x: number | Unit): number
    sec(x: BigNumber): BigNumber
    sec(x: Complex): Complex

    /**
     * Calculate the hyperbolic secant of a value, defined as sech(x) = 1 /
     * cosh(x).
     * @param x Function input
     * @returns The hyperbolic secant of x
     */
    sech(x: number | Unit): number
    sech(x: BigNumber): BigNumber
    sech(x: Complex): Complex

    /**
     * Calculate the sine of a value.
     * @param x Function input
     * @returns The sine of x
     */
    sin(x: number | Unit): number
    sin(x: BigNumber): BigNumber
    sin(x: Complex): Complex

    /**
     * Calculate the hyperbolic sine of a value, defined as sinh(x) = 1/2 *
     * (exp(x) - exp(-x)).
     * @param x Function input
     * @returns The hyperbolic sine of x
     */
    sinh(x: number | Unit): number
    sinh(x: BigNumber): BigNumber
    sinh(x: Complex): Complex

    /**
     * Calculate the tangent of a value. tan(x) is equal to sin(x) / cos(x).
     * @param x Function input
     * @returns The tangent of x
     */
    tan(x: number | Unit): number
    tan(x: BigNumber): BigNumber
    tan(x: Complex): Complex

    /**
     * Calculate the hyperbolic tangent of a value, defined as tanh(x) =
     * (exp(2 * x) - 1) / (exp(2 * x) + 1).
     * @param x Function input
     * @returns The hyperbolic tangent of x
     */
    tanh(x: number | Unit): number
    tanh(x: BigNumber): BigNumber
    tanh(x: Complex): Complex

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

    isNode(x: unknown): x is MathNodeCommon

    isObjectNode(x: unknown): x is ObjectNode

    isOperatorNode(
      x: unknown
    ): x is OperatorNode<OperatorNodeOp, OperatorNodeFn>

    isParenthesisNode(x: unknown): x is ParenthesisNode

    isRangeNode(x: unknown): x is RangeNode

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
     * @returns Returns true when x is a number, BigNumber, Fraction, Boolean, or a String containing number.
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
    isNaN(x: number | BigNumber | Fraction | MathCollection | Unit): boolean

    /**
     * Test whether a value is negative: smaller than zero. The function
     * supports types number, BigNumber, Fraction, and Unit. The function is
     * evaluated element-wise in case of Array or Matrix input.
     * @param x Value to be tested
     * @returns Returns true when x is larger than zero. Throws an error in
     * case of an unknown data type.
     */
    isNegative(
      x: number | BigNumber | Fraction | MathCollection | Unit
    ): boolean

    /**
     * Test whether a value is an numeric value. The function is evaluated
     * element-wise in case of Array or Matrix input.
     * @param x Value to be tested
     * @returns Returns true when x is a number, BigNumber, Fraction, or
     * boolean. Returns false for other types. Throws an error in case of
     * unknown types.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isNumeric(x: any): x is number | BigNumber | Fraction | boolean

    /**
     * Test whether a value is positive: larger than zero. The function
     * supports types number, BigNumber, Fraction, and Unit. The function is
     * evaluated element-wise in case of Array or Matrix input.
     * @param x Value to be tested
     * @returns Returns true when x is larger than zero. Throws an error in
     * case of an unknown data type.
     */
    isPositive(
      x: number | BigNumber | Fraction | MathCollection | Unit
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
    isZero(
      x: number | BigNumber | Fraction | MathCollection | Unit | Complex
    ): boolean

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
     *      interface MathJsStatic {
     *          hello(a: number): number;
     *      }
     * }
     *
     * @param object An object with functions to be imported.
     * @param options An object with import options.
     */
    import(object: ImportObject | ImportObject[], options?: ImportOptions): void
  }

  /*************************************************************************
   * Factory and Dependencies
   ************************************************************************/
  interface FactoryDependencies {
    create: (
      factories: FactoryFunctionMap,
      config?: ConfigOptions
    ) => MathJsStatic
    factory: <T, TDeps extends readonly MathJsFunctionName[]>(
      name: string,
      dependencies: TDeps,
      create: (
        injected: Pick<MathJsStatic, Extract<MathJsFunctionName, TDeps[number]>>
      ) => T,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      meta?: any
    ) => FactoryFunction<T>
    all: FactoryFunctionMap

    typedDependencies: FactoryFunctionMap
    ResultSetDependencies: FactoryFunctionMap
    BigNumberDependencies: FactoryFunctionMap
    ComplexDependencies: FactoryFunctionMap
    FractionDependencies: FactoryFunctionMap
    RangeDependencies: FactoryFunctionMap
    MatrixDependencies: FactoryFunctionMap
    DenseMatrixDependencies: FactoryFunctionMap
    cloneDependencies: FactoryFunctionMap
    isIntegerDependencies: FactoryFunctionMap
    isNegativeDependencies: FactoryFunctionMap
    isNumericDependencies: FactoryFunctionMap
    hasNumericValueDependencies: FactoryFunctionMap
    isPositiveDependencies: FactoryFunctionMap
    isZeroDependencies: FactoryFunctionMap
    isNaNDependencies: FactoryFunctionMap
    typeOfDependencies: FactoryFunctionMap
    typeofDependencies: FactoryFunctionMap
    equalScalarDependencies: FactoryFunctionMap
    SparseMatrixDependencies: FactoryFunctionMap
    numberDependencies: FactoryFunctionMap
    stringDependencies: FactoryFunctionMap
    booleanDependencies: FactoryFunctionMap
    bignumberDependencies: FactoryFunctionMap
    complexDependencies: FactoryFunctionMap
    fractionDependencies: FactoryFunctionMap
    matrixDependencies: FactoryFunctionMap
    splitUnitDependencies: FactoryFunctionMap
    unaryMinusDependencies: FactoryFunctionMap
    unaryPlusDependencies: FactoryFunctionMap
    absDependencies: FactoryFunctionMap
    applyDependencies: FactoryFunctionMap
    addScalarDependencies: FactoryFunctionMap
    cbrtDependencies: FactoryFunctionMap
    ceilDependencies: FactoryFunctionMap
    cubeDependencies: FactoryFunctionMap
    expDependencies: FactoryFunctionMap
    expm1Dependencies: FactoryFunctionMap
    fixDependencies: FactoryFunctionMap
    floorDependencies: FactoryFunctionMap
    gcdDependencies: FactoryFunctionMap
    lcmDependencies: FactoryFunctionMap
    log10Dependencies: FactoryFunctionMap
    log2Dependencies: FactoryFunctionMap
    modDependencies: FactoryFunctionMap
    multiplyScalarDependencies: FactoryFunctionMap
    multiplyDependencies: FactoryFunctionMap
    nthRootDependencies: FactoryFunctionMap
    signDependencies: FactoryFunctionMap
    sqrtDependencies: FactoryFunctionMap
    squareDependencies: FactoryFunctionMap
    subtractDependencies: FactoryFunctionMap
    xgcdDependencies: FactoryFunctionMap
    dotMultiplyDependencies: FactoryFunctionMap
    bitAndDependencies: FactoryFunctionMap
    bitNotDependencies: FactoryFunctionMap
    bitOrDependencies: FactoryFunctionMap
    bitXorDependencies: FactoryFunctionMap
    argDependencies: FactoryFunctionMap
    conjDependencies: FactoryFunctionMap
    imDependencies: FactoryFunctionMap
    reDependencies: FactoryFunctionMap
    notDependencies: FactoryFunctionMap
    orDependencies: FactoryFunctionMap
    xorDependencies: FactoryFunctionMap
    concatDependencies: FactoryFunctionMap
    columnDependencies: FactoryFunctionMap
    crossDependencies: FactoryFunctionMap
    diagDependencies: FactoryFunctionMap
    eyeDependencies: FactoryFunctionMap
    filterDependencies: FactoryFunctionMap
    flattenDependencies: FactoryFunctionMap
    forEachDependencies: FactoryFunctionMap
    getMatrixDataTypeDependencies: FactoryFunctionMap
    identityDependencies: FactoryFunctionMap
    kronDependencies: FactoryFunctionMap
    mapDependencies: FactoryFunctionMap
    onesDependencies: FactoryFunctionMap
    rangeDependencies: FactoryFunctionMap
    reshapeDependencies: FactoryFunctionMap
    resizeDependencies: FactoryFunctionMap
    rowDependencies: FactoryFunctionMap
    sizeDependencies: FactoryFunctionMap
    squeezeDependencies: FactoryFunctionMap
    subsetDependencies: FactoryFunctionMap
    transposeDependencies: FactoryFunctionMap
    ctransposeDependencies: FactoryFunctionMap
    zerosDependencies: FactoryFunctionMap
    erfDependencies: FactoryFunctionMap
    modeDependencies: FactoryFunctionMap
    prodDependencies: FactoryFunctionMap
    formatDependencies: FactoryFunctionMap
    printDependencies: FactoryFunctionMap
    toDependencies: FactoryFunctionMap
    isPrimeDependencies: FactoryFunctionMap
    numericDependencies: FactoryFunctionMap
    divideScalarDependencies: FactoryFunctionMap
    powDependencies: FactoryFunctionMap
    roundDependencies: FactoryFunctionMap
    logDependencies: FactoryFunctionMap
    log1pDependencies: FactoryFunctionMap
    nthRootsDependencies: FactoryFunctionMap
    dotPowDependencies: FactoryFunctionMap
    dotDivideDependencies: FactoryFunctionMap
    lsolveDependencies: FactoryFunctionMap
    usolveDependencies: FactoryFunctionMap
    leftShiftDependencies: FactoryFunctionMap
    rightArithShiftDependencies: FactoryFunctionMap
    rightLogShiftDependencies: FactoryFunctionMap
    andDependencies: FactoryFunctionMap
    compareDependencies: FactoryFunctionMap
    compareNaturalDependencies: FactoryFunctionMap
    compareTextDependencies: FactoryFunctionMap
    equalDependencies: FactoryFunctionMap
    equalTextDependencies: FactoryFunctionMap
    smallerDependencies: FactoryFunctionMap
    smallerEqDependencies: FactoryFunctionMap
    largerDependencies: FactoryFunctionMap
    largerEqDependencies: FactoryFunctionMap
    deepEqualDependencies: FactoryFunctionMap
    unequalDependencies: FactoryFunctionMap
    partitionSelectDependencies: FactoryFunctionMap
    sortDependencies: FactoryFunctionMap
    maxDependencies: FactoryFunctionMap
    minDependencies: FactoryFunctionMap
    ImmutableDenseMatrixDependencies: FactoryFunctionMap
    IndexDependencies: FactoryFunctionMap
    FibonacciHeapDependencies: FactoryFunctionMap
    SpaDependencies: FactoryFunctionMap
    UnitDependencies: FactoryFunctionMap
    unitDependencies: FactoryFunctionMap
    sparseDependencies: FactoryFunctionMap
    createUnitDependencies: FactoryFunctionMap
    acosDependencies: FactoryFunctionMap
    acoshDependencies: FactoryFunctionMap
    acotDependencies: FactoryFunctionMap
    acothDependencies: FactoryFunctionMap
    acscDependencies: FactoryFunctionMap
    acschDependencies: FactoryFunctionMap
    asecDependencies: FactoryFunctionMap
    asechDependencies: FactoryFunctionMap
    asinDependencies: FactoryFunctionMap
    asinhDependencies: FactoryFunctionMap
    atanDependencies: FactoryFunctionMap
    atan2Dependencies: FactoryFunctionMap
    atanhDependencies: FactoryFunctionMap
    cosDependencies: FactoryFunctionMap
    coshDependencies: FactoryFunctionMap
    cotDependencies: FactoryFunctionMap
    cothDependencies: FactoryFunctionMap
    cscDependencies: FactoryFunctionMap
    cschDependencies: FactoryFunctionMap
    secDependencies: FactoryFunctionMap
    sechDependencies: FactoryFunctionMap
    sinDependencies: FactoryFunctionMap
    sinhDependencies: FactoryFunctionMap
    tanDependencies: FactoryFunctionMap
    tanhDependencies: FactoryFunctionMap
    setCartesianDependencies: FactoryFunctionMap
    setDifferenceDependencies: FactoryFunctionMap
    setDistinctDependencies: FactoryFunctionMap
    setIntersectDependencies: FactoryFunctionMap
    setIsSubsetDependencies: FactoryFunctionMap
    setMultiplicityDependencies: FactoryFunctionMap
    setPowersetDependencies: FactoryFunctionMap
    setSizeDependencies: FactoryFunctionMap
    setSymDifferenceDependencies: FactoryFunctionMap
    setUnionDependencies: FactoryFunctionMap
    addDependencies: FactoryFunctionMap
    hypotDependencies: FactoryFunctionMap
    normDependencies: FactoryFunctionMap
    dotDependencies: FactoryFunctionMap
    traceDependencies: FactoryFunctionMap
    indexDependencies: FactoryFunctionMap
    NodeDependencies: FactoryFunctionMap
    AccessorNodeDependencies: FactoryFunctionMap
    ArrayNodeDependencies: FactoryFunctionMap
    AssignmentNodeDependencies: FactoryFunctionMap
    BlockNodeDependencies: FactoryFunctionMap
    ConditionalNodeDependencies: FactoryFunctionMap
    ConstantNodeDependencies: FactoryFunctionMap
    FunctionAssignmentNodeDependencies: FactoryFunctionMap
    IndexNodeDependencies: FactoryFunctionMap
    ObjectNodeDependencies: FactoryFunctionMap
    OperatorNodeDependencies: FactoryFunctionMap
    ParenthesisNodeDependencies: FactoryFunctionMap
    RangeNodeDependencies: FactoryFunctionMap
    RelationalNodeDependencies: FactoryFunctionMap
    SymbolNodeDependencies: FactoryFunctionMap
    FunctionNodeDependencies: FactoryFunctionMap
    parseDependencies: FactoryFunctionMap
    compileDependencies: FactoryFunctionMap
    evaluateDependencies: FactoryFunctionMap
    evalDependencies: FactoryFunctionMap
    ParserDependencies: FactoryFunctionMap
    parserDependencies: FactoryFunctionMap
    lupDependencies: FactoryFunctionMap
    qrDependencies: FactoryFunctionMap
    sluDependencies: FactoryFunctionMap
    lusolveDependencies: FactoryFunctionMap
    HelpDependencies: FactoryFunctionMap
    ChainDependencies: FactoryFunctionMap
    helpDependencies: FactoryFunctionMap
    chainDependencies: FactoryFunctionMap
    detDependencies: FactoryFunctionMap
    invDependencies: FactoryFunctionMap
    expmDependencies: FactoryFunctionMap
    sqrtmDependencies: FactoryFunctionMap
    divideDependencies: FactoryFunctionMap
    distanceDependencies: FactoryFunctionMap
    intersectDependencies: FactoryFunctionMap
    sumDependencies: FactoryFunctionMap
    meanDependencies: FactoryFunctionMap
    medianDependencies: FactoryFunctionMap
    madDependencies: FactoryFunctionMap
    varianceDependencies: FactoryFunctionMap
    varDependencies: FactoryFunctionMap
    quantileSeqDependencies: FactoryFunctionMap
    stdDependencies: FactoryFunctionMap
    combinationsDependencies: FactoryFunctionMap
    gammaDependencies: FactoryFunctionMap
    factorialDependencies: FactoryFunctionMap
    kldivergenceDependencies: FactoryFunctionMap
    multinomialDependencies: FactoryFunctionMap
    permutationsDependencies: FactoryFunctionMap
    pickRandomDependencies: FactoryFunctionMap
    randomDependencies: FactoryFunctionMap
    randomIntDependencies: FactoryFunctionMap
    stirlingS2Dependencies: FactoryFunctionMap
    bellNumbersDependencies: FactoryFunctionMap
    catalanDependencies: FactoryFunctionMap
    compositionDependencies: FactoryFunctionMap
    simplifyDependencies: FactoryFunctionMap
    derivativeDependencies: FactoryFunctionMap
    rationalizeDependencies: FactoryFunctionMap
    reviverDependencies: FactoryFunctionMap
    eDependencies: FactoryFunctionMap
    EDependencies: FactoryFunctionMap
    falseDependencies: FactoryFunctionMap
    iDependencies: FactoryFunctionMap
    InfinityDependencies: FactoryFunctionMap
    LN10Dependencies: FactoryFunctionMap
    LN2Dependencies: FactoryFunctionMap
    LOG10EDependencies: FactoryFunctionMap
    LOG2EDependencies: FactoryFunctionMap
    NaNDependencies: FactoryFunctionMap
    nullDependencies: FactoryFunctionMap
    phiDependencies: FactoryFunctionMap
    piDependencies: FactoryFunctionMap
    PIDependencies: FactoryFunctionMap
    SQRT1_2Dependencies: FactoryFunctionMap
    SQRT2Dependencies: FactoryFunctionMap
    tauDependencies: FactoryFunctionMap
    trueDependencies: FactoryFunctionMap
    versionDependencies: FactoryFunctionMap
    atomicMassDependencies: FactoryFunctionMap
    avogadroDependencies: FactoryFunctionMap
    bohrMagnetonDependencies: FactoryFunctionMap
    bohrRadiusDependencies: FactoryFunctionMap
    boltzmannDependencies: FactoryFunctionMap
    classicalElectronRadiusDependencies: FactoryFunctionMap
    conductanceQuantumDependencies: FactoryFunctionMap
    coulombDependencies: FactoryFunctionMap
    deuteronMassDependencies: FactoryFunctionMap
    efimovFactorDependencies: FactoryFunctionMap
    electricConstantDependencies: FactoryFunctionMap
    electronMassDependencies: FactoryFunctionMap
    elementaryChargeDependencies: FactoryFunctionMap
    faradayDependencies: FactoryFunctionMap
    fermiCouplingDependencies: FactoryFunctionMap
    fineStructureDependencies: FactoryFunctionMap
    firstRadiationDependencies: FactoryFunctionMap
    gasConstantDependencies: FactoryFunctionMap
    gravitationConstantDependencies: FactoryFunctionMap
    gravityDependencies: FactoryFunctionMap
    hartreeEnergyDependencies: FactoryFunctionMap
    inverseConductanceQuantumDependencies: FactoryFunctionMap
    klitzingDependencies: FactoryFunctionMap
    loschmidtDependencies: FactoryFunctionMap
    magneticConstantDependencies: FactoryFunctionMap
    magneticFluxQuantumDependencies: FactoryFunctionMap
    molarMassDependencies: FactoryFunctionMap
    molarMassC12Dependencies: FactoryFunctionMap
    molarPlanckConstantDependencies: FactoryFunctionMap
    molarVolumeDependencies: FactoryFunctionMap
    neutronMassDependencies: FactoryFunctionMap
    nuclearMagnetonDependencies: FactoryFunctionMap
    planckChargeDependencies: FactoryFunctionMap
    planckConstantDependencies: FactoryFunctionMap
    planckLengthDependencies: FactoryFunctionMap
    planckMassDependencies: FactoryFunctionMap
    planckTemperatureDependencies: FactoryFunctionMap
    planckTimeDependencies: FactoryFunctionMap
    protonMassDependencies: FactoryFunctionMap
    quantumOfCirculationDependencies: FactoryFunctionMap
    reducedPlanckConstantDependencies: FactoryFunctionMap
    rydbergDependencies: FactoryFunctionMap
    sackurTetrodeDependencies: FactoryFunctionMap
    secondRadiationDependencies: FactoryFunctionMap
    speedOfLightDependencies: FactoryFunctionMap
    stefanBoltzmannDependencies: FactoryFunctionMap
    thomsonCrossSectionDependencies: FactoryFunctionMap
    vacuumImpedanceDependencies: FactoryFunctionMap
    weakMixingAngleDependencies: FactoryFunctionMap
    wienDisplacementDependencies: FactoryFunctionMap
    applyTransformDependencies: FactoryFunctionMap
    columnTransformDependencies: FactoryFunctionMap
    filterTransformDependencies: FactoryFunctionMap
    forEachTransformDependencies: FactoryFunctionMap
    indexTransformDependencies: FactoryFunctionMap
    mapTransformDependencies: FactoryFunctionMap
    maxTransformDependencies: FactoryFunctionMap
    meanTransformDependencies: FactoryFunctionMap
    minTransformDependencies: FactoryFunctionMap
    rangeTransformDependencies: FactoryFunctionMap
    rowTransformDependencies: FactoryFunctionMap
    subsetTransformDependencies: FactoryFunctionMap
    concatTransformDependencies: FactoryFunctionMap
    stdTransformDependencies: FactoryFunctionMap
    sumTransformDependencies: FactoryFunctionMap
    varianceTransformDependencies: FactoryFunctionMap
  }

  interface Matrix {
    type: string
    storage(): string
    datatype(): string
    create(data: MathArray, datatype?: string): void
    density(): number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    subset(index: Index, replacement?: any, defaultValue?: any): Matrix
    apply(
      dim: number,
      callback: (array: MathCollection) => number
    ): Matrix | MathArray
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(index: number[]): any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set(index: number[], value: any, defaultValue?: number | string): Matrix
    resize(size: MathCollection, defaultValue?: number | string): Matrix
    clone(): Matrix
    size(): number[]
    map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      callback: (a: any, b: number, c: Matrix) => any,
      skipZeros?: boolean
    ): Matrix
    forEach(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      callback: (a: any, b: number, c: Matrix) => void,
      skipZeros?: boolean
    ): void
    toArray(): MathArray
    valueOf(): MathArray
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    format(options?: FormatOptions | number | ((value: any) => string)): string
    toString(): string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toJSON(): any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    diagonal(k?: number | BigNumber): any[]
    swapRows(i: number, j: number): Matrix
  }

  interface MatrixCtor {
    new (): Matrix
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface BigNumber extends Decimal {}

  interface Fraction {
    s: number
    n: number
    d: number
  }

  interface Complex {
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

  interface PolarCoordinates {
    r: number
    phi: number
  }

  interface MathJSON {
    mathjs?: string
    value: number
    unit: string
    fixPrefix?: boolean
  }

  interface UnitComponent {
    power: number
    prefix: string
    unit: {
      name: string
      base: {
        dimensions: number[]
        key: string
      }
      prefixes: Record<string, UnitPrefix>
      value: number
      offset: number
      dimensions: number[]
    }
  }

  interface UnitPrefix {
    name: string
    value: number
    scientific: boolean
  }

  interface Unit {
    valueOf(): string
    clone(): Unit
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hasBase(base: any): boolean
    equalBase(unit: Unit): boolean
    equals(unit: Unit): boolean
    multiply(unit: Unit): Unit
    divide(unit: Unit): Unit
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

  interface CreateUnitOptions {
    prefixes?: 'none' | 'short' | 'long' | 'binary_short' | 'binary_long'
    aliases?: string[]
    offset?: number
    override?: boolean
  }

  type SimplifyContext = Partial<
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

  interface SimplifyOptions {
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

  type SimplifyRule =
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

  interface Simplify {
    (expr: MathNode | string): MathNode
    (
      expr: MathNode | string,
      rules: SimplifyRule[],
      scope?: object,
      options?: SimplifyOptions
    ): MathNode
    (
      expr: MathNode | string,
      scope: object,
      options?: SimplifyOptions
    ): MathNode

    rules: SimplifyRule[]
  }

  interface UnitDefinition {
    definition?: string | Unit
    prefixes?: string
    offset?: number
    aliases?: string[]
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Index {}

  interface EvalFunction {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    evaluate(scope?: any): any
  }

  interface MathNodeCommon {
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
      callback: (node: MathNode, path: string, parent: MathNode) => any
    ): MathNode[]

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): any
  }

  interface Parser {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    evaluate(expr: string | string[]): any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(variable: string): any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getAll(): { [key: string]: any }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set: (variable: string, value: any) => void
    clear: () => void
  }

  interface Distribution {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    random(size: any, min?: any, max?: any): any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    randomInt(min: any, max?: any): any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pickRandom(array: any): any
  }

  interface FormatOptions {
    /**
     * Number notation. Choose from: 'fixed' Always use regular number
     * notation. For example '123.40' and '14000000' 'exponential' Always
     * use exponential notation. For example '1.234e+2' and '1.4e+7' 'auto'
     * (default) Regular number notation for numbers having an absolute
     * value between lower and upper bounds, and uses exponential notation
     * elsewhere. Lower bound is included, upper bound is excluded. For
     * example '123.4' and '1.4e7'.
     */
    notation?: 'fixed' | 'exponential' | 'engineering' | 'auto'

    /**
     * A number between 0 and 16 to round the digits of the number. In case
     * of notations 'exponential' and 'auto', precision defines the total
     * number of significant digits returned and is undefined by default. In
     * case of notation 'fixed', precision defines the number of significant
     * digits after the decimal point, and is 0 by default.
     */
    precision?: number

    /**
     * Exponent determining the lower boundary for formatting a value with
     * an exponent when notation='auto. Default value is -3.
     */
    lowerExp?: number

    /**
     * Exponent determining the upper boundary for formatting a value with
     * an exponent when notation='auto. Default value is 5.
     */
    upperExp?: number

    /**
     * Available values: 'ratio' (default) or 'decimal'. For example
     * format(fraction(1, 3)) will output '1/3' when 'ratio' is configured,
     * and will output 0.(3) when 'decimal' is configured.
     */
    fraction?: string
  }

  interface Help {
    toString(): string
    toJSON(): string
  }

  interface ConfigOptions {
    epsilon?: number
    matrix?: 'Matrix' | 'Array'
    number?: 'number' | 'BigNumber' | 'Fraction'
    precision?: number
    predictable?: boolean
    randomSeed?: string | null
  }

  interface MathJsChain<TValue> {
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
        number | string | Fraction | BigNumber | boolean | Fraction | null
      >
    ): MathJsChain<BigNumber>
    bignumber<T extends MathCollection>(this: MathJsChain<T>): MathJsChain<T>

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
        number | string | BigNumber | Fraction | FractionDefinition
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
        string | number | BigNumber | Fraction | boolean | Unit | null
      >,
      valuelessUnit?: Unit | string
    ): MathJsChain<number>
    number(
      this: MathJsChain<MathCollection>,
      valuelessUnit?: Unit | string
    ): MathJsChain<MathCollection>

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
    unit(this: MathJsChain<Unit>, unit?: string): MathJsChain<Unit>
    unit(
      this: MathJsChain<number | BigNumber>,
      unit?: string
    ): MathJsChain<Unit>
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
    lsolve(
      this: MathJsChain<Matrix>,
      b: Matrix | MathArray
    ): MathJsChain<Matrix>
    lsolve(
      this: MathJsChain<MathArray>,
      b: Matrix | MathArray
    ): MathJsChain<MathArray>

    /**
     * Calculate the Matrix LU decomposition with partial pivoting. Matrix A
     * is decomposed in two matrices (L, U) and a row permutation vector p
     * where A[p,:] = L * U
     */
    lup(this: MathJsChain<Matrix | MathArray>): MathJsChain<LUDecomposition>

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
      b: Matrix | MathArray,
      order?: number,
      threshold?: number
    ): MathJsChain<Matrix>

    lusolve(
      this: MathJsChain<MathArray>,
      b: Matrix | MathArray,
      order?: number,
      threshold?: number
    ): MathJsChain<MathArray>

    /**
     * Calculate the Matrix QR decomposition. Matrix A is decomposed in two
     * matrices (Q, R) where Q is an orthogonal matrix and R is an upper
     * triangular matrix.
     */
    qr(this: MathJsChain<Matrix | MathArray>): MathJsChain<QRDecomposition>

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
    usolve(
      this: MathJsChain<Matrix>,
      b: Matrix | MathArray
    ): MathJsChain<Matrix>
    usolve(
      this: MathJsChain<MathArray>,
      b: Matrix | MathArray
    ): MathJsChain<MathArray>

    /*************************************************************************
     * Arithmetic functions
     ************************************************************************/

    /**
     * Calculate the absolute value of a number. For matrices, the function
     * is evaluated element wise.
     */
    abs(this: MathJsChain<number>): MathJsChain<number>
    abs(this: MathJsChain<BigNumber>): MathJsChain<BigNumber>
    abs(this: MathJsChain<Fraction>): MathJsChain<Fraction>
    abs(this: MathJsChain<Complex>): MathJsChain<Complex>
    abs(this: MathJsChain<MathArray>): MathJsChain<MathArray>
    abs(this: MathJsChain<Matrix>): MathJsChain<Matrix>
    abs(this: MathJsChain<Unit>): MathJsChain<Unit>

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
    apply<T extends MathCollection>(
      this: MathJsChain<T>,
      dim: number,
      callback: (array: Array<MathType> | Matrix) => number
    ): MathJsChain<T>

    /**
     * Calculate the cubic root of a value. For matrices, the function is
     * evaluated element wise.
     * @param allRoots Optional, false by default. Only applicable when x is
     * a number or complex number. If true, all complex roots are returned,
     * if false (default) the principal root is returned.
     */
    cbrt(this: MathJsChain<number>, allRoots?: boolean): MathJsChain<number>
    cbrt(this: MathJsChain<BigNumber>): MathJsChain<BigNumber>
    cbrt(this: MathJsChain<Complex>, allRoots?: boolean): MathJsChain<Complex>
    cbrt(this: MathJsChain<Unit>, allRoots?: boolean): MathJsChain<Unit>

    // Rounding functions grouped for similarity

    /**
     * Round a value towards plus infinity If x is complex, both real and
     * imaginary part are rounded towards plus infinity. For matrices, the
     * function is evaluated element wise.
     * @param n Number of decimals Default value: 0.
     */
    ceil(
      this: MathJsChain<MathNumericType>,
      n?: number | BigNumber | MathCollection
    ): MathJsChain<MathNumericType>
    ceil(
      this: MathJsChain<MathCollection>,
      n?: number | BigNumber | MathCollection
    ): MathJsChain<MathCollection>

    /**
     * Round a value towards zero. For matrices, the function is evaluated
     * element wise.
     * @param n Number of decimals Default value: 0.
     */
    fix(
      this: MathJsChain<MathNumericType>,
      n?: number | BigNumber | MathCollection
    ): MathJsChain<MathNumericType>
    fix(
      this: MathJsChain<MathCollection>,
      n?: number | BigNumber | MathCollection
    ): MathJsChain<MathCollection>

    /**
     * Round a value towards minus infinity. For matrices, the function is
     * evaluated element wise.
     * @param n Number of decimals Default value: 0.
     */
    floor(
      this: MathJsChain<MathNumericType>,
      n?: number | BigNumber | MathCollection
    ): MathJsChain<MathNumericType>
    floor(
      this: MathJsChain<MathCollection>,
      n?: number | BigNumber | MathCollection
    ): MathJsChain<MathCollection>

    /**
     * Round a value towards the nearest integer. For matrices, the function
     * is evaluated element wise.
     * @param n Number of decimals Default value: 0.
     */
    round(
      this: MathJsChain<MathNumericType>,
      n?: number | BigNumber | MathCollection
    ): MathJsChain<MathNumericType>
    round(
      this: MathJsChain<MathCollection>,
      n?: number | BigNumber | MathCollection
    ): MathJsChain<MathCollection>

    // End of rounding group

    /**
     * Compute the cube of a value, x * x * x. For matrices, the function is
     * evaluated element wise.
     */
    cube(this: MathJsChain<number>): MathJsChain<number>
    cube(this: MathJsChain<BigNumber>): MathJsChain<BigNumber>
    cube(this: MathJsChain<Fraction>): MathJsChain<Fraction>
    cube(this: MathJsChain<Complex>): MathJsChain<Complex>
    cube(this: MathJsChain<Unit>): MathJsChain<Unit>

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
    dotDivide(this: MathJsChain<MathType>, y: MathType): MathJsChain<MathType>

    /**
     * Multiply two matrices element wise. The function accepts both
     * matrices and scalar values.
     * @param y Right hand value
     */
    dotMultiply(this: MathJsChain<MathType>, y: MathType): MathJsChain<MathType>

    /**
     * Calculates the power of x to y element wise.
     * @param y The exponent
     */
    dotPow(this: MathJsChain<MathType>, y: MathType): MathJsChain<MathType>

    /**
     * Calculate the exponent of a value. For matrices, the function is
     * evaluated element wise.
     */
    exp(this: MathJsChain<number>): MathJsChain<number>
    exp(this: MathJsChain<BigNumber>): MathJsChain<BigNumber>
    exp(this: MathJsChain<Complex>): MathJsChain<Complex>

    /**
     * Calculate the value of subtracting 1 from the exponential value. For
     * matrices, the function is evaluated element wise.
     */
    expm1(this: MathJsChain<number>): MathJsChain<number>
    expm1(this: MathJsChain<BigNumber>): MathJsChain<BigNumber>
    expm1(this: MathJsChain<Complex>): MathJsChain<Complex>

    /**
     * Calculate the greatest common divisor for two or more values or
     * arrays. For matrices, the function is evaluated element wise.
     */
    gcd(this: MathJsChain<number[]>, ...args: number[]): MathJsChain<number>
    gcd(
      this: MathJsChain<BigNumber[]>,
      ...args: BigNumber[]
    ): MathJsChain<BigNumber>
    gcd(this: MathJsChain<Complex[]>, ...args: Fraction[]): MathJsChain<Complex>
    gcd(
      this: MathJsChain<MathArray[]>,
      ...args: MathArray[]
    ): MathJsChain<MathArray>
    gcd(this: MathJsChain<Matrix[]>, ...args: Matrix[]): MathJsChain<Matrix>

    /**
     * Calculate the hypotenusa of a list with values. The hypotenusa is
     * defined as: hypot(a, b, c, ...) = sqrt(a^2 + b^2 + c^2 + ...) For
     * matrix input, the hypotenusa is calculated for all values in the
     * matrix.
     */
    hypot(this: MathJsChain<number[]>): MathJsChain<number>
    hypot(this: MathJsChain<BigNumber[]>): MathJsChain<BigNumber>

    /**
     * Calculate the least common multiple for two or more values or arrays.
     * lcm is defined as: lcm(a, b) = abs(a * b) / gcd(a, b) For matrices,
     * the function is evaluated element wise.
     * @param b An integer number
     */
    lcm(this: MathJsChain<number>, b: number): MathJsChain<number>
    lcm(this: MathJsChain<BigNumber>, b: BigNumber): MathJsChain<BigNumber>
    lcm(this: MathJsChain<MathArray>, b: MathArray): MathJsChain<MathArray>
    lcm(this: MathJsChain<Matrix>, b: Matrix): MathJsChain<Matrix>

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

    log10(this: MathJsChain<number>): MathJsChain<number>
    log10(this: MathJsChain<BigNumber>): MathJsChain<BigNumber>
    log10(this: MathJsChain<Complex>): MathJsChain<Complex>
    log10(this: MathJsChain<MathArray>): MathJsChain<MathArray>
    log10(this: MathJsChain<Matrix>): MathJsChain<Matrix>

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

    log2(this: MathJsChain<number>): MathJsChain<number>
    log2(this: MathJsChain<BigNumber>): MathJsChain<BigNumber>
    log2(this: MathJsChain<Complex>): MathJsChain<Complex>
    log2(this: MathJsChain<MathArray>): MathJsChain<MathArray>
    log2(this: MathJsChain<Matrix>): MathJsChain<Matrix>

    /**
     * Calculates the modulus, the remainder of an integer division. For
     * matrices, the function is evaluated element wise. The modulus is
     * defined as: x - y * floor(x / y)
     * @see http://en.wikipedia.org/wiki/Modulo_operation.
     * @param y Divisor
     */
    mod<T extends number | BigNumber | Fraction | MathCollection>(
      this: MathJsChain<T>,
      y: number | BigNumber | Fraction | MathCollection
    ): MathJsChain<NoLiteralType<T>>

    /**
     * Multiply two values, x * y. The result is squeezed. For matrices, the
     * matrix product is calculated.
     * @param y The second value to multiply
     */
    multiply<T extends Matrix | MathArray>(
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
      y: number | BigNumber | Complex
    ): MathJsChain<MathType>

    /**
     * Compute the sign of a value. The sign of a value x is: 1 when x > 1
     * -1 when x < 0 0 when x == 0 For matrices, the function is evaluated
     * element wise.
     * @param x The number for which to determine the sign
     * @returns The sign of x
     */
    sign(this: MathJsChain<number>): MathJsChain<number>
    sign(this: MathJsChain<BigNumber>): MathJsChain<BigNumber>
    sign(this: MathJsChain<Fraction>): MathJsChain<Fraction>
    sign(this: MathJsChain<Complex>): MathJsChain<Complex>
    sign(this: MathJsChain<MathArray>): MathJsChain<MathArray>
    sign(this: MathJsChain<Matrix>): MathJsChain<Matrix>
    sign(this: MathJsChain<Unit>): MathJsChain<Unit>

    /**
     * Calculate the square root of a value. For matrices, the function is
     * evaluated element wise.
     */

    sqrt(this: MathJsChain<number>): MathJsChain<number>
    sqrt(this: MathJsChain<BigNumber>): MathJsChain<BigNumber>
    sqrt(this: MathJsChain<Complex>): MathJsChain<Complex>
    sqrt(this: MathJsChain<MathArray>): MathJsChain<MathArray>
    sqrt(this: MathJsChain<Matrix>): MathJsChain<Matrix>
    sqrt(this: MathJsChain<Unit>): MathJsChain<Unit>

    /**
     * Compute the square of a value, x * x. For matrices, the function is
     * evaluated element wise.
     */

    square(this: MathJsChain<number>): MathJsChain<number>
    square(this: MathJsChain<BigNumber>): MathJsChain<BigNumber>
    square(this: MathJsChain<Fraction>): MathJsChain<Fraction>
    square(this: MathJsChain<Complex>): MathJsChain<Complex>
    square(this: MathJsChain<MathArray>): MathJsChain<MathArray>
    square(this: MathJsChain<Matrix>): MathJsChain<Matrix>
    square(this: MathJsChain<Unit>): MathJsChain<Unit>

    /**
     * Subtract two values, x - y. For matrices, the function is evaluated
     * element wise.
     * @param y Value to subtract from x
     */
    subtract<T extends MathType>(this: MathJsChain<T>, y: T): MathJsChain<T>
    subtract(this: MathJsChain<MathType>, y: MathType): MathJsChain<MathType>

    /**
     * Inverse the sign of a value, apply a unary minus operation. For
     * matrices, the function is evaluated element wise. Boolean values and
     * strings will be converted to a number. For complex numbers, both real
     * and complex value are inverted.
     */

    unaryMinus(this: MathJsChain<number>): MathJsChain<number>
    unaryMinus(this: MathJsChain<BigNumber>): MathJsChain<BigNumber>
    unaryMinus(this: MathJsChain<Fraction>): MathJsChain<Fraction>
    unaryMinus(this: MathJsChain<Complex>): MathJsChain<Complex>
    unaryMinus(this: MathJsChain<MathArray>): MathJsChain<MathArray>
    unaryMinus(this: MathJsChain<Matrix>): MathJsChain<Matrix>
    unaryMinus(this: MathJsChain<Unit>): MathJsChain<Unit>

    /**
     * Unary plus operation. Boolean values and strings will be converted to
     * a number, numeric values will be returned as is. For matrices, the
     * function is evaluated element wise.
     */

    unaryPlus(this: MathJsChain<number>): MathJsChain<number>
    unaryPlus(this: MathJsChain<BigNumber>): MathJsChain<BigNumber>
    unaryPlus(this: MathJsChain<Fraction>): MathJsChain<Fraction>
    unaryPlus(this: MathJsChain<string>): MathJsChain<string>
    unaryPlus(this: MathJsChain<Complex>): MathJsChain<Complex>
    unaryPlus(this: MathJsChain<MathArray>): MathJsChain<MathArray>
    unaryPlus(this: MathJsChain<Matrix>): MathJsChain<Matrix>
    unaryPlus(this: MathJsChain<Unit>): MathJsChain<Unit>

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
    bitAnd<T extends number | BigNumber | MathCollection>(
      this: MathJsChain<T>,
      y: number | BigNumber | MathCollection
    ): MathJsChain<NoLiteralType<T>>

    /**
     * Bitwise NOT value, ~x. For matrices, the function is evaluated
     * element wise. For units, the function is evaluated on the best prefix
     * base.
     */

    bitNot(this: MathJsChain<number>): MathJsChain<number>
    bitNot(this: MathJsChain<BigNumber>): MathJsChain<BigNumber>
    bitNot(this: MathJsChain<MathArray>): MathJsChain<MathArray>
    bitNot(this: MathJsChain<Matrix>): MathJsChain<Matrix>

    /**
     * Bitwise OR two values, x | y. For matrices, the function is evaluated
     * element wise. For units, the function is evaluated on the lowest
     * print base.
     * @param y Second value to or
     */
    bitOr(this: MathJsChain<number>, y: number): MathJsChain<number>
    bitOr(this: MathJsChain<BigNumber>, y: BigNumber): MathJsChain<BigNumber>
    bitOr(this: MathJsChain<MathArray>, y: MathArray): MathJsChain<MathArray>
    bitOr(this: MathJsChain<Matrix>, y: Matrix): MathJsChain<Matrix>

    /**
     * Bitwise XOR two values, x ^ y. For matrices, the function is
     * evaluated element wise.
     * @param y Second value to xor
     */
    bitXor<T extends number | BigNumber | MathCollection>(
      this: MathJsChain<T>,
      y: number | BigNumber | MathCollection
    ): MathJsChain<NoLiteralType<T>>

    /**
     * Bitwise left logical shift of a value x by y number of bits, x << y.
     * For matrices, the function is evaluated element wise. For units, the
     * function is evaluated on the best prefix base.
     * @param y Amount of shifts
     */
    leftShift<T extends number | BigNumber | MathCollection>(
      this: MathJsChain<T>,
      y: number | BigNumber
    ): MathJsChain<NoLiteralType<T>>

    /**
     * Bitwise right arithmetic shift of a value x by y number of bits, x >>
     * y. For matrices, the function is evaluated element wise. For units,
     * the function is evaluated on the best prefix base.
     * @param y Amount of shifts
     */
    rightArithShift<T extends number | BigNumber | MathCollection>(
      this: MathJsChain<T>,
      y: number | BigNumber
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
      z: MathCollection
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
      this: MathJsChain<number | BigNumber | Complex | Unit | MathCollection>,
      y: number | BigNumber | Complex | Unit | MathCollection
    ): MathJsChain<boolean | MathCollection>

    /**
     * Logical not. Flips boolean value of a given parameter. For matrices,
     * the function is evaluated element wise.
     */
    not(
      this: MathJsChain<number | BigNumber | Complex | Unit | MathCollection>
    ): MathJsChain<boolean | MathCollection>

    /**
     * Logical or. Test if at least one value is defined with a
     * nonzero/nonempty value. For matrices, the function is evaluated
     * element wise.
     * @param y Second value to or
     */
    or(
      this: MathJsChain<number | BigNumber | Complex | Unit | MathCollection>,
      y: number | BigNumber | Complex | Unit | MathCollection
    ): MathJsChain<boolean | MathCollection>

    /**
     * Logical xor. Test whether one and only one value is defined with a
     * nonzero/nonempty value. For matrices, the function is evaluated
     * element wise.
     * @param y Second value to xor
     */
    xor(
      this: MathJsChain<number | BigNumber | Complex | Unit | MathCollection>,
      y: number | BigNumber | Complex | Unit | MathCollection
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
    ): MathJsChain<Matrix | MathArray>

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
    diag(
      this: MathJsChain<MathCollection>,
      format?: string
    ): MathJsChain<Matrix>
    diag(
      this: MathJsChain<MathCollection>,
      k: number | BigNumber,
      format?: string
    ): MathJsChain<Matrix | MathArray>

    /**
     * Calculate the dot product of two vectors. The dot product of A = [a1,
     * a2, a3, ..., an] and B = [b1, b2, b3, ..., bn] is defined as: dot(A,
     * B) = a1 * b1 + a2 * b2 + a3 * b3 + ... + an * bn
     * @param y Second vector
     */
    dot(
      this: MathJsChain<MathCollection>,
      y: MathCollection
    ): MathJsChain<number>

    /**
     * Compute the matrix exponential, expm(A) = e^A. The matrix must be
     * square. Not to be confused with exp(a), which performs element-wise
     * exponentiation. The exponential is calculated using the Padé
     * approximant with scaling and squaring; see “Nineteen Dubious Ways to
     * Compute the Exponential of a Matrix,” by Moler and Van Loan.
     */

    expm(this: MathJsChain<Matrix>): MathJsChain<Matrix>

    /**
     * Create a 2-dimensional identity matrix with size m x n or n x n. The
     * matrix has ones on the diagonal and zeros elsewhere.
     * @param format The Matrix storage format
     */
    identity(
      this: MathJsChain<number | number[] | Matrix | MathArray>,
      format?: string
    ): MathJsChain<Matrix | MathArray | number>

    /**
     * @param n The y dimension for the matrix
     * @param format The Matrix storage format
     */
    identity(
      this: MathJsChain<number>,
      n: number,
      format?: string
    ): MathJsChain<Matrix | MathArray | number>

    /**
     * Filter the items in an array or one dimensional matrix.
     */
    filter(
      this: MathJsChain<Matrix | MathArray | string[]>,
      test:
        | ((
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            value: any,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            index: any,
            matrix: Matrix | MathArray | string[]
          ) => boolean)
        | RegExp
    ): MathJsChain<Matrix | MathArray>

    /**
     * Flatten a multi dimensional matrix into a single dimensional matrix.
     */

    flatten<T extends MathCollection>(x: MathJsChain<T>): MathJsChain<T>

    /**
     * Iterate over all elements of a matrix/array, and executes the given
     * callback function.
     */
    forEach<T extends Matrix | MathArray>(
      this: MathJsChain<T>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      callback: (value: any, index: any, matrix: T) => void
    ): MathJsChain<T>

    /**
     * Calculate the inverse of a square matrix.
     */

    inv<T extends number | Complex | MathCollection>(
      this: MathJsChain<T>
    ): MathJsChain<NoLiteralType<T>>

    /**
     * Calculate the kronecker product of two matrices or vectors
     * @param y Second vector
     */
    kron(
      this: MathJsChain<Matrix | MathArray>,
      y: Matrix | MathArray
    ): MathJsChain<Matrix>

    /**
     * Iterate over all elements of a matrix/array, and executes the given
     * callback function.
     * @param callback The callback function is invoked with three
     * parameters: the value of the element, the index of the element, and
     * the Matrix/array being traversed.
     */
    map<T extends Matrix | MathArray>(
      this: MathJsChain<T>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      callback: (value: any, index: any, matrix: T) => MathType | string
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
      this: MathJsChain<number | BigNumber>,
      end: number | BigNumber,
      step: number | BigNumber,
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
    sort<T extends Matrix | MathArray>(
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
    pickRandom(
      array: MathJsChain<number[]>,
      number?: number,
      weights?: number[]
    ): MathJsChain<number | number[]>

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
     * between x and y is smaller than the configured epsilon. The function
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
    deepEqual(
      this: MathJsChain<MathType>,
      y: MathType
    ): MathJsChain<
      number | BigNumber | Fraction | Complex | Unit | MathCollection
    >

    /**
     * Test whether two values are equal.
     *
     * The function tests whether the relative difference between x and y is
     * smaller than the configured epsilon. The function cannot be used to
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
     * larger than the configured epsilon. The function cannot be used to
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
     * y is smaller than the configured epsilon. The function cannot be used
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
     * is smaller than the configured epsilon. The function cannot be used
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
     * and y is smaller than the configured epsilon. The function cannot be
     * used to compare values smaller than approximately 2.22e-16. For
     * matrices, the function is evaluated element wise.
     * @param y Second value to compare
     */
    smallerEq(
      this: MathJsChain<MathType | string>,
      y: MathType | string
    ): MathJsChain<boolean | MathCollection>

    /**
     * Test whether two values are unequal. The function tests whether the
     * relative difference between x and y is larger than the configured
     * epsilon. The function cannot be used to compare values smaller than
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
      e: MathJsChain<number | BigNumber | Fraction | Complex>,
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
     * Special functions
     ************************************************************************/

    /**
     * Compute the erf function of a value using a rational Chebyshev
     * approximations for different intervals of x.
     */
    erf<T extends number | MathCollection>(
      this: MathJsChain<T>
    ): MathJsChain<NoLiteralType<T>>

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
     * Compute the maximum value of a matrix or a list of values. In case of
     * a multi dimensional array, the maximum of the flattened array will be
     * calculated. When dim is provided, the maximum over the selected
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

    acos(this: MathJsChain<number>): MathJsChain<number>
    acos(this: MathJsChain<BigNumber>): MathJsChain<BigNumber>
    acos(this: MathJsChain<Complex>): MathJsChain<Complex>
    acos(this: MathJsChain<MathArray>): MathJsChain<MathArray>
    acos(this: MathJsChain<Matrix>): MathJsChain<Matrix>

    /**
     * Calculate the hyperbolic arccos of a value, defined as acosh(x) =
     * ln(sqrt(x^2 - 1) + x). For matrices, the function is evaluated
     * element wise.
     */

    acosh(this: MathJsChain<number>): MathJsChain<number>
    acosh(this: MathJsChain<BigNumber>): MathJsChain<BigNumber>
    acosh(this: MathJsChain<Complex>): MathJsChain<Complex>
    acosh(this: MathJsChain<MathArray>): MathJsChain<MathArray>
    acosh(this: MathJsChain<Matrix>): MathJsChain<Matrix>

    /**
     * Calculate the inverse cotangent of a value. For matrices, the
     * function is evaluated element wise.
     */

    acot(this: MathJsChain<number>): MathJsChain<number>
    acot(this: MathJsChain<BigNumber>): MathJsChain<BigNumber>
    acot(this: MathJsChain<MathArray>): MathJsChain<MathArray>
    acot(this: MathJsChain<Matrix>): MathJsChain<Matrix>

    /**
     * Calculate the hyperbolic arccotangent of a value, defined as acoth(x)
     * = (ln((x+1)/x) + ln(x/(x-1))) / 2. For matrices, the function is
     * evaluated element wise.
     */

    acoth(this: MathJsChain<number>): MathJsChain<number>
    acoth(this: MathJsChain<BigNumber>): MathJsChain<BigNumber>
    acoth(this: MathJsChain<MathArray>): MathJsChain<MathArray>
    acoth(this: MathJsChain<Matrix>): MathJsChain<Matrix>

    /**
     * Calculate the inverse cosecant of a value. For matrices, the function
     * is evaluated element wise.
     */

    acsc(this: MathJsChain<number>): MathJsChain<number>
    acsc(this: MathJsChain<BigNumber>): MathJsChain<BigNumber>
    acsc(this: MathJsChain<MathArray>): MathJsChain<MathArray>
    acsc(this: MathJsChain<Matrix>): MathJsChain<Matrix>

    /**
     * Calculate the hyperbolic arccosecant of a value, defined as acsch(x)
     * = ln(1/x + sqrt(1/x^2 + 1)). For matrices, the function is evaluated
     * element wise.
     */

    acsch(this: MathJsChain<number>): MathJsChain<number>
    acsch(this: MathJsChain<BigNumber>): MathJsChain<BigNumber>
    acsch(this: MathJsChain<MathArray>): MathJsChain<MathArray>
    acsch(this: MathJsChain<Matrix>): MathJsChain<Matrix>

    /**
     * Calculate the inverse secant of a value. For matrices, the function
     * is evaluated element wise.
     */

    asec(this: MathJsChain<number>): MathJsChain<number>
    asec(this: MathJsChain<BigNumber>): MathJsChain<BigNumber>
    asec(this: MathJsChain<MathArray>): MathJsChain<MathArray>
    asec(this: MathJsChain<Matrix>): MathJsChain<Matrix>

    /**
     * Calculate the hyperbolic arcsecant of a value, defined as asech(x) =
     * ln(sqrt(1/x^2 - 1) + 1/x). For matrices, the function is evaluated
     * element wise.
     */

    asech(this: MathJsChain<number>): MathJsChain<number>
    asech(this: MathJsChain<BigNumber>): MathJsChain<BigNumber>
    asech(this: MathJsChain<MathArray>): MathJsChain<MathArray>
    asech(this: MathJsChain<Matrix>): MathJsChain<Matrix>

    /**
     * Calculate the inverse sine of a value. For matrices, the function is
     * evaluated element wise.
     */

    asin(this: MathJsChain<number>): MathJsChain<number>
    asin(this: MathJsChain<BigNumber>): MathJsChain<BigNumber>
    asin(this: MathJsChain<Complex>): MathJsChain<Complex>
    asin(this: MathJsChain<MathArray>): MathJsChain<MathArray>
    asin(this: MathJsChain<Matrix>): MathJsChain<Matrix>

    /**
     * Calculate the hyperbolic arcsine of a value, defined as asinh(x) =
     * ln(x + sqrt(x^2 + 1)). For matrices, the function is evaluated
     * element wise.
     */

    asinh(this: MathJsChain<number>): MathJsChain<number>
    asinh(this: MathJsChain<BigNumber>): MathJsChain<BigNumber>
    asinh(this: MathJsChain<MathArray>): MathJsChain<MathArray>
    asinh(this: MathJsChain<Matrix>): MathJsChain<Matrix>

    /**
     * Calculate the inverse tangent of a value. For matrices, the function
     * is evaluated element wise.
     */

    atan(this: MathJsChain<number>): MathJsChain<number>
    atan(this: MathJsChain<BigNumber>): MathJsChain<BigNumber>
    atan(this: MathJsChain<MathArray>): MathJsChain<MathArray>
    atan(this: MathJsChain<Matrix>): MathJsChain<Matrix>

    /**
     * Calculate the inverse tangent function with two arguments, y/x. By
     * providing two arguments, the right quadrant of the computed angle can
     * be determined. For matrices, the function is evaluated element wise.
     */

    atan2(this: MathJsChain<number>, x: number): MathJsChain<number>
    atan2(
      this: MathJsChain<MathCollection>,
      x: MathCollection
    ): MathJsChain<MathCollection>

    /**
     * Calculate the hyperbolic arctangent of a value, defined as atanh(x) =
     * ln((1 + x)/(1 - x)) / 2. For matrices, the function is evaluated
     * element wise.
     */

    atanh(this: MathJsChain<number>): MathJsChain<number>
    atanh(this: MathJsChain<BigNumber>): MathJsChain<BigNumber>
    atanh(this: MathJsChain<MathArray>): MathJsChain<MathArray>
    atanh(this: MathJsChain<Matrix>): MathJsChain<Matrix>

    /**
     * Calculate the cosine of a value. For matrices, the function is
     * evaluated element wise.
     */

    cos(this: MathJsChain<number | Unit>): MathJsChain<number>
    cos(this: MathJsChain<BigNumber>): MathJsChain<BigNumber>
    cos(this: MathJsChain<Complex>): MathJsChain<Complex>
    cos(this: MathJsChain<MathArray>): MathJsChain<MathArray>
    cos(this: MathJsChain<Matrix>): MathJsChain<Matrix>

    /**
     * Calculate the hyperbolic cosine of a value, defined as cosh(x) = 1/2
     * * (exp(x) + exp(-x)). For matrices, the function is evaluated element
     * wise.
     */

    cosh(this: MathJsChain<number | Unit>): MathJsChain<number>
    cosh(this: MathJsChain<BigNumber>): MathJsChain<BigNumber>
    cosh(this: MathJsChain<Complex>): MathJsChain<Complex>
    cosh(this: MathJsChain<MathArray>): MathJsChain<MathArray>
    cosh(this: MathJsChain<Matrix>): MathJsChain<Matrix>

    /**
     * Calculate the cotangent of a value. cot(x) is defined as 1 / tan(x).
     * For matrices, the function is evaluated element wise.
     */

    cot(this: MathJsChain<number | Unit>): MathJsChain<number>
    cot(this: MathJsChain<Complex>): MathJsChain<Complex>
    cot(this: MathJsChain<MathArray>): MathJsChain<MathArray>
    cot(this: MathJsChain<Matrix>): MathJsChain<Matrix>

    /**
     * Calculate the hyperbolic cotangent of a value, defined as coth(x) = 1
     * / tanh(x). For matrices, the function is evaluated element wise.
     */

    coth(this: MathJsChain<number | Unit>): MathJsChain<number>
    coth(this: MathJsChain<Complex>): MathJsChain<Complex>
    coth(this: MathJsChain<MathArray>): MathJsChain<MathArray>
    coth(this: MathJsChain<Matrix>): MathJsChain<Matrix>

    /**
     * Calculate the cosecant of a value, defined as csc(x) = 1/sin(x). For
     * matrices, the function is evaluated element wise.
     */

    csc(this: MathJsChain<number | Unit>): MathJsChain<number>
    csc(this: MathJsChain<Complex>): MathJsChain<Complex>
    csc(this: MathJsChain<MathArray>): MathJsChain<MathArray>
    csc(this: MathJsChain<Matrix>): MathJsChain<Matrix>

    /**
     * Calculate the hyperbolic cosecant of a value, defined as csch(x) = 1
     * / sinh(x). For matrices, the function is evaluated element wise.
     */

    csch(this: MathJsChain<number | Unit>): MathJsChain<number>
    csch(this: MathJsChain<Complex>): MathJsChain<Complex>
    csch(this: MathJsChain<MathArray>): MathJsChain<MathArray>
    csch(this: MathJsChain<Matrix>): MathJsChain<Matrix>

    /**
     * Calculate the secant of a value, defined as sec(x) = 1/cos(x). For
     * matrices, the function is evaluated element wise.
     */

    sec(this: MathJsChain<number | Unit>): MathJsChain<number>
    sec(this: MathJsChain<Complex>): MathJsChain<Complex>
    sec(this: MathJsChain<MathArray>): MathJsChain<MathArray>
    sec(this: MathJsChain<Matrix>): MathJsChain<Matrix>

    /**
     * Calculate the hyperbolic secant of a value, defined as sech(x) = 1 /
     * cosh(x). For matrices, the function is evaluated element wise.
     */

    sech(this: MathJsChain<number | Unit>): MathJsChain<number>
    sech(this: MathJsChain<Complex>): MathJsChain<Complex>
    sech(this: MathJsChain<MathArray>): MathJsChain<MathArray>
    sech(this: MathJsChain<Matrix>): MathJsChain<Matrix>

    /**
     * Calculate the sine of a value. For matrices, the function is
     * evaluated element wise.
     */

    sin(this: MathJsChain<number | Unit>): MathJsChain<number>
    sin(this: MathJsChain<BigNumber>): MathJsChain<BigNumber>
    sin(this: MathJsChain<Complex>): MathJsChain<Complex>
    sin(this: MathJsChain<MathArray>): MathJsChain<MathArray>
    sin(this: MathJsChain<Matrix>): MathJsChain<Matrix>

    /**
     * Calculate the hyperbolic sine of a value, defined as sinh(x) = 1/2 *
     * (exp(x) - exp(-x)). For matrices, the function is evaluated element
     * wise.
     */

    sinh(this: MathJsChain<number | Unit>): MathJsChain<number>
    sinh(this: MathJsChain<BigNumber>): MathJsChain<BigNumber>
    sinh(this: MathJsChain<Complex>): MathJsChain<Complex>
    sinh(this: MathJsChain<MathArray>): MathJsChain<MathArray>
    sinh(this: MathJsChain<Matrix>): MathJsChain<Matrix>

    /**
     * Calculate the tangent of a value. tan(x) is equal to sin(x) / cos(x).
     * For matrices, the function is evaluated element wise.
     */

    tan(this: MathJsChain<number | Unit>): MathJsChain<number>
    tan(this: MathJsChain<BigNumber>): MathJsChain<BigNumber>
    tan(this: MathJsChain<Complex>): MathJsChain<Complex>
    tan(this: MathJsChain<MathArray>): MathJsChain<MathArray>
    tan(this: MathJsChain<Matrix>): MathJsChain<Matrix>

    /**
     * Calculate the hyperbolic tangent of a value, defined as tanh(x) =
     * (exp(2 * x) - 1) / (exp(2 * x) + 1). For matrices, the function is
     * evaluated element wise.
     */

    tanh(this: MathJsChain<number | Unit>): MathJsChain<number>
    tanh(this: MathJsChain<BigNumber>): MathJsChain<BigNumber>
    tanh(this: MathJsChain<Complex>): MathJsChain<Complex>
    tanh(this: MathJsChain<MathArray>): MathJsChain<MathArray>
    tanh(this: MathJsChain<Matrix>): MathJsChain<Matrix>

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
      this: MathJsChain<number | BigNumber | Fraction | MathCollection>
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
     * Test whether a value is an numeric value. The function is evaluated
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
      this: MathJsChain<number | BigNumber | Fraction | MathCollection | Unit>
    ): MathJsChain<boolean>

    /**
     * Test whether a value is prime: has no divisors other than itself and
     * one. The function supports type number, bignumber. The function is
     * evaluated element-wise in case of Array or Matrix input.
     */

    isPrime(
      this: MathJsChain<number | BigNumber | MathCollection>
    ): MathJsChain<boolean>

    /**
     * Test whether a value is zero. The function can check for zero for
     * types number, BigNumber, Fraction, Complex, and Unit. The function is
     * evaluated element-wise in case of Array or Matrix input.
     */

    isZero(
      this: MathJsChain<
        number | BigNumber | Fraction | MathCollection | Unit | Complex
      >
    ): MathJsChain<boolean>

    /**
     * Determine the type of a variable.
     */

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeOf(this: MathJsChain<any>): MathJsChain<string>
  }

  interface ImportOptions {
    override?: boolean
    silent?: boolean
    wrap?: boolean
  }

  interface ImportObject {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  }
}
