/** @type { Record<String, { "ticks_per_frame": Number, "loop": "pingpong" | "cycle", frames: Number[] }> } */
export const itemAnimationData = {
    "avaritiaaddon:infinity_sword": {
        "ticks_per_frame": 1,
        "loop": "pingpong",
        "frames": [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 6, 7, 8, 9, 10]
    },
    "avaritiaaddon:infinity_pickaxe": {
        "ticks_per_frame": 1,
        "loop": "pingpong",
        "frames": [0, 0, 0, 1, 1, 1, 2, 2, 3, 3, 4, 4, 5, 6, 7, 8]
    }
};

/** @type { Record<String, { "name_data": { "ticks_per_frame": Number, frames: Number[], data: String[] }, "lore_data": { "ticks_per_frame": Number, frames: Number[], data: import("@minecraft/server").RawText[] } }> } */
export const itemStringAnimationData = {
    "avaritiaaddon:infinity_sword": {
        "name_data": {
            "ticks_per_frame": 0,
            "frames": [0],
            "data": [
                "§r§cSword of the Cosmos§r§f"
            ]
        },
        "lore_data": {
            "ticks_per_frame": 2,
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
            "ticks_per_frame": 0,
            "frames": [0],
            "data": [
                "§r§cWorld Breaker§r§f"
            ]
        },
        "lore_data": {
            "ticks_per_frame": 0,
            "frames": [0],
            "data": [
                { "rawtext": [{ "translate": "lore.avaritiaaddon:infinity_pickaxe_0" }] }
            ]
        }
    }
};

export const loreSet = /** @type { Map<String, Set<String>> } */ (new Map());

for (const key in itemStringAnimationData) {
    loreSet.set(key, new Set(itemStringAnimationData[key].lore_data.data.map(v => JSON.stringify(v))));
};