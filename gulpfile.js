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
var strip = require('gulp-strip-comments'); //strip comments from files
var htmlmin = require('gulp-htmlmin'); //minify html
var replace = require('gulp-string-replace'); //string raplace in case of cdn
var wait = require('gulp-wait');
const stripDebug = require('gulp-strip-debug');
var ftp = require('vinyl-ftp');
var sitemap = require('gulp-sitemap');
// var prompt = require('gulp-prompt');
const readlineSync = require('readline-sync');

var config = require('./project-config.json');
var configFTP = require('./ftp-config.json');
var configFTP_PROD = require('./prod-ftp-config.json');

gulp.task('watch', [], function () {
  runSequence('clean',
    'sass',
    ['copy-assets', 'copy-js', 'copy-js2', 'copy-vendor-js2', 'copy-vendor-js', 'copy-css'],
    'create-cookie-file',
    'inject',
    function () {
      console.log("initial setup terminates");

      //start browser sync after all actions are completed
      browserSync.init({
        server: config.paths.tmp.folder,
        notify: false
      });

    });

  var scssPaths = config.paths.src.scss.watch;

  gulp.watch(scssPaths, ['sass']);
  gulp.watch(config.paths.src.html.watch, ['inject']);
  gulp.watch(config.paths.src.vendor.css.watch, ['copy-css']);
  gulp.watch(config.paths.src.js.watch, ['copy-js']);
  gulp.watch(config.paths.src.js.watch2, ['copy-js2']);
  gulp.watch(config.paths.src.vendor.js.watch, ['copy-vendor-js']);
  gulp.watch(config.paths.src.vendor.js.watch2, ['copy-vendor-js2']);
});

gulp.task('clean', [], function () {
  console.log("Clean all files in build folder");

  return gulp.src([config.paths.tmp.folder], {
    read: false
  }).pipe(clean());
});


gulp.task('copy-assets', [], function () {

  return gulp.src([config.paths.assets.allfiles]).pipe(gulp.dest(config.paths.tmp.assets));
});

// Copy vendor css files & auto-inject into browsers
gulp.task('copy-css', function () {
  return gulp.src(config.paths.src.vendor.css.watch)
    .pipe(gulp.dest(config.paths.tmp.vendor.css))
    .pipe(browserSync.stream());
});
// Copy js files & auto-inject into browsers
gulp.task('copy-js', function () {
  return gulp.src(config.paths.src.js.watch)
    .pipe(gulp.dest(config.paths.tmp.js))
    .pipe(browserSync.stream());
});
// Copy js files & auto-inject into browsers
gulp.task('copy-js2', function () {
  return gulp.src(config.paths.src.js.watch2)
    .pipe(gulp.dest(config.paths.tmp.js))
    .pipe(browserSync.stream());
});
// Copy vendor js files & auto-inject into browsers
gulp.task('copy-vendor-js', function () {
  return gulp.src(config.paths.src.vendor.js.watch)
    .pipe(gulp.dest(config.paths.tmp.vendor.js))
    .pipe(browserSync.stream());
});
// Copy vendor js files & auto-inject into browsers
gulp.task('copy-vendor-js2', function () {
  return gulp.src(config.paths.src.vendor.js.watch2)
    .pipe(gulp.dest(config.paths.tmp.vendor.js))
    .pipe(browserSync.stream());
});

// Compile sass & auto-inject into browsers
gulp.task('sass', function () {

  return gulp.src(config.paths.src.scss.entrypoint)
    .pipe(wait(500))
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer({
      browsers: ['last 2 versions']
    })]))
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(gulp.dest(config.paths.tmp.css))
    .pipe(browserSync.stream());
});

