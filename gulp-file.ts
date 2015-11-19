import * as gulp from 'gulp';
import * as ts from 'gulp-typescript';
import * as tslint from 'gulp-tslint';
import * as sourcemaps from 'gulp-sourcemaps';
import * as del from 'del';
import * as browserify from 'browserify';

// Not all modules can be imported with the ES6 syntax, (see https://github.com/Microsoft/TypeScript/issues/3612),
// so some have been left using the ES5 'require' syntax, inline.

let testsDir = './tests/',
    wildcard = '**/*';

let paths = {
    src: {
        src: './src/',
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
        ts: paths.src.src + wildcard + '.ts'
    },
    tests: {
        specs: {
            ts: paths.tests.ts + wildcard + '[Ss]pec.ts',
            js: paths.tests.js + wildcard + '[Ss]pec.js'
        },
        ts: paths.tests.ts + wildcard + '.ts'
    },
    site: {
        html: paths.site.src + wildcard + '.html',
        ts: paths.site.src + wildcard + '.ts',
        js: paths.site.src + wildcard + '.js',
        maps: paths.site.src + wildcard + '.js.map'
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
    let tests = [paths.tests.js + wildcard],
        app = [files.site.js, files.site.maps],
        dist = [paths.src.dist + wildcard, paths.site.app + wildcard];

    return del(tests.concat(dist).concat(app));
});

// Because the tests are transpiling src on the fly cleaning the transpiled src is safe.
gulp.task('build:tests', ['lint', 'clean'], () => {
    return gulp.src(files.tests.specs.ts)
        .pipe(sourcemaps.init())
        .pipe(ts(ts.createProject('tsconfig.json')))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.tests.js));
});

// The tests are transpiling the src ts files on the fly, so there is no dependency for building the source yet.
gulp.task('test', ['build:tests'], () => {
    let jasmine = require('gulp-jasmine');

    return gulp.src(files.tests.specs.js)
        .pipe(jasmine());
});

// Compiles LESS > CSS
gulp.task('build:less', () => {
    let less = require('gulp-less');
    return gulp.src(paths.site.src + 'styles.less')
        .pipe(less())
        .pipe(gulp.dest(paths.site.app + '/css'));
});

let bfy = (file: string, name: string, dest: string) => {
    let source = require('vinyl-source-stream'),
        tsify = require('tsify'),
        uglify = require('gulp-uglify'),
        buffer = require('vinyl-buffer');

    return browserify()
        .add(file)
        .plugin(tsify)
        .bundle()
        .pipe(source(name))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(dest));
};

// This task builds, uglifies and maps the appsrc.
gulp.task('browserify:app', ['lint', 'clean'], () => {
    return bfy(paths.site.src + 'app.ts', 'app.min.js', paths.site.app);
});

// This task builds, uglifies and maps the src.
gulp.task('browserify:src', ['lint', 'clean', 'test'], () => {
    return bfy(paths.src.src + 'app.ts', 'techstudio.min.js', paths.src.dist);
});

// This task copies the HTML, angular js and library js into a dist folder.
gulp.task('app:build', ['browserify:app', 'build:less', 'browserify:src'], () => {
    return gulp.src([files.site.html, paths.src.dist + wildcard])
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
