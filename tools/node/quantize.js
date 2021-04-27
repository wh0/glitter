#!/usr/bin/env node

const fs = require('fs');

const canvas = require('canvas');
const RgbQuant = require('rgbquant');

const palette = require('./palette.json');

const [, , src, dst, flag] = process.argv;

function hasFlag(f) {
	return (typeof flag === 'string') && flag.includes(f);
}

(async () => {
	try {
		const srcImg = await canvas.loadImage(src);
		const c = canvas.createCanvas(srcImg.width, srcImg.height);
		const ctx = c.getContext('2d');
		ctx.drawImage(srcImg, 0, 0);

		const dstImageData = canvas.createImageData(srcImg.width, srcImg.height);
		const dstData = dstImageData.data;

		const opts = {
			palette,
		};
		if (hasFlag('d')) {
			opts.dithKern = 'FloydSteinberg';
			opts.dithSerp = true;
		}

		const q = new RgbQuant(opts);
		if (hasFlag('i')) {
			console.error('reduce');
			const dstIndices = q.reduce(ctx, 2);

			console.error('convert to index image');
			for (let i = 0; i < dstIndices.length; i++) {
				dstData[i * 4] = 255;
				dstData[i * 4 + 1] = dstIndices[i];
				dstData[i * 4 + 2] = 0;
				dstData[i * 4 + 3] = 255;
			}
		} else {
			console.error('reduce');
			const dstColor = q.reduce(ctx, 1);

			console.error('convert to color image');
			dstData.set(dstColor);
		}

		console.error('encode');
		ctx.putImageData(dstImageData, 0, 0);
		const dstBuffer = c.toBuffer('image/png');

		console.error('writeFile');
		await fs.promises.writeFile(dst, dstBuffer);
	} catch (e) {
		console.error(e);
		process.exit(1);
	}
})();
