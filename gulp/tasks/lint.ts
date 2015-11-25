import * as path from 'path';
let config = require('../config');

export default (gulp: any, plugins: any) => {
    return () => {
        let files: string[] = [];

        let wildcard = config.wildcard;
        for (let key in config.tasks) {
            if (config.tasks.hasOwnProperty(key)) {
                let task = config.tasks[key];
                if (task.src) {
                    let glob = wildcard + '.{ts}';
                    files.push(path.join(task.src, glob));
                }
            }
        };

        files.push('./gulp' + wildcard + '.ts');

        let tslint = plugins.tslint;
        return gulp.src(files)
            .pipe(tslint({}))
            .pipe(tslint.report('verbose'));
    };
};
