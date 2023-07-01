import { join } from 'path';
import { copyFolderRecursiveSync } from '../utils/funcs.js';
import { Logger } from '../utils/logger.js';

const logger = new Logger(buildTemplates.name, 'info', 'blue');
const imgSrc = 'templates';
const imgDest = '/';

export async function buildTemplates(srcHome, distHome) {
    logger.info('Fonts build has started');
    const tmplSrcPath = join(srcHome, imgSrc);
    const tmplDestPath = join(distHome, imgDest);

    // just copy the entire tmplSrcPath to tmplDestPath
    copyFolderRecursiveSync(tmplSrcPath, tmplDestPath);
    logger.info('Templates build has finished');
}
