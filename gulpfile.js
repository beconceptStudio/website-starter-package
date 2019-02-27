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
var ftp = require('vinyl-ftp');//FTP plugin

var config = require('./project-config.json');
var configFTP = require('./ftp-config.json');

gulp.task('watch', [], function() {
  runSequence('clean',
  'sass',
  ['copy-assets', 'copy-js', 'copy-vendor-js', 'copy-css'],
  'create-cookie-file',
  'inject',
  function(){
    console.log("initial setup terminates");    

    //start browser sync after all actions are completed
    browserSync.init({
      server: config.paths.tmp.folder,
      notify: false
    });

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
  return gulp.src(config.paths.src.vendor.css.watch)
        .pipe(gulp.dest(config.paths.tmp.vendor.css))
        .pipe(browserSync.stream());
});

// Copy js files & auto-inject into browsers
gulp.task('copy-js', function() {
  return gulp.src(config.paths.src.js.watch)
        .pipe(gulp.dest(config.paths.tmp.js))
        .pipe(browserSync.stream());
});

// Copy vendor js files & auto-inject into browsers
gulp.task('copy-vendor-js', function() {
  return gulp.src(config.paths.src.vendor.js.watch)
        .pipe(gulp.dest(config.paths.tmp.vendor.js))
        .pipe(browserSync.stream());
});

// Compile sass & auto-inject into browsers
gulp.task('sass', function() {

  return gulp.src(config.paths.src.scss.entrypoint)
        .pipe(wait(500))
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
        .pipe(gulp.dest(config.paths.tmp.css))
        .pipe(browserSync.stream());
});

gulp.task('inject', function () {
  var target = gulp.src(config.paths.src.html.watch);
 
  var sources = gulp.src(config.paths.tmp.injectarray, {'cwd': __dirname + '/' + config.paths.tmp.folder});
  return target.pipe(inject(sources))
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
  .pipe(inject(gulp.src(['src/partials/out-of-the-wrapper.html']), {//inject code outside the wrappers
    starttag: '<!-- inject:outofthewrapper:html -->',
    transform: function(filepath, file) {
      return file.contents.toString();
    }
  }))
    .pipe(gulp.dest(config.paths.tmp.folder)).pipe(browserSync.stream());
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

  return gulp.src([config.paths.prod.folder], { read: false })
  .pipe(clean());
});


gulp.task('prod-copy-assets', [], function() {

  return gulp.src([config.paths.assets.allfiles]).pipe(gulp.dest(config.paths.prod.assets));
});


// Copy vendor css files & auto-inject into browsers
gulp.task('prod-copy-css', function() {
  return gulp.src(config.paths.src.vendor.css.watch)
            .pipe(cleanCSS({compatibility: 'ie8'}))
            .pipe(rename('vendor.min.css'))
            .pipe(gulp.dest(config.paths.prod.vendor.css));
});

// Copy js files & auto-inject into browsers
gulp.task('prod-copy-js', function() {
  
  return gulp.src(config.paths.src.js.watch)
  .pipe(concat("scripts.js"))
  .pipe(rename('scripts.min.js'))
  .pipe(uglify().on('error', gutil.log))
  .pipe(gulp.dest(config.paths.prod.js));
});

// Copy vendor js files & auto-inject into browsers
gulp.task('prod-copy-vendor-js', function() {
  return gulp.src(config.paths.src.vendor.js.watch)
  .pipe(concat("scripts.js"))
  .pipe(rename('vendor.min.js'))
  .pipe(uglify().on('error', gutil.log))
  .pipe(gulp.dest(config.paths.prod.vendor.js));
});

// Compile sass & auto-inject into browsers
gulp.task('prod-sass', function() {

  return gulp.src(config.paths.src.scss.entrypoint)
      .pipe(sass().on('error', sass.logError))
      .pipe(concat("main.css"))
      .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(rename('main.min.css'))
      .pipe(gulp.dest(config.paths.prod.css));
});

gulp.task('prod-inject', function () {
  var target = gulp.src(config.paths.src.html.watch);
 
  var sources = gulp.src(config.paths.prod.injectarray, {'cwd': __dirname + '/' + config.paths.prod.folder});
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
    .pipe(inject(gulp.src(['src/partials/out-of-the-wrapper.html']), {//inject code outside the wrappers
      starttag: '<!-- inject:outofthewrapper:html -->',
      transform: function(filepath, file) {
        return file.contents.toString();
      }
    }))
    .pipe(strip())//remove all comments
    .pipe(htmlmin({collapseWhitespace: true}))//minify html page
    .pipe(gulp.dest(config.paths.prod.folder));//create files
});


gulp.task('prod-inject-cdn', function () {
  
  var cdn, i = process.argv.indexOf("--cdn");
  cdn = process.argv[i+1];
  
  var target = gulp.src(config.paths.src.html);

  var sources = gulp.src(config.paths.prod.injectarray, {'cwd': __dirname + '/' + config.paths.tmp.folder});
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
    .pipe(inject(gulp.src(['src/partials/out-of-the-wrapper.html']), {//inject code outside the wrappers
      starttag: '<!-- inject:outofthewrapper:html -->',
      transform: function(filepath, file) {
        return file.contents.toString();
      }
    }))
    .pipe(strip())//remove all comments
    .pipe(replace('src="/', 'src="' + cdn + "/"))
    .pipe(replace('src="./', 'src="' + cdn + "/"))
    .pipe(replace('src="assets/', 'src="' + cdn + "/assets/"))
    .pipe(htmlmin({collapseWhitespace: true}))//minify html page
    .pipe(gulp.dest(config.paths.prod.folder));//create files
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
        server: config.paths.prod.folder,
        notify: false
      });
    }
}
});
gulp.task('default', ['watch']);



