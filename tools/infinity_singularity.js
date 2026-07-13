const sharp = require("sharp");
const fs = require("fs");

const SIZE = 16;

// ====== 設定 ======
const NAME = "infinity";
const COLOR1 = { r: 255, g: 0, b: 255 };
let COLOR0 = COLOR1;
// COLOR0 = { r: 255, g: 180, b: 80 };

const LAYER1_BRIGHTNESS = 1.0;
const LAYER0_BRIGHTNESS = 0.5;
// ===================

const FRAME_COUNT = 42;

function getFrameColor(frame) {
    const hue = (300 + frame * 360 / FRAME_COUNT) % 360;
    return hsvToRgb(hue);
}

function hsvToRgb(h, s = 1, v = 1) {
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

async function tint(img, color, brightness = 1) {
    const { data, info } = await img
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

    for (let i = 0; i < data.length; i += 4) {
        const gray = data[i] * brightness;

        data[i] = Math.round(gray * color.r / 255);
        data[i + 1] = Math.round(gray * color.g / 255);
        data[i + 2] = Math.round(gray * color.b / 255);
        // αはそのまま
    }

    return sharp(data, { raw: info }).png().toBuffer();
}

(async () => {

    const layer0 = sharp("./input/singularity_layer_0.png");
    const layer1 = sharp("./input/singularity_layer_1.png");

    const result = [];

    for (let i = 0; i < 42; i++) {

        const color = getFrameColor(i);

        const layer0Index = i % 3;
        const layer1Index = i % 6;

        // layer0切り出し
        const l0 = await layer0
            .clone()
            .extract({
                left: 0,
                top: layer0Index * SIZE,
                width: SIZE,
                height: SIZE
            });

        // layer1切り出し
        const l1 = await layer1
            .clone()
            .extract({
                left: 0,
                top: layer1Index * SIZE,
                width: SIZE,
                height: SIZE
            });

        // 着色
        const l0Buffer = await tint(l0, color, LAYER0_BRIGHTNESS);
        const l1Buffer = await tint(l1, color, LAYER1_BRIGHTNESS);

        // 合成（layer1を上に重ねる）
        const merged = await sharp(l0Buffer)
            .composite([
                {
                    input: l1Buffer,
                    blend: "over"
                }
            ])
            .png()
            .toBuffer();

        result.push({
            input: merged,
            top: i * SIZE,
            left: 0
        });
    }

    await sharp({
        create: {
            width: SIZE,
            height: SIZE * FRAME_COUNT,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 }
        }
    })
        .composite(result)
        .png()
        .toFile(`./output/${NAME}_singularity.png`);
})();