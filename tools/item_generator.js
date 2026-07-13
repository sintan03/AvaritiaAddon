const fs = require(`fs`);

const moto = 
[`{
	"format_version": "1.21.80",
	"minecraft:item": {
		"description": {
			"identifier": "avaritiaaddon:infinity_singularity_`,`"
		},
		"components": {
			"minecraft:max_stack_size": 64,
            "minecraft:icon": {
                "textures": {
                    "default": "avaritiaaddon:infinity_singularity_`,`"
                }
            },
			"minecraft:fire_resistant": {
				"value": true
			},
			"minecraft:should_despawn": false,
			"minecraft:tags": {
				"tags": [
					"avaritiaaddon:singularity",
					"avaritiaaddon:infinity_singularity"
				]
			}
		}
	}
}`];

for (let i = 1; i <= 41; i++) {
    fs.writeFileSync(`json_out/infinity_singularity_${i}.item.json`, `${moto[0]}${i}${moto[1]}${i}${moto[2]}`);
};