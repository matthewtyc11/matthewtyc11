/**
 * Made by BloxdCodingYT!
 * Click the White Paintball to place down the Iron Chest!
 * Refactored for readability
 */

// --- Helper: Set Default Callback Values ---
const setCallbackDefaults = (defaults) => {
    for (let callbackName of Object.keys(defaults)) {
        api.setCallbackValueFallback(callbackName, defaults[callbackName]);
    }
};

// Prevent changing the block or opening the chest by default for specific events
setCallbackDefaults({
    onPlayerChangeBlock: "preventChange",
    onPlayerAttemptOpenChest: "preventOpen"
});

// --- Constants & Globals ---
const setChestSlot = api.setStandardChestItemSlot;
const getChestSlot = api.getStandardChestItemSlot;
globalThis.scheduledTasks = []; // Replaces globalThis.sT

// --- Helper Functions ---

// Get the name of the block the player is looking at
const getTargetBlockName = (playerId) => {
    const raycast = api.raycastForBlock;
    const facing = api.getPlayerFacingInfo;
    const { camPos, dir } = facing(playerId);
    
    if (raycast(camPos, dir)) {
        return api.blockIdToBlockName(api.raycastForBlock(camPos, dir).blockID);
    }
};

// Get the coordinates adjacent to the block the player is looking at (placement pos)
const getTargetAdjacentPos = (playerId) => {
    const raycast = api.raycastForBlock;
    const facing = api.getPlayerFacingInfo;
    const { camPos, dir } = facing(playerId);
    
    if (raycast(camPos, dir)) {
        return api.raycastForBlock(camPos, dir).adjacent;
    }
};

// Get custom attributes from the item the player is holding
const getHeldItemAttributes = (playerId) => {
    return api.getHeldItem(playerId)?.attributes?.customAttributes;
};

// --- Main Logic: Handle Vault Placement (hV) ---
const handleVaultPlacement = (playerId) => {
    // Check if player is looking at a block and holding an item with 'retrieve' data (the Vault item)
    if (getTargetBlockName(playerId) && getHeldItemAttributes(playerId)?.retrieve) {
        
        let cart = []; // Appears unused in original, but kept for fidelity
        const storageCoords = getHeldItemAttributes(playerId).retrieve;
        const targetPos = getTargetAdjacentPos(playerId);

        // Ensure the player isn't inside the block they are trying to place
        if (!api.isInsideRect(api.getPosition(playerId), targetPos, targetPos, true)) {
            
            // Security Check: Does the item owner match the player?
            if (getHeldItemAttributes(playerId).ownerDbId == api.getPlayerDbId(playerId)) {
                
                // Ensure the storage area isn't unloaded and no tasks are currently running
                if (api.getBlock(storageCoords) != "Unloaded" && globalThis.scheduledTasks.length < 1) {
                    
                    // Teleport player briefly to load chunks (implied hack to ensure area is loaded)
                    const originalPos = api.getPosition(playerId);
                    api.setPosition(playerId, storageCoords);
                    api.setPosition(playerId, originalPos);

                    // Place the physical chest
                    api.setBlock(targetPos, "Iron Chest");
                    
                    // Get items from the hidden storage chest
                    const storedItems = api.getStandardChestItems(storageCoords);

                    // Set the new chest's data (ownership and passkey)
                    api.setBlockData(...targetPos, {
                        persisted: {
                            shared: {
                                passkeyLastUpdated: api.now(),
                                ownerDbId: getHeldItemAttributes(playerId).ownerDbId
                            },
                            passkey: getHeldItemAttributes(playerId).passkey
                        }
                    });

                    api.sendMessage(playerId, "Fetching items...", { color: "#ff9d87" });

                    // Transfer first half of items (0-18) immediately
                    for (let j = 0; j < 18; j++) {
                        if (storedItems[j]) {
                            setChestSlot(targetPos, j, storedItems[j].name, storedItems[j].amount, playerId, storedItems[j].attributes);
                        }
                    }

                    // Store data globally for the delayed task (second half of items)
                    globalThis.tempItems = storedItems;       // Zz
                    globalThis.tempStorage = storageCoords;   // Cc
                    globalThis.tempTarget = targetPos;        // Pa
                    globalThis.tempPlayer = playerId;         // MI

                    // Schedule the second half of the transfer (18-36) after 500ms
                    globalThis.scheduledTasks.push({
                        time: api.now(),
                        wait: 500,
                        c: `
                            $ = globalThis.tempPlayer;
                            po = globalThis.tempTarget;
                            cC = globalThis.tempStorage;
                            for(j = 18; j < 36; j++) {
                                _z = globalThis.tempItems;
                                if (_z[j]) {
                                    api.setStandardChestItemSlot(po, j, _z[j].name, _z[j].amount, $, _z[j].attributes)
                                }
                            };
                            api.sendMessage($, "Vault ready!", { color: "#2eed82" });
                        `
                    });

                    // Remove the hidden storage block and remove the Vault item from player inventory
                    api.setBlock(storageCoords, "Air");
                    api.setItemSlot(playerId, api.getSelectedInventorySlotI(playerId), "Air", 0);

                } else {
                    api.sendMessage(playerId, "Failed to retrieve info. Try again!");
                }
            } else {
                // Anti-Theft logic
                api.sendMessage(playerId, "You can't place down a Vault that is not yours!", { color: "#ff9d87" });
                api.applyEffect(playerId, "Thief", 30000, { icon: "Iron Chest" });
            }
            
            // Play sound effect
            api.broadcastSound("stone", 1, 1, {
                playerIdOrPos: playerId,
                maxHearDist: 14.9,
                refDistance: 3
            });
        }
    }
};

