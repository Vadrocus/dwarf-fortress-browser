import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { GameState, Item, Dwarf, ItemType } from "@shared/schema";

interface EquipmentManagerProps {
  gameState: GameState;
  onAssignEquipment: (dwarfId: string, itemId: string) => void;
}

export function EquipmentManager({
  gameState,
  onAssignEquipment,
}: EquipmentManagerProps) {
  // Get all weapons and armor
  const weapons = gameState.items.filter((item) => item.type === "sword");
  const armors = gameState.items.filter((item) => item.type === "armor");

  // Get living dwarves
  const livingDwarves = gameState.dwarves.filter((d) => d.health > 0);

  const canEquip = (dwarf: Dwarf, slot: "weapon" | "armor"): boolean => {
    if (slot === "weapon") {
      return !dwarf.equipment?.weapon && dwarf.task !== "equipping";
    }
    if (slot === "armor") {
      return !dwarf.equipment?.armor && dwarf.task !== "equipping";
    }
    return false;
  };

  return (
    <Card className="font-mono">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm uppercase tracking-wider">
          Equipment Manager
        </CardTitle>
        <CardDescription className="text-xs">
          Assign dwarves to fetch and equip items
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weapons" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="weapons">
              Weapons ({weapons.length})
            </TabsTrigger>
            <TabsTrigger value="armor">Armor ({armors.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="weapons" className="mt-3">
            {weapons.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No weapons available. Craft swords at a workshop!
              </p>
            ) : (
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {weapons.map((weapon) => (
                    <div
                      key={weapon.id}
                      className="border border-border rounded p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold capitalize">
                          ⚔️ {weapon.type}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({weapon.location.x}, {weapon.location.y})
                        </span>
                      </div>

                      <div className="space-y-1">
                        {livingDwarves.map((dwarf) => {
                          const canEquipWeapon = canEquip(dwarf, "weapon");
                          const hasWeapon = dwarf.equipment?.weapon;
                          const isFetchingThis =
                            dwarf.equipTargetItemId === weapon.id;

                          return (
                            <Button
                              key={dwarf.id}
                              size="sm"
                              variant={isFetchingThis ? "default" : "outline"}
                              disabled={!canEquipWeapon || isFetchingThis}
                              onClick={() =>
                                onAssignEquipment(dwarf.id, weapon.id)
                              }
                              className="w-full justify-between text-xs"
                            >
                              <span>{dwarf.name}</span>
                              <span className="text-muted-foreground">
                                {isFetchingThis
                                  ? "→ Fetching..."
                                  : hasWeapon
                                    ? "✓ Armed"
                                    : "○"}
                              </span>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="armor" className="mt-3">
            {armors.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No armor available. Craft armor at a workshop!
              </p>
            ) : (
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {armors.map((armor) => (
                    <div
                      key={armor.id}
                      className="border border-border rounded p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold capitalize">
                          🛡️ {armor.type}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({armor.location.x}, {armor.location.y})
                        </span>
                      </div>

                      <div className="space-y-1">
                        {livingDwarves.map((dwarf) => {
                          const canEquipArmor = canEquip(dwarf, "armor");
                          const hasArmor = dwarf.equipment?.armor;
                          const isFetchingThis =
                            dwarf.equipTargetItemId === armor.id;

                          return (
                            <Button
                              key={dwarf.id}
                              size="sm"
                              variant={isFetchingThis ? "default" : "outline"}
                              disabled={!canEquipArmor || isFetchingThis}
                              onClick={() =>
                                onAssignEquipment(dwarf.id, armor.id)
                              }
                              className="w-full justify-between text-xs"
                            >
                              <span>{dwarf.name}</span>
                              <span className="text-muted-foreground">
                                {isFetchingThis
                                  ? "→ Fetching..."
                                  : hasArmor
                                    ? "✓ Armored"
                                    : "○"}
                              </span>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
