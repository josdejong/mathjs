var fs = require('fs'),
    dateable = require('dateable'),

    gulp = require('gulp'),
    replace = require('gulp-replace'),
    concat = require('gulp-concat'),
    browserify = require('gulp-browserify'),
    uglify = require('gulp-uglify');

// bundle the script using browserify
gulp.task('build', function() {
  gulp.src(['./index.js'])
      .pipe(replace('@@date', today()))
      .pipe(replace('@@version', version()))

      .pipe(browserify({
        // standalone: 'mathjs' // TODO: standalone not yet supported
      }))
      .pipe(concat('math.js'))
      .pipe(gulp.dest('./dist'))

      .pipe(uglify({
        output: {
          comments: /@license/
        }
      }))
      .pipe(concat('math.min.js'))
      .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function () {
  gulp.run('build');

  gulp.watch('lib/**', function() {
    gulp.run('build');
  });
});

// The default task (called when you run `gulp`)
gulp.task('default', function() {
  gulp.run('build');
});

/**
 * Returns today's date as a formatted string.
 * Default format is 'YYYY-MM-DD', for example '2013-02-18'
 * @param {String} [format]
 * @return {String} today
 */
function today (format) {
  var date = new Date();
  return dateable.format(date, format || 'YYYY-MM-DD');
}

/**
 * Read the version number from the package.json file.
 * If not found, an error is thrown
 * @return {String} version
 * @throws {Error}
 */
function version() {
  var pkg = JSON.parse(fs.readFileSync('./package.json'));
  if (!pkg.version) {
    throw new Error('No version found in package.json');
  }
  return pkg.version;
}
