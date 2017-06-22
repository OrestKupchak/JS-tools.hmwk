
var gulp  = require('gulp')
var jshint = require('gulp-jshint') //  javascript files
var  less = require('gulp-less') //   less --> css
var   babel = require('gulp-babel') //ES6 --> ES5
var copy = require('gulp-copy')
var  concat = require('gulp-concat') //  concatination
var  uglify = require('gulp-uglifyjs') //  uglifying
var  cssnano = require('gulp-cssnano') //  minification
var  del = require('del') //  delete distributives folder before bulding
var  browserSync = require('browser-sync').create() //  liveReload


gulp.task('default', [ 'run' ]);      //default task on loading project

gulp.task('run', [ 'less', 'concat', 'hint', 'babel'], function(){   //run all tasks
  gulp.start('less');
  var loadHtml = gulp.src('source/*.html')
    .pipe(gulp.dest('target/'));
  gulp.watch(['less']);
  gulp.watch('*.html', browserSync.reload);
  gulp.watch('source/js/*.js', browserSync.reload);
});


gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'source' //repo for server
        },
        notify: false 
    });
});

gulp.task('hint', function() {
    return gulp.src('source/js/**/*.js')   //take all files in directory js
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
});


gulp.task('babel', function() {      //translating es6 --> es5
  return gulp.src('source/app.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('target/js/'));
});


gulp.task('uglify', function () {    //minificating js files
  gulp.src('source/js/app.js')
    .pipe(uglify())
    .pipe(gulp.dest('target'));
});


gulp.task('concat', function() {      //join all js files into one
  return gulp.src('source/js/*.js')
    .pipe(concat('final.js'))
    .pipe(gulp.dest('target/js'));
});



gulp.task('less', function() {
    return gulp.src('source/less/*.less') //take less files from source folder
        .pipe(less()) //  less --> css
        .pipe(gulp.dest('source/css')) 
        .pipe(browserSync.reload({ stream: true })) // for reload page, when css will be change
});


gulp.task('delete', function() { // delete target folder before running
  return del.sync('target'); 
});


gulp.task('build', ['delete', 'less'], function() { //Load files from source folder into production folder target
        
        var buildCss = gulp.src('source/css/**/*') // push css in target repo
            .pipe(cssnano())
            .pipe(gulp.dest('target/css'))

        var buildJS = gulp.src('source/js/**/*') //push js in target repo
            .pipe(gulp.dest('target/js'))

        var buildHtml = gulp.src('source/*.html') //push html in target repo
            .pipe(gulp.dest('target'));
    });

