// Update the version numbers and library sizes in index.md

var fs = require('fs'),
    zlib = require('zlib');

var MATHJS = 'js/lib/math.js',
    MATHJS_MIN = 'js/lib/math.min.js',
    INDEX = 'index.md';

// get development size
function developmentSize(callback) {
  fs.readFile(MATHJS, function (err, data) {
    if (!err) {
      var size = Math.round(data.length / 1024) + ' kB';
      callback(null, size);
    }
    else {
      callback(err);
    }
  });
}

// get (gzipped) production size
function productionSize(callback) {
  fs.readFile(MATHJS_MIN, function (err, data) {
    if (!err) {
      zlib.gzip(data, function (err, data) {
        if (!err) {
          var size = Math.round(data.length / 1024) + ' kB';
          callback(null, size)
        }
        else {
          callback(err);
        }
      });
    }
    else {
      callback(err);
    }
  });
}

// get version
function version(callback) {
  fs.readFile(MATHJS_MIN, function (err, data) {
    if (!err) {
      var match = /@version\s*([\w\.-]*)/i.exec(data);
      var version = undefined;
      if (match) {
        version = match[1];
      }
      callback(null, version);
    }
    else {
      callback(err);
    }
  });
}

// update version and library sizes in index.md
function updateVersion(developmentSize, productionSize, version, callback) {
  fs.readFile(INDEX, function (err, data) {
    if (!err) {
      data = String(data);

      // replace version
      data = data.replace(/\(version [0-9]+\.[0-9]+\.[0-9]+?(-SNAPSHOT)\)/g, '(version ' + version + ')');
      data = data.replace(/\/[0-9]+\.[0-9]+\.[0-9]+?(-SNAPSHOT)\//g, '/' + version + '/');

      // replace development size
      data = data.replace(/<span id="development-size">([\w\s]*)<\/span>/g,
          '<span id="development-size">' + developmentSize + '</span>');

      // replace production size
      data = data.replace(/<span id="production-size">([\w\s]*)<\/span>/g,
          '<span id="production-size">' + productionSize + '</span>');

      fs.writeFile(INDEX, data, callback);
    }
    else {
      callback(err);
    }
  });
}

developmentSize(function (err, devSize) {
  console.log('development size: ' + devSize);
  productionSize(function (err, prodSize) {
    console.log('production size: ' + prodSize);
    version(function (err, version) {
      console.log('version: ' + version);
      if (devSize && prodSize && version) {
        updateVersion(devSize, prodSize, version, function (err, res) {
          if (err) {
            console.log(err);
          }
          else {
            console.log('done');
          }
        });
      }
      else {
      }
    });
  });
});