// --- Event Handlers ---

onChestUpdated = (playerId, isMainChest, x, y, z) => {
    if (api.getBlock(x, y, z).includes("Iron Chest")) {
        // Prevent putting a Vault item inside an Iron Chest
        for (let l = 0; l < 36; l++) {
            if (api.getStandardChestItemSlot([x, y, z], l)?.name == "White Paintball") {
                // Return item to player
                api.giveItem(playerId, "White Paintball", 1, api.getStandardChestItemSlot([x, y, z], l).attributes);
                // Clear slot
                api.setStandardChestItemSlot([x, y, z], l, "Air", 0);
                api.sendMessage(playerId, "You can't put a Vault into another Vault!");
            }
        }
    }
};

onPlayerClick = (playerId) => {
    // Only run on mobile if clicked, otherwise handled by AltAction usually?
    if (api.isMobile(playerId)) {
        try {
            handleVaultPlacement(playerId);
        } catch (e) {
            api.log(e);
        }
    }
};

onPlayerAltAction = (playerId) => {
    handleVaultPlacement(playerId);
};

onPlayerChangeBlock = (playerId, x, y, z, fromBlock, toBlock, droppedItem, fromBlockId, toBlockId) => {
    globalThis.tempPlayerId = playerId; // $$
    globalThis.targetX = x;             // yx
    globalThis.targetY = y;             // yy
    globalThis.targetZ = z;             // zz
    let cart = []; // Unused

    // If the block being broken is an Iron Chest (Vault)
    if (fromBlock.includes("Iron Chest")) {
        let hiddenY = -399999;

        // Check availability of deep storage
        if (api.getBlock(x, hiddenY, z) != "Unloaded" && globalThis.scheduledTasks.length < 1) {
            
            // Find a free vertical slot starting from deep underground
            for (let k = 0; k < 16; k++) {
                if (api.getBlock(x, hiddenY, z) == "Chest") {
                    hiddenY++;
                }
            }

            if (api.getBlock(x, hiddenY, z) != "Unloaded") {
                globalThis.hiddenY = hiddenY; // ry
                
                // Get items from the chest being broken
                const chestItems = api.getStandardChestItems([x, y, z]); // zx
                const blockData = api.getBlockData(x, y, z); // ze
                globalThis.tempChestItems = chestItems; // zy

                // Clear the current block data
                api.setBlockData(x, y, z, {});

                // Drop the "Vault" item (White Paintball) with saved data
                api.createItemDrop(x + .5, y + .5, z + .5, "White Paintball", 1, false, {
                    customDisplayName: "Vault",
                    customDescription: `Owner: ${api.getEntityName(api.getPlayerIdFromDbId(blockData.persisted.shared.ownerDbId))}`,
                    customAttributes: {
                        retrieve: [x, hiddenY, z],
                        ownerDbId: blockData.persisted.shared.ownerDbId,
                        passkey: blockData.persisted.passkey
                    }
                });

                // Create the hidden storage chest
                api.setBlock(x, hiddenY, z, "Chest");
                api.sendMessage(playerId, "Sending critical info... DO NOT place the vault!", { color: `#ff9d87` });

                // Move items 18-36 immediately to hidden storage
                for (let i = 18; i < 36; i++) {
                    const item = chestItems[i];
                    if (item) {
                        setChestSlot([x, hiddenY, z], i, item.name, item.amount, playerId, item.attributes);
                    }
                }

                // Schedule moving items 0-18 to hidden storage
                globalThis.scheduledTasks.push({
                    time: api.now(),
                    wait: 500,
                    c: `
                        id = globalThis.tempPlayerId;
                        zx = globalThis.tempChestItems;
                        for(i = 0; i < 18; i++) {
                            zs = zx[i];
                            if (zs) {
                                api.setStandardChestItemSlot([globalThis.targetX, globalThis.hiddenY, globalThis.targetZ], i, zs.name, zs.amount, id, zs.attributes);
                            }
                        };
                        api.sendMessage(id, "You can place the vault now!", { color: "#2eed82" });
                    `
                });

                // Clear the broken block location
                api.setBlockData(x, globalThis.targetY, globalThis.targetZ, {});
                return "preventDrop"; // Prevent standard block drop

            } else {
                api.sendMessage(playerId, "Failed to store items. Try again!", { color: "#ff9d87" });
            }
        } else {
            api.sendMessage(playerId, "Failed to fetch items. Try again!", { color: "#ff9d87" });
            return "preventChange";
        }
    }
};

