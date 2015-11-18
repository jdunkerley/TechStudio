/// <reference path='typings/node/node.d.ts' />

let gulp = require('gulp');
let ts = require('gulp-typescript');
let sourcemaps = require('gulp-sourcemaps');

let createProject = () => ts.createProject('tsconfig.json');

let paths = {
    src: {
        ts: './src/ts/',
        js: './src/js/',
        dist: './dist/'
    },
    tests: {
        ts: './tests/ts/',
        js: './tests/js/'
    }
};

let files = {
    src: {
        ts: paths.src.ts + '**/*.ts',
        js: paths.src.js + '**/*.js',
        maps: paths.src.js + '**/*.js.map'
    },
    tests: {
        specs: {
            ts: paths.tests.ts + '**/*[Ss]pec.ts',
            js: paths.tests.js + '**/*[Ss]pec.js'
        },
        ts: paths.tests.ts + '**/*.ts',
        js: paths.tests.js + '**/*.js',
        maps: paths.tests.js + '**/*.js.map'
    },
    releaseName: 'techstudio.js',
    gulp: 'gulp-file.ts'
};

gulp.task('lint', () => {
    let tslint = require('gulp-tslint');

    return gulp.src([files.src.ts, files.tests.ts, files.gulp])
        .pipe(tslint())
        .pipe(tslint.report('verbose'));
});

gulp.task('clean', () => {
    let del = require('del');

    let src = [files.src.js, files.src.maps],
        tests = [files.tests.js, files.tests.maps],
        dist = [paths.src.dist + '**/*'];

    return del(src.concat(tests).concat(dist));
});

// Because the tests are transpiling src on the fly cleaning the transpiled src
// is safe.
gulp.task('build:tests', ['lint', 'clean'], () => {
    let tsProject = createProject();

    return gulp.src(files.tests.specs.ts)
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.tests.js));
});

// The tests are transpiling the src ts files on the fly, so there is no
// dependency for building the source yet.
gulp.task('test', ['build:tests'], () => {
    let jasmine = require('gulp-jasmine');

    return gulp.src(files.tests.specs.js)
        .pipe(jasmine());
});

gulp.task('build:src', ['lint', 'clean'], () => {
    let tsProject = createProject();

    return gulp.src(files.src.ts)
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.src.js));
});

gulp.task('build', ['build:tests', 'build:src']);

gulp.task('concat', ['build', 'test'], () => {
    let concat = require('gulp-concat');

    return gulp.src(files.src.js)
        .pipe(concat(files.releaseName))
        .pipe(gulp.dest(paths.src.dist));
});

gulp.task('min', ['concat'], () => {
    let rename = require('gulp-rename');
    let uglify = require('gulp-uglify');

    return gulp.src(paths.src.dist + files.releaseName)
        .pipe(rename({ extname: '.min.js' }))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.src.dist));
});

gulp.task('watch', () =>
    gulp.watch([files.src.ts, files.tests.specs.ts, files.gulp], ['lint', 'build', 'test']));

gulp.task('default', ['watch']);