gulp.task('inject', function () {
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
    .pipe(inject(gulp.src(['src/partials/footer-en.html']), { //inject facebook pixel code
      starttag: '<!-- inject:footeren:html -->',
      transform: function (filepath, file) {
        return file.contents.toString();
      }
    }))
    .pipe(inject(gulp.src(['src/partials/header-en.html']), { //inject facebook pixel code
      starttag: '<!-- inject:headeren:html -->',
      transform: function (filepath, file) {
        return file.contents.toString();
      }
    }))
    .pipe(inject(gulp.src(['src/partials/fonts-en.html']), { //inject facebook pixel code
      starttag: '<!-- inject:fontsen:html -->',
      transform: function (filepath, file) {
        return file.contents.toString();
      }
    }))
    .pipe(inject(gulp.src(['src/partials/out-of-the-wrapper-en.html']), { //inject code outside the wrappers
      starttag: '<!-- inject:outofthewrapperen:html -->',
      transform: function (filepath, file) {
        return file.contents.toString();
      }
    }))
    .pipe(gulp.dest(config.paths.tmp.folder)).pipe(browserSync.stream());
});



gulp.task('create-cookie-file', function () {
  var target = gulp.src('othercode/cookie-script/js-template.js');
  return target.pipe(inject(gulp.src(['othercode/cookie-script/html-code.html']), { //inject cookie code
      starttag: '<!-- inject:js -->',
      transform: function (filepath, file) {
        var content = file.contents.toString();
        content = content.replace(/<\!--.*?-->/g, "");
        content = content.replace(/\r?\n|\r/g, "");
        content = content.replace("'", "\"");

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
    .pipe(gulp.dest('./src/js/')).pipe(browserSync.stream());
});

//START STAGING

// Copy js files & auto-inject into browsers
gulp.task('stg-copy-js', function () {
  return gulp.src(config.paths.src.js.watch)
    .pipe(concat("scripts.js"))
    .pipe(rename('scripts.min.js'))
    .pipe(stripDebug())
    .pipe(uglify().on('error', gutil.log))
    .pipe(gulp.dest(config.paths.tmp.js))
    .pipe(browserSync.stream());
});
// Copy js files & auto-inject into browsers
gulp.task('stg-copy-js2', function () {
  return gulp.src(config.paths.src.js.watch2)
    .pipe(concat("loader.js"))
    .pipe(rename('loader.min.js'))
    .pipe(stripDebug())
    .pipe(uglify().on('error', gutil.log))
    .pipe(gulp.dest(config.paths.tmp.js))
    .pipe(browserSync.stream());
});

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
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(gulp.dest(config.paths.tmp.vendor.css));
});
// Copy vendor js files & auto-inject into browsers
gulp.task('stg-copy-vendor-js', function () {
  return gulp.src(config.paths.src.vendor.js.watch)
    .pipe(concat("scripts.js"))
    .pipe(rename('scripts.min.js'))
    .pipe(uglify().on('error', gutil.log))
    .pipe(gulp.dest(config.paths.tmp.vendor.js))
    .pipe(browserSync.stream());
});
// Copy vendor js files & auto-inject into browsers
gulp.task('stg-copy-vendor-js2', function () {
  return gulp.src(config.paths.src.vendor.js.watch2)
    .pipe(concat("scripts2.js"))
    .pipe(rename('scripts2.min.js'))
    .pipe(uglify().on('error', gutil.log))
    .pipe(gulp.dest(config.paths.tmp.vendor.js))
    .pipe(browserSync.stream());
});

// Compile sass & auto-inject into browsers
gulp.task('stg-sass', function () {

  return gulp.src(config.paths.src.scss.entrypoint)
    .pipe(wait(500))
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer({
      browsers: ['last 2 versions']
    })]))
    .pipe(replace('url\\(/assets', 'url(/' + configFTP.startFolder + "/assets"))
    .pipe(replace('url\\(assets', 'url(/' + configFTP.startFolder + "/assets"))
    .pipe(replace("url\\('/assets", "url(/'" + configFTP.startFolder + "/assets"))
    .pipe(replace("url\\('assets", "url(/'" + configFTP.startFolder + "/assets"))
    .pipe(replace('url\\("/assets', 'url("/' + configFTP.startFolder + "/assets"))
    .pipe(replace('url\\("assets', 'url("/' + configFTP.startFolder + "/assets"))
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(gulp.dest(config.paths.tmp.css));
});

