import { join } from 'path';
import { copyFolderRecursiveSync } from '../utils/funcs.js';
import { Logger } from '../utils/logger.js';

const logger = new Logger(buildTemplates.name, 'info', 'blue');
const tmplSrc = 'templates';
const tmplDest = '/';

export async function buildTemplates(srcHome, distHome) {
    logger.info('Templates build has started');
    const tmplSrcPath = join(srcHome, tmplSrc);
    const tmplDestPath = join(distHome, tmplDest);

    // just copy the entire tmplSrcPath to tmplDestPath
    copyFolderRecursiveSync(tmplSrcPath, tmplDestPath);
    logger.info('Templates build has finished');
}
