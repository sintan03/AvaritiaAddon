// @ts-check

import { world, system, EntityComponentTypes, ItemStack } from "@minecraft/server";

import { animationData } from "./data.js";

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
            const foundAnimationKey = Object.keys(animationData).find(key => itemId.startsWith(key));
            if (!foundAnimationKey) continue;

            const expectedAnimationData = animationData[foundAnimationKey];
            const loopPingpong = expectedAnimationData.loop === `pingpong`;
            const totalTick = loopPingpong ? expectedAnimationData.frames.length * 2 - 2 : expectedAnimationData.frames.length;
            const currentTickScalar = Math.floor(currentTick / expectedAnimationData.ticks_per_frame);

            const newItemStack = new ItemStack(`${foundAnimationKey}_${expectedAnimationData.frames[loopPingpong ? ((currentTickScalar % totalTick - expectedAnimationData.frames.length) >= 0 ? expectedAnimationData.frames.length - (currentTickScalar % totalTick - expectedAnimationData.frames.length + 2) : currentTickScalar % totalTick) : currentTickScalar % totalTick]}`);
            if (newItemStack.typeId !== itemId) inventoryComponent.container.setItem(slotIndex, newItemStack);

        };

    };
    
});