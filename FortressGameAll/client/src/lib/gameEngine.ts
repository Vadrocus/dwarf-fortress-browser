import type {
  GameState,
  Tile,
  Dwarf,
  Monster,
  TerrainType,
  DwarfTask,
  MonsterType,
  ItemType,
  Item,
  CraftingJob,
} from "@shared/schema";
import { CRAFTING_RECIPES } from "@shared/schema";

const WORLD_WIDTH = 60;
const WORLD_HEIGHT = 30;

const DWARF_NAMES = [
  "Urist",
  "Bomrek",
  "Kogan",
  "Thob",
  "Zasit",
  "Datan",
  "Rigoth",
  "Likot",
  "Vucar",
  "Stakud",
  "Nish",
  "Aban",
  "Kib",
  "Nil",
  "Goden",
  "Fikod",
];

export function createInitialGameState(): GameState {
  const tiles: Tile[][] = [];

  for (let y = 0; y < WORLD_HEIGHT; y++) {
    const row: Tile[] = [];
    for (let x = 0; x < WORLD_WIDTH; x++) {
      let terrain: TerrainType;
      const rand = Math.random();

      if (y < 5) {
        terrain = "grass";
        if (rand < 0.05) terrain = "tree";
      } else if (y < 12) {
        terrain = "dirt";
      } else {
        terrain = "stone";
      }

      if (
        x === 0 ||
        x === WORLD_WIDTH - 1 ||
        y === 0 ||
        y === WORLD_HEIGHT - 1
      ) {
        terrain = "stone";
      }

      row.push({
        x,
        y,
        terrain,
        miningDesignated: false,
      });
    }
    tiles.push(row);
  }

  const dwarves: Dwarf[] = [];
  const startX = Math.floor(WORLD_WIDTH / 2);
  const startY = 3;

  for (let i = 0; i < 5; i++) {
    dwarves.push({
      id: `dwarf-${i}`,
      name: DWARF_NAMES[i],
      x: startX + (i % 3) - 1,
      y: startY + Math.floor(i / 3),
      task: "idle",
      health: 100,
      maxHealth: 100,
    });
  }

  return {
    tiles,
    dwarves,
    monsters: [],
    resources: {
      stone: 0,
      wood: 0,
    },
    items: [],
    messages: [
      {
        id: "msg-0",
        timestamp: Date.now(),
        text: "Welcome to Fortress Terminal! Your dwarves have arrived.",
        type: "success",
      },
    ],
    isPaused: false,
    gameSpeed: 1,
    tick: 0,
  };
}

