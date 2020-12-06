import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
import { embeddedDocs } from '../../../../src/expression/embeddedDocs/embeddedDocs.js'

describe('help', function () {
  it('should find documentation for a function by its name', function () {
    const help = math.help('sin')
    assert.ok(help instanceof math.Help)
    assert.deepStrictEqual(help.doc, embeddedDocs.sin)
  })

  it('should find documentation for a function by the function itself', function () {
    const help = math.help(math.sin)
    assert.ok(help instanceof math.Help)
    assert.deepStrictEqual(help.doc, embeddedDocs.sin)
  })

  it('should throw an error on wrong number of arguments', function () {
    assert.throws(function () { math.help() }, /TypeError: Too few arguments/)
    assert.throws(function () { math.help('sin', 2) }, /TypeError: Too many arguments/)
  })

  it('should find help from a function name', function () {
    const help = math.help('sin')
    assert(help instanceof math.Help)
    assert.strictEqual(help.doc.name, 'sin')
  })

  it('should find help from a function', function () {
    const help = math.help(math.sin)
    assert(help instanceof math.Help)
    assert.strictEqual(help.doc.name, 'sin')
  })

  it('should find help from a constant name', function () {
    const help = math.help('pi')
    assert(help instanceof math.Help)
    assert.strictEqual(help.doc.name, 'pi')
  })

  it('should find help from a constant', function () {
    const help = math.help(math.pi)
    assert(help instanceof math.Help)
    assert.strictEqual(help.doc.name, 'pi')
  })

  it('should not allow accessing unsafe properties ', function () {
    assert.throws(function () { math.help('constructor') }, /No access/)
  })

  it('should throw an error when no help is found', function () {
    // assert.throws(function () {math.help(undefined)}, /No documentation found/);
    assert.throws(function () { math.help(new Date()) }, /No documentation found/)
    assert.throws(function () { math.help('nonExistingFunction') }, /No documentation found/)
    assert.throws(function () { math.help('parse') }, /No documentation found/)
  })

  it('should LaTeX help', function () {
    const expression = math.parse('help(parse)')
    assert.strictEqual(expression.toTex(), '\\mathrm{help}\\left( parse\\right)')
  })
})

describe('createDocs', function () {
  it('should throw an error on wrong number of arguments', function () {
    assert.throws(function () { math.createDocs() }, /TypeError: Too few arguments/)
    assert.throws(function () { math.createDocs({}, 2) }, /TypeError: Too many arguments/)
  })

  it('should throw an error if documentation already exists', function () {
    assert.throws(function () { math.createDocs({ name: 'sin', category: 'any', syntax: [], description: '' }) },
      /Error: Documentation for "sin" already exists/)
    assert.throws(function () { math.createDocs({ name: '', category: 'any', syntax: [], description: '' }) },
      /Error: Help Entry must be in correct format/)
  })

  it('should create documentation for a function by its name', function () {
    const mymath = math.create()
    const newEntry = {
      name: 'myfunction',
      category: 'custom',
      syntax: ['myfunction()'],
      description: 'My awesome function',
      examples: [],
      seealso: []
    }
    mymath.createDocs(newEntry)
    const help = mymath.help('myfunction')
    assert.ok(help instanceof mymath.Help)
    assert.deepStrictEqual(help.doc, newEntry)
  })

  it('should find help from a function', function () {
    const mymath = math.create()
    mymath.import({
      area: function (x, y) {
        return x * y
      }
    })
    const newEntry = {
      name: 'area',
      category: 'Utils',
      syntax: ['area()'],
      description: 'My area function',
      examples: [],
      seealso: []
    }
    mymath.createDocs(newEntry)
    const help = mymath.help(mymath.area)
    assert(help instanceof mymath.Help)
    assert.deepStrictEqual(help.doc, newEntry)
  })

  it('should remove superfluous keys from provided help entry', function () {
    const mymath = math.create()
    const newEntry = {
      name: 'area',
      category: 'Utils',
      syntax: ['area()'],
      description: 'My area function',
      examples: [],
      seealso: [],
      aKey: 'something'
    }
    mymath.createDocs(newEntry)
    const help = mymath.help('area')
    assert(help instanceof mymath.Help)
    assert(help.doc.aKey === undefined)
  })

  it('should throw error if provided help entry has missing manadatory fields', function () {
    const mymath = math.create()
    const newEntry = {
      name: 'area',
      category: 'Utils',
      description: 'My area function'
    }
    assert.throws(function () { mymath.createDocs(newEntry) },
      /Error: Help Entry must be in correct format/)
  })

  it('should throw error if provided help entry has fields of incorrect type', function () {
    const mymath = math.create()
    const newEntry = {
      name: 'area',
      category: 'Utils',
      syntax: 'area()',
      description: 'My area function'
    }
    assert.throws(function () { mymath.createDocs(newEntry) },
      /Error: Help Entry must be in correct format/)
  })

  it('should create separate documentations for different mathjs instances', function () {
    const mymath = math.create()
    const newEntry = {
      name: 'myfunction',
      category: 'custom',
      syntax: ['myfunction()'],
      description: 'My awesome function',
      examples: [],
      seealso: []
    }
    mymath.createDocs(newEntry)
    const help = mymath.help('myfunction')
    assert.ok(help instanceof mymath.Help)

    const anothermath = math.create()
    assert.throws(function () { anothermath.help('myfunction') },
      /Error: No documentation found/)
  })

  it('should throw an error if creating the documentation twice for the same function', function () {
    const mymath = math.create()
    const newEntry = {
      name: 'myfunction',
      category: 'custom',
      syntax: ['myfunction()'],
      description: 'My awesome function',
      examples: [],
      seealso: []
    }
    mymath.createDocs(newEntry)
    const help = mymath.help('myfunction')
    assert.ok(help instanceof mymath.Help)
    assert.throws(function () { mymath.createDocs(newEntry) },
      /Error: Documentation for "myfunction" already exists/)
  })

  it('should throw an error if trying to create a documentation entry for a mathjs function', function () {
    const mymath = math.create()
    const sinEntry = {
      name: 'sin',
      category: 'custom',
      syntax: ['sin()'],
      description: 'Trying to update sin help',
      examples: [],
      seealso: []
    }
    assert.throws(function () { mymath.createDocs(sinEntry) },
      /Error: Documentation for "sin" already exists/)
  })

  it('should LaTeX createDocs', function () {
    const expression = math.parse('createDocs({})')
    assert.strictEqual(expression.toTex(), '\\mathrm{createDocs}\\left(\\left\\{\\begin{array}{ll}\\end{array}\\right\\}\\right)')
  })
})
