// Load all required packages
const gulp     = require('gulp')
const sass     = require('gulp-sass')
const prefix   = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
// const uglify   = require('gulp-uglify')
const rename   = require('gulp-rename')
// const sync     = require('browser-sync').create()

// Compile sass
gulp.task('sass:min', function() {
  gulp.src('./source/style/style.sass')
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
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

// Minify javascript
// gulp.task('js:min', function() {
//   gulp.src('./src/js/**/*.js')
//     .pipe(uglify())
//     .pipe(rename({ suffix: '.min' }))
//     .pipe(gulp.dest('./dist/js'))
// })

// Watch for changes
gulp.task('watch', function() {
  gulp.watch('./source/style/**/*.sass', [ 'sass:min' ])
  // gulp.watch('./source/js/**/*.js', [ 'js:min' ])
})

// Serve task
// gulp.task('serve', ['watch'], function() {
//   sync.init({
//     server: './dist'
//   })

//   gulp.watch('./dist/**').on('change', sync.reload)
// })
