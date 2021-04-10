const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

// Sass Task
function scssTask() {
	return src('src/scss/main.scss', { sourcemaps: true })
		.pipe(sass())
		.pipe(postcss([ cssnano() ]))
		.pipe(dest('dist/css', { sourcemaps: '.' }));
}

// JavaScript Task
function jsTask() {
	return src('src/js/main.js', { sourcemaps: true }).pipe(terser()).pipe(dest('dist/js', { sourcemaps: '.' }));
}

// Browsersync Tasks
function browsersyncServe(cb) {
	browsersync.init({
		server : {
			baseDir : '.'
		}
	});
	cb();
}

function browsersyncReload(cb) {
	browsersync.reload();
	cb();
}

// Watch Task
function watchTask() {
	watch('*.html', browsersyncReload);
	watch([ 'src/scss/**/*.scss', 'src/js/**/*.js' ], series(scssTask, jsTask, browsersyncReload));
}

// Default Gulp task
exports.default = series(scssTask, jsTask, browsersyncServe, watchTask);
