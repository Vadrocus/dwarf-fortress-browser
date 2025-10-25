import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Item } from "@shared/schema";

interface ResourcePanelProps {
  stone: number;
  wood: number;
  items?: Item[];
}

export default function ResourcePanel({
  stone,
  wood,
  items = [],
}: ResourcePanelProps) {
  // Count items by type
  const itemCounts = items.reduce(
    (acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <Card className="font-mono">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm uppercase tracking-wider">
          Resources
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">█</span>
            <span className="text-xs text-muted-foreground">Stone</span>
          </div>
          <span className="font-bold tabular-nums" data-testid="text-stone">
            {stone}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-chart-2">♠</span>
            <span className="text-xs text-muted-foreground">Wood</span>
          </div>
          <span className="font-bold tabular-nums" data-testid="text-wood">
            {wood}
          </span>
        </div>

        {items.length > 0 && (
          <>
            <div className="h-px bg-border my-2" />
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Items
            </div>
            {Object.entries(itemCounts).map(([type, count]) => (
              <div
                key={type}
                className="flex items-center justify-between gap-2"
              >
                <span className="text-xs text-muted-foreground capitalize">
                  {type}
                </span>
                <span className="font-bold tabular-nums text-sm">{count}</span>
              </div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
}
