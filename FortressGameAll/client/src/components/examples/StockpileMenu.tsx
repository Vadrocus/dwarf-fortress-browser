import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { GameState, ItemType, Dwarf } from "@shared/schema";

interface StockpileMenuProps {
  gameState: GameState;
  stockpileX: number;
  stockpileY: number;
  onEquipItem: (
    dwarfId: string,
    itemType: ItemType,
    slot: "weapon" | "armor",
  ) => void;
  onClose: () => void;
}

export function StockpileMenu({
  gameState,
  stockpileX,
  stockpileY,
  onEquipItem,
  onClose,
}: StockpileMenuProps) {
  const tile = gameState.tiles[stockpileY]?.[stockpileX];

  if (!tile || tile.construction !== "stockpile") {
    return null;
  }

  // Get items at this stockpile
  const itemsHere = gameState.items.filter(
    (item) => item.location.x === stockpileX && item.location.y === stockpileY,
  );

  // Group items by type
  const itemCounts = itemsHere.reduce(
    (acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Get living dwarves
  const livingDwarves = gameState.dwarves.filter((d) => d.health > 0);

  const getEquipSlot = (itemType: ItemType): "weapon" | "armor" | null => {
    if (itemType === "sword") return "weapon";
    if (itemType === "armor") return "armor";
    return null;
  };

  return (
    <Card className="absolute top-4 right-4 w-96 z-50 bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-y-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Stockpile</span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </CardTitle>
        <CardDescription>
          Location: ({stockpileX}, {stockpileY})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="inventory" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inventory">Items</TabsTrigger>
            <TabsTrigger value="equip">Equip</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-2 mt-3">
            {itemsHere.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No items stored here yet.
              </p>
            ) : (
              <>
                <p className="text-xs text-muted-foreground mb-2">
                  {itemsHere.length} item{itemsHere.length !== 1 ? "s" : ""}{" "}
                  stored
                </p>
                {Object.entries(itemCounts).map(([type, count]) => (
                  <div
                    key={type}
                    className="flex items-center justify-between p-2 border border-border rounded"
                  >
                    <span className="text-sm capitalize">{type}</span>
                    <span className="text-sm font-bold">×{count}</span>
                  </div>
                ))}
              </>
            )}
          </TabsContent>

          <TabsContent value="equip" className="space-y-3 mt-3">
            {livingDwarves.map((dwarf) => {
              const canEquipWeapon = itemsHere.some(
                (item) => item.type === "sword",
              );
              const canEquipArmor = itemsHere.some(
                (item) => item.type === "armor",
              );
              const hasWeapon = dwarf.equipment?.weapon;
              const hasArmor = dwarf.equipment?.armor;

              return (
                <div
                  key={dwarf.id}
                  className="border border-border rounded p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{dwarf.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ❤️ {dwarf.health}/{dwarf.maxHealth}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Weapon:</span>
                      <span>{hasWeapon ? `⚔️ ${hasWeapon}` : "None"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Armor:</span>
                      <span>{hasArmor ? `🛡️ ${hasArmor}` : "None"}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!canEquipWeapon || hasWeapon !== undefined}
                      onClick={() => onEquipItem(dwarf.id, "sword", "weapon")}
                      className="flex-1 text-xs"
                    >
                      {hasWeapon ? "Has Weapon" : "Equip Sword"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!canEquipArmor || hasArmor !== undefined}
                      onClick={() => onEquipItem(dwarf.id, "armor", "armor")}
                      className="flex-1 text-xs"
                    >
                      {hasArmor ? "Has Armor" : "Equip Armor"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
