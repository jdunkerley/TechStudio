import * as path from 'path';
import * as browserify from 'browserify';
let buffer = require('vinyl-buffer');
let source = require('vinyl-source-stream');
let tsify = require('tsify');
let config = require('../config');

export default (gulp: any, plugins: any) => {
    return () => {
        let sourcemaps = plugins.sourcemaps,
            srcConfig = config.tasks.browserifySrc;

        return browserify()
            .add(path.join(srcConfig.src, 'app.ts'))
            .plugin(tsify)
            .bundle()
            .pipe(source('techstudio.min.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init())
            .pipe(plugins.uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(srcConfig.dest));
    };
};
