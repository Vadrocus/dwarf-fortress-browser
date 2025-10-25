import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Dwarf } from "@shared/schema";

interface DwarfListProps {
  dwarves: Dwarf[];
}

const TASK_ICONS: Record<string, string> = {
  idle: "○",
  mining: "⚒",
  hauling: "↔",
  building: "▲",
  fighting: "⚔",
  crafting: "🔨",
  equipping: "🎽",
};

const TASK_COLORS: Record<string, string> = {
  idle: "text-muted-foreground",
  mining: "text-chart-3",
  hauling: "text-chart-1",
  building: "text-chart-2",
  fighting: "text-destructive",
  crafting: "text-chart-4",
  equipping: "text-chart-5",
};

export default function DwarfList({ dwarves }: DwarfListProps) {
  return (
    <Card className="font-mono">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm uppercase tracking-wider">
          Dwarves ({dwarves.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]">
          <div className="space-y-2">
            {dwarves.map((dwarf) => (
              <div
                key={dwarf.id}
                className="p-2 rounded hover-elevate space-y-1"
                data-testid={`dwarf-${dwarf.id}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`${TASK_COLORS[dwarf.task]} text-sm`}>
                      {TASK_ICONS[dwarf.task]}
                    </span>
                    <span className="text-sm truncate">{dwarf.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground capitalize whitespace-nowrap">
                    {dwarf.task}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        dwarf.health > 50
                          ? "bg-chart-2"
                          : dwarf.health > 25
                            ? "bg-chart-1"
                            : "bg-destructive"
                      }`}
                      style={{
                        width: `${(dwarf.health / dwarf.maxHealth) * 100}%`,
                      }}
                      data-testid={`health-bar-${dwarf.id}`}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
                    {dwarf.health}/{dwarf.maxHealth}
                  </span>
                </div>
                {(dwarf.equipment?.weapon || dwarf.equipment?.armor) && (
                  <div className="flex items-center gap-1 text-xs">
                    {dwarf.equipment?.weapon && <span title="Weapon">⚔️</span>}
                    {dwarf.equipment?.armor && <span title="Armor">🛡️</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
