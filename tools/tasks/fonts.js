import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { readFiles } from '../utils/funcs.js';
import { Logger } from '../utils/logger.js';

const logger = new Logger(buildFonts.name, 'info', 'brightCyan');
const imgSrc = 'themes/fonts';
const imgDest = '/public/assets/fonts';

export async function buildFonts(srcHome, distHome) {
    logger.info('Fonts build has started');
    const fontsSrcPath = join(srcHome, imgSrc);
    const fontsDestPath = join(distHome, imgDest);

    // if fontsSrcPath does not exist, return
    if (!existsSync(fontsSrcPath)) {
        logger.warn(`No fonts found in ${fontsSrcPath} (there's not even a folder there)`);
        return;
    }

    const files = readFiles(fontsSrcPath, [
        '.woff',
        '.woff2',
        '.ttf',
        '.eot',
        '.svg',
        '.otf',
    ]);

    // if there are no files, return
    if (!files.length) {
        logger.warn(`No fonts found in ${fontsSrcPath}`);
        return;
    }

    mkdirSync(fontsDestPath, { recursive: true });

    for (const file of files) {
        // just copy the file
        copyFileSync(join(fontsSrcPath, file), join(fontsDestPath, file));
    }

    logger.info('Fonts build has finished');
}
