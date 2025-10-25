import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { GameState, ItemType } from "@shared/schema";
import { CRAFTING_RECIPES } from "@shared/schema";

interface WorkshopMenuProps {
  gameState: GameState;
  workshopX: number;
  workshopY: number;
  onCraftItem: (itemType: ItemType) => void;
  onClose: () => void;
}

export function WorkshopMenu({ gameState, workshopX, workshopY, onCraftItem, onClose }: WorkshopMenuProps) {
  const tile = gameState.tiles[workshopY]?.[workshopX];

  if (!tile || tile.construction !== 'workshop') {
    return null;
  }

  const canAfford = (itemType: ItemType) => {
    const recipe = CRAFTING_RECIPES[itemType];
    if (recipe.requiredResources.stone && gameState.resources.stone < recipe.requiredResources.stone) {
      return false;
    }
    if (recipe.requiredResources.wood && gameState.resources.wood < recipe.requiredResources.wood) {
      return false;
    }
    return true;
  };

  const isBusy = tile.craftingJob !== undefined;

  return (
    <Card className="absolute top-4 right-4 w-96 z-50 bg-zinc-900 border-zinc-700">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Workshop Menu</span>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </CardTitle>
        <CardDescription>
          {isBusy ? (
            <>
              Crafting {tile.craftingJob!.itemType}... {Math.floor(tile.craftingJob!.progress)}%
            </>
          ) : (
            'Select an item to craft'
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {Object.entries(CRAFTING_RECIPES).map(([itemType, recipe]) => {
          const affordable = canAfford(itemType as ItemType);
          const resourcesText = Object.entries(recipe.requiredResources)
            .map(([resource, amount]) => `${amount} ${resource}`)
            .join(', ');

          return (
            <Button
              key={itemType}
              onClick={() => onCraftItem(itemType as ItemType)}
              disabled={!affordable || isBusy}
              className="w-full justify-start"
              variant={affordable && !isBusy ? "default" : "outline"}
            >
              <div className="flex flex-col items-start">
                <span className="font-semibold capitalize">{itemType}</span>
                <span className="text-xs opacity-70">
                  Requires: {resourcesText} • {recipe.craftingTime} ticks
                </span>
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}