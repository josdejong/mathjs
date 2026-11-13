/// <reference types="node" />
// Checks that every property of a mathjs instance created with create(all)
// is declared as a member of the MathJsInstance interface in types/index.d.ts.
// The check uses the TypeScript compiler API, so a name that only appears in
// a comment or in another interface does not count as declared.
import * as assert from 'assert'
import { fileURLToPath } from 'url'
import ts from 'typescript'
import { all, create } from 'mathjs'

const declarationFile = fileURLToPath(
  new URL('../../types/index.d.ts', import.meta.url)
)

// Properties of a mathjs instance that are not yet declared on MathJsInstance.
// Remove names from this list when their declarations are added.
const knownUndeclared = new Set<string>([
  // event emitter methods
  'on',
  'off',
  'once',
  'emit',
  // functions
  'bin',
  'combinationsWithRep',
  'hex',
  'invmod',
  'lsolveAll',
  'oct',
  'solveODE',
  'usolveAll',
  // scalar variants of functions
  'addScalar',
  'divideScalar',
  'equalScalar',
  'multiplyScalar',
  'subtractScalar',
  // classes
  'BigNumber',
  'Chain',
  'Complex',
  'DenseMatrix',
  'FibonacciHeap',
  'Fraction',
  'Help',
  'ImmutableDenseMatrix',
  'Index',
  'Parser',
  'Range',
  'ResultSet',
  'Spa',
  'SparseMatrix',
  // error classes
  'ArgumentsError',
  'DimensionError',
  'IndexError',
  // constants
  'coulombConstant',
  'E',
  'false',
  'null',
  'PI',
  'true'
])

function getInterfaceMembers(fileName: string, interfaceName: string) {
  const program = ts.createProgram([fileName], { noEmit: true })
  const checker = program.getTypeChecker()
  const moduleSymbol = checker.getSymbolAtLocation(
    program.getSourceFile(fileName)
  )
  const interfaceSymbol = checker
    .getExportsOfModule(moduleSymbol)
    .find((symbol) => symbol.getName() === interfaceName)
  assert.ok(interfaceSymbol, `${interfaceName} not found in ${fileName}`)

  const interfaceType = checker.getDeclaredTypeOfSymbol(interfaceSymbol)
  return new Set(
    checker.getPropertiesOfType(interfaceType).map((prop) => prop.getName())
  )
}

const declared = getInterfaceMembers(declarationFile, 'MathJsInstance')
const undeclared = Object.keys(create(all)).filter(
  (name) => !declared.has(name) && !knownUndeclared.has(name)
)

assert.deepStrictEqual(
  undeclared,
  [],
  'Properties of a mathjs instance missing from the MathJsInstance interface ' +
    `in types/index.d.ts: ${undeclared.join(', ')}`
)
