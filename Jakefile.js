/**
 * Jake build script for math.js
 */

var jake = require('jake'),
    util = require('./tools/jake-utils.js'),
    browserify = require('browserify');

/**
 * Constants
 */
var INDEX             = './index.js',
    HEADER            = './lib/header.js',
    DIST              = './dist',
    MATHJS            = DIST + '/math.js',
    MATHJS_MIN        = DIST + '/math.min.js',
    MATHJS_MAP        = MATHJS_MIN + '.map';

// register start time
var start = +new Date();

/**
 * default task
 */
desc('Execute all tasks: bundle and minify the library');
task('default', ['bundle', 'minify'], function () {
  // calculate duration
  var end = +new Date();
  var duration = end - start;
  console.log('Done (' + duration + ' ms)');
});

/**
 * Bundle task
 */
desc('Bundle the library');
task('bundle', {async: true}, function () {
  var b = browserify();

  // make directory dist
  jake.mkdirP(DIST);

  b.add(INDEX);
  b.bundle({
    standalone: 'mathjs'
  }, function (err, code) {
    if(err) {
      throw err;
    }

    // add header and shim to code
    var lib = util.read(HEADER) + code;

    // write bundled file
    util.write(MATHJS, lib);

    // update version number and stuff in the javascript files
    updateVersion(MATHJS);

    console.log('Bundled library ' + MATHJS + ' (' + filesize(lib.length, 1) + ')');

    complete();
  });
});

/**
 * minify task
 */
desc('Minify the library');
task('minify', ['bundle'], function () {
  var result = util.minify({
    src: MATHJS,
    dest: MATHJS_MIN,
    options: {
      outSourceMap: MATHJS_MAP // TODO: map doesn't work
    },
    header: util.read(HEADER)
  });
  updateVersion(MATHJS_MIN);

  // TODO: generate a file with map for debugging

  console.log('Minified library ' + MATHJS_MIN + ' (' + filesize(result.code.length, 1) + ')');
});

// TODO: test the bundled library and minified library (not the sources)

/**
 * Update version and date patterns in given file.
 * Patterns '@@date' and '@@version' will be replaced with current date and
 * version.
 * @param {String} file
 */
function updateVersion(file) {
  // update date and version number
  util.replace({
    replacements: [
      {pattern: '@@date',    replacement: util.today()},
      {pattern: '@@version', replacement: util.version()}
    ],
    src: file
  });
}

/**
 * Return the filesize in kilo bytes
 * @param {Number} size    Size in Bytes
 * @return {String} str    Formatted string like "50.7KB"
 */
function filesize (size) {
  return (size / 1024).toPrecision(3) + 'KB';
}
