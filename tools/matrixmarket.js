'use strict'

const fs = require('fs')
const zlib = require('zlib')
const tar = require('tar')
const math = require('../src/main')
const Q = require('q')
const typed = require('typed-function')
const Spa = math.type.Spa
const DenseMatrix = math.type.DenseMatrix
const SparseMatrix = math.type.SparseMatrix
const FibonacciHeap = math.type.FibonacciHeap

const _importFromStream = function (stream, deferred) {
  // header regex
  const headerRegex = /%%MatrixMarket ([a-zA-Z]+) ([a-zA-Z]+) ([a-zA-Z]+) ([a-zA-Z]+)/
  const coordinateHeaderRegex = /(\d+) (\d+) (\d+)/
  const coordinateDataRegex = /(\d+) (\d+) (.*)/
  const coordinatePatternRegex = /(\d+) (\d+)/
  const arrayHeaderRegex = /(\d+) (\d+)/
  const arrayDataRegex = /(\d+)/

  // Matrix Market supported formats
  const typecodes = ['matrix']
  const formats = ['coordinate', 'array']
  const datatypes = ['real', 'pattern']
  const qualifiers = ['general', 'symmetric']

  // matrix data
  let mm = null
  let buffer = ''

  const readHeader = function (line) {
    // check line is a header
    const matches = line.match(headerRegex)
    if (matches !== null) {
      // get matches values
      const typecode = matches[1]
      const format = matches[2]
      const datatype = matches[3]
      const qualifier = matches[4]
      // check typecode
      if (typecodes.indexOf(typecode) === -1) {
        // typecode not supported
        deferred.reject(new Error('Matrix Market type code is not supported: ' + typecode))
        // close stream
        stream.close()
      }
      // check format
      if (formats.indexOf(format) === -1) {
        // typecode not supported
        deferred.reject(new Error('Matrix Market format is not supported: ' + format))
        // close stream
        stream.close()
      }
      // check datatype
      if (datatypes.indexOf(datatype) === -1) {
        // typecode not supported
        deferred.reject(new Error('Matrix Market datatype is not supported: ' + datatype))
        // close stream
        stream.close()
      }
      if (qualifiers.indexOf(qualifier) === -1) {
        // typecode not supported
        deferred.reject(new Error('Matrix Market qualifier is not supported: ' + qualifier))
        // close stream
        stream.close()
      }

      // initialize matrix market structure
      mm = {
        typecode: typecode,
        format: format,
        datatype: datatype,
        qualifier: qualifier,
        data: null
      }
    } else {
      // invalid header
      deferred.reject(new Error('Invalid file header: ' + line))
      // close stream
      stream.close()
    }
  }

  const readStructure = function (line) {
    // vars
    let matches
    // check matrix format
    switch (mm.format) {
      case 'coordinate':
        // rows columns entries
        matches = line.match(coordinateHeaderRegex)
        if (matches !== null) {
          // read structure
          mm.rows = parseInt(matches[1])
          mm.columns = parseInt(matches[2])
          mm.entries = parseInt(matches[3])
          // initialize data
          mm.data = new FibonacciHeap()
        }
        break
      case 'array':
        matches = line.match(arrayHeaderRegex)
        if (matches !== null) {
          // read structure
          mm.rows = parseInt(matches[1])
          mm.columns = parseInt(matches[2])
          // initialize data
          mm.data = []
        }
        break
    }
  }

  const readValue = function (text) {
    // check datatype
    switch (mm.datatype) {
      case 'real':
        return parseFloat(text)
      case 'pattern':
        return 1
    }
  }

  const readData = function (line) {
    // vars
    let matches
    // check matrix format
    switch (mm.format) {
      case 'coordinate':
        // regex to use
        const rx = mm.datatype !== 'pattern' ? coordinateDataRegex : coordinatePatternRegex
        // check data line is correct
        matches = line.match(rx)
        if (matches !== null) {
          // row, columns, value
          const r = parseInt(matches[1]) - 1
          const c = parseInt(matches[2]) - 1
          const v = readValue(matches.length === 4 ? matches[3] : null)
          // insert entry
          mm.data.insert(c, { i: r, j: c, v: v })
          // check matrix is simmetric
          if (mm.qualifier === 'symmetric' && c !== r) {
            // insert entry
            mm.data.insert(r, { i: c, j: r, v: v })
          }
        }
        break
      case 'array':
        // check data line is correct
        matches = line.match(arrayDataRegex)
        if (matches !== null) {
          // get values in row
          const values = []
          for (let j = 1; j < matches.length; j++) { values.push(readValue(matches[j])) }
          // push entry
          mm.data.push(values)
        }
        break
    }
  }

  const processLine = function (line) {
    // check this is the first line
    if (mm !== null) {
      // skip all comments
      if (line.charAt(0) !== '%') {
        // check data is ready to be processed
        if (mm.data !== null) {
          // it is a data row
          readData(line)
        } else {
          // read matrix structure
          readStructure(line)
        }
      }
    } else {
      // read header, initialize data
      readHeader(line)
    }
  }

  stream.on('data', function (chunk) {
    // concatenate chunk
    buffer += chunk
    // eol
    let index = buffer.indexOf('\n')
    // process lines
    while (index !== -1) {
      // extract line
      const line = buffer.substr(0, index)
      // process line
      processLine(line.trim())
      // update buffer
      buffer = buffer.length > index ? buffer.substr(index + 1) : ''
      // next line
      index = buffer.indexOf('\n')
    }
  })

  stream.on('end', function () {
    // check mm
    if (mm !== null) {
      // process matrix format
      switch (mm.format) {
        case 'coordinate':
          // CCS structure
          const values = mm.datatype !== 'pattern' ? [] : undefined
          const index = []
          const ptr = []
          const datatype = mm.datatype === 'real' ? 'number' : undefined
          // mm data & pointer
          const d = mm.data
          let p = -1
          let spa = new Spa(mm.rows)
          // push value
          const pushValue = function (i, v) {
            // push row
            index.push(i)
            // check there is a value (pattern matrix)
            if (values) { values.push(v) }
          }
          // extract node (column sorted)
          let n = d.extractMinimum()
          // loop all nodes
          while (n !== null) {
            // check column changed
            if (p !== n.key) {
              // process sparse accumulator
              spa.forEach(0, mm.rows, pushValue)
              // process columns from p + 1 to n.j
              for (let j = p + 1; j <= n.key; j++) {
                // ptr update
                ptr.push(index.length)
              }
              // create sparse accumulator
              spa = new Spa(mm.rows)
              // reset p
              p = n.key
            }
            // store value in spa
            spa.set(n.value.i, n.value.v)
            // extract node
            n = d.extractMinimum()
          }
          // process sparse accumulator
          spa.forEach(0, mm.rows, pushValue)
          // ptr update
          ptr.push(index.length)
          // resolve promise
          deferred.resolve(new SparseMatrix({
            values: values,
            index: index,
            ptr: ptr,
            size: [mm.rows, mm.columns],
            datatype: datatype
          }))
          break
        case 'array':
          // resolve promise
          deferred.resolve(new DenseMatrix({
            data: mm.data,
            size: [mm.rows, mm.columns]
          }))
          break
      }
    }
  })

  stream.on('error', function (e) {
    // reject promise
    deferred.reject(new Error(e))
  })
}

