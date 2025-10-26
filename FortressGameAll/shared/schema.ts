import { z } from "zod";

export const TerrainType = {
  GRASS: "grass",
  DIRT: "dirt",
  STONE: "stone",
  WATER: "water",
  TREE: "tree",
  EMPTY: "empty",
} as const;

export const DwarfTask = {
  IDLE: "idle",
  MINING: "mining",
  HAULING: "hauling",
  BUILDING: "building",
  FIGHTING: "fighting",
  CRAFTING: "crafting",
  EQUIPPING: "equipping",
} as const;

export const ItemType = {
  PICKAXE: "pickaxe",
  SWORD: "sword",
  ARMOR: "armor",
  FURNITURE: "furniture",
} as const;

export const ConstructionType = {
  WORKSHOP: "workshop",
  STOCKPILE: "stockpile",
  WALL: "wall",
  HOUSE: "house",
  NURSERY: "nursery",
} as const;

export const MonsterType = {
  GOBLIN: "goblin",
  TROLL: "troll",
  BEAST: "beast",
} as const;

export type TerrainType = (typeof TerrainType)[keyof typeof TerrainType];
export type DwarfTask = (typeof DwarfTask)[keyof typeof DwarfTask];
export type ConstructionType =
  (typeof ConstructionType)[keyof typeof ConstructionType];
export type MonsterType = (typeof MonsterType)[keyof typeof MonsterType];
export type ItemType = (typeof ItemType)[keyof typeof ItemType];

export interface Tile {
  x: number;
  y: number;
  terrain: TerrainType;
  miningDesignated: boolean;
  construction?: ConstructionType;
  craftingJob?: CraftingJob;
  storedItems?: Item[];
  lastNurserySpawn?: number; // tick when last dwarf was spawned
}

export interface CraftingJob {
  itemType: ItemType;
  progress: number; // 0-100
  assignedDwarfId?: string;
}

export interface Item {
  id: string;
  type: ItemType;
  location: { x: number; y: number };
}

export interface Dwarf {
  id: string;
  name: string;
  x: number;
  y: number;
  task: DwarfTask;
  targetX?: number;
  targetY?: number;
  health: number;
  maxHealth: number;
  targetMonsterId?: string;
  targetWorkshopX?: number;
  targetWorkshopY?: number;
  craftingItemType?: ItemType;
  haulTargetItemId?: string;
  haulTargetStockpileX?: number;
  haulTargetStockpileY?: number;
  carriedItemId?: string;
  equipTargetItemId?: string;
  equipment?: {
    weapon?: ItemType;
    armor?: ItemType;
  };
}

export interface Monster {
  id: string;
  type: MonsterType;
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  targetDwarfId?: string;
}

export interface GameState {
  tiles: Tile[][];
  dwarves: Dwarf[];
  monsters: Monster[];
  resources: {
    stone: number;
    wood: number;
  };
  items: Item[];
  messages: GameMessage[];
  isPaused: boolean;
  gameSpeed: number;
  tick: number;
}

export interface CraftingRecipe {
  itemType: ItemType;
  requiredResources: {
    stone?: number;
    wood?: number;
  };
  craftingTime: number; // ticks
}

export const CRAFTING_RECIPES: Record<ItemType, CraftingRecipe> = {
  pickaxe: {
    itemType: "pickaxe",
    requiredResources: { stone: 2, wood: 1 },
    craftingTime: 50,
  },
  sword: {
    itemType: "sword",
    requiredResources: { stone: 3, wood: 1 },
    craftingTime: 75,
  },
  armor: {
    itemType: "armor",
    requiredResources: { stone: 5 },
    craftingTime: 100,
  },
  furniture: {
    itemType: "furniture",
    requiredResources: { wood: 3, stone: 1 },
    craftingTime: 60,
  },
};

export interface GameMessage {
  id: string;
  timestamp: number;
  text: string;
  type: "info" | "warning" | "success" | "error";
}
