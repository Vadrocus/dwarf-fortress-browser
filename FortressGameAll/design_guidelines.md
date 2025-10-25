# Design Guidelines: Dwarf Fortress-Inspired Colony Management Game

## Design Approach
**Reference-Based Approach**: Drawing from classic ASCII roguelikes and Dwarf Fortress's iconic terminal aesthetic, combined with modern web game UX patterns for accessibility.

**Key Design Principles**:
- Authentic retro terminal/DOS aesthetic with ASCII characters
- High information density without overwhelming the player
- Immediate visual feedback for all game states
- Nostalgic gaming experience with modern usability

## Core Design Elements

### A. Color Palette

**Dark Mode Terminal Theme** (Primary):
- Background: 220 15% 8% (deep charcoal, terminal black)
- ASCII Grid Background: 220 12% 12% (slightly lighter for contrast)
- UI Panel Background: 220 15% 10% (subtle differentiation)
- Primary Text: 45 100% 75% (amber/orange terminal glow)
- Secondary Text: 200 10% 70% (muted gray for labels)

**Game World Colors** (ASCII Character Colors):
- Rock/Stone: 210 8% 45% (gray)
- Dirt: 30 40% 35% (brown)
- Grass: 120 50% 45% (green)
- Water: 200 80% 55% (blue)
- Dwarfs: 350 70% 65% (magenta/pink)
- Resources: 45 90% 65% (gold/amber)
- Designated Areas: 180 60% 55% (cyan overlay)

**UI Accents**:
- Action Buttons: 45 100% 60% (bright amber)
- Danger/Warning: 0 80% 60% (red)
- Success/Build: 120 60% 55% (green)
- Hover States: 45 100% 85% (lighter amber)

### B. Typography

**Fonts**:
- Primary (ASCII Grid): 'Courier New', 'Consolas', monospace (16-18px, letter-spacing: 0.05em for crisp ASCII)
- UI Text: 'JetBrains Mono', 'Fira Code', monospace (13-14px for panels)
- Headers: Same monospace, bold weight, 16-20px with slight text-shadow for CRT glow effect

**Hierarchy**:
- Game Grid: 16-18px monospace, line-height: 1.2
- Panel Headers: 14px bold, uppercase, tracking-wide
- Resource Counters: 16px bold
- Info Text: 12-13px regular

### C. Layout System

**Tailwind Spacing Primitives**: Use 2, 4, 6, 8 units (p-2, m-4, gap-6, h-8)

**Grid Layout**:
- Main game grid: Central focus, 60-70% viewport width on desktop
- Left Sidebar: 240-280px fixed width (resource counters, dwarf list)
- Right Sidebar: 280-320px (action buttons, construction menu)
- Top Bar: 48-56px height (game controls: pause/play/speed, title)
- Bottom Panel: 120-160px collapsible (event log, messages)

**Responsive Breakpoints**:
- Desktop: Three-panel layout (left sidebar, grid, right panel)
- Tablet: Stack right panel below, keep left sidebar
- Mobile: Single column, floating control buttons

### D. Component Library

**Core Game Components**:

1. **ASCII Game Grid**
   - Monospace character grid with border (2px solid amber glow)
   - Each cell: 18x18px minimum for readability
   - Hover state: subtle background highlight (amber at 10% opacity)
   - Selected cells: cyan border overlay for designations
   - Grid lines: Optional faint lines (1px at 5% opacity) for readability

2. **Resource Counter Panel**
   - Dark panel background with subtle border
   - Icon (ASCII symbol) + Label + Number layout
   - Vertically stacked list with 2-unit gaps
   - Critical resources highlighted when low (red pulsing text)
   - Header: "RESOURCES" in uppercase, bordered bottom

3. **Control Buttons**
   - Rectangular with 1px border (amber)
   - Background: Transparent with hover state (amber 15% fill)
   - Active state: Amber 25% fill with inset shadow
   - Button groups: Bordered container with 1px internal dividers
   - Icons: ASCII symbols (▶ ⏸ ⏩ ⛏ 🏗 etc.)

4. **Dwarf Status List**
   - Compact list items (each dwarf entry)
   - Dwarf name + current task in monospace
   - Status indicator: colored ASCII symbol (● for idle, ⚒ for working)
   - Scrollable container with custom scrollbar (amber track)

5. **Event Log**
   - Reverse chronological message feed
   - Timestamp + event text in amber
   - Color-coded by type (warnings red, success green)
   - Auto-scroll with pause option
   - Semi-transparent dark background

6. **Action Menu**
   - Tab-based interface (Mining, Building, Zones)
   - Each tab: bordered button style, active tab highlighted
   - Content area: Grid of action buttons (2-3 columns)
   - Tooltips on hover with keyboard shortcuts

**Navigation**:
- Top bar: Title left-aligned, controls center, settings/help right
- Keyboard shortcut hints in subtle text below buttons
- Modal dialogs: Centered with dark overlay (80% opacity background)

**Forms & Data Displays**:
- N/A - minimal forms, mostly click-to-designate interaction
- Data displays: Tabular ASCII-style borders for stats screens

### E. Visual Effects

**Terminal CRT Effects** (Subtle):
- Slight text-shadow on amber text (0 0 8px current color at 40%)
- Optional scanline overlay (repeating-linear-gradient, 2px intervals at 3% opacity)
- Subtle noise texture on panels (5% opacity)

**Animations** (Minimal):
- Dwarf movement: Instant position updates (no smooth transitions for retro feel)
- Resource updates: 200ms fade-in for new values
- Button clicks: 100ms scale down (0.95) for tactile feedback
- Warning pulses: 1s ease-in-out for critical alerts

**Interaction Feedback**:
- Cursor: Custom pointer (crosshair) over game grid
- Click feedback: Brief flash on designated cells (100ms)
- Invalid actions: Red X flash with subtle shake (200ms)

## Special Considerations

**Retro Gaming Authenticity**:
- Maintain sharp, pixelated edges (no border-radius except minimal on outer containers)
- Use ASCII box-drawing characters (─ │ ┌ ┐ └ ┘ ├ ┤) for panel borders
- Monospace everywhere for consistency
- High contrast ratios for visibility during long play sessions

**Accessibility**:
- Maintain 4.5:1 contrast for all text
- Keyboard navigation for all actions
- Clear focus indicators (amber outline, 2px)
- Text alternatives for ASCII symbols via aria-labels

**Performance**:
- Efficient grid rendering (canvas or optimized DOM)
- Debounced scroll/zoom events
- Lazy rendering for off-screen grid cells