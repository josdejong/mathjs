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

  it('should not alter the mathjs instance when stringifying help', function () {
    const config = math.config()
    const str = math.help(math.config).toString()
    assert(str.includes('number: "Fraction"'))
    assert.deepStrictEqual(math.config(), config)
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
