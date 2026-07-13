/** @type { Record<String, { "frametime": Number, "loop": "pingpong" | "cycle", frames: Number[] }> } */
export const itemAnimationData = {
    "avaritiaaddon:infinity_sword": {
        "frametime": 1,
        "loop": "pingpong",
        "frames": [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 5, 6, 7, 8]
    },
    "avaritiaaddon:infinity_pickaxe": {
        "frametime": 1,
        "loop": "pingpong",
        "frames": [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 5, 6, 7, 8]
    },

    "avaritiaaddon:infinity_singularity": {
        "frametime": 1,
        "loop": "cycle",
        "frames": Array(42).fill(0).map((m, i) => i)
    }
};

/** @type { Record<String, { "name_data": { "frametime": Number, frames: Number[], data: String[] }, "lore_data": { "frametime": Number, frames: Number[], data: import("@minecraft/server").RawText[] } }> } */
export const itemStringAnimationData = {
    "avaritiaaddon:infinity_sword": {
        "name_data": {
            "frametime": 0,
            "frames": [0],
            "data": [
                "§r§cSword of the Cosmos§r§f"
            ]
        },
        "lore_data": {
            "frametime": 2,
            "frames": [0, 1, 2, 3, 4, 5, 6],
            "data": [
                { "rawtext": [{ "translate": "lore.avaritiaaddon:infinity_sword_0" }] },
                { "rawtext": [{ "translate": "lore.avaritiaaddon:infinity_sword_1" }] },
                { "rawtext": [{ "translate": "lore.avaritiaaddon:infinity_sword_2" }] },
                { "rawtext": [{ "translate": "lore.avaritiaaddon:infinity_sword_3" }] },
                { "rawtext": [{ "translate": "lore.avaritiaaddon:infinity_sword_4" }] },
                { "rawtext": [{ "translate": "lore.avaritiaaddon:infinity_sword_5" }] },
                { "rawtext": [{ "translate": "lore.avaritiaaddon:infinity_sword_6" }] }
            ]
        }
    },
    "avaritiaaddon:infinity_pickaxe": {
        "name_data": {
            "frametime": 0,
            "frames": [0],
            "data": [
                "§r§cWorld Breaker§r§f"
            ]
        },
        "lore_data": {
            "frametime": 0,
            "frames": [0],
            "data": [
                { "rawtext": [{ "translate": "lore.avaritiaaddon:infinity_pickaxe_0" }] }
            ]
        }
    },

    "avaritiaaddon:infinity_singularity": {
        "name_data": {
            "frametime": 0,
            "frames": [0],
            "data": [
                "§r§dInfinity Singularity§r§f"
            ]
        },
        "lore_data": {
            "frametime": 0,
            "frames": [0],
            "data": [
                { "rawtext": [{ "translate": "lore.avaritiaaddon:infinity_singularity_0" }] }
            ]
        }
    }
};

export const loreSet = /** @type { Map<String, Set<String>> } */ (new Map());

for (const key in itemStringAnimationData) {
    loreSet.set(key, new Set(itemStringAnimationData[key].lore_data.data.map(v => JSON.stringify(v))));
};