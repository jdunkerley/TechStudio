/// <reference path='typings/node/node.d.ts' />

let gulp = require('gulp');
let del = require('del');
let ts = require('gulp-typescript');
let sourcemaps = require('gulp-sourcemaps');
let tslint = require('gulp-tslint');
let jsmine = require('gulp-jasmine');
let concat = require('gulp-concat');
let rename = require('gulp-rename');
let uglify = require('gulp-uglify');

let createProject = () => ts.createProject('tsconfig.json');

let paths = {
    src: {
        app: 'src/app/',
        js: 'src/js/',
        maps: './maps/'
    },
    tests: {
        app: 'tests/app/',
        js: 'tests/js/',
        maps: './maps/'
    },
    dest: 'dist/'
};

let files = {
    app: {
        ts: paths.src.app + '**/*.ts',
        js: paths.src.js + '**/*.js'
    },
    test: {
        specs: {
            ts: paths.tests.app + '**/*[Ss]pec.ts',
            js: paths.tests.js + '**/*[Ss]pec.js'
        },
        ts: paths.tests.app + '**/*.ts',
        js: paths.tests.js + '**/*.*'
    },
    releaseName: 'techstudio.js',
    gulp: 'gulp-file.ts'
};

gulp.task('lint', () => {
    return gulp.src([files.app.ts, files.test.ts, files.gulp])
        .pipe(tslint())
        .pipe(tslint.report('verbose'));
});

gulp.task('clean', () => { return del([files.app.js, paths.dest + '**/*']); });

gulp.task('cleanTests', () => { return del([files.test.js]); });

gulp.task('buildTests', ['lint', 'cleanTests'], () => {
    let tsProject = createProject();

    return gulp.src(files.test.specs.ts)
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject))
        .pipe(sourcemaps.write(paths.tests.maps))
        .pipe(gulp.dest(paths.tests.js));
});

gulp.task('test', ['buildTests'], () => {
    return gulp.src(files.test.specs.js)
        .pipe(jsmine());
});

gulp.task('build', ['lint', 'clean'], () => {
    let tsProject = createProject();

    return gulp.src(files.app.ts)
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject))
        .pipe(sourcemaps.write(paths.src.maps))
        .pipe(gulp.dest(paths.src.js));
});

gulp.task('concat', ['test', 'build'], () => {
    return gulp.src(files.app.js)
        .pipe(concat(files.releaseName))
        .pipe(gulp.dest(paths.dest));
});

gulp.task('uglify', ['concat'], () =>
    gulp.src(paths.dest + files.releaseName)
        .pipe(rename({ extname: '.min.js' }))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dest)));

gulp.task('watch', () =>
    gulp.watch([files.app.ts, files.test.specs.ts, files.gulp], ['lint', 'test', 'build']));

gulp.task('default', ['lint', 'test', 'build']);
