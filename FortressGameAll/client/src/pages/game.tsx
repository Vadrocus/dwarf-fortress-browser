import { useState, useEffect, useRef } from "react";
import GameGrid from "@/components/GameGrid";
import ResourcePanel from "@/components/ResourcePanel";
import ControlPanel from "@/components/ControlPanel";
import DwarfList from "@/components/DwarfList";
import EventLog from "@/components/EventLog";
import ActionMenu from "@/components/ActionMenu";
import { WorkshopMenu } from "@/components/examples/WorkshopMenu";
import { WorkshopList } from "@/components/examples/WorkshopList";
import { EquipmentManager } from "@/components/examples/EquipmentManager";
import {
  createInitialGameState,
  updateGameState,
  queueCraftingJob,
  equipItem,
} from "@/lib/gameEngine";
import type { GameState, ItemType } from "@shared/schema";

export default function Game() {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [selectedWorkshop, setSelectedWorkshop] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const lastUpdateRef = useRef(Date.now());
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = now - lastUpdateRef.current;

      if (!gameState.isPaused) {
        const updateInterval = 1000 / gameState.gameSpeed;

        if (deltaTime >= updateInterval) {
          setGameState((prevState) => updateGameState(prevState));
          lastUpdateRef.current = now;
        }
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState.isPaused, gameState.gameSpeed]);

  const handlePauseToggle = () => {
    setGameState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const handleSpeedChange = (speed: number) => {
    setGameState((prev) => ({ ...prev, gameSpeed: speed }));
  };

  const handleTileClick = (x: number, y: number) => {
    const tile = gameState.tiles[y][x];

    // If clicking on a workshop without an action selected, open workshop menu
    if (!selectedAction && tile.construction === "workshop") {
      setSelectedWorkshop({ x, y });
      return;
    }

    if (selectedAction === "mine") {
      setGameState((prev) => {
        const newTiles = prev.tiles.map((row) => [...row]);
        const tile = newTiles[y][x];

        if (tile.terrain === "stone" || tile.terrain === "tree") {
          tile.miningDesignated = !tile.miningDesignated;

          const newMessages = [...prev.messages];
          if (tile.miningDesignated) {
            newMessages.unshift({
              id: `msg-${Date.now()}`,
              timestamp: Date.now(),
              text: `Designated ${tile.terrain} at (${x}, ${y}) for mining.`,
              type: "info",
            });
          }

          return {
            ...prev,
            tiles: newTiles,
            messages: newMessages.slice(0, 50),
          };
        }

        return prev;
      });
    } else if (selectedAction === "build") {
      setGameState((prev) => {
        const newTiles = prev.tiles.map((row) => [...row]);
        const tile = newTiles[y][x];

        if (prev.resources.stone >= 5) {
          if (
            tile.terrain === "empty" ||
            tile.terrain === "grass" ||
            tile.terrain === "dirt"
          ) {
            tile.construction = "workshop";

            return {
              ...prev,
              tiles: newTiles,
              resources: {
                ...prev.resources,
                stone: prev.resources.stone - 5,
              },
              messages: [
                {
                  id: `msg-${Date.now()}`,
                  timestamp: Date.now(),
                  text: `Workshop built at (${x}, ${y}).`,
                  type: "success",
                },
                ...prev.messages.slice(0, 49),
              ],
            };
          } else {
            return {
              ...prev,
              messages: [
                {
                  id: `msg-${Date.now()}`,
                  timestamp: Date.now(),
                  text: `Cannot build here! Clear the area first or choose grass/dirt terrain.`,
                  type: "warning",
                },
                ...prev.messages.slice(0, 49),
              ],
            };
          }
        } else {
          return {
            ...prev,
            messages: [
              {
                id: `msg-${Date.now()}`,
                timestamp: Date.now(),
                text: "Not enough stone! Need 5 stone to build workshop.",
                type: "warning",
              },
              ...prev.messages.slice(0, 49),
            ],
          };
        }
      });
    } else if (selectedAction === "zone") {
      setGameState((prev) => {
        const newTiles = prev.tiles.map((row) => [...row]);
        const tile = newTiles[y][x];

        if (
          tile.terrain === "empty" ||
          tile.terrain === "grass" ||
          tile.terrain === "dirt"
        ) {
          tile.construction = "stockpile";

          return {
            ...prev,
            tiles: newTiles,
            messages: [
              {
                id: `msg-${Date.now()}`,
                timestamp: Date.now(),
                text: `Stockpile created at (${x}, ${y}).`,
                type: "info",
              },
              ...prev.messages.slice(0, 49),
            ],
          };
        } else {
          return {
            ...prev,
            messages: [
              {
                id: `msg-${Date.now()}`,
                timestamp: Date.now(),
                text: `Cannot place stockpile here! Clear the area first or choose grass/dirt terrain.`,
                type: "warning",
              },
              ...prev.messages.slice(0, 49),
            ],
          };
        }
      });
    }
  };

  const handleActionSelect = (action: "mine" | "build" | "zone") => {
    setSelectedAction((prev) => (prev === action ? null : action));
  };

  const handleCraftItem = (itemType: ItemType) => {
    if (selectedWorkshop) {
      setGameState((prev) =>
        queueCraftingJob(
          prev,
          selectedWorkshop.x,
          selectedWorkshop.y,
          itemType,
        ),
      );
    }
  };

  const handleEquipItem = (dwarfId: string, itemId: string) => {
    setGameState((prev) => equipItem(prev, dwarfId, itemId));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold font-mono tracking-wider uppercase">
            ⛏ Fortress Terminal
          </h1>
          <div className="text-sm text-muted-foreground font-mono">
            Tick: {gameState.tick}
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-64 border-r border-border overflow-y-auto p-4 space-y-4">
          <ResourcePanel
            stone={gameState.resources.stone}
            wood={gameState.resources.wood}
            items={gameState.items}
          />
          <ControlPanel
            isPaused={gameState.isPaused}
            gameSpeed={gameState.gameSpeed}
            onPauseToggle={handlePauseToggle}
            onSpeedChange={handleSpeedChange}
          />
          <DwarfList dwarves={gameState.dwarves} />
          <WorkshopList
            gameState={gameState}
            onSelectWorkshop={(x, y) => setSelectedWorkshop({ x, y })}
          />
          <EquipmentManager
            gameState={gameState}
            onAssignEquipment={handleEquipItem}
          />
        </aside>

        <main className="flex-1 overflow-auto relative">
          <GameGrid
            tiles={gameState.tiles}
            dwarves={gameState.dwarves}
            monsters={gameState.monsters}
            onTileClick={handleTileClick}
          />
          {selectedWorkshop && (
            <WorkshopMenu
              gameState={gameState}
              workshopX={selectedWorkshop.x}
              workshopY={selectedWorkshop.y}
              onCraftItem={handleCraftItem}
              onClose={() => setSelectedWorkshop(null)}
            />
          )}
        </main>

        <aside className="w-72 border-l border-border overflow-y-auto p-4 space-y-4">
          <ActionMenu
            onActionSelect={handleActionSelect}
            selectedAction={selectedAction}
          />
          <EventLog messages={gameState.messages} />
        </aside>
      </div>
    </div>
  );
}
``;
