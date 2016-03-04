'use strict';
var fs = require("fs");
var browserify = require('browserify');
var postcss = require('gulp-postcss');
var gulp = require('gulp');
var vueify = require('vueify');
var autoprefixer = require('autoprefixer');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var cleanCSS = require('gulp-clean-css');
var mqpacker = require('css-mqpacker');
var csswring = require('csswring');
var uglify = require('gulp-uglify');
var ignore = require('gulp-ignore');
var zip = require('gulp-zip');

var concat = require('gulp-concat-util');

var file = require('gulp-file');

var pkg = require('./package.json');
var config = require('./setup/setup.js');

var banner = ['/**',
  'Theme Name: '+ pkg.name +'',
  'Theme URI: '+ pkg.theme_infos.uri +'',
  'Version: '+ pkg.version +'',
  'Author: '+ pkg.author.name +'',
  'Author URI: '+ pkg.author.url +'',
  'Description: '+ pkg.description +'',
  'Text Domain: '+ pkg.theme_infos.textdomain +'',
  ' */',
  ''].join('\n');



gulp.task('sass', function () {
    var stream = gulp.src('./assets/css/src/'+ pkg.theme_infos.textdomain +'.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./'))   
        .pipe(gulp.dest('./assets/css/'))
    return stream;
});

gulp.task('postcss', function () {
    var processors = [
        autoprefixer({browsers: ['last 1 version']}),
        mqpacker,
        csswring
    ];
    return gulp.src('./assets/css/'+ pkg.theme_infos.textdomain +'.css')
        .pipe(postcss(processors))
        .pipe(concat(pkg.theme_infos.textdomain +'.min.css'))
        .pipe(gulp.dest('./assets/css/'));
});

gulp.task('css',['sass'], function () {
    gulp.start('postcss');
});

gulp.task('wp', function () {
    
return  file('index.php', config.setupindexphp, { src: true }).pipe(gulp.dest('./')) &&      
        file('header.php', config.setupheaderphp, { src: true }).pipe(gulp.dest('./')) &&
        file('footer.php', config.setupfooterphp, { src: true }).pipe(gulp.dest('./')) &&
        file('functions.php', config.setupfuncphp, { src: true }).pipe(gulp.dest('./'))&&
        file('core.php', config.setupcorephp, { src: true }).pipe(gulp.dest('./includes/functions/'))&&
        file('style.css', banner, { src: true }).pipe(gulp.dest('./'))&&
        file(pkg.theme_infos.textdomain +'.scss', config.setupmainscss, { src: true }).pipe(gulp.dest('./assets/css/src/'))&&
        file('_variables.scss', '', { src: true }).pipe(gulp.dest('./assets/css/src/scss/'))&&
        file('_global.scss', '', { src: true }).pipe(gulp.dest('./assets/css/src/scss/'))&&
        file('_mixins.scss', '', { src: true }).pipe(gulp.dest('./assets/css/src/scss/'))&&
        file(pkg.theme_infos.textdomain +'.js', config.setupmainjs, { src: true }).pipe(gulp.dest('./assets/js/src/'))
});

gulp.task('brows', function() {
    return browserify('./assets/js/src/'+pkg.theme_infos.textdomain +'.js')
        .transform(vueify)
        .bundle()
        .pipe(fs.createWriteStream('./assets/js/'+pkg.theme_infos.textdomain +'.js'))
});

gulp.task('js',['brows'], function () {
     return gulp.src('./assets/js/'+pkg.theme_infos.textdomain +'.js')
    .pipe(concat(pkg.theme_infos.textdomain +'.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./assets/js'));
});

gulp.task('watch', function () {
  gulp.watch('./assets/css/src/scss/*.scss', ['css']);
  gulp.watch('./assets/js/src/*.js', ['brows']);
  gulp.watch('./assets/vues/*.vue', ['brows']);
});

gulp.task('dist', function () {
    return gulp.src('./**/*.*') // much faster 
    .pipe(ignore.exclude(['node_modules/**','setup/**','assets/css/src/**','assets/js/src/**','assets/vues/*.*','dist/**']))
    .pipe(gulp.dest('./dist/'+ pkg.version +'/'+ pkg.name));
    
});

gulp.task('distnpm', function () {
    return gulp.src('./**/*.*') // much faster 
    .pipe(ignore.exclude(['node_modules/**','bower_components/**','includes/**','distnpm/**','assets/css/**','assets/js/**','dist/**','*.php','*.css']))
    .pipe(gulp.dest('./distnpm/'+ pkg.version +'/'+ pkg.name));
    
});

gulp.task('zip',['dist'], function () {
   return gulp.src('./dist/'+pkg.version+'/**/*.*')
		.pipe(zip(pkg.name +'_'+ pkg.version+'.zip'))
		.pipe(gulp.dest('dist'));    
});

gulp.task('build',['js','css'], function () {
    gulp.start('zip');
});
