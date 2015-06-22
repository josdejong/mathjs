'use strict';

var fs = require('fs'),
    zlib = require('zlib'),
    tar = require('tar'),
    math = require('../index'),
    Q = require('q'),
    typed = require('typed-function'),
    
    Spa = math.type.Spa,
    DenseMatrix = math.type.DenseMatrix,
    SparseMatrix = math.type.SparseMatrix,
    FibonacciHeap = math.type.FibonacciHeap;

var _importFromStream = function (stream, deferred) {

  // header regex
  var headerRegex = /%%MatrixMarket ([a-zA-Z]+) ([a-zA-Z]+) ([a-zA-Z]+) ([a-zA-Z]+)/;
  var coordinateHeaderRegex = /(\d+) (\d+) (\d+)/;
  var coordinateDataRegex = /(\d+) (\d+) (.*)/;
  var coordinatePatternRegex = /(\d+) (\d+)/;
  var arrayHeaderRegex = /(\d+) (\d+)/;
  var arrayDataRegex = /(\d+)/;
  
  // Matrix Market supported formats
  var typecodes = ['matrix'];
  var formats = ['coordinate', 'array'];
  var datatypes = ['real', 'pattern'];
  var qualifiers = ['general', 'symmetric'];

  // matrix data
  var mm = null;
  var buffer = '';

  var readHeader = function (line) {
    // check line is a header
    var matches = line.match(headerRegex);
    if (matches !== null) {      
      // get matches values
      var typecode = matches[1];
      var format = matches[2];
      var datatype = matches[3];
      var qualifier = matches[4];
      // check typecode
      if (typecodes.indexOf(typecode) === -1) {
        // typecode not supported
        deferred.reject(new Error('Matrix Market type code is not supported: ' + typecode));
        // close stream
        stream.close();
      }
      // check format
      if (formats.indexOf(format) === -1) {
        // typecode not supported
        deferred.reject(new Error('Matrix Market format is not supported: ' + format));
        // close stream
        stream.close();
      }
      // check datatype
      if (datatypes.indexOf(datatype) === -1) {
        // typecode not supported
        deferred.reject(new Error('Matrix Market datatype is not supported: ' + datatype));
        // close stream
        stream.close();
      }
      if (qualifiers.indexOf(qualifier) === -1) {
        // typecode not supported
        deferred.reject(new Error('Matrix Market qualifier is not supported: ' + qualifier));
        // close stream
        stream.close();
      }
      
      // initialize matrix market structure
      mm = {
        typecode: typecode,
        format: format,
        datatype: datatype,
        qualifier: qualifier,
        data: null
      };
    }
    else {
      // invalid header
      deferred.reject(new Error('Invalid file header: ' + line));
      // close stream
      stream.close();
    }
  };

  var readStructure = function (line) {
    // vars
    var matches;
    // check matrix format
    switch (mm.format) {
      case 'coordinate':
        // rows columns entries
        matches = line.match(coordinateHeaderRegex);
        if (matches !== null) {
          // read structure
          mm.rows = parseInt(matches[1]);
          mm.columns = parseInt(matches[2]);
          mm.entries = parseInt(matches[3]);
          // initialize data
          mm.data = new FibonacciHeap();
        }
        break;
      case 'array':
        matches = line.match(arrayHeaderRegex);
        if (matches !== null) {
          // read structure
          mm.rows = parseInt(matches[1]);
          mm.columns = parseInt(matches[2]);
          // initialize data
          mm.data = [];
        }
        break;
    }
  };

  var readValue = function (text) {
    // check datatype
    switch (mm.datatype) {
      case 'real':
        return parseFloat(text);
      case 'pattern':
        return 1;
    }
  };

  var readData = function (line) {
    // vars
    var matches;
    // check matrix format
    switch (mm.format) {
      case 'coordinate':
        // regex to use
        var rx = mm.datatype !== 'pattern' ? coordinateDataRegex : coordinatePatternRegex;
        // check data line is correct
        matches = line.match(rx);
        if (matches !== null) {
          // row, columns, value
          var r = parseInt(matches[1]) - 1;
          var c = parseInt(matches[2]) - 1;
          var v = readValue(matches.length === 4 ? matches[3] : null);
          // insert entry
          mm.data.insert(c, {i: r, j: c, v: v});
          // check matrix is simmetric
          if (mm.qualifier === 'symmetric' && c !== r) {
            // insert entry
            mm.data.insert(r, {i: c, j: r, v: v});
          }
        }
        break;
      case 'array':          
        // check data line is correct
        matches = line.match(arrayDataRegex);
        if (matches !== null) {
          // get values in row
          var values = [];
          for (var j = 1; j < matches.length; j++)
            values.push(readValue(matches[j]));
          // push entry
          mm.data.push(values);
        }
        break;
    }
  };

  var processLine = function (line) {
    // check this is the first line
    if (mm !== null) {
      // skip all comments
      if (line.charAt(0) !== '%') {
        // check data is ready to be processed
        if (mm.data !== null) {
          // it is a data row
          readData(line);
        }
        else {
          // read matrix structure
          readStructure(line);
        }
      }
    }
    else {
      // read header, initialize data
      readHeader(line);
    }
  };
   
  stream.on('data', function (chunk) {
    // concatenate chunk
    buffer += chunk;
    // eol
    var index = buffer.indexOf('\n');
    // process lines
    while (index !== -1) {
      // extract line
      var line = buffer.substr(0, index);
      // process line
      processLine(line.trim());
      // update buffer
      buffer = buffer.length > index ? buffer.substr(index + 1) : '';
      // next line
      index = buffer.indexOf('\n');
    }
  });
  
  stream.on('end', function () {
    // check mm
    if (mm !== null) {
      // process matrix format
      switch (mm.format) {
        case 'coordinate':
          // CCS structure
          var values = mm.datatype !== 'pattern' ? [] : undefined;
          var index = [];
          var ptr = [];
          var datatype = mm.datatype === 'real' ? 'number' : undefined;
          // mm data & pointer
          var d = mm.data;
          var p = -1;
          var spa = new Spa(mm.rows);
          // push value 
          var pushValue = function (i, v) {
            // push row
            index.push(i);
            // check there is a value (pattern matrix)
            if (values)
              values.push(v);
          };
          // extract node (column sorted)            
          var n = d.extractMinimum();
          // loop all nodes
          while (n !== null) {
            // check column changed
            if (p !== n.key) {
              // process sparse accumulator
              spa.forEach(0, mm.rows, pushValue);
              // process columns from p + 1 to n.j
              for (var j = p + 1; j <= n.key; j++) {
                // ptr update
                ptr.push(index.length);
              }
              // create sparse accumulator
              spa = new Spa(mm.rows);
              // reset p
              p = n.key;
            }
            // store value in spa
            spa.set(n.value.i, n.value.v);
            // extract node
            n = d.extractMinimum();
          }
          // process sparse accumulator
          spa.forEach(0, mm.rows, pushValue);
          // ptr update
          ptr.push(index.length);
          // resolve promise
          deferred.resolve(new SparseMatrix({
            values: values,
            index: index,
            ptr: ptr,
            size: [mm.rows, mm.columns],
            datatype: datatype
          }));   
          break;
        case 'array':
          // resolve promise
          deferred.resolve(new DenseMatrix({
            data: mm.data,
            size: [mm.rows, mm.columns]
          }));
          break;
      }
    }
  });
  
  stream.on('error', function (e) {
    // reject promise
    deferred.reject(new Error(e));
  });
};