onPlayerAttemptOpenChest = (playerId, x, y, z, isOpen, isMain) => {
    // Prevent opening the hidden storage chests deep underground
    if (y < -399968 && !isOpen && !isMain) {
        /* code made by BloxdCodingYT */
        return "preventOpen";
    }
};

// --- System Loop ---

tick = (d) => {
    for (let i = 0; i < globalThis.scheduledTasks.length; i++) {
        if (api.now() > globalThis.scheduledTasks[i].time + globalThis.scheduledTasks[i].wait) {
            // Execute the scheduled code string
            eval((globalThis.scheduledTasks[i]).c);
            // Remove task from queue
            globalThis.scheduledTasks = globalThis.scheduledTasks.slice(i + 1);
        }
    }
};

// --- Crafting Configuration ---

const craftingOpts = {
    items: {
        "Moonstone": 2,
        "Gold Bar": 2,
        "Iron Chest": 1
    },
    station: ["Workbench"],
    aura: 20,
    canCraftInven: true
};

onPlayerJoin = (playerId) => {
    let apiRecipes = [];
    for (let i of Object.keys(craftingOpts.items)) {
        apiRecipes.push({
            items: [i],
            amt: craftingOpts.items[i]
        });
    }

    api.editItemCraftingRecipes(playerId, "Iron Chest", [{
        requires: apiRecipes,
        produces: 1,
        station: craftingOpts.station,
        onCraftedAura: craftingOpts.aura,
        isStarterRecipe: craftingOpts.canCraftInven
    }]);
};