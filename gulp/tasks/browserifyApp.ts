import * as path from 'path';
import * as browserify from 'browserify';
let buffer = require('vinyl-buffer');
let source = require('vinyl-source-stream');
let tsify = require('tsify');
let config = require('../config');

export default (gulp: any, plugins: any) => {
    return () => {
        let sourcemaps = plugins.sourcemaps,
            appConfig = config.tasks.browserifyApp;

        return browserify()
            .add(path.join(appConfig.src, 'app.ts'))
            .plugin(tsify)
            .bundle()
            .pipe(source('app.min.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init())
            .pipe(plugins.uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(appConfig.dest));
    };
};
