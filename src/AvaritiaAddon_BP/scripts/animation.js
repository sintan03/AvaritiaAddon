// @ts-check

import { world, system, EntityComponentTypes, ItemStack, EntityInventoryComponent } from "@minecraft/server";

import { itemAnimationData, itemStringAnimationData, loreSet } from "./data.js";

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

    if (expectedItemStringAnimationData) {

        if (expectedItemStringAnimationData.name_data) {
            itemStack.nameTag = expectedItemStringAnimationData.name_data.data[expectedItemStringAnimationData.name_data.frames[Math.floor(currentTick / expectedItemStringAnimationData.name_data.ticks_per_frame) % expectedItemStringAnimationData.name_data.frames.length]];
        };

        if (expectedItemStringAnimationData.lore_data) {

            const rawLore = oldItemStack.getRawLore();
            const rawLoreStrings = rawLore.map(v => JSON.stringify(v));

            if (!loreSet.has(foundAnimationKey)) return;
            const loreIndex = rawLoreStrings.findIndex(v => loreSet.get(foundAnimationKey)?.has(v));

            if (loreIndex === -1) {
                rawLore.push(expectedItemStringAnimationData.lore_data.data[expectedItemStringAnimationData.lore_data.frames[Math.floor(currentTick / expectedItemStringAnimationData.lore_data.ticks_per_frame) % expectedItemStringAnimationData.lore_data.frames.length]]);
            } else {
                rawLore[loreIndex] = expectedItemStringAnimationData.lore_data.data[expectedItemStringAnimationData.lore_data.frames[Math.floor(currentTick / expectedItemStringAnimationData.lore_data.ticks_per_frame) % expectedItemStringAnimationData.lore_data.frames.length]];
            };

            itemStack.setLore(rawLore);

        };

    };

    inventoryComponent.container.setItem(slotIndex, itemStack);
};

system.runInterval(() => {
    const players = world.getAllPlayers();
    const { currentTick } = system;

    for (const player of players) {

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
            const currentTickScalar = Math.floor(currentTick / expectedItemAnimationData.ticks_per_frame);

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