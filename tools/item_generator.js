const fs = require(`fs`);

const moto = 
[`{
	"format_version": "1.21.80",
	"minecraft:item": {
		"description": {
			"identifier": "avaritiaaddon:infinity_pickaxe_`,`"
		},
		"components": {
			"minecraft:max_stack_size": 1,
            "minecraft:icon": {
                "textures": {
                    "default": "avaritiaaddon:infinity_pickaxe_`,`"
                }
            },
			"minecraft:hand_equipped": true,
			"minecraft:enchantable": {
				"slot": "pickaxe",
				"value": 20
			},
			"minecraft:fire_resistant": {
				"value": true
			},
			"minecraft:should_despawn": false,
			"minecraft:tags": {
				"tags": [
					"minecraft:wooden_tier",
					"minecraft:stone_tier",
					"minecraft:iron_tier",
					"minecraft:golden_tier",
					"minecraft:diamond_tier",
					"minecraft:netherite_tier",
					"minecraft:is_pickaxe"
				]
			},
			"minecraft:digger": {
				"destroy_speeds": [
					{
						"speed": 1000
					}
				]
			}
		}
	}
}`];

for (let i = 1; i <= 9; i++) {
    fs.writeFileSync(`infinity_pickaxe_${i}.item.json`, `${moto[0]}${i}${moto[1]}${i}${moto[2]}`);
};