var _importFile = function (filename, deferred) {
  return function () {
    // input stream
    var input = fs.createReadStream(filename);
    // import from stream
    _importFromStream(input, deferred);
  };
};

/**
 * Imports a Matrix Market matrix from the filesystem. (http://math.nist.gov/MatrixMarket/)
 */
var _import = typed('importMatrix', {
  'Array': function (files) {
    // array of promises
    var promises = [];    
    // loop files
    for (var i = 0; i < files.length; i++) {
      // file name
      var filename = files[i];
      // create deferred instance
      var deferred = Q.defer();
      // check file exists, import file
      fs.exists(filename, _importFile(filename, deferred));
      // import file
      promises.push(deferred.promise);
    }
    // return promise
    return Q.all(promises);
  },
  'string, Array': function (archive, files) {
    // array of deferrred & promises
    var deferred = [];
    var promises = [];
    // initialize promises
    for (var i = 0; i < files.length; i++) {
      var d = Q.defer();
      deferred[i] = d;
      promises[i] = d.promise;
    }
    // check archive exists
    fs.exists(archive, function () {
      // input stream
      var input = fs.createReadStream(archive);
      // gz
      input = input.pipe(zlib.createUnzip());
      // tar
      input = input.pipe(tar.Parse());
      // process entries
      input.on('entry', function (e) {
        // check we need to process entry
        var index = files.indexOf(e.path);
        if (index !== -1) {
          // current deferred instance
          var d = deferred[index];
          // process entry
          _importFromStream(e, d);
        }                             
      });
      // error
      input.on('error', function (e) {
        // check error is in one of the files
        var index = files.indexOf(e.path);
        if (index !== -1) {
          // current deferred instance
          var d = deferred[index];
          // reject promise with error
          d.reject(new Error(e));
        }
      });      
    });
    // return promise
    return Q.all(promises);
  }
});

module.exports = {
  import: _import
};