gulp.task('stg-inject', function () {
  var target = gulp.src(config.paths.src.html.watch);

  var sources = gulp.src(config.paths.tmp.injectarray, {
    'cwd': __dirname + '/' + config.paths.tmp.folder
  });
  return target.pipe(inject(sources, {
      transform: (path, file) => {
        if (path.toLowerCase().indexOf(".js") !== -1 && path.toLowerCase().indexOf("loader") !== -1) {
          return `<script src="${path}" ></script>`;
        } else {
          if (path.toLowerCase().indexOf(".js") !== -1 && path.toLowerCase().indexOf("scripts2") !== -1) {
            return `<script src="${path}" ></script>`;
          } else {
            if (path.toLowerCase().indexOf(".js") !== -1)
              return `<script src="${path}" defer></script>`;
            else {
              if (path.toLowerCase().indexOf("loader.css") !== -1)
                return `<link rel="stylesheet" href="${path}"/>`;
              else {
                /*<noscript>
                <link rel="stylesheet" type="text/css" href="../css/yourcssfile.css" />
                <link rel="stylesheet" type="text/css" href="../css/yourcssfile2.css" />
                </noscript> */

                // var string = "<script>var giftofspeed2 = document.createElement('link');giftofspeed2.rel = 'stylesheet';giftofspeed2.href = '/beconcept/" + path + "';giftofspeed2.type = 'text/css'; document.getElementsByTagName('head')[0].appendChild( giftofspeed2 );</script>"
                // return string;
                //return `<link rel="stylesheet" href="${path}" defer/>`;
              }
            }
          }
        }
      }
    }))
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
    .pipe(inject(gulp.src(['src/partials/footer-en.html']), { //inject facebook pixel code
      starttag: '<!-- inject:footeren:html -->',
      transform: function (filepath, file) {
        return file.contents.toString();
      }
    }))
    .pipe(inject(gulp.src(['src/partials/header-en.html']), { //inject facebook pixel code
      starttag: '<!-- inject:headeren:html -->',
      transform: function (filepath, file) {
        return file.contents.toString();
      }
    }))
    .pipe(inject(gulp.src(['src/partials/fonts-en.html']), { //inject facebook pixel code
      starttag: '<!-- inject:fontsen:html -->',
      transform: function (filepath, file) {
        return file.contents.toString();
      }
    }))
    .pipe(inject(gulp.src(['src/partials/out-of-the-wrapper-en.html']), { //inject code outside the wrappers
      starttag: '<!-- inject:outofthewrapperen:html -->',
      transform: function (filepath, file) {
        return file.contents.toString();
      }
    }))
    .pipe(replace('src="/', 'src="/' + configFTP.startFolder + "/"))
    .pipe(replace('src="./', 'src="/' + configFTP.startFolder + "/"))
    .pipe(replace('src="assets/', 'src="/' + configFTP.startFolder + "/assets/"))
    .pipe(replace('href="/', 'href="/' + configFTP.startFolder + "/"))
    .pipe(replace('href="./', 'href="/' + configFTP.startFolder + "/"))
    .pipe(replace('href="assets/', 'href="/' + configFTP.startFolder + "/assets/"))
    .pipe(strip()) //remove all comments
    .pipe(htmlmin({
      collapseWhitespace: true
    })) //minify html page
    .pipe(gulp.dest(config.paths.tmp.folder));
});



gulp.task("stg-ft-upload", () => {

  var configf = configFTP;
  configf.log = gutil.log;
  var conn = ftp.create(configf);

  return gulp.src(["tmp/**", "tmp/sitemap.xml", "!tmp/assets/**", "!tmp/kernel/**", "!tmp/partials/*.html"], {
      buffer: true,
      reload: true
    })
    .pipe(conn.newerOrDifferentSize("/")) // only upload newer files
    .pipe(conn.dest("/"));


});

//END STAGING

//START PRODUCTION

// Copy js files & auto-inject into browsers
gulp.task('prod-copy-js', function () {
  return gulp.src(config.paths.src.js.watch)
    .pipe(concat("scripts.js"))
    .pipe(rename('scripts.min.js'))
    .pipe(stripDebug())
    .pipe(uglify().on('error', gutil.log))
    .pipe(gulp.dest(config.paths.tmp.js));
});
// Copy js files & auto-inject into browsers
gulp.task('prod-copy-js2', function () {
  return gulp.src(config.paths.src.js.watch2)
    .pipe(concat("loader.js"))
    .pipe(rename('loader.min.js'))
    .pipe(stripDebug())
    .pipe(uglify().on('error', gutil.log))
    .pipe(gulp.dest(config.paths.tmp.js));
});

