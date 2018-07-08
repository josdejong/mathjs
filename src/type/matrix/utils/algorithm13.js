'use strict'

const DimensionError = require('../../../error/DimensionError')

function factory (type, config, load, typed) {
  const DenseMatrix = type.DenseMatrix

  /**
   * Iterates over DenseMatrix items and invokes the callback function f(Aij..z, Bij..z).
   * Callback function invoked MxN times.
   *
   * C(i,j,...z) = f(Aij..z, Bij..z)
   *
   * @param {Matrix}   a                 The DenseMatrix instance (A)
   * @param {Matrix}   b                 The DenseMatrix instance (B)
   * @param {Function} callback          The f(Aij..z,Bij..z) operation to invoke
   *
   * @return {Matrix}                    DenseMatrix (C)
   *
   * https://github.com/josdejong/mathjs/pull/346#issuecomment-97658658
   */
  const algorithm13 = function (a, b, callback) {
    // a arrays
    const adata = a._data
    const asize = a._size
    const adt = a._datatype
    // b arrays
    const bdata = b._data
    const bsize = b._size
    const bdt = b._datatype
    // c arrays
    const csize = []

    // validate dimensions
    if (asize.length !== bsize.length) { throw new DimensionError(asize.length, bsize.length) }

    // validate each one of the dimension sizes
    for (let s = 0; s < asize.length; s++) {
      // must match
      if (asize[s] !== bsize[s]) { throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')') }
      // update dimension in c
      csize[s] = asize[s]
    }

    // datatype
    let dt
    // callback signature to use
    let cf = callback

    // process data types
    if (typeof adt === 'string' && adt === bdt) {
      // datatype
      dt = adt
      // callback
      cf = typed.find(callback, [dt, dt])
    }

    // populate cdata, iterate through dimensions
    const cdata = csize.length > 0 ? _iterate(cf, 0, csize, csize[0], adata, bdata) : []

    // c matrix
    return new DenseMatrix({
      data: cdata,
      size: csize,
      datatype: dt
    })
  }

  // recursive function
  function _iterate (f, level, s, n, av, bv) {
    // initialize array for this level
    const cv = []
    // check we reach the last level
    if (level === s.length - 1) {
      // loop arrays in last level
      for (let i = 0; i < n; i++) {
        // invoke callback and store value
        cv[i] = f(av[i], bv[i])
      }
    } else {
      // iterate current level
      for (let j = 0; j < n; j++) {
        // iterate next level
        cv[j] = _iterate(f, level + 1, s, s[level + 1], av[j], bv[j])
      }
    }
    return cv
  }

  return algorithm13
}

exports.name = 'algorithm13'
exports.factory = factory
