import * as gulp from 'gulp';
import * as ts from 'gulp-typescript';
import * as tslint from 'gulp-tslint';
import * as sourcemaps from 'gulp-sourcemaps';
import * as concat from 'gulp-concat';
import * as del from 'del';

// Not all modules can be imported with the ES6 syntax, (see https://github.com/Microsoft/TypeScript/issues/3612),
// so some have been left using the ES5 'require' syntax, inline.

let build = (src: string, dest: string) => gulp.src(src)
    .pipe(sourcemaps.init())
    .pipe(ts(ts.createProject('tsconfig.json')))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dest));

let srcDir = './src/',
    testsDir = './tests/',
    wildcard = '**/*';

let paths = {
    src: {
        ts: srcDir + 'ts/',
        js: srcDir + 'js/',
        dist: './dist/'
    },
    tests: {
        ts: testsDir + 'ts/',
        js: testsDir + 'js/'
    },
    site: {
        src: './appsrc/',
        app: './app/'
    }
};

let files = {
    src: {
        ts: paths.src.ts + wildcard + '.ts',
        js: paths.src.js + wildcard + '.js',
        maps: paths.src.js + wildcard + '.js.map'
    },
    tests: {
        specs: {
            ts: paths.tests.ts + wildcard + '[Ss]pec.ts',
            js: paths.tests.js + wildcard + '[Ss]pec.js'
        },
        ts: paths.tests.ts + wildcard + '.ts',
        js: paths.tests.js + wildcard + '.js',
        maps: paths.tests.js + wildcard + '.js.map'
    },
    site: {
        html: paths.site.src + wildcard + '.html',
        ts: paths.site.src + wildcard + '.ts'
    },
    releaseName: 'techstudio.js',
    gulp: 'gulp-file.ts'
};

let startServer = () => {
    let gls = require('gulp-live-server'),
        portNumber = 8080,
        server = gls.static(paths.site.app, portNumber);

    server.start();
};

gulp.task('lint', () => {
    return gulp.src([files.src.ts, files.tests.ts, files.site.ts, files.gulp])
        .pipe(tslint({}))
        .pipe(tslint.report('verbose'));
});

gulp.task('clean', () => {
    let src = [files.src.js, files.src.maps],
        tests = [files.tests.js, files.tests.maps],
        dist = [paths.src.dist + wildcard, paths.site.app + wildcard];

    return del(src.concat(tests).concat(dist));
});

// Because the tests are transpiling src on the fly cleaning the transpiled src is safe.
gulp.task('build:tests', ['lint', 'clean'], () => {
    return build(files.tests.specs.ts, paths.tests.js);
});

// The tests are transpiling the src ts files on the fly, so there is no dependency for building the source yet.
gulp.task('test', ['build:tests'], () => {
    let jasmine = require('gulp-jasmine');

    return gulp.src(files.tests.specs.js)
        .pipe(jasmine());
});

gulp.task('build:src', ['lint', 'clean'], () => {
    return build(files.src.ts, paths.src.js);
});

gulp.task('build:appsrc', ['lint', 'clean'], () => {
    return build(files.site.ts, paths.site.app);
});

// Compiles LESS > CSS
gulp.task('build:less', () => {
    let less = require('gulp-less');
    return gulp.src(paths.site.src + 'styles.less')
        .pipe(less())
        .pipe(gulp.dest(paths.site.app + '/css'));
});

gulp.task('build', ['build:tests', 'build:src', 'build:appsrc', 'build:less']);

gulp.task('concat', ['build', 'test'], () => {
    return gulp.src(files.src.js)
        .pipe(concat(files.releaseName))
        .pipe(gulp.dest(paths.src.dist));
});

gulp.task('min', ['concat'], () => {
    let rename = require('gulp-rename'),
        uglify = require('gulp-uglify');

    return gulp.src(paths.src.dist + files.releaseName)
        .pipe(rename({ extname: '.min.js' }))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.src.dist));
});

// This task copies the HTML, angular js and library js into a dist folder.
gulp.task('app:build', ['min'], () => {
    gulp.src([files.site.html, paths.src.dist + wildcard])
        .pipe(gulp.dest(paths.site.app));
});

gulp.task('app:serve', ['app:build'], () => {
    startServer();
});

gulp.task('app:connect', () => {
    startServer();
});

gulp.task('watch', () =>
    gulp.watch([files.src.ts, files.tests.specs.ts, files.gulp], ['lint', 'build', 'test']));

gulp.task('default', ['watch']);

// This task will fetch the most recent typings, and needs to initially be run once, before any other task.
// Thereafter it only needs to be run to update the existing typings.
gulp.task('tsd', () => {
    let tsd = require('gulp-tsd');

    return gulp.src('./gulp_tsd.json')
        .pipe(tsd());
});
