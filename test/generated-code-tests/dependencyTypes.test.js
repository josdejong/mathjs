import assert from 'assert'
import { readFileSync } from 'node:fs'
import ts from 'typescript'
import * as math from '../../src/entry/mainAny.js'

describe('dependency types', function () {
  it('should only declare dependency bundles that are exported', function () {
    const source = ts.createSourceFile(
      'index.d.ts',
      readFileSync(new URL('../../types/index.d.ts', import.meta.url), 'utf8'),
      ts.ScriptTarget.Latest
    )
    const names = []

    for (const statement of source.statements) {
      if (!ts.isVariableStatement(statement) ||
          !statement.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword)) {
        continue
      }
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isObjectBindingPattern(declaration.name)) {
          for (const element of declaration.name.elements) {
            if (ts.isIdentifier(element.name) && element.name.text.endsWith('Dependencies')) {
              names.push(element.name.text)
            }
          }
        }
      }
    }

    assert.ok(names.length > 0, 'Expected dependency declarations in index.d.ts')
    assert.deepStrictEqual(names.filter(name => !Object.hasOwn(math, name)), [])
  })
})
