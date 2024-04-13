import { optimizeCss } from "./tasks/optimize-css.js";
import { cwd } from 'process';
import { join } from 'path';

const distPath = join(cwd(), 'dist');

// run the optimization creating a .min.css file for each .css file in the dist folder
// useful to check issues with the css files optimization
// (in order to use this script, you need to first build the project removing the
// optimization step from the build.js file)
optimizeCss(distPath, false).then(() => {
    console.log('Optimization completed');
}).catch((err) => {
    console.error(err);
});

