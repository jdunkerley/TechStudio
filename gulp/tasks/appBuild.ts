import * as path from 'path';
let config = require('../config');

export default (gulp: any, plugins: any) => {
    return () => {
        let files: string[] = [],
            appConfig = config.tasks.appBuild,
            srcConfig = config.tasks.browserifySrc;

        files.push(path.join(appConfig.src, config.wildcard) + '.' + appConfig.extensions.in);
        files.push(path.join(srcConfig.dest, config.wildcard) + '.' + srcConfig.extensions.out + '*');

        return gulp.src(files)
            .pipe(gulp.dest(appConfig.dest));
    };
};
