import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { approxEqual } from '../../tools/approx.js'
import { create, all } from '../../lib/esm/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const math = create(all)

describe('table of physical constants in the docs', function () {
  it('should match the values in the code', function () {
    const section = fs.readFileSync(path.resolve(__dirname, '../../docs/datatypes/units.md'), 'utf8')
      .split('### Physical Constants')[1]
      .split(/\n#{2,3} /)[0]
      .replace(/<!--[\s\S]*?-->/g, '') // skip the commented-out rows

    const rows = section.split('\n')
      .map(line => line.split('|').map(cell => cell.trim()))
      .filter(cells => cells.length === 4 && cells[2] !== '' && !isNaN(Number(cells[2])))

    assert(rows.length > 40, 'the table should be found')
    for (const [name, , value] of rows) {
      const constant = math[name]
      let actual
      if (typeof constant === 'number') {
        actual = constant // dimensionless constants such as fineStructure
      } else if (constant !== undefined) {
        actual = constant.toNumber()
      } else {
        // adopted values such as atm are units, not constants
        assert(math.Unit.isValuelessUnit(name), `${name} should be a physical constant or a unit`)
        actual = math.unit(1, name).toSI().toNumber()
      }
      approxEqual(Number(value), actual, 1e-12)
    }
  })
})