/**
 * Imports a Matrix Market matrix from the filesystem. (http://math.nist.gov/MatrixMarket/)
 */
const _import = typed('importMatrix', {
  'Array': function (files) {
    // array of promises
    const promises = []
    // loop files
    for (let i = 0; i < files.length; i++) {
      // file name
      const filename = files[i]
      // create deferred instance
      const deferred = Q.defer()
      // check file exists, import file
      try {
        fs.accessSync(filename, fs.constants.R_OK)
        // input stream
        const input = fs.createReadStream(filename)
        // import from stream
        _importFromStream(input, deferred)
      } catch (err) {
        // doesn't exist or no access
      }
      // import file
      promises.push(deferred.promise)
    }
    // return promise
    return Q.all(promises)
  },
  'string, Array': function (archive, files) {
    // array of deferrred & promises
    const deferred = []
    const promises = []
    // initialize promises
    for (let i = 0; i < files.length; i++) {
      const d = Q.defer()
      deferred[i] = d
      promises[i] = d.promise
    }
    // check archive exists
    try {
      fs.accessSync(archive, fs.constants.R_OK)
      // input stream
      let input = fs.createReadStream(archive)
      // gz
      input = input.pipe(zlib.createUnzip())
      // tar
      input = input.pipe(new tar.Parse())
      // process entries
      input.on('entry', function (e) {
        // check we need to process entry
        const index = files.indexOf(e.path)
        if (index !== -1) {
          // current deferred instance
          const d = deferred[index]
          // process entry
          _importFromStream(e, d)
        }
      })
      // error
      input.on('error', function (e) {
        // check error is in one of the files
        const index = files.indexOf(e.path)
        if (index !== -1) {
          // current deferred instance
          const d = deferred[index]
          // reject promise with error
          d.reject(new Error(e))
        }
      })
    } catch (err) {
      // doesn't exist or no access
    }
    // return promise
    return Q.all(promises)
  }
})

module.exports = {
  import: _import
}
