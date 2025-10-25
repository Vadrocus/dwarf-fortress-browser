import { useRef, useEffect } from "react";
import type { Tile, Dwarf, Monster } from "@shared/schema";

interface GameGridProps {
  tiles: Tile[][];
  dwarves: Dwarf[];
  monsters: Monster[];
  onTileClick: (x: number, y: number) => void;
}

const TERRAIN_CHARS: Record<string, string> = {
  grass: ".",
  dirt: "≈",
  stone: "█",
  water: "~",
  tree: "♠",
  empty: " ",
};

const TERRAIN_COLORS: Record<string, string> = {
  grass: "hsl(120 50% 45%)",
  dirt: "hsl(30 40% 35%)",
  stone: "hsl(210 8% 45%)",
  water: "hsl(200 80% 55%)",
  tree: "hsl(120 60% 30%)",
  empty: "hsl(220 12% 12%)",
};

const MONSTER_CHARS: Record<string, string> = {
  goblin: "g",
  troll: "T",
  beast: "B",
};

const MONSTER_COLORS: Record<string, string> = {
  goblin: "hsl(120 60% 40%)",
  troll: "hsl(0 60% 50%)",
  beast: "hsl(30 70% 45%)",
};

export default function GameGrid({
  tiles,
  dwarves,
  monsters,
  onTileClick,
}: GameGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cellWidth = 12;
    const cellHeight = 18;

    canvas.width = tiles[0].length * cellWidth;
    canvas.height = tiles.length * cellHeight;

    ctx.fillStyle = "hsl(220 12% 12%)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = '16px "JetBrains Mono", "Courier New", monospace';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let y = 0; y < tiles.length; y++) {
      for (let x = 0; x < tiles[y].length; x++) {
        const tile = tiles[y][x];
        const char = TERRAIN_CHARS[tile.terrain] || "?";
        const color = TERRAIN_COLORS[tile.terrain] || "#888";

        if (tile.miningDesignated) {
          ctx.fillStyle = "hsl(180 60% 55% / 0.3)";
          ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
        }

        ctx.fillStyle = color;
        ctx.fillText(
          char,
          x * cellWidth + cellWidth / 2,
          y * cellHeight + cellHeight / 2,
        );

        if (tile.construction) {
          ctx.fillStyle = "hsl(45 90% 65%)";
          const constructionChar =
            tile.construction === "workshop"
              ? "⚒"
              : tile.construction === "stockpile"
                ? "□"
                : "#";
          ctx.fillText(
            constructionChar,
            x * cellWidth + cellWidth / 2,
            y * cellHeight + cellHeight / 2,
          );

          // Show crafting progress
          if (tile.construction === "workshop" && tile.craftingJob) {
            const progress = tile.craftingJob.progress / 100;
            ctx.fillStyle = "hsl(180 70% 50% / 0.6)";
            ctx.fillRect(
              x * cellWidth,
              y * cellHeight + cellHeight - 3,
              cellWidth * progress,
              3,
            );
          }
        }
      }
    }

    for (const monster of monsters) {
      const char = MONSTER_CHARS[monster.type] || "M";
      const color = MONSTER_COLORS[monster.type] || "hsl(0 70% 50%)";
      ctx.fillStyle = color;
      ctx.fillText(
        char,
        monster.x * cellWidth + cellWidth / 2,
        monster.y * cellHeight + cellHeight / 2,
      );
    }

    ctx.fillStyle = "hsl(350 70% 65%)";
    for (const dwarf of dwarves) {
      ctx.fillText(
        "☺",
        dwarf.x * cellWidth + cellWidth / 2,
        dwarf.y * cellHeight + cellHeight / 2,
      );
    }
  }, [tiles, dwarves, monsters]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const cellWidth = 12;
    const cellHeight = 18;

    const x = Math.floor((e.clientX - rect.left) / cellWidth);
    const y = Math.floor((e.clientY - rect.top) / cellHeight);

    if (x >= 0 && x < tiles[0].length && y >= 0 && y < tiles.length) {
      onTileClick(x, y);
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        className="border-2 border-primary cursor-crosshair"
        style={{
          imageRendering: "pixelated",
          boxShadow: "0 0 20px hsl(45 100% 60% / 0.3)",
        }}
        data-testid="game-grid"
      />
    </div>
  );
}
