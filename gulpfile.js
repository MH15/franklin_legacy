// Load all required packages
const gulp     = require('gulp')
const prefix   = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const rename   = require('gulp-rename')

// Compile sass
gulp.task('sass:min', function() {
  gulp.src('./source/style.css')
    .pipe(prefix(
      'last 1 version', '> 1%', 'ie8', 'ie7'
    ))
    // minify css using gulp-clean-css
    .pipe(cleanCSS({ compatibility: '*' }))
    // let us know it's minified
    .pipe(rename({ suffix: '.min' }))
    // output
    .pipe(gulp.dest('./public/css'))
})

// Watch for changes
gulp.task('watch', function() {
  gulp.watch('./src/style.css', [ 'css:min' ])
  // gulp.watch('./source/js/**/*.js', [ 'js:min' ])
})