//START STAGING



gulp.task('stg-clean', [], function () {
  console.log("Clean all files in build folder");

  return gulp.src([config.paths.tmp.folder], {
    read: false
  }).pipe(clean());
});


gulp.task('stg-copy-assets', [], function () {

  return gulp.src([config.paths.assets.allfiles]).pipe(gulp.dest(config.paths.tmp.assets));
});

// Copy vendor css files & auto-inject into browsers
gulp.task('stg-copy-css', function () {
  return gulp.src(config.paths.src.vendor.css.watch)
    .pipe(gulp.dest(config.paths.tmp.vendor.css));
});

// Copy js files & auto-inject into browsers
gulp.task('stg-copy-js', function () {
  return gulp.src(config.paths.src.js.watch)
    .pipe(concat("scripts.js"))
    .pipe(rename('scripts.min.js'))
    .pipe(gulp.dest(config.paths.tmp.js));
});

// Copy vendor js files & auto-inject into browsers
gulp.task('stg-copy-vendor-js', function () {
  return gulp.src(config.paths.src.vendor.js.watch)
    .pipe(concat("vendor.scripts.js"))
    .pipe(rename('scripts.min.js'))
    .pipe(gulp.dest(config.paths.tmp.vendor.js));
});

// Compile sass & auto-inject into browsers
gulp.task('stg-sass', function () {

  return gulp.src(config.paths.src.scss.entrypoint)
    .pipe(wait(500))
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer({
      browsers: ['last 2 versions']
    })]))
    .pipe(replace('url\\(/assets', 'url(' + configFTP.startFolder + "assets"))
    .pipe(replace('url\\(assets', 'url(' + configFTP.startFolder + "assets"))
    .pipe(replace("url\\('/assets", "url('" + configFTP.startFolder + "assets"))
    .pipe(replace("url\\('assets", "url('" + configFTP.startFolder + "assets"))
    .pipe(gulp.dest(config.paths.tmp.css));
});

gulp.task('stg-inject', function () {
  var target = gulp.src(config.paths.src.html.watch);

  var sources = gulp.src(config.paths.tmp.injectarray, {
    'cwd': __dirname + '/' + config.paths.tmp.folder
  });
  return target.pipe(inject(sources))

    .pipe(inject(gulp.src(['othercode/vendorremotecode.html']), { //inject facebook pixel code
      starttag: '<!-- inject:vendorremotecode:html -->',
      transform: function (filepath, file) {
        return file.contents.toString();
      }
    }))
    .pipe(inject(gulp.src(['src/partials/footer.html']), { //inject facebook pixel code
      starttag: '<!-- inject:footer:html -->',
      transform: function (filepath, file) {
        return file.contents.toString();
      }
    }))
    .pipe(inject(gulp.src(['src/partials/header.html']), { //inject facebook pixel code
      starttag: '<!-- inject:header:html -->',
      transform: function (filepath, file) {
        return file.contents.toString();
      }
    }))
    .pipe(inject(gulp.src(['src/partials/fonts.html']), { //inject facebook pixel code
      starttag: '<!-- inject:fonts:html -->',
      transform: function (filepath, file) {
        return file.contents.toString();
      }
    }))
    .pipe(inject(gulp.src(['src/partials/out-of-the-wrapper.html']), { //inject code outside the wrappers
      starttag: '<!-- inject:outofthewrapper:html -->',
      transform: function (filepath, file) {
        return file.contents.toString();
      }
    }))
    .pipe(replace('src="/', 'src="' + configFTP.startFolder))
    .pipe(replace('src="./', 'src="' + configFTP.startFolder))
    .pipe(replace('src="assets/', 'src="' + configFTP.startFolder + "assets/"))
    .pipe(replace('href="/', 'href="' + configFTP.startFolder))
    .pipe(replace('href="./', 'href="' + configFTP.startFolder))
    .pipe(replace('href="assets/', 'href="' + configFTP.startFolder + "assets/"))
    .pipe(gulp.dest(config.paths.tmp.folder));
});





gulp.task("stg-ft-upload", () => {

  var configf = configFTP;
  configf.log = gutil.log;
  var conn = ftp.create(configf);

  return gulp.src(["tmp/**", "!tmp/assets/**", "!tmp/kernel/**"], {
      buffer: true,
      reload: true
    })
    .pipe(conn.newerOrDifferentSize("/")) // only upload newer files
    .pipe(conn.dest("/"));


});

//END STAGING

//staging task
gulp.task("staging", () => {
  runSequence('clean',
    'sass',
    ['copy-js', 'copy-vendor-js', 'copy-css'],
    'create-cookie-file',
    'inject',
    'stg-ft-upload',
    function () {
      console.log("UPLOADED TO STAGING SERVER");
    });
});