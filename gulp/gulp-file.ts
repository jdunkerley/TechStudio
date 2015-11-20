import * as gulp from 'gulp';
let plugins = require('gulp-load-plugins')();
let configRoot = require('./config').root;

// Not all modules can be imported with the ES6 syntax, (see https://github.com/Microsoft/TypeScript/issues/3612),
// so some have been left using the ES5 'require' syntax, inline.

let getTask = (task: string) => {
    return require('./tasks/' + task).default(gulp, plugins);
};

let startServer = () => {
    let gls = require('gulp-live-server'),
        portNumber = 8080,
        server = gls.static(configRoot.appdest, portNumber);

    server.start();
};

gulp.task('tsd', getTask('tsd'));
gulp.task('lint', getTask('lint'));
gulp.task('clean', getTask('clean'));

// Because the tests are transpiling src on the fly cleaning the transpiled src is safe.
gulp.task('build:tests', ['lint', 'clean'], getTask('buildTests'));
gulp.task('test', ['build:tests'], getTask('test'));

gulp.task('browserify:src', ['lint', 'clean', 'test'], getTask('browserifySrc'));
gulp.task('browserify:app', ['lint', 'clean'], getTask('browserifyApp'));
gulp.task('less', getTask('less'));

gulp.task('app:build', ['browserify:app', 'less', 'browserify:src'], getTask('appBuild'));
gulp.task('app:serve', ['app:build'], startServer);
gulp.task('app:connect', startServer);

gulp.task('watch', () =>
    gulp.watch([configRoot.src, configRoot.tests, configRoot.appsrc], ['test']));

gulp.task('default', ['watch']);