export function updateGameState(state: GameState): GameState {
  // Create deep copies to avoid mutation
  const tiles = state.tiles.map((row) => row.map((tile) => ({ ...tile })));
  let monsters = state.monsters.map((m) => ({ ...m }));
  let dwarves = state.dwarves.map((d) => ({ ...d }));
  let messages = [...state.messages];
  const resources = { ...state.resources };
  let items = state.items.map((i) => ({ ...i }));
  const tick = state.tick + 1;

  // Spawn monsters occasionally
  if (tick % 200 === 0 && Math.random() < 0.2) {
    const edge = Math.floor(Math.random() * 4);
    let x, y;

    if (edge === 0) {
      x = 0;
      y = Math.floor(Math.random() * WORLD_HEIGHT);
    } else if (edge === 1) {
      x = WORLD_WIDTH - 1;
      y = Math.floor(Math.random() * WORLD_HEIGHT);
    } else if (edge === 2) {
      x = Math.floor(Math.random() * WORLD_WIDTH);
      y = 0;
    } else {
      x = Math.floor(Math.random() * WORLD_WIDTH);
      y = WORLD_HEIGHT - 1;
    }

    const types: MonsterType[] = ["goblin", "troll", "beast"];
    const type = types[Math.floor(Math.random() * types.length)];
    const maxHealth = type === "goblin" ? 30 : type === "troll" ? 60 : 40;

    monsters = [
      ...monsters,
      {
        id: `monster-${Date.now()}-${Math.random()}`,
        type,
        x,
        y,
        health: maxHealth,
        maxHealth,
      },
    ];

    messages = [
      {
        id: `msg-${Date.now()}`,
        timestamp: Date.now(),
        text: `A ${type} has appeared at the edge of the map!`,
        type: "warning",
      },
      ...messages.slice(0, 49),
    ];
  }

  // Update workshops - process crafting jobs
  for (let row of tiles) {
    for (let tile of row) {
      if (tile.construction === "workshop" && tile.craftingJob) {
        const job = tile.craftingJob;
        const assignedDwarf = dwarves.find((d) => d.id === job.assignedDwarfId);

        // If dwarf is at workshop, increase progress
        if (
          assignedDwarf &&
          assignedDwarf.x === tile.x &&
          assignedDwarf.y === tile.y
        ) {
          job.progress += 2; // Progress per tick

          if (job.progress >= 100) {
            // Crafting complete!
            const newItem: Item = {
              id: `item-${Date.now()}-${Math.random()}`,
              type: job.itemType,
              location: { x: tile.x, y: tile.y },
            };
            items.push(newItem);

            messages = [
              {
                id: `msg-${Date.now()}`,
                timestamp: Date.now(),
                text: `${assignedDwarf.name} crafted a ${job.itemType}!`,
                type: "success",
              },
              ...messages.slice(0, 49),
            ];

            // Clear the job
            tile.craftingJob = undefined;

            // Set dwarf back to idle
            const dwarfIndex = dwarves.findIndex(
              (d) => d.id === assignedDwarf.id,
            );
            if (dwarfIndex !== -1) {
              dwarves[dwarfIndex] = {
                ...dwarves[dwarfIndex],
                task: "idle",
                targetWorkshopX: undefined,
                targetWorkshopY: undefined,
                craftingItemType: undefined,
              };
            }
          }
        }
      }
    }
  }

  // Assign hauling jobs - items not in stockpiles should be hauled
  const unassignedItems = items.filter((item) => {
    // Check if item is already being hauled
    const beingHauled = dwarves.some((d) => d.haulTargetItemId === item.id);
    if (beingHauled) return false;

    // Check if item is already in a stockpile
    const itemTile = tiles[item.location.y]?.[item.location.x];
    if (itemTile?.construction === "stockpile") return false;

    return true;
  });

  if (unassignedItems.length > 0) {
    const idleDwarves = dwarves.filter(
      (d) => d.task === "idle" && d.health > 0,
    );

    for (
      let i = 0;
      i < Math.min(idleDwarves.length, unassignedItems.length);
      i++
    ) {
      const dwarf = idleDwarves[i];
      const item = unassignedItems[i];

      // Find nearest stockpile
      const stockpile = findNearestStockpile(
        tiles,
        item.location.x,
        item.location.y,
      );
      if (stockpile) {
        const dwarfIndex = dwarves.findIndex((d) => d.id === dwarf.id);
        if (dwarfIndex !== -1) {
          dwarves[dwarfIndex] = {
            ...dwarves[dwarfIndex],
            task: "hauling",
            haulTargetItemId: item.id,
            haulTargetStockpileX: stockpile.x,
            haulTargetStockpileY: stockpile.y,
          };
        }
      }
    }
  }

  // Update dwarves
  dwarves = dwarves
    .filter((dwarf) => dwarf.health > 0)
    .map((dwarf) => {
      const nearbyMonster = findNearestMonster(monsters, dwarf.x, dwarf.y, 8);

      if (nearbyMonster && dwarf.task !== "fighting") {
        return {
          ...dwarf,
          task: "fighting",
          targetMonsterId: nearbyMonster.id,
        };
      }

      if (dwarf.task === "fighting" && dwarf.targetMonsterId) {
        const monsterIndex = monsters.findIndex(
          (m) => m.id === dwarf.targetMonsterId,
        );
        if (monsterIndex === -1 || monsters[monsterIndex].health <= 0) {
          return { ...dwarf, task: "idle", targetMonsterId: undefined };
        }

        const monster = monsters[monsterIndex];
        const dist =
          Math.abs(monster.x - dwarf.x) + Math.abs(monster.y - dwarf.y);
        if (dist <= 1) {
          // Attack! Damage scales with equipment
          let baseDamage = 10;
          if (dwarf.equipment?.weapon === "sword") {
            baseDamage = 20; // Swords do double damage!
          }

          monsters[monsterIndex] = {
            ...monster,
            health: monster.health - baseDamage,
          };
          if (monsters[monsterIndex].health <= 0) {
            messages = [
              {
                id: `msg-${Date.now()}`,
                timestamp: Date.now(),
                text: `${dwarf.name} defeated a ${monster.type}!`,
                type: "success",
              },
              ...messages.slice(0, 49),
            ];
            return { ...dwarf, task: "idle", targetMonsterId: undefined };
          }
          return dwarf;
        } else {
          // Move toward monster
          let newX = dwarf.x;
          let newY = dwarf.y;
          if (newX < monster.x) newX++;
          else if (newX > monster.x) newX--;
          else if (newY < monster.y) newY++;
          else if (newY > monster.y) newY--;
          return { ...dwarf, x: newX, y: newY };
        }
      }

      // Crafting task - move to workshop and craft
      if (
        dwarf.task === "crafting" &&
        dwarf.targetWorkshopX !== undefined &&
        dwarf.targetWorkshopY !== undefined
      ) {
        if (
          dwarf.x === dwarf.targetWorkshopX &&
          dwarf.y === dwarf.targetWorkshopY
        ) {
          // At workshop, crafting happens automatically in workshop update
          return dwarf;
        } else {
          // Move toward workshop
          let newX = dwarf.x;
          let newY = dwarf.y;
          if (newX < dwarf.targetWorkshopX) newX++;
          else if (newX > dwarf.targetWorkshopX) newX--;
          else if (newY < dwarf.targetWorkshopY) newY++;
          else if (newY > dwarf.targetWorkshopY) newY--;
          return { ...dwarf, x: newX, y: newY };
        }
      }

      // Hauling task - move items to stockpiles
      if (dwarf.task === "hauling" && dwarf.haulTargetItemId) {
        const item = items.find((i) => i.id === dwarf.haulTargetItemId);

        if (!item) {
          // Item disappeared, go idle
          return {
            ...dwarf,
            task: "idle",
            haulTargetItemId: undefined,
            haulTargetStockpileX: undefined,
            haulTargetStockpileY: undefined,
            carriedItemId: undefined,
          };
        }

        // If not carrying yet, move to item
        if (!dwarf.carriedItemId) {
          if (dwarf.x === item.location.x && dwarf.y === item.location.y) {
            // Pick up the item
            return { ...dwarf, carriedItemId: item.id };
          } else {
            // Move toward item
            let newX = dwarf.x;
            let newY = dwarf.y;
            if (newX < item.location.x) newX++;
            else if (newX > item.location.x) newX--;
            else if (newY < item.location.y) newY++;
            else if (newY > item.location.y) newY--;
            return { ...dwarf, x: newX, y: newY };
          }
        } else {
          // Carrying item, move to stockpile
          if (
            dwarf.haulTargetStockpileX !== undefined &&
            dwarf.haulTargetStockpileY !== undefined
          ) {
            if (
              dwarf.x === dwarf.haulTargetStockpileX &&
              dwarf.y === dwarf.haulTargetStockpileY
            ) {
              // Drop item at stockpile
              const itemIndex = items.findIndex(
                (i) => i.id === dwarf.carriedItemId,
              );
              if (itemIndex !== -1) {
                items[itemIndex] = {
                  ...items[itemIndex],
                  location: { x: dwarf.x, y: dwarf.y },
                };

                // Add to stockpile tile
                const stockpileTile = tiles[dwarf.y][dwarf.x];
                if (!stockpileTile.storedItems) {
                  stockpileTile.storedItems = [];
                }
                stockpileTile.storedItems.push(items[itemIndex]);

                messages = [
                  {
                    id: `msg-${Date.now()}`,
                    timestamp: Date.now(),
                    text: `${dwarf.name} hauled ${items[itemIndex].type} to stockpile.`,
                    type: "info",
                  },
                  ...messages.slice(0, 49),
                ];
              }

              return {
                ...dwarf,
                task: "idle",
                haulTargetItemId: undefined,
                haulTargetStockpileX: undefined,
                haulTargetStockpileY: undefined,
                carriedItemId: undefined,
              };
            } else {
              // Move toward stockpile
              let newX = dwarf.x;
              let newY = dwarf.y;
              if (newX < dwarf.haulTargetStockpileX) newX++;
              else if (newX > dwarf.haulTargetStockpileX) newX--;
              else if (newY < dwarf.haulTargetStockpileY) newY++;
              else if (newY > dwarf.haulTargetStockpileY) newY--;

              // Update item location as dwarf carries it
              const itemIndex = items.findIndex(
                (i) => i.id === dwarf.carriedItemId,
              );
              if (itemIndex !== -1) {
                items[itemIndex] = {
                  ...items[itemIndex],
                  location: { x: newX, y: newY },
                };
              }

              return { ...dwarf, x: newX, y: newY };
            }
          }
        }
      }

      // Handle equipping task
      if (dwarf.task === "equipping" && dwarf.equipTargetItemId) {
        const targetItem = items.find((i) => i.id === dwarf.equipTargetItemId);

        if (!targetItem) {
          // Item no longer exists, go back to idle
          return {
            ...dwarf,
            task: "idle",
            equipTargetItemId: undefined,
          };
        }

        // Check if dwarf reached the item
        if (
          dwarf.x === targetItem.location.x &&
          dwarf.y === targetItem.location.y
        ) {
          // Determine equipment slot based on item type
          let slot: "weapon" | "armor" | null = null;
          if (targetItem.type === "sword" || targetItem.type === "pickaxe") {
            slot = "weapon";
          } else if (targetItem.type === "armor") {
            slot = "armor";
          }

          if (slot) {
            // Remove item from items array
            items = items.filter((i) => i.id !== targetItem.id);

            // Equip the item
            const newEquipment = {
              ...dwarf.equipment,
              [slot]: targetItem.type,
            };

            messages = [
              {
                id: `msg-${Date.now()}`,
                timestamp: Date.now(),
                text: `${dwarf.name} equipped ${targetItem.type}.`,
                type: "success",
              },
              ...messages.slice(0, 49),
            ];

            return {
              ...dwarf,
              task: "idle",
              equipTargetItemId: undefined,
              equipment: newEquipment,
            };
          } else {
            // Can't equip this item type
            return {
              ...dwarf,
              task: "idle",
              equipTargetItemId: undefined,
            };
          }
        } else {
          // Move toward item
          let newX = dwarf.x;
          let newY = dwarf.y;
          if (newX < targetItem.location.x) newX++;
          else if (newX > targetItem.location.x) newX--;
          else if (newY < targetItem.location.y) newY++;
          else if (newY > targetItem.location.y) newY--;
          return { ...dwarf, x: newX, y: newY };
        }
      }

      if (dwarf.task === "idle") {
        const miningTile = findNearestMiningTile(tiles, dwarf.x, dwarf.y);
        if (miningTile) {
          return {
            ...dwarf,
            task: "mining",
            targetX: miningTile.x,
            targetY: miningTile.y,
          };
        }
      }

      if (
        dwarf.task === "mining" &&
        dwarf.targetX !== undefined &&
        dwarf.targetY !== undefined
      ) {
        if (dwarf.x === dwarf.targetX && dwarf.y === dwarf.targetY) {
          const tile = tiles[dwarf.y][dwarf.x];
          if (tile.miningDesignated) {
            tile.miningDesignated = false;

            if (tile.terrain === "stone") {
              resources.stone += 1;
              tile.terrain = "empty";
              messages = [
                {
                  id: `msg-${Date.now()}`,
                  timestamp: Date.now(),
                  text: `${dwarf.name} mined stone.`,
                  type: "info",
                },
                ...messages.slice(0, 49),
              ];
            } else if (tile.terrain === "tree") {
              resources.wood += 1;
              tile.terrain = "grass";
              messages = [
                {
                  id: `msg-${Date.now()}`,
                  timestamp: Date.now(),
                  text: `${dwarf.name} chopped down a tree.`,
                  type: "info",
                },
                ...messages.slice(0, 49),
              ];
            }
          }

          return {
            ...dwarf,
            task: "idle",
            targetX: undefined,
            targetY: undefined,
          };
        } else {
          let newX = dwarf.x;
          let newY = dwarf.y;
          if (newX < dwarf.targetX) newX++;
          else if (newX > dwarf.targetX) newX--;
          else if (newY < dwarf.targetY) newY++;
          else if (newY > dwarf.targetY) newY--;
          return { ...dwarf, x: newX, y: newY };
        }
      }

      return dwarf;
    });

  // Update monsters
  monsters = monsters
    .filter((monster) => monster.health > 0)
    .map((monster) => {
      let nearestDwarfIndex = dwarves.findIndex((d) => d.health > 0);
      if (nearestDwarfIndex === -1) return monster;

      let nearestDwarf = dwarves[nearestDwarfIndex];
      let minDist =
        Math.abs(nearestDwarf.x - monster.x) +
        Math.abs(nearestDwarf.y - monster.y);

      for (let i = 1; i < dwarves.length; i++) {
        if (dwarves[i].health <= 0) continue;
        const dist =
          Math.abs(dwarves[i].x - monster.x) +
          Math.abs(dwarves[i].y - monster.y);
        if (dist < minDist) {
          minDist = dist;
          nearestDwarf = dwarves[i];
          nearestDwarfIndex = i;
        }
      }

      const updatedMonster = { ...monster, targetDwarfId: nearestDwarf.id };

      const dist =
        Math.abs(nearestDwarf.x - monster.x) +
        Math.abs(nearestDwarf.y - monster.y);
      if (dist <= 1) {
        // Attack dwarf - damage reduced by armor
        let baseDamage = monster.type === "troll" ? 15 : 8;

        if (nearestDwarf.equipment?.armor === "armor") {
          baseDamage = Math.floor(baseDamage / 2); // Armor halves damage!
        }

        const newHealth = nearestDwarf.health - baseDamage;
        dwarves[nearestDwarfIndex] = { ...nearestDwarf, health: newHealth };
        if (newHealth <= 0) {
          messages = [
            {
              id: `msg-${Date.now()}`,
              timestamp: Date.now(),
              text: `${nearestDwarf.name} has fallen in combat!`,
              type: "error",
            },
            ...messages.slice(0, 49),
          ];
        }
        return updatedMonster;
      } else {
        // Move toward dwarf
        let newX = monster.x;
        let newY = monster.y;
        if (newX < nearestDwarf.x) newX++;
        else if (newX > nearestDwarf.x) newX--;
        else if (newY < nearestDwarf.y) newY++;
        else if (newY > nearestDwarf.y) newY--;
        return { ...updatedMonster, x: newX, y: newY };
      }
    });

  return {
    tiles,
    dwarves,
    monsters,
    resources,
    items,
    messages,
    isPaused: state.isPaused,
    gameSpeed: state.gameSpeed,
    tick,
  };
}

