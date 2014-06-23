var gulp = require('gulp'),
    replace = require('gulp-replace');
    header = require('gulp-header');

var DOCS_SRC = './node_modules/mathjs/docs/**/*.md',
    DOCS_DEST = './docs';

/**
 * Import docs and preprocess them for the static HTML web page:
 * - Add a markdown header containing the layout page
 * - Replace internal links to other markdown documents with *.html
 */
gulp.task('preprocess', function () {
  var banner =
      '---\n' +
      'layout: default\n' +
      '---\n' +
      '\n';

  // find all urls \[\w*\]\([\w\./]*\)
  return gulp.src(DOCS_SRC)
      .pipe(replace(/(\([\w\./]*).md(\))/g, '$1.html$2'))  // replace urls to *.md with *.html
      .pipe(header(banner))                             // add header with markdown layout
      .pipe(gulp.dest(DOCS_DEST));
});

gulp.task('default', ['preprocess']);
