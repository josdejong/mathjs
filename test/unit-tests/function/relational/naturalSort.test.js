import assert from 'assert'
import { naturalSort } from '../../../../src/function/relational/naturalSort.js'

// Helper: sort an array using naturalSort and return the result
function sorted (arr) {
  return arr.slice().sort(naturalSort)
}

describe('naturalSort', function () {
  it('should return 0 for identical strings', function () {
    assert.strictEqual(naturalSort('a', 'a'), 0)
  })

  // Simple string comparisons
  it('should sort simple strings', function () {
    assert.deepStrictEqual(sorted(['b', 'a', 'c']), ['a', 'b', 'c'])
  })

  // Different value types
  it('should sort numeric strings and numbers', function () {
    assert.deepStrictEqual(sorted([2, 10, 1]), [1, 2, 10])
    assert.deepStrictEqual(sorted(['10', 9, 2, '1', '4']), ['1', 2, '4', 9, '10'])
  })

  it('should sort numeric strings with padding', function () {
    assert.deepStrictEqual(
      sorted(['0001', '002', '001']),
      ['0001', '001', '002']
    )
  })

  // DateTime sorting
  it('should sort dates in MM/DD/YYYY format', function () {
    assert.deepStrictEqual(
      sorted(['10/12/2008', '10/11/2008', '10/11/2007', '10/12/2007']),
      ['10/11/2007', '10/12/2007', '10/11/2008', '10/12/2008']
    )
  })

  it('should sort dates in YYYY/MM/DD format', function () {
    assert.deepStrictEqual(
      sorted(['2008/10/12', '2008/10/11', '2007/10/12', '2007/10/11']),
      ['2007/10/11', '2007/10/12', '2008/10/11', '2008/10/12']
    )
  })

  it('should sort JavaScript toString() dates', function () {
    assert.deepStrictEqual(
      sorted([
        'Wed Jan 01 2010 00:00:00 GMT-0800 (Pacific Standard Time)',
        'Thu Dec 25 2008 00:00:00 GMT-0800 (Pacific Standard Time)',
        'Wed Jan 01 2008 00:00:00 GMT-0800 (Pacific Standard Time)'
      ]),
      [
        'Wed Jan 01 2008 00:00:00 GMT-0800 (Pacific Standard Time)',
        'Thu Dec 25 2008 00:00:00 GMT-0800 (Pacific Standard Time)',
        'Wed Jan 01 2010 00:00:00 GMT-0800 (Pacific Standard Time)'
      ]
    )
  })

  // Version numbers
  it('should sort version number strings', function () {
    assert.deepStrictEqual(
      sorted(['1.0.2', '1.0.1', '1.0.0', '1.0.9']),
      ['1.0.0', '1.0.1', '1.0.2', '1.0.9']
    )
  })

  it('should sort version numbers with alpha/beta', function () {
    assert.deepStrictEqual(
      sorted(['1.1.100', '1.1.1', '1.1.10', '1.1.54']),
      ['1.1.1', '1.1.10', '1.1.54', '1.1.100']
    )
  })

  it('should sort prefixed version numbers', function () {
    assert.deepStrictEqual(
      sorted(['v1.1', 'v1.2', 'v1.0']),
      ['v1.0', 'v1.1', 'v1.2']
    )
  })

  // Numeric comparisons
  it('should sort floats', function () {
    assert.deepStrictEqual(
      sorted([1, 1.1, 1.01, 1.001]),
      [1, 1.001, 1.01, 1.1]
    )
  })

  it('should sort scientific notation', function () {
    assert.deepStrictEqual(
      sorted(['1.528535047e5', '1.528535047e7', '1.528535047e3']),
      ['1.528535047e3', '1.528535047e5', '1.528535047e7']
    )
  })

  it('should sort negative numbers', function () {
    assert.deepStrictEqual(
      sorted([-1, -2, -10, -100]),
      [-100, -10, -2, -1]
    )
  })

  it('should sort negative floats', function () {
    assert.deepStrictEqual(
      sorted([-2.01, -2.1, -2.001]),
      [-2.1, -2.01, -2.001]
    )
  })

  // IP addresses
  it('should sort IP addresses', function () {
    assert.deepStrictEqual(
      sorted(['192.168.0.100', '192.168.0.1', '192.168.1.1']),
      ['192.168.0.1', '192.168.0.100', '192.168.1.1']
    )
  })

  // Filenames
  it('should sort filenames with numbers', function () {
    assert.deepStrictEqual(
      sorted(['img12.png', 'img10.png', 'img2.png', 'img1.png']),
      ['img1.png', 'img2.png', 'img10.png', 'img12.png']
    )
  })

  it('should sort filenames with complex names', function () {
    assert.deepStrictEqual(
      sorted(['car.mov', '01alpha.syi', '001alpha.syi', '1alpha.syi']),
      ['001alpha.syi', '01alpha.syi', '1alpha.syi', 'car.mov']
    )
  })

  it('should sort unix filenames with paths', function () {
    assert.deepStrictEqual(
      sorted([
        '/home/user/img/img10.png',
        '/home/user/img/img2.png',
        '/home/user/img/img1.png'
      ]),
      [
        '/home/user/img/img1.png',
        '/home/user/img/img2.png',
        '/home/user/img/img10.png'
      ]
    )
  })

  // Whitespace
  it('should handle leading spaces', function () {
    assert.deepStrictEqual(
      sorted(['  b', 'a', ' c']),
      ['a', '  b', ' c']
    )
  })

  it('should handle empty strings', function () {
    assert.deepStrictEqual(
      sorted(['', 'a', '']),
      ['', '', 'a']
    )
  })

  // Hex
  it('should sort hex numbers', function () {
    assert.deepStrictEqual(
      sorted(['0xA', '0x9', '0xB']),
      ['0x9', '0xA', '0xB']
    )
  })

  it('should not treat non-hex as hex', function () {
    assert.deepStrictEqual(
      sorted(['0xZZ', '0xAA']),
      ['0xZZ', '0xAA']
    )
  })

  // Unicode
  it('should sort unicode characters', function () {
    assert.deepStrictEqual(
      sorted(['\u00e6', '\u00e4', '\u00f6']),
      ['\u00e4', '\u00e6', '\u00f6']
    )
  })

  // Case sensitivity
  it('should be case-sensitive by default', function () {
    assert.deepStrictEqual(
      sorted(['A', 'b', 'C', 'd', 'E', 'f']),
      ['A', 'C', 'E', 'b', 'd', 'f']
    )
  })

  // Undefined handling
  it('should handle undefined values', function () {
    assert.deepStrictEqual(
      sorted([undefined, 'a', undefined]),
      ['a', undefined, undefined]
    )
  })

  // Numbers vs strings
  it('should sort numbers before strings', function () {
    assert.strictEqual(naturalSort('a', '1') > 0, true)
    assert.strictEqual(naturalSort('1', 'a') < 0, true)
  })

  // Mixed alphanumeric
  it('should sort mixed alphanumeric strings naturally', function () {
    assert.deepStrictEqual(
      sorted(['a1', 'a10', 'a2', 'a20', 'a3']),
      ['a1', 'a2', 'a3', 'a10', 'a20']
    )
  })

  // Zero-padded numbers
  it('should sort zero-padded numbers', function () {
    assert.deepStrictEqual(
      sorted(['02', '1', '003', '10']),
      ['003', '02', '1', '10']
    )
  })

  // Non-string inputs
  it('should handle null values', function () {
    assert.strictEqual(naturalSort(null, null), 0)
    assert.strictEqual(naturalSort(null, 'a') > 0, true)
    assert.strictEqual(naturalSort('a', null) < 0, true)
  })

  it('should handle boolean values', function () {
    assert.strictEqual(naturalSort(true, false) > 0, true)
    assert.strictEqual(naturalSort(true, 'true'), 0)
  })

  it('should handle Infinity', function () {
    assert.strictEqual(naturalSort(Infinity, 1000000) > 0, true)
    assert.strictEqual(naturalSort(-Infinity, -1000000) < 0, true)
  })

  // Numeric equivalence
  it('should treat scientific notation as equivalent number', function () {
    assert.strictEqual(naturalSort('1e2', '100'), 0)
  })

  it('should handle large numbers', function () {
    assert.strictEqual(naturalSort('999999999999', '1000000000000') < 0, true)
  })

  // Global regex stability (repeated calls must be consistent)
  it('should produce stable results across repeated calls', function () {
    for (let i = 0; i < 5; i++) {
      assert.strictEqual(naturalSort('abc123', 'abc45') > 0, true)
    }
  })
})