function findNearestMonster(
  monsters: Monster[],
  x: number,
  y: number,
  maxDist: number,
): Monster | null {
  let nearest: Monster | null = null;
  let minDist = maxDist;

  for (let monster of monsters) {
    if (monster.health <= 0) continue;
    const dist = Math.abs(monster.x - x) + Math.abs(monster.y - y);
    if (dist < minDist) {
      minDist = dist;
      nearest = monster;
    }
  }

  return nearest;
}

function findNearestDwarf(
  dwarves: Dwarf[],
  x: number,
  y: number,
): Dwarf | null {
  let nearest: Dwarf | null = null;
  let minDist = Infinity;

  for (let dwarf of dwarves) {
    if (dwarf.health <= 0) continue;
    const dist = Math.abs(dwarf.x - x) + Math.abs(dwarf.y - y);
    if (dist < minDist) {
      minDist = dist;
      nearest = dwarf;
    }
  }

  return nearest;
}

function findNearestMiningTile(
  tiles: Tile[][],
  x: number,
  y: number,
): Tile | null {
  let nearest: Tile | null = null;
  let minDist = Infinity;

  for (let row of tiles) {
    for (let tile of row) {
      if (tile.miningDesignated) {
        const dist = Math.abs(tile.x - x) + Math.abs(tile.y - y);
        if (dist < minDist) {
          minDist = dist;
          nearest = tile;
        }
      }
    }
  }

  return nearest;
}

