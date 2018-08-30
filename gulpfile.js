'use strict';

var gulp = require('gulp');
var postcss = require('gulp-postcss');
var sass = require('gulp-sass');
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync').create();
var inject = require('gulp-inject');
var clean = require('gulp-rimraf');
var runSequence = require('run-sequence');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
let uglify = require('gulp-uglify-es').default;
var gutil = require('gulp-util');
var strip = require('gulp-strip-comments');//strip comments from files
var htmlmin = require('gulp-htmlmin');//minify html
var replace = require('gulp-string-replace');//string raplace in case of cdn
var wait = require('gulp-wait');

var config = require('./project-config.json');

gulp.task('watch', [], function() {
  runSequence('clean',
  'sass',
  ['copy-assets', 'copy-js', 'copy-vendor-js', 'copy-css'],
  'create-cookie-file',
  'inject',
  function(){
    console.log("initial setup terminates");
  });
  browserSync.init({
    server: config.paths.tmp.folder,
    notify: false
  });

  var scssPaths = config.paths.src.scss.watch;

  gulp.watch(scssPaths, ['sass']);
  gulp.watch(config.paths.src.html.watch, [ 'inject']);
  gulp.watch(config.paths.src.vendor.css.watch, ['copy-css']);
  gulp.watch(config.paths.src.js.watch, [ 'copy-js']);
  gulp.watch(config.paths.src.vendor.js.watch, ['copy-vendor-js']);
});

gulp.task('clean', [], function() {
  console.log("Clean all files in build folder");

  return gulp.src([config.paths.tmp.folder], { read: false }).pipe(clean());
});


gulp.task('copy-assets', [], function() {

  return gulp.src([config.paths.assets.allfiles]).pipe(gulp.dest(config.paths.tmp.assets));
});

// Copy vendor css files & auto-inject into browsers
gulp.task('copy-css', function() {
  return gulp.src("src/vendor/css/*.css")
      .pipe(gulp.dest("tmp/dist/vendor/css/")).pipe(browserSync.stream());
});

// Copy js files & auto-inject into browsers
gulp.task('copy-js', function() {
  return gulp.src("src/js/*.js")
      .pipe(gulp.dest("tmp/dist/js/")).pipe(browserSync.stream());
});

// Copy vendor js files & auto-inject into browsers
gulp.task('copy-vendor-js', function() {
  return gulp.src("src/vendor/js/*.js")
      .pipe(gulp.dest("tmp/dist/vendor/js/")).pipe(browserSync.stream());
});

// Compile sass & auto-inject into browsers
gulp.task('sass', function() {

  return gulp.src("src/scss/*.scss")
      .pipe(wait(500))
      .pipe(sass().on('error', sass.logError))
      .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
      .pipe(gulp.dest("tmp/dist/css"))
      .pipe(browserSync.stream()).pipe(browserSync.stream());
});

gulp.task('inject', function () {
  var target = gulp.src('./src/**/*.html');
 
  var sources = gulp.src(['dist/vendor/js/*.js', 'dist/vendor/css/*.css', 'dist/js/*.js', 'dist/css/*.css',], {'cwd': __dirname + '/tmp/'});
  return target.pipe(inject(sources))
  .pipe(inject(gulp.src(['othercode/googleanalytics.html']), {//inject google analytics code
    starttag: '<!-- inject:googleanalytics:html -->',
    transform: function(filepath, file) {
      return file.contents.toString();
    }
  }))
  .pipe(inject(gulp.src(['othercode/facebookpixel.html']), {//inject facebook pixel code
    starttag: '<!-- inject:facebookpixel:html -->',
    transform: function(filepath, file) {
      return file.contents.toString();
    }
  }))
  .pipe(inject(gulp.src(['othercode/vendorremotecode.html']), {//inject facebook pixel code
    starttag: '<!-- inject:vendorremotecode:html -->',
    transform: function(filepath, file) {
      return file.contents.toString();
    }
  }))
  .pipe(inject(gulp.src(['src/partials/footer.html']), {//inject facebook pixel code
    starttag: '<!-- inject:footer:html -->',
    transform: function(filepath, file) {
      return file.contents.toString();
    }
  }))
  .pipe(inject(gulp.src(['src/partials/header.html']), {//inject facebook pixel code
    starttag: '<!-- inject:header:html -->',
    transform: function(filepath, file) {
      return file.contents.toString();
    }
  }))
  .pipe(inject(gulp.src(['src/partials/fonts.html']), {//inject facebook pixel code
    starttag: '<!-- inject:fonts:html -->',
    transform: function(filepath, file) {
      return file.contents.toString();
    }
  }))
    .pipe(gulp.dest('./tmp')).pipe(browserSync.stream());
});



