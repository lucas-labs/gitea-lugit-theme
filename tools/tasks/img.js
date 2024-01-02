import { fabric } from 'fabric';
import imageminZopfli from 'imagemin-zopfli';
import { readFile, writeFile } from 'node:fs/promises';
import { join, basename } from 'path';
import { optimize } from 'svgo';
import { readFiles } from '../utils/funcs.js';
import { Logger } from '../utils/logger.js';
import { mkdirSync, copyFileSync } from 'fs';

const logger = new Logger(buildImg.name, 'info', 'brightGreen');
const imgSrc = 'themes/img';
const imgDest = '/public/assets/img';

export async function buildImg(srcHome, distHome) {
    logger.info('Images build has started');
    const imgSrcPath = join(srcHome, imgSrc);
    const imgDestPath = join(distHome, imgDest);
    const images = { logos: { logo: undefined, favicon: undefined }, others: [] };
    mkdirSync(imgDestPath, { recursive: true });

    const files = readFiles(imgSrcPath, ['.svg', '.png', '.jpg', '.webp', '.gif']);
    
    // Separate logo.svg and favicon.svg from the rest
    files.forEach((file) => {
        if (file === 'logo.svg') {
            images.logos.logo = join(imgSrcPath, file);
        } else if (file === 'favicon.svg') {
            images.logos.favicon = join(imgSrcPath, file);
        } else {
            images.others.push(join(imgSrcPath, file));
        }
    });

    await Promise.all([
        processLogos(images.logos, imgDestPath),
        processOthers(images.others, imgDestPath),
    ])
    
    logger.info('Images build has finished');
}

async function processLogos(logos, distHome) {
    const promises = [];

    if (logos.logo) {
        const svg = await readFile(logos.logo, 'utf8');
        promises.push(generate(svg, join(distHome, 'logo.svg'), { size: 32 }));
        promises.push(generate(svg, join(distHome, 'logo.png'), { size: 512 }));
    }

    if (logos.favicon) {
        const svg = await readFile(logos.favicon, 'utf8');
        promises.push(
            generate(svg, join(distHome, 'favicon.svg'), { size: 32 }),
            generate(svg, join(distHome, 'favicon.png'), { size: 180 }),
            generate(svg, join(distHome, 'apple-touch-icon.png'), { size: 180, bg: true }),
            generate(svg, join(distHome, 'avatar_default.png'), { size: 200, bg: true })
        );
    }

    await Promise.all(promises);
}

function loadSvg(svg) {
    return new Promise((resolve) => {
        fabric.loadSVGFromString(svg, (objects, options) => {
            resolve({ objects, options });
        });
    });
}

async function generate(svg, path, { size, bg }) {
    if (String(path).endsWith('.svg')) {
        const { data } = optimize(svg, {
            plugins: [
                'preset-default',
                'removeDimensions',
                {
                    name: 'addAttributesToSVGElement',
                    params: { attributes: [{ height: size }] },
                },
            ],
        });
        await writeFile(path, data);
        return;
    }

    const { objects, options } = await loadSvg(svg);
    const canvas = new fabric.Canvas();

    
    const newWidth = size * options.width / options.height;
    canvas.setDimensions({ width: newWidth, height: size });
    const ctx = canvas.getContext('2d');
    ctx.scale(
        options.width ? newWidth / options.width : 1,
        options.height ? size / options.height : 1
    );

    if (bg) {
        canvas.add(
            new fabric.Rect({
                left: 0,
                top: 0,
                height: size * (1 / (size / options.height)),
                width: size * (1 / (size / options.width)),
                fill: 'black',
            })
        );
    }

    canvas.add(fabric.util.groupSVGElements(objects, options));
    canvas.renderAll();

    let png = Buffer.from([]);
    for await (const chunk of canvas.createPNGStream()) {
        png = Buffer.concat([png, chunk]);
    }

    png = await imageminZopfli({ more: true })(png);
    await writeFile(path, png);
}

async function processOthers(others, distHome) {
    // just copy the rest of the images to dist
    for (const img of others) {
        copyFileSync(img, join(distHome, basename(img)));
    }
}