import { copyFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { readFiles } from '../utils/funcs.js';
import { Logger } from '../utils/logger.js';

const logger = new Logger(buildFonts.name, 'info', 'brightCyan');
const imgSrc = 'themes/fonts';
const imgDest = '/public/fonts';

export async function buildFonts(srcHome, distHome) {
    logger.info('Fonts build has started');
    const fontsSrcPath = join(srcHome, imgSrc);
    const fontsDestPath = join(distHome, imgDest);

    mkdirSync(fontsDestPath, { recursive: true });

    const files = readFiles(fontsSrcPath, [
        '.woff',
        '.woff2',
        '.ttf',
        '.eot',
        '.svg',
        '.otf',
    ]);

    for (const file of files) {
        // just copy the file
        copyFileSync(join(fontsSrcPath, file), join(fontsDestPath, file));
    }

    logger.info('Fonts build has finished');
}
