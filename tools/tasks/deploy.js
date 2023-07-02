import { Logger } from '../utils/logger.js';
import { buildScss } from './scss.js';
import { buildFonts } from './fonts.js';
import { buildTemplates } from './templates.js';
import { copyTo } from './copy-to.js';
import { restartService } from './restart-service.js';
import { extname  } from 'path';
import browsersync from 'browser-sync';

const logger = new Logger('deploy', 'info', 'brightMagenta');

const sync = browsersync.create('lugit')

sync.init({
    proxy: 'http://lugit.local',
    port: 8080,
})


export async function deploy(srcPath, distPath, serverPath, serviceName, file = null) {
    logger.info('Deploying...');

    let shouldRestart = true;

    // check if it's an scss
    if (file !== null && file !== undefined && extname(file) === '.scss') {
        shouldRestart = false;
    }

    try {
        await buildScss(srcPath, distPath);
        await buildFonts(srcPath, distPath);
        await buildTemplates(srcPath, distPath);
        await copyTo(distPath, serverPath);        
        shouldRestart && await restartService(serviceName);

        if(!shouldRestart) {
            sync.reload();
        }

        logger.info('Deployment successful!');
    } catch (error) {
        logger.error(`Deployment failed: ${error}`);
    }
}
