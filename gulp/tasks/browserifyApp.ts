import * as path from 'path';
import * as browserify from 'browserify';
let buffer = require('vinyl-buffer');
let source = require('vinyl-source-stream');
let tsify = require('tsify');
let config = require('../config');

export default (gulp: any, plugins: any) => {
    return () => {
        let sourcemaps = plugins.sourcemaps,
            appConfig = config.tasks.browserifyApp,
            props = {
                entries: [path.join(appConfig.src, 'app.ts')]
            };

        return browserify(props)
            .plugin(tsify)
            .bundle()
            .pipe(source('app.bundle.min.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(plugins.uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(appConfig.dest));
    };
};
