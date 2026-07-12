const sharp = require("sharp");
const path = require("path");

// ===== 設定 =====
const inputFile = "../src/AvaritiaAddon_RP/textures/items/tools/infinity_axe/infinity_axe.png";
const outputName = "infinity_axe";
    // =================

    (async () => {
        const image = sharp(inputFile);
        const metadata = await image.metadata();
        const size = metadata.width;

        if (metadata.height % size !== 0) {
            throw new Error("画像の高さが正方形サイズで割り切れません。");
        }

        const count = metadata.height / size;

        for (let i = 0; i < count; i++) {
            const outputPath = path.join(
                path.dirname(inputFile),
                `${outputName}_${i}.png`
            );

            await image
                .clone()
                .extract({
                    left: 0,
                    top: i * size,
                    width: size,
                    height: size
                })
                .toFile(outputPath);
        }

        console.log(`${count}枚の画像を書き出しました。`);
    })();