// @ts-check

import { world, system, EntityComponentTypes, ItemStack, EntityInventoryComponent, EntitySwingSource, InputButton, ButtonState, Player, EquipmentSlot } from "@minecraft/server";

import { itemAnimationData, itemStringAnimationData, loreSet } from "./data.js";

const flyData = new Map();

const MOVE_SPEED = 1.20;
const UP_SPEED = 0.50;
const FOLLOW_POWER = 0.25;
const MAX_IMPULSE = 0.12;
const DRIFT = 0.02;
const RESET_DISTANCE = 8.00;
const DRIFT_DISTANCE = 1.00;

let preTime = new Date().getTime() - 50;
let timeScatter = 1;

/**
 * 
 * @param { Number } value 
 * @returns { Number }
 */
function clamp(value) {
    return Math.max(-MAX_IMPULSE, Math.min(MAX_IMPULSE, value));
}

/**
 * 
 * @param { ItemStack } oldItemStack 
 * @param { ItemStack } itemStack 
 * @param { String } foundAnimationKey 
 * @param { Number } currentTick 
 * @param { EntityInventoryComponent } inventoryComponent 
 * @param { Number } slotIndex 
 */
function setAnimationItem(oldItemStack, itemStack, foundAnimationKey, currentTick, inventoryComponent, slotIndex) {

    const expectedItemStringAnimationData = itemStringAnimationData[foundAnimationKey];

    const itemNameTag = itemStack.nameTag;

    if (expectedItemStringAnimationData) {

        const nameData = expectedItemStringAnimationData.name_data;
        const loreData = expectedItemStringAnimationData.lore_data;

        if (nameData) {

            if (nameData.frametime <= 0) {
                if (itemStack.nameTag === undefined) itemStack.nameTag = nameData.data[nameData.frames[0]];
            } else {
                itemStack.nameTag = nameData.data[nameData.frames[Math.floor(currentTick / nameData.frametime) % nameData.frames.length]];
            };

        };

        if (loreData) {

            const rawLore = oldItemStack.getRawLore();
            const rawLoreStrings = rawLore.map(v => JSON.stringify(v));

            if (!loreSet.has(foundAnimationKey)) return;
            const loreIndex = rawLoreStrings.findIndex(v => loreSet.get(foundAnimationKey)?.has(v));

            if (loreData.frametime <= 0) {

                if (loreIndex === -1) {
                    rawLore.push(loreData.data[loreData.frames[0]]);
                };

            } else {

                if (loreIndex === -1) {
                    rawLore.push(loreData.data[loreData.frames[Math.floor(currentTick / loreData.frametime) % loreData.frames.length]]);
                } else {
                    rawLore[loreIndex] = loreData.data[loreData.frames[Math.floor(currentTick / loreData.frametime) % loreData.frames.length]];
                };

            };

            itemStack.setLore(rawLore);

        };

    };

    if (itemNameTag === undefined) inventoryComponent.container.setItem(slotIndex, itemStack);

};

/**
 * 
 * @param { Player } player 
 */
function fly(player) {

    if (!player.hasTag("avaritiaaddon_flying")) return;

    const data = flyData.get(player.id);
    if (!data) return;

    const target = data.target;
    const loc = player.location;

    let dx = target.x - loc.x;
    let dy = target.y - loc.y;
    let dz = target.z - loc.z;

    const distance = Math.hypot(dx, dy, dz);

    if (distance > RESET_DISTANCE) {
        target.x = loc.x;
        target.y = loc.y;
        target.z = loc.z;
        return;
    }

    const move = player.inputInfo.getMovementVector();
    const view = player.getViewDirection();

    const len = Math.hypot(view.x, view.z);

    if (len > 0) {

        const fx = view.x / len;
        const fz = view.z / len;

        const rx = fz;
        const rz = -fx;

        target.x += (fx * move.y + rx * move.x) * MOVE_SPEED * timeScatter;
        target.z += (fz * move.y + rz * move.x) * MOVE_SPEED * timeScatter;

    }

    if (player.inputInfo.getButtonState(InputButton.Jump) === ButtonState.Pressed) {
        target.y += UP_SPEED * timeScatter;
    }

    if (player.inputInfo.getButtonState(InputButton.Sneak) === ButtonState.Pressed) {
        target.y -= UP_SPEED * timeScatter;
    }

    dx = target.x - loc.x;
    dy = target.y - loc.y;
    dz = target.z - loc.z;

    player.applyImpulse({
        x: clamp(dx * FOLLOW_POWER) * timeScatter,
        y: clamp(dy * FOLLOW_POWER) * timeScatter,
        z: clamp(dz * FOLLOW_POWER) * timeScatter
    });

    const driftDx = loc.x - target.x;
    const driftDy = loc.y - target.y;
    const driftDz = loc.z - target.z;

    if (Math.hypot(driftDx, driftDy, driftDz) > DRIFT_DISTANCE * timeScatter) {
        target.x += driftDx * DRIFT;
        target.y += driftDy * DRIFT;
        target.z += driftDz * DRIFT;
    }
}

