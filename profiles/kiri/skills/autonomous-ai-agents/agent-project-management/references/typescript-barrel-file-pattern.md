# TypeScript Barrel File Pattern

Session: 2026-05-16
Problem: Next.js build failing with `Module not found: Can't resolve '@/plugin-system/core'`

## The Issue

Directory structure existed:
```
src/plugin-system/core/
├── PluginRegistry.ts
├── PluginStorage.ts
└── (missing: index.ts)
```

Imports in API routes:
```typescript
import { listPlugins, installPlugin } from "@/plugin-system/core";
```

Error: Module not found despite files existing.

## Root Cause

TypeScript/Next.js path mapping `@/*` → `./src/*` requires an `index.ts` (barrel file) to export from a directory.

Without `index.ts`, the directory has no public API surface.

## The Fix

Create `src/plugin-system/core/index.ts`:

```typescript
// Barrel file - re-export all public APIs
export { PluginRegistry } from './PluginRegistry';
export { PluginStorage } from './PluginStorage';

// If the consuming code expects these functions:
export function listPlugins() { /* ... */ }
export function installPlugin(manifest: PluginManifest) { /* ... */ }
export function enablePlugin(id: string) { /* ... */ }
export function disablePlugin(id: string) { /* ... */ }
export function getPlugin(id: string) { /* ... */ }
export function updatePluginConfig(id: string, config: unknown) { /* ... */ }
export function uninstallPlugin(id: string) { /* ... */ }
```

## Verification

```bash
# Check what the directory exports
cat src/plugin-system/core/index.ts

# Verify build succeeds
npm run build
```

## Pattern

When you see `Module not found` for a path that clearly exists:
1. Check if it's a directory import (no `/` at end means it looks for `index.ts`)
2. Verify `index.ts` exists in that directory
3. Check that `index.ts` exports what consumers expect

## Anti-Pattern

**Don't:** Create individual exports at top level when code expects directory structure.
**Do:** Use barrel files to maintain clean directory organization while providing unified exports.