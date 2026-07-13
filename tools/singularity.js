const sharp = require("sharp");
const fs = require("fs");

const SIZE = 16;

// ====== 設定 ======
const NAME = "test";
const COLOR1 = { r: 255, g: 0, b: 255 };
let COLOR0 = COLOR1;
// COLOR0 = { r: 255, g: 180, b: 80 };

const LAYER1_BRIGHTNESS = 1.0;
const LAYER0_BRIGHTNESS = 0.5;
// ===================

async function tint(img, color, brightness = 1) {
    const { data, info } = await img
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

    for (let i = 0; i < data.length; i += 4) {
        const gray = data[i] * brightness;

        data[i]     = Math.round(gray * color.r / 255);
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

    for (let i = 0; i < 6; i++) {

        const layer0Index = i % 3;

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
                top: i * SIZE,
                width: SIZE,
                height: SIZE
            });

        // 着色
        const l0Buffer = await tint(l0, COLOR0, LAYER0_BRIGHTNESS);
        const l1Buffer = await tint(l1, COLOR1, LAYER1_BRIGHTNESS);

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
            height: SIZE * 6,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 }
        }
    })
        .composite(result)
        .png()
        .toFile(`./output/${NAME}_singularity.png`);
})();