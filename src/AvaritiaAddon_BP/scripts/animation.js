// @ts-check

import { world, system, EntityComponentTypes } from "@minecraft/server";

import { animationData } from "./data";

system.runInterval(() => {
    const players = world.getAllPlayers();
    const { currentTick } = system;
    for (const player of players) {

        const inventoryComponent = player.getComponent(EntityComponentTypes.Inventory);
        if (!inventoryComponent) continue;

        const { selectedSlotIndex } = player;
        const mainContainerSlot = inventoryComponent.container.getSlot(selectedSlotIndex);
        if (!mainContainerSlot.hasItem()) continue;

        const itemId = mainContainerSlot.typeId;
        const foundAnimationKey = Object.keys(animationData).find(key => itemId.startsWith(key));
        if (!foundAnimationKey) continue;

        const expectedAnimationData = animationData[foundAnimationKey];
        const totalTicks = expectedAnimationData.loop === `pingpong` ? expectedAnimationData.flames.length * 2 - 2 : expectedAnimationData.flames.length;

    };
});