// Queue a crafting job at a workshop
export function queueCraftingJob(
  state: GameState,
  workshopX: number,
  workshopY: number,
  itemType: ItemType,
): GameState {
  const recipe = CRAFTING_RECIPES[itemType];

  // Check if we have enough resources
  if (
    recipe.requiredResources.stone &&
    state.resources.stone < recipe.requiredResources.stone
  ) {
    return state;
  }
  if (
    recipe.requiredResources.wood &&
    state.resources.wood < recipe.requiredResources.wood
  ) {
    return state;
  }

  const tile = state.tiles[workshopY][workshopX];
  if (tile.construction !== "workshop") {
    return state;
  }

  if (tile.craftingJob) {
    // Workshop is already busy
    return state;
  }

  // Find an idle dwarf
  const idleDwarf = state.dwarves.find(
    (d) => d.task === "idle" && d.health > 0,
  );
  if (!idleDwarf) {
    return state;
  }

  // Deduct resources
  const newResources = { ...state.resources };
  if (recipe.requiredResources.stone) {
    newResources.stone -= recipe.requiredResources.stone;
  }
  if (recipe.requiredResources.wood) {
    newResources.wood -= recipe.requiredResources.wood;
  }

  // Create crafting job
  const craftingJob: CraftingJob = {
    itemType,
    progress: 0,
    assignedDwarfId: idleDwarf.id,
  };

  // Update tile with job
  const newTiles = state.tiles.map((row) =>
    row.map((t) => {
      if (t.x === workshopX && t.y === workshopY) {
        return { ...t, craftingJob };
      }
      return t;
    }),
  );

  // Update dwarf
  const newDwarves = state.dwarves.map((d) => {
    if (d.id === idleDwarf.id) {
      return {
        ...d,
        task: "crafting" as DwarfTask,
        targetWorkshopX: workshopX,
        targetWorkshopY: workshopY,
        craftingItemType: itemType,
      };
    }
    return d;
  });

  const newMessages = [
    {
      id: `msg-${Date.now()}`,
      timestamp: Date.now(),
      text: `${idleDwarf.name} is crafting a ${itemType}.`,
      type: "info" as const,
    },
    ...state.messages.slice(0, 49),
  ];

  return {
    ...state,
    tiles: newTiles,
    dwarves: newDwarves,
    resources: newResources,
    messages: newMessages,
  };
}

