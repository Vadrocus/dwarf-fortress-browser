# Fortress Terminal - ASCII Colony Management Game

## Overview

Fortress Terminal is a browser-based colony management game inspired by Dwarf Fortress, featuring a retro ASCII aesthetic combined with modern web technologies. Players manage a dwarf colony, designating mining operations, constructing buildings, and surviving against monsters in a procedurally generated world rendered entirely in ASCII characters.

The application is built as a full-stack web game with a React-based frontend featuring canvas-rendered ASCII graphics, shadcn/ui components for the interface, and an Express backend with planned database persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Component-Based React Application**
- Built with React 18 using functional components and hooks
- Vite as the build tool and development server for fast HMM and optimized production builds
- TypeScript for type safety across the entire codebase
- Wouter for lightweight client-side routing

**UI Framework & Styling**
- shadcn/ui component library (New York variant) providing accessible, pre-built components based on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Monospace fonts (JetBrains Mono, Fira Code, Courier Prime) for authentic terminal aesthetic
- Custom CSS variables for dark mode terminal theme with amber/orange primary colors
- Design system follows Dwarf Fortress-inspired retro aesthetic with high information density

**Game State Management**
- Client-side game loop using `requestAnimationFrame` for smooth 60 FPS updates
- Local state management with React hooks (useState, useEffect, useRef)
- TanStack Query (React Query) for server state management and data fetching
- Game engine (`gameEngine.ts`) handles world generation, dwarf AI, and game logic updates

**Canvas-Based Rendering**
- HTML5 Canvas for rendering the ASCII game grid
- Character-by-character rendering with monospace fonts for pixel-perfect alignment
- Color-coded terrain types, entities, and construction zones
- 60x30 tile world displayed on canvas with click interaction support

### Backend Architecture

**Express.js Server**
- RESTful API structure with routes prefixed under `/api`
- Middleware for JSON parsing, logging, and request tracking
- Development mode includes Vite middleware for HMR and dev tooling
- Production mode serves static built assets

**Storage Layer**
- In-memory storage implementation (`MemStorage`) for users and game state
- Interface-based storage pattern (`IStorage`) allowing easy swap to persistent storage
- Designed to integrate with Drizzle ORM and PostgreSQL database

**Development Tools**
- TypeScript compilation with strict mode enabled
- Hot module replacement via Vite integration
- Request/response logging with timing metrics
- Replit-specific plugins for runtime error handling and cartographer support

### External Dependencies

**Database (Planned)**
- PostgreSQL via Neon serverless driver (`@neondatabase/serverless`)
- Drizzle ORM for type-safe database queries and schema management
- `connect-pg-simple` for session storage in PostgreSQL
- Migration system via `drizzle-kit`

**UI Component Libraries**
- Radix UI primitives for accessible, unstyled components (accordion, dialog, dropdown, popover, tabs, toast, tooltip, etc.)
- Embla Carousel for carousel functionality
- cmdk for command palette interface
- Lucide React for icon system

**Utilities & Tooling**
- React Hook Form with Zod resolvers for form validation
- date-fns for date manipulation
- class-variance-authority (CVA) for component variant management
- clsx and tailwind-merge for conditional CSS class handling
- nanoid for unique ID generation

**Build & Development**
- Vite with React plugin for development and production builds
- esbuild for server-side bundling
- PostCSS with Tailwind CSS and Autoprefixer
- tsx for running TypeScript directly in development

**Key Design Decisions**

1. **Client-Side Game Loop**: Game state updates happen entirely on the client using a game loop pattern, reducing server load and enabling offline play. Server will be used for persistence and multiplayer features.

2. **Canvas Rendering**: Chose HTML5 Canvas over DOM-based rendering for performance with large ASCII grids and smoother animations at 60 FPS.

3. **Monorepo Structure**: Shared schema types between client and server via `shared/` directory, ensuring type consistency across the full stack.

4. **In-Memory First**: Started with in-memory storage to iterate quickly on game mechanics before adding database complexity.

5. **Component Isolation**: Game UI components (ActionMenu, ControlPanel, DwarfList, EventLog, GameGrid, ResourcePanel) are isolated and reusable with example implementations.

6. **Design System**: Terminal-inspired dark theme with amber accents maintains nostalgic aesthetic while using modern component patterns for accessibility and responsiveness.