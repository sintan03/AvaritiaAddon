/** @type { Record<String, { "ticks_per_frame": Number, "loop": "pingpong" | "cycle", frames: Number[] }> } */
export const itemAnimationData = {
    "avaritiaaddon:infinity_sword": {
        "ticks_per_frame": 2,
        "loop": "pingpong",
        "frames": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }
};

/** @type { Record<String, { "name_data": { "ticks_per_frame": Number, frames: Number[], data: String[] }, "lore_data": { "ticks_per_frame": Number, frames: Number[], data: import("@minecraft/server").RawText[] } }> } */
export const itemStringAnimationData = {
    "avaritiaaddon:infinity_sword": {
        "name_data": {
            "ticks_per_frame": 1,
            "frames": [0, 1, 2, 3, 4, 5, 6],
            "data": [
                "§r§l§o§cS§gw§eo§ar§bd §wo§df §ct§gh§ee §aC§bo§ws§dm§co§gs§r§f",
                "§r§l§o§dS§cw§go§er§ad §bo§wf §dt§ch§ge §eC§ao§bs§wm§do§cs§r§f",
                "§r§l§o§wS§dw§co§gr§ed §ao§bf §wt§dh§ce §gC§eo§as§bm§wo§ds§r§f",
                "§r§l§o§bS§ww§do§cr§gd §eo§af §bt§wh§de §cC§go§es§am§bo§ws§r§f",
                "§r§l§o§aS§bw§wo§dr§cd §go§ef §at§bh§we §dC§co§gs§em§ao§bs§r§f",
                "§r§l§o§eS§aw§bo§wr§dd §co§gf §et§ah§be §wC§do§cs§gm§eo§as§r§f",
                "§r§l§o§gS§ew§ao§br§wd §do§cf §gt§eh§ae §bC§wo§ds§cm§go§es§r§f"
            ]
        },
        "lore_data": {
            "ticks_per_frame": 5,
            "frames": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 10, 10, 10, 10],
            "data": [
                { "rawtext": [{ "translate": "lore.avaritiaaddon:infinity_sword_0" }] },
                { "rawtext": [{ "translate": "lore.avaritiaaddon:infinity_sword_1" }] },
                { "rawtext": [{ "translate": "lore.avaritiaaddon:infinity_sword_2" }] },
                { "rawtext": [{ "translate": "lore.avaritiaaddon:infinity_sword_3" }] },
                { "rawtext": [{ "translate": "lore.avaritiaaddon:infinity_sword_4" }] },
                { "rawtext": [{ "translate": "lore.avaritiaaddon:infinity_sword_5" }] },
                { "rawtext": [{ "translate": "lore.avaritiaaddon:infinity_sword_6" }] },
                { "rawtext": [{ "translate": "lore.avaritiaaddon:infinity_sword_7" }] },
                { "rawtext": [{ "translate": "lore.avaritiaaddon:infinity_sword_8" }] },
                { "rawtext": [{ "translate": "lore.avaritiaaddon:infinity_sword_9" }] },
                { "rawtext": [{ "translate": "lore.avaritiaaddon:infinity_sword_10" }] }
            ]
        }
    }
};

export const loreSet = /** @type { Map<String, Set<String>> } */ (new Map());

for (const key in itemStringAnimationData) {
    loreSet.set(key, new Set(itemStringAnimationData[key].lore_data.data.map(v => JSON.stringify(v))));
};