gulp.task('prod-clean', [], function () {
  console.log("Clean all files in build folder");

  return gulp.src([config.paths.tmp.folder], {
    read: false
  }).pipe(clean());
});


gulp.task('prod-copy-assets', [], function () {

  return gulp.src([config.paths.assets.allfiles]).pipe(gulp.dest(config.paths.tmp.assets));
});

// Copy vendor css files & auto-inject into browsers
gulp.task('prod-copy-css', function () {
  return gulp.src(config.paths.src.vendor.css.watch)
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(gulp.dest(config.paths.tmp.vendor.css));
});
// Copy vendor js files & auto-inject into browsers
gulp.task('prod-copy-vendor-js', function () {
  return gulp.src(config.paths.src.vendor.js.watch)
    .pipe(concat("scripts.js"))
    .pipe(rename('scripts.min.js'))
    .pipe(uglify().on('error', gutil.log))
    .pipe(gulp.dest(config.paths.tmp.vendor.js));
});
// Copy vendor js files & auto-inject into browsers
gulp.task('prod-copy-vendor-js2', function () {
  return gulp.src(config.paths.src.vendor.js.watch2)
    .pipe(concat("scripts2.js"))
    .pipe(rename('scripts2.min.js'))
    .pipe(uglify().on('error', gutil.log))
    .pipe(gulp.dest(config.paths.tmp.vendor.js));
});

// Compile sass & auto-inject into browsers
gulp.task('prod-sass', function () {

  return gulp.src(config.paths.src.scss.entrypoint)
    .pipe(wait(500))
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer({
      browsers: ['last 2 versions']
    })]))
    // .pipe(replace('url\\(/assets', 'url(/' + configFTP.startFolder + "/assets"))
    // .pipe(replace('url\\(assets', 'url(/' + configFTP.startFolder + "/assets"))
    // .pipe(replace("url\\('/assets", "url(/'" + configFTP.startFolder + "/assets"))
    // .pipe(replace("url\\('assets", "url(/'" + configFTP.startFolder + "/assets"))
    // .pipe(replace('url\\("/assets', 'url("/' + configFTP.startFolder + "/assets"))
    // .pipe(replace('url\\("assets', 'url("/' + configFTP.startFolder + "/assets"))
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(gulp.dest(config.paths.tmp.css));
});