gulp.task('create-cookie-file', function () {
  var target = gulp.src('othercode/cookie-script/js-template.js');
  return target.pipe(inject(gulp.src(['othercode/cookie-script/html-code.html']), {//inject cookie code
      starttag: '<!-- inject:js -->',
      transform: function(filepath, file) {
        var content = file.contents.toString();
        content = content.replace(/<\!--.*?-->/g, "");
        content = content.replace(/\r?\n|\r/g, "");
        content = content.replace("'","\"");
        
        return content;
      }
    }))
    .pipe(rename('beconcept-cookie.js'))
    .pipe(replace(/<\!--(.|\s)*?-->/g, ''))
    .pipe(replace("##COOKIE_POLICY_URL##", config.cookie.COOKIE_POLICY_URL))
    .pipe(replace("##COOKIE_SCRIPT_ID##", config.cookie.COOKIE_SCRIPT_ID))
    .pipe(replace("##ACCEPT_CLASS##", config.cookie.ACCEPT_CLASS))
    .pipe(replace("##MORE_CLASS##", config.cookie.MORE_CLASS))
    .pipe(replace("##REJECT_CLASS##", config.cookie.REJECT_CLASS))
    .pipe(replace("##COOKIE_BANNER_CLASS##", config.cookie.COOKIE_BANNER_CLASS))
    .pipe(gulp.dest('./tmp/dist/js/')).pipe(browserSync.stream());
});



gulp.task('prod-clean', [], function() {
  console.log("Clean all files in build folder");

  return gulp.src(['prod/'], { read: false })
  .pipe(clean());
});


gulp.task('prod-copy-assets', [], function() {

  return gulp.src(['assets/**/*']).pipe(gulp.dest('prod/assets'));
});


// Copy vendor css files & auto-inject into browsers
gulp.task('prod-copy-css', function() {
  return gulp.src("src/vendor/css/*.css")
            .pipe(cleanCSS({compatibility: 'ie8'}))
            .pipe(rename('vendor.min.css'))
            .pipe(gulp.dest("prod/dist/vendor/css/"));
});

// Copy js files & auto-inject into browsers
gulp.task('prod-copy-js', function() {
  
  return gulp.src("src/js/*.js")
  .pipe(concat("scripts.js"))
  .pipe(rename('scripts.min.js'))
  .pipe(uglify().on('error', gutil.log))
  .pipe(gulp.dest("prod/dist/js/"));
});

// Copy vendor js files & auto-inject into browsers
gulp.task('prod-copy-vendor-js', function() {
  return gulp.src("src/vendor/js/*.js")
  .pipe(concat("scripts.js"))
  .pipe(rename('vendor.min.js'))
  .pipe(uglify().on('error', gutil.log))
  .pipe(gulp.dest("prod/dist/vendor/js/"));
});

// Compile sass & auto-inject into browsers
gulp.task('prod-sass', function() {

  return gulp.src("src/scss/*.scss")
      .pipe(sass().on('error', sass.logError))
      .pipe(concat("main.css"))
      .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(rename('main.min.css'))
      .pipe(gulp.dest("prod/dist/css"));
});

