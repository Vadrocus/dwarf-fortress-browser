import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { GameState, ItemType } from "@shared/schema";
import { CRAFTING_RECIPES } from "@shared/schema";

interface WorkshopListProps {
  gameState: GameState;
  onSelectWorkshop: (x: number, y: number) => void;
}

export function WorkshopList({
  gameState,
  onSelectWorkshop,
}: WorkshopListProps) {
  // Find all workshops on the map
  const workshops: Array<{
    x: number;
    y: number;
    isBusy: boolean;
    craftingItem?: ItemType;
    progress?: number;
  }> = [];

  for (let y = 0; y < gameState.tiles.length; y++) {
    for (let x = 0; x < gameState.tiles[y].length; x++) {
      const tile = gameState.tiles[y][x];
      if (tile.construction === "workshop") {
        workshops.push({
          x,
          y,
          isBusy: !!tile.craftingJob,
          craftingItem: tile.craftingJob?.itemType,
          progress: tile.craftingJob?.progress,
        });
      }
    }
  }

  if (workshops.length === 0) {
    return (
      <Card className="font-mono">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm uppercase tracking-wider">
            Workshops
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            No workshops built yet. Build one first (costs 5 stone).
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="font-mono">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm uppercase tracking-wider">
          Workshops ({workshops.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {workshops.map((workshop, idx) => (
          <div
            key={`${workshop.x}-${workshop.y}`}
            className="border border-border rounded p-2 space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold">Workshop #{idx + 1}</span>
              <span className="text-xs text-muted-foreground">
                ({workshop.x}, {workshop.y})
              </span>
            </div>

            {workshop.isBusy ? (
              <div className="space-y-1">
                <p className="text-xs text-amber-500 capitalize">
                  Crafting {workshop.craftingItem}...
                </p>
                <div className="w-full bg-zinc-800 rounded-full h-2">
                  <div
                    className="bg-cyan-500 h-2 rounded-full transition-all"
                    style={{ width: `${workshop.progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-right">
                  {Math.floor(workshop.progress || 0)}%
                </p>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={() => onSelectWorkshop(workshop.x, workshop.y)}
                className="w-full text-xs"
              >
                Open Workshop
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
