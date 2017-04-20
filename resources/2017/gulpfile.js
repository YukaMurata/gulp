'use strict';

var gulp      = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    cached    = require('gulp-cached'),
    encode    = require('gulp-convert-encoding'),
    imagemin  = require('gulp-imagemin'),
    pngquant  = require('imagemin-pngquant'),
    jpegoptim = require('imagemin-jpegoptim'),
    pug       = require('gulp-pug'),
    notify    = require('gulp-notify'),
    plumber   = require('gulp-plumber'),
    replace   = require('gulp-replace'),
    sass      = require('gulp-sass'),
    watch     = require('gulp-watch'),
    rename    = require('gulp-rename'),
    uglify    = require('gulp-uglify');


//------------------------------------------------------------------------------
// sass / scss / css
//------------------------------------------------------------------------------

gulp.task('sass', function() {
  return gulp.src(
      __dirname + '/css/**/*.scss'
    )
    .pipe(plumber({ errorHandler: notify.onError('<%= error.message %>') }))
    .pipe(cached('sass'))
    .pipe(
      sass({
        outputStyle: 'expanded',
      }).on('error', sass.logError)
    )
    .pipe(
      autoprefixer({
        browsers: [
          'last 2 versions',
          'ie >= 9',
          'ChromeAndroid >= 6',
          'Android >= 6',
          'iOS >= 9',
        ],
      })
    )
    .pipe(
      rename({
        extname: '.css',
      })
    )
    .pipe(
      gulp.dest(__dirname + '/../../app/webroot/css')
    );
});

//------------------------------------------------------------------------------
// pug
//------------------------------------------------------------------------------
gulp.task('pug', function () {
  return gulp.src(
     [ __dirname + '/pug/**/*.pug' , '!' + __dirname + '/pug/**/include/**/*.pug']
  )
      .pipe(plumber({ errorHandler: notify.onError('<%= error.message %>') }))
      .pipe(cached('pug'))
      .pipe(pug({pretty: true}))
      .pipe(gulp.dest(__dirname + '/../../app/views/pages')
      );
});

//------------------------------------------------------------------------------
// image
//------------------------------------------------------------------------------
gulp.task('imagemin',function () {
  return gulp.src(
      __dirname + '/images/**/*.+(jpg|jpeg|png|gif|svg)'
  )
      .pipe(imagemin({optimizationLevel: 3, progressive: false, use: [pngquant({quality: '80-90'}), jpegoptim({max: 90})]}))
      .pipe(gulp.dest(__dirname + '/../../app/webroot/images'));
});


//------------------------------------------------------------------------------
// webpack
//------------------------------------------------------------------------------



//------------------------------------------------------------------------------
// watch
//------------------------------------------------------------------------------

gulp.task('watch', function() {
  watch(__dirname + '/css/**/*.scss', function() {
    return gulp.start('sass');
  });
  watch(__dirname + '/pug/**/*.pug' , '!' + __dirname + '/pug/**/include/**/*.pug', function() {
    return gulp.start('pug');
  });
  watch(__dirname + '/images/**/*.+(jpg|jpeg|png|gif|svg)', function() {
    return gulp.start('imagemin');
  });
});

