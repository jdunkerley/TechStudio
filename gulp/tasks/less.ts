import * as path from 'path';
let config = require('../config');

export default (gulp: any, plugins: any) => {
    return () => {
        let wildcard = config.wildcard,
            lessConfig = config.tasks.less,
            paths = {
                src: path.join(lessConfig.src, wildcard) + '.' + lessConfig.extensions.in,
                dest: lessConfig.dest
            };

        return gulp.src(paths.src)
            .pipe(plugins.less())
            .pipe(gulp.dest(paths.dest));
    };
};
