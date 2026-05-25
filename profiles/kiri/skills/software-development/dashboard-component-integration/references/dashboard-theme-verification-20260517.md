# Dashboard Theme Verification Checklist

**Session:** 2026-05-17 - Violet/black dashboard recovery

## Theme Detection Methodology

### Primary vs Accent Colors
When user requests "black with purple buttons", check for:

| Location | Primary Theme | Violet Usage |
|----------|---------------|--------------|
| `globals.css --primary` | Main brand color | Usually absent or minimal |
| Tailwind classes | `bg-violet-600` etc. | Button accents |
| Compiled CSS | `border-slate-800` | Focus rings, hover states |

### Verification Steps
1. Check `globals.css` for `--primary: X` HSL value
2. Search for `violet-*` in `src/components/*` (button files)
3. Verify in compiled `.next/static/css/*.css` if pre-built
4. Check `tailwind.config.ts` for color extensions

## Common Theme Configurations

### Config A: Blue Primary (Most Common)
```css
--primary: 240 5.9% 10%;  /* Near-black */
--accent: 217 91% 60%;    /* Blue */
```
Buttons: `bg-primary` or Tailwind `bg-blue-*`

### Config B: Violet Accents (Forge Profile May 7)
```css
--primary: 240 5.9% 10%;  /* Near-black */
```
Buttons: `bg-violet-600 hover:bg-violet-500`
Location: `ask-kiri-bar.tsx`, action buttons

### Config C: True Violet Primary (Not Found)
```css
--primary: 267 45% 65%;   /* Violet HSL */
```
**Status:** Not found in any snapshot as of 2026-05-17

## Snapshot Confidence Report Format

When reporting "version not found":

| Check | Result |
|-------|--------|
| Agent profile directories | ✅ 26 profiles checked |
| Infrastructure snapshots | ✅ 8 snapshots checked |
| User snapshots | ✅ 3 locations checked |
| Cron archives | ✅ (if applicable) |
| Session logs | ✅ (if applicable) |
| **Total dashboards found** | **26 versions** |
| Matching criteria | **0 versions** |

**Conclusion:** Confident search completed. Target configuration does not exist in available snapshots.
