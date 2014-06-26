var exec = require('child_process').exec;
var fs = require('fs');
var zlib = require('zlib');
var gulp = require('gulp');
var gutil = require('gulp-util');
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var header = require('gulp-header');

var LIB_SRC = './node_modules/mathjs/dist/*';
var LIB_DEST = './js/lib';
var DOCS_SRC = './node_modules/mathjs/docs/**/*.md';
var DOCS_DEST = './docs';
var HISTORY_SRC = './node_modules/mathjs/HISTORY.md';
var HISTORY_DEST = '.';
var MATHJS = './js/lib/math.js';
var MATHJS_MIN = './js/lib/math.min.js';
var DOWNLOAD = './download.md';

var MD_HEADER =
    '---\n' +
    'layout: default\n' +
    '---\n' +
    '\n';

/**
 * Update the dependencies (mathjs) to the latest version
 */
gulp.task('update', function (cb) {
  exec('npm install ../mathjs', cb); // TODO: replace with 'npm update'
});

/**
 * copy math.js and math.min.js
 */
gulp.task('lib', ['update'], function () {
  return gulp.src(LIB_SRC)
      .pipe(gulp.dest(LIB_DEST));
});

/**
 * Import docs and preprocess them for the static HTML web page:
 * - Add a markdown header containing the layout page
 * - Replace internal links to other markdown documents with *.html
 */
gulp.task('docs', ['update'], function () {
  return gulp.src(DOCS_SRC)
      .pipe(replace(/HISTORY.md/g, 'history.html'))        // change links to history.md to lowercase
      .pipe(replace(/(\([\w\./]*).md(\))/g, '$1.html$2'))  // replace urls to *.md with *.html
      .pipe(header(MD_HEADER))                             // add header with markdown layout
      .pipe(gulp.dest(DOCS_DEST));
});

/**
 * Copy and preprocess the history file
 */
gulp.task('history', ['update'], function () {
  return gulp.src(HISTORY_SRC)
      .pipe(header(MD_HEADER))    // add header with markdown layout
      .pipe(rename('history.md')) // rename to lower case
      .pipe(gulp.dest(HISTORY_DEST));
});

/**
 * Update size and version number on the downloads page
 */
gulp.task('version', ['update'], function (cb) {
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
    fs.readFile(DOWNLOAD, function (err, data) {
      if (!err) {
        data = String(data);

        // replace version
        data = data.replace(/\(version [0-9]+\.[0-9]+\.[0-9]+(-SNAPSHOT)?\)/g, '(version ' + version + ')');
        data = data.replace(/\/[0-9]+\.[0-9]+\.[0-9]+?(-SNAPSHOT)?\//g, '/' + version + '/');

        // replace development size
        data = data.replace(/<span id="development-size">([\w\s]*)<\/span>/g,
                '<span id="development-size">' + developmentSize + '</span>');

        // replace production size
        data = data.replace(/<span id="production-size">([\w\s]*)<\/span>/g,
                '<span id="production-size">' + productionSize + '</span>');

        fs.writeFile(DOWNLOAD, data, callback);
      }
      else {
        callback(err);
      }
    });
  }

  developmentSize(function (err, devSize) {
    gutil.log('development size: ' + devSize);
    productionSize(function (err, prodSize) {
      gutil.log('production size: ' + prodSize);
      version(function (err, version) {
        gutil.log('version: ' + version);
        if (devSize && prodSize && version) {
          updateVersion(devSize, prodSize, version, cb);
        }
        else {
          cb(new Error('Failed to update version number'));
        }
      });
    });
  });

});

gulp.task('default', ['update', 'lib', 'docs', 'history', 'version']);