function findNearestStockpile(
  tiles: Tile[][],
  x: number,
  y: number,
): Tile | null {
  let nearest: Tile | null = null;
  let minDist = Infinity;

  for (let row of tiles) {
    for (let tile of row) {
      if (tile.construction === "stockpile") {
        const dist = Math.abs(tile.x - x) + Math.abs(tile.y - y);
        if (dist < minDist) {
          minDist = dist;
          nearest = tile;
        }
      }
    }
  }

  return nearest;
}

// Equip an item to a dwarf - assigns them the task to go pick it up
export function equipItem(
  state: GameState,
  dwarfId: string,
  itemId: string,
): GameState {
  const dwarfIndex = state.dwarves.findIndex((d) => d.id === dwarfId);
  if (dwarfIndex === -1) return state;

  const dwarf = state.dwarves[dwarfIndex];

  // Check if dwarf is already busy
  if (dwarf.task !== "idle") {
    return state;
  }

  // Find the item in items array
  const item = state.items.find((i) => i.id === itemId);
  if (!item) return state;

  // Assign equipping task
  const newDwarves = state.dwarves.map((d, idx) => {
    if (idx === dwarfIndex) {
      return {
        ...d,
        task: "equipping" as DwarfTask,
        equipTargetItemId: itemId,
      };
    }
    return d;
  });

  const newMessages = [
    {
      id: `msg-${Date.now()}`,
      timestamp: Date.now(),
      text: `${dwarf.name} is going to equip ${item.type}.`,
      type: "info" as const,
    },
    ...state.messages.slice(0, 49),
  ];

  return {
    ...state,
    dwarves: newDwarves,
    messages: newMessages,
  };
}
