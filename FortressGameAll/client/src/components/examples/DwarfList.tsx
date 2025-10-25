import DwarfList from "../DwarfList";
import type { Dwarf } from "@shared/schema";

export default function DwarfListExample() {
  const dwarves: Dwarf[] = [
    {
      id: "1",
      name: "Urist McStone",
      x: 10,
      y: 10,
      task: "mining",
      health: 100,
      maxHealth: 100,
    },
    {
      id: "2",
      name: "Bomrek Ironforge",
      x: 12,
      y: 8,
      task: "fighting",
      health: 45,
      maxHealth: 100,
    },
    {
      id: "3",
      name: "Kogan Deepdelver",
      x: 9,
      y: 11,
      task: "building",
      health: 80,
      maxHealth: 100,
    },
    {
      id: "4",
      name: "Thob Rockpicker",
      x: 15,
      y: 5,
      task: "idle",
      health: 100,
      maxHealth: 100,
    },
    {
      id: "5",
      name: "Zasit Caveborn",
      x: 8,
      y: 12,
      task: "fighting",
      health: 20,
      maxHealth: 100,
    },
  ];

  return <DwarfList dwarves={dwarves} />;
}
