const { PNG } = require("pngjs");
const fs = require("fs");

const WIDTH = 16;
const HEIGHT = 32;

const png = new PNG({
    width: WIDTH,
    height: HEIGHT
});

// HSV → RGB
function hsvToRgb(h, s, v) {
    const c = v * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = v - c;

    let r = 0, g = 0, b = 0;

    if (h < 60) {
        r = c; g = x;
    } else if (h < 120) {
        r = x; g = c;
    } else if (h < 180) {
        g = c; b = x;
    } else if (h < 240) {
        g = x; b = c;
    } else if (h < 300) {
        r = x; b = c;
    } else {
        r = c; b = x;
    }

    return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255)
    };
}

for (let y = 0; y < HEIGHT; y++) {

    // 300°(マゼンタ)から開始して一周
    const hue = (300 + (360 * y / HEIGHT)) % 360;

    const color = hsvToRgb(hue, 1, 1);

    for (let x = 0; x < WIDTH; x++) {
        const idx = (WIDTH * y + x) * 4;

        png.data[idx]     = color.r;
        png.data[idx + 1] = color.g;
        png.data[idx + 2] = color.b;
        png.data[idx + 3] = 255;
    }
}

png.pack().pipe(fs.createWriteStream("gradient.png"));