gulp.task('prod-inject', function () {
  var target = gulp.src(config.paths.src.html.watch);

  var sources = gulp.src(config.paths.tmp.injectarray, {
    'cwd': __dirname + '/' + config.paths.tmp.folder
  });
  return target.pipe(inject(sources, {
      transform: (path, file) => {
        if (path.toLowerCase().indexOf(".js") !== -1 && path.toLowerCase().indexOf("loader") !== -1) {
          return `<script src="${path}" ></script>`;
        } else {
          if (path.toLowerCase().indexOf(".js") !== -1 && path.toLowerCase().indexOf("scripts2") !== -1) {
            return `<script src="${path}" ></script>`;
          } else {
            if (path.toLowerCase().indexOf(".js") !== -1)
              return `<script src="${path}" defer></script>`;
            else {
              if (path.toLowerCase().indexOf("loader.css") !== -1)
                return `<link rel="stylesheet" href="${path}"/>`;
              else {
                /*<noscript>
                <link rel="stylesheet" type="text/css" href="../css/yourcssfile.css" />
                <link rel="stylesheet" type="text/css" href="../css/yourcssfile2.css" />
                </noscript> */

                // var string = "<script>var giftofspeed2 = document.createElement('link');giftofspeed2.rel = 'stylesheet';giftofspeed2.href = '/beconcept/" + path + "';giftofspeed2.type = 'text/css'; document.getElementsByTagName('head')[0].appendChild( giftofspeed2 );</script>"
                // return string;
                //return `<link rel="stylesheet" href="${path}" defer/>`;
              }
            }
          }
        }
      }
    }))
    .pipe(inject(gulp.src(['othercode/googleanalytics.html']), { //inject google analytics code
      starttag: '<!-- inject:googleanalytics:html -->',
      transform: function (filepath, file) {
        return file.contents.toString();
      }
    }))
    .pipe(inject(gulp.src(['othercode/facebookpixel.html']), { //inject facebook pixel code
      starttag: '<!-- inject:facebookpixel:html -->',
      transform: function (filepath, file) {
        return file.contents.toString();
      }
    }))
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
    .pipe(inject(gulp.src(['src/partials/footer-en.html']), { //inject facebook pixel code
      starttag: '<!-- inject:footeren:html -->',
      transform: function (filepath, file) {
        return file.contents.toString();
      }
    }))
    .pipe(inject(gulp.src(['src/partials/header-en.html']), { //inject facebook pixel code
      starttag: '<!-- inject:headeren:html -->',
      transform: function (filepath, file) {
        return file.contents.toString();
      }
    }))
    .pipe(inject(gulp.src(['src/partials/fonts-en.html']), { //inject facebook pixel code
      starttag: '<!-- inject:fontsen:html -->',
      transform: function (filepath, file) {
        return file.contents.toString();
      }
    }))
    .pipe(inject(gulp.src(['src/partials/out-of-the-wrapper-en.html']), { //inject code outside the wrappers
      starttag: '<!-- inject:outofthewrapperen:html -->',
      transform: function (filepath, file) {
        return file.contents.toString();
      }
    }))
    // .pipe(replace('src="/', 'src="/' + configFTP.startFolder + "/"))
    // .pipe(replace('src="./', 'src="/' + configFTP.startFolder + "/"))
    // .pipe(replace('src="assets/', 'src="/' + configFTP.startFolder + "/assets/"))
    // .pipe(replace('href="/', 'href="/' + configFTP.startFolder + "/"))
    // .pipe(replace('href="./', 'href="/' + configFTP.startFolder + "/"))
    // .pipe(replace('href="assets/', 'href="/' + configFTP.startFolder + "/assets/"))
    .pipe(strip()) //remove all comments
    .pipe(htmlmin({
      collapseWhitespace: true
    })) //minify html page
    .pipe(gulp.dest(config.paths.tmp.folder));
});

gulp.task('build-prompt', function (done) {
  if (readlineSync.keyInYN('Do you want to build to production server?')) {
    return done();
  }
  console.log('Ok, not building.');
  process.exit(1);
});

gulp.task("prod-ft-upload", () => {

  var configf = configFTP_PROD;
  configf.log = gutil.log;
  var conn = ftp.create(configf);

  return gulp.src(["tmp/**", "tmp/sitemap.xml", "!tmp/assets/**", "!tmp/kernel/**", "!tmp/partials/*.html"], {
      buffer: true,
      reload: true
    })
    .pipe(conn.newerOrDifferentSize("/")) // only upload newer files
    .pipe(conn.dest("/"));


});


//END PRODUCTION


gulp.task('sitemap', function () {
  gulp.src(['tmp/**/*.html', '!tmp/partials/*.html'], {
      read: false
    })
    .pipe(sitemap({
      siteUrl: 'http://beconcept.studio'
    }))
    .pipe(gulp.dest('tmp'));
});

gulp.task("staging", () => {
  runSequence('clean',
    'stg-sass',
    'create-cookie-file',
    ['copy-assets', 'stg-copy-js', 'stg-copy-js2', 'stg-copy-vendor-js2', 'stg-copy-vendor-js', 'copy-css'],
    'stg-inject',
    // 'stg-ft-upload',
    function () {
      console.log("UPLOADED TO STAGING SERVER");
    });
});

gulp.task("production", () => {

  runSequence(
    'build-prompt',
    'clean',
    'prod-sass',
    'create-cookie-file',
    ['copy-assets', 'prod-copy-js', 'prod-copy-js2', 'prod-copy-vendor-js2', 'prod-copy-vendor-js', 'copy-css'],
    'prod-inject',
    'prod-ft-upload',
    function () {
      console.log("UPLOADED TO PRODUCTIO");
    });
});

gulp.task('default', ['watch']);