gulp.task('prod-inject', function () {
  var target = gulp.src('./src/**/*.html');
 
  var sources = gulp.src(['dist/vendor/js/*.js', 'dist/vendor/css/*.css', 'dist/js/*.js', 'dist/css/*.css',], {'cwd': __dirname + '/prod/'});
  return target.pipe(inject(sources))
    .pipe(inject(gulp.src(['othercode/googleanalytics.html']), {//inject google analytics code
      starttag: '<!-- inject:googleanalytics:html -->',
      transform: function(filepath, file) {
        return file.contents.toString();
      }
    }))
    .pipe(inject(gulp.src(['othercode/facebookpixel.html']), {//inject facebook pixel code
      starttag: '<!-- inject:facebookpixel:html -->',
      transform: function(filepath, file) {
        return file.contents.toString();
      }
    }))
    .pipe(inject(gulp.src(['othercode/vendorremotecode.html']), {//inject facebook pixel code
      starttag: '<!-- inject:vendorremotecode:html -->',
      transform: function(filepath, file) {
        return file.contents.toString();
      }
    }))
    .pipe(strip())//remove all comments
    .pipe(htmlmin({collapseWhitespace: true}))//minify html page
    .pipe(gulp.dest('./prod'));//create files
});


gulp.task('prod-inject-cdn', function () {
  
  var cdn, i = process.argv.indexOf("--cdn");
  cdn = process.argv[i+1];
  
  var target = gulp.src('./src/*.html');
 
  var sources = gulp.src(['dist/vendor/js/*.js', 'dist/vendor/css/*.css', 'dist/js/*.js', 'dist/css/*.css',], {'cwd': __dirname + '/prod/'});
  return target.pipe(inject(sources))
    .pipe(inject(gulp.src(['src/trackingcode/googleanalytics.html']), {//inject google analytics code
      starttag: '<!-- inject:googleanalytics:html -->',
      transform: function(filepath, file) {
        return file.contents.toString();
      }
    })).pipe(inject(gulp.src(['src/trackingcode/facebookpixel.html']), {//inject facebook pixel code
      starttag: '<!-- inject:facebookpixel:html -->',
      transform: function(filepath, file) {
        return file.contents.toString();
      }
    }))
    .pipe(inject(gulp.src(['src/partials/footer.html']), {//inject facebook pixel code
      starttag: '<!-- inject:footer:html -->',
      transform: function(filepath, file) {
        return file.contents.toString();
      }
    }))
    .pipe(inject(gulp.src(['src/partials/header.html']), {//inject facebook pixel code
      starttag: '<!-- inject:header:html -->',
      transform: function(filepath, file) {
        return file.contents.toString();
      }
    }))
    .pipe(inject(gulp.src(['src/partials/fonts.html']), {//inject facebook pixel code
      starttag: '<!-- inject:fonts:html -->',
      transform: function(filepath, file) {
        return file.contents.toString();
      }
    }))
    .pipe(strip())//remove all comments
    .pipe(replace('src="/', 'src="' + cdn + "/"))
    .pipe(replace('src="./', 'src="' + cdn + "/"))
    .pipe(replace('src="assets/', 'src="' + cdn + "/assets/"))
    .pipe(htmlmin({collapseWhitespace: true}))//minify html page
    .pipe(gulp.dest('./prod'));//create files
});


gulp.task('production', function () {
  console.log("production");
  var option, i = process.argv.indexOf("--cdn");
  if(i>-1) {
      option = process.argv[i+1];
      console.log("cdn: " + option);
      runSequence(
        'prod-clean',
        'prod-copy-assets',
        ['prod-sass',
        'prod-copy-js',
        'prod-copy-vendor-js',
        'prod-copy-css'],
        'prod-inject-cdn'
      );
  }else{
    runSequence(
      'prod-clean',
      'prod-copy-assets',
      ['prod-sass',
      'prod-copy-js',
      'prod-copy-vendor-js',
      'prod-copy-css'],
      'prod-inject'
    );
    if(process.argv.indexOf("--visual")>-1){
      browserSync.init({
        server: "prod/",
        notify: false
      });
    }
}
});
gulp.task('default', ['watch']);