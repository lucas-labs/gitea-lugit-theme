import { mkdirSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Logger } from '../utils/logger.js';
import { compile } from 'sass';

const logger = new Logger(buildScss.name, 'debug', 'pink');
const themesSrc = 'themes/scss';
const cssDistPath = '/public/assets/css';

async function buildThemes(srcPath, distPath) {
    const themes = getScssFiles(srcPath, themesSrc);

    for (const theme of themes) {
        logger.debug(`Building ${theme.name} theme`);

        const result = compile(theme.path, {
            loadPaths: [join(srcPath, '../node_modules')],
            quietDeps: true,
            logger: {
                debug: logger.simpleDebug.bind(logger),
                info:  logger.simpleInfo.bind(logger),
                warn:  logger.simpleWarn.bind(logger),
                error: logger.simpleError.bind(logger),
            }
        });
        
        logger.debug(`Writing ${theme.name} theme to disk`);

        writeFileSync(
            join(distPath, cssDistPath, `theme-${theme.name}.css`),
            result.css
        );
    }
}

export async function buildScss(srcPath, distPath) {
    logger.info('SCSS build has started');
    
    mkdirSync(join(distPath, cssDistPath), { recursive: true });

    await buildThemes(srcPath, distPath);
    logger.info('SCSS build has finished');
}

function getScssFiles(srcHome, path) {
    try {
        return readdirSync(join(srcHome, path)).filter(
            (fn) => fn.endsWith('.scss') && !fn.startsWith('_')
        ).map((file) => ({
            name: file.replace('.scss', ''),
            path: join(srcHome, path, file),
        }))
    } catch (err) {
        return [];
    }
}
