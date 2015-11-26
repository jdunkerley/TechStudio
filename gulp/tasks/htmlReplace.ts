let config = require('../config');

export default (gulp: any, plugins: any) => {
    return () => {
        return gulp.src(config.root.appsrc + '/index.html')
            .pipe(plugins.htmlReplace({ app: './app.bundle.min.js' }))
            .pipe(gulp.dest(config.root.appdest));
    };
};