world.afterEvents.playerButtonInput.subscribe(ev => {
    const { player, button, newButtonState } = ev;
    const equippableComponent = player.getComponent(EntityComponentTypes.Equippable);
    if (!equippableComponent) return;
    const itemChest = equippableComponent.getEquipment(EquipmentSlot.Chest);
    if (!itemChest || itemChest.typeId !== `avaritiaaddon:infinity_chestplate`) return;
    if (button === InputButton.Jump) {
        if (newButtonState === ButtonState.Pressed) {
            player.addTag(`avaritiaaddon_jumping`);
            if (player.hasTag(`avaritiaaddon_fly_ready`)) {
                if (!player.hasTag(`avaritiaaddon_flying`)) {
                    player.addTag(`avaritiaaddon_flying`);
                    player.removeTag(`avaritiaaddon_fly_ready`);
                    const loc = player.location;
                    flyData.set(player.id, {
                        target: {
                            x: loc.x,
                            y: loc.y,
                            z: loc.z
                        },
                        velocity: {
                            x: 0,
                            y: 0,
                            z: 0
                        }
                    });
                } else {
                    player.removeTag(`avaritiaaddon_flying`);
                    player.removeTag(`avaritiaaddon_fly_ready`);
                    flyData.delete(player.id);
                };
            } else {
                player.addTag(`avaritiaaddon_fly_ready`);
                system.runTimeout(() => {
                    if (player.hasTag(`avaritiaaddon_fly_ready`)) player.removeTag(`avaritiaaddon_fly_ready`);
                }, 7);
            };
        } else {
            player.removeTag(`avaritiaaddon_jumping`);
        };
    };
});

system.runInterval(() => {
    const players = world.getAllPlayers();
    const { currentTick } = system;

    const nowTime = new Date().getTime();
    timeScatter = Math.min((nowTime - preTime) / 50, 5);
    preTime = nowTime;

    for (const player of players) {

        fly(player);

        const inventoryComponent = player.getComponent(EntityComponentTypes.Inventory);
        if (!inventoryComponent) continue;

        for (let slotIndex = 0; slotIndex < inventoryComponent.inventorySize; slotIndex++) {

            const itemStack = inventoryComponent.container.getItem(slotIndex);
            if (!itemStack) continue;

            const itemId = itemStack.typeId;
            const foundAnimationKey = Object.keys(itemAnimationData).find(key => itemId.startsWith(key));
            if (!foundAnimationKey) continue;

            const expectedItemAnimationData = itemAnimationData[foundAnimationKey];
            const loopPingpong = expectedItemAnimationData.loop === `pingpong`;
            const totalTick = loopPingpong ? expectedItemAnimationData.frames.length * 2 - 2 : expectedItemAnimationData.frames.length;
            const currentTickScalar = Math.floor(currentTick / expectedItemAnimationData.frametime);

            const newItemStackId = `${foundAnimationKey}_${expectedItemAnimationData.frames[loopPingpong ? ((currentTickScalar % totalTick - expectedItemAnimationData.frames.length) >= 0 ? expectedItemAnimationData.frames.length - (currentTickScalar % totalTick - expectedItemAnimationData.frames.length + 2) : currentTickScalar % totalTick) : currentTickScalar % totalTick]}`;
            if (newItemStackId === itemId) {
                setAnimationItem(itemStack, itemStack, foundAnimationKey, currentTick, inventoryComponent, slotIndex);
            } else {
                const newItemStack = new ItemStack(newItemStackId, itemStack.amount);
                setAnimationItem(itemStack, newItemStack, foundAnimationKey, currentTick, inventoryComponent, slotIndex);
            };

        };

    };

});

world.afterEvents.playerSwingStart.subscribe(ev => {
    const { heldItemStack, player, swingSource } = ev;
    if (!heldItemStack) return;
    if (swingSource !== EntitySwingSource.Attack) return;
    const heldItemStackId = heldItemStack.typeId;
    if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => `avaritiaaddon:infinity_sword_${v}`).includes(heldItemStackId)) {
        player.sendMessage(`swing`);
    };
});