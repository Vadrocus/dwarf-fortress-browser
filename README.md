# ⛏ Fortress Terminal

A browser-based Dwarf Fortress-inspired colony management game built with React, TypeScript, and real-time game loop mechanics.

## 🎮 About

Fortress Terminal is a simplified dwarf colony simulator where you manage a group of dwarves as they mine resources, craft equipment, build workshops, and defend against monsters. The game runs entirely in your browser with no backend required.

## ✨ Features

### Core Gameplay
- **Resource Management**: Mine stone and chop trees for building materials
- **Construction System**: Build workshops and stockpiles
- **Crafting System**: Create weapons, armor, and tools at workshops
- **Equipment System**: Dwarves can fetch and equip items for combat
- **Combat System**: Defend your fortress against goblins, trolls, and beasts
- **Hauling System**: Dwarves automatically organize items into stockpiles

### Game Mechanics
- **Real-time Simulation**: Game runs on a tick-based system with adjustable speed
- **Autonomous Dwarves**: Dwarves automatically find and complete tasks
- **Task Priorities**: Combat > Equipping > Crafting > Hauling > Mining > Idle
- **Pathfinding**: Dwarves navigate the map to reach their destinations
- **Health System**: Dwarves and monsters have health pools and damage calculations

### UI Features
- **Live Resource Counter**: Track stone, wood, and crafted items
- **Dwarf Status Panel**: Monitor each dwarf's task, health, and equipment
- **Workshop Manager**: Queue crafting jobs at workshops
- **Equipment Manager**: Assign dwarves to fetch and equip weapons/armor
- **Event Log**: Real-time updates on game events
- **Pause & Speed Controls**: Pause or adjust game speed (1x, 2x, 4x)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd FortressGame
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

## 🎯 How to Play

### Basic Tutorial

1. **Mine Resources**
   - Click "Mine" button in the action menu
   - Click on stone tiles (gray) or trees (green with tree icon)
   - Idle dwarves will automatically mine designated tiles
   - Stone and wood accumulate in your resource counter

2. **Build a Workshop**
   - Gather at least 5 stone
   - Click "Build" button
   - Click on an empty grass or dirt tile
   - Workshop appears instantly

3. **Craft Equipment**
   - Click on a workshop tile (⚒ icon)
   - Select an item to craft (sword or armor)
   - An idle dwarf will walk to the workshop and craft the item
   - Watch the progress bar fill up

4. **Create a Stockpile** (Optional)
   - Click "Zones" button
   - Click on empty tiles to create stockpile zones
   - Items will be automatically hauled to stockpiles

5. **Equip Your Dwarves**
   - Open the Equipment Manager in the left sidebar
   - See available weapons and armor
   - Click a dwarf's name next to an item
   - Watch the dwarf fetch and equip the item

6. **Defend Against Monsters**
   - Monsters spawn periodically at map edges
   - Dwarves automatically engage nearby monsters
   - Equipped dwarves are much stronger in combat
   - Keep your dwarves alive!

### Tips & Strategies

- **Prioritize Equipment**: Swords deal 2x damage, armor reduces damage by 50%
- **Build Multiple Workshops**: Craft more items simultaneously
- **Watch Dwarf Health**: Injured dwarves are less effective
- **Stockpile Placement**: Place near workshops for faster crafting
- **Monster Spawns**: Expect monsters every ~200 ticks (more with higher spawn rate)

## 📊 Game Stats

### Resources
- **Stone**: Mined from stone tiles, used for workshops and crafting
- **Wood**: Chopped from trees, used for crafting

### Crafting Recipes
| Item | Stone | Wood | Time | Effect |
|------|-------|------|------|--------|
| Pickaxe | 2 | 1 | 50 ticks | Mining tool |
| Sword | 3 | 1 | 75 ticks | 20 damage (vs 10 base) |
| Armor | 5 | 0 | 100 ticks | 50% damage reduction |
| Furniture | 1 | 3 | 60 ticks | Decoration |

### Combat Stats
- **Unarmed Dwarf**: 10 damage per hit
- **Sword-Equipped**: 20 damage per hit
- **Goblin**: 30 HP, 8 damage
- **Troll**: 60 HP, 15 damage
- **Beast**: 40 HP, 8 damage

## 🏗 Project Structure

```
FortressGame/
├── client/
│   ├── src/
│   │   ├── components/        # UI components
│   │   │   ├── examples/      # Example/wrapper components
│   │   │   └── ui/            # shadcn/ui components
│   │   ├── pages/             # Main game page
│   │   ├── lib/               # Game engine & utilities
│   │   └── hooks/             # React hooks
├── server/                     # Backend (minimal, mostly serves frontend)
├── shared/                     # Shared types and schemas
└── package.json
```

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Build Tool**: Vite
- **State Management**: React useState/useEffect
- **Game Loop**: requestAnimationFrame

## 🎨 Game Symbols

| Symbol | Meaning |
|--------|---------|
| ☺ | Dwarf |
| G | Goblin |
| T | Troll |
| B | Beast |
| ■ | Stone |
| ≋ | Water |
| ♠ | Tree |
| ⚒ | Workshop |
| □ | Stockpile |
| ⚔ | Sword (item or equipped) |
| 🛡️ | Armor (equipped) |

## 🎮 Controls

- **Left Click**: Interact with tiles (mine, build, zone)
- **Mouse Hover**: See tile information
- **UI Buttons**: Toggle actions, pause, adjust speed

## 🐛 Known Issues

- Monster spawning is random and can be overwhelming
- No save/load system yet
- Pathfinding is simple (Manhattan distance)
- No dwarf needs system (hunger, thirst, happiness)

## 🔮 Future Ideas

- [ ] Save/load game state
- [ ] More building types (dormitories, dining halls)
- [ ] Dwarf needs system (food, sleep, happiness)
- [ ] Advanced pathfinding
- [ ] More item types and crafting recipes
- [ ] Dwarf skills and experience
- [ ] Multi-level fortress (dig down!)
- [ ] Trade caravan system
- [ ] More monster types and behaviors

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

Inspired by the legendary Dwarf Fortress by Bay 12 Games.

## 🤝 Contributing

Feel free to fork, modify, and submit pull requests! This is a learning project.

---

**Strike the earth!** ⛏️🏔️
