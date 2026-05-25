# Next.js 14 Porting Reference

## Common Migration Issues When Restoring/Moving Dashboards

### 1. next.config.ts → next.config.js

**Problem:** Next.js 14 doesn't support TypeScript config files.
```
Error: Configuring Next.js via 'next.config.ts' is not supported. 
Please replace the file with 'next.config.js' or 'next.config.mjs'.
```

**Fix:**
```bash
# Convert .ts to .js (remove type annotations)
# Remove `import type` statements
# Change `export default` to `module.exports`
```

**Example conversion:**
```typescript
// BEFORE: next.config.ts
import type { NextConfig } from "next";
const nextConfig: NextConfig = { ... };
export default nextConfig;

// AFTER: next.config.js  
/** @type {import('next').NextConfig} */
const nextConfig = { ... };
module.exports = nextConfig;
```

### 2. Geist Font Compatibility

**Problem:** `next/font/google` in Next.js 14 may not recognize newer fonts like Geist:
```
Unknown font `Geist`
`next/font` error: Unknown font `Geist`
```

**Fix:** Replace with standard Inter font:
```typescript
// BEFORE
import { Geist, Geist_Mono } from "next/font/google";

// AFTER  
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
```

### 3. Root Layout Requirements

**Problem:** Next.js App Router requires root layout with specific tags.
```
Missing required html tags
The following tags are missing in the Root Layout: <html>, <body>
```

**Fix:** Ensure layout.tsx includes:
```typescript
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### 4. Module Resolution (require-hook)

**Problem:** When node_modules is partially corrupted:
```
Error: Cannot find module '../server/require-hook'
Require stack: - /node_modules/.bin/next
```

**Fix:** Full dependency reinstall, not just cache clear
```bash
rm -rf node_modules package-lock.json
npm install next@14.2.20 react@18.3.1 react-dom@18.3.1 --save
```

## Complete Reset Pattern for Next.js 14

When dashboard shows blank/404 after restoration:

```bash
cd /path/to/dashboard
pkill -9 -f "next.*300[01]"
rm -rf .next node_modules package-lock.json
rm -f next.config.ts  # Remove old .ts file

# Create valid next.config.js:
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  images: { unoptimized: true },
  async redirects() {
    return [
      { source: '/agents', destination: '/', permanent: true },
    ];
  },
};
module.exports = nextConfig;
EOF

# Fix font in layout.tsx (remove Geist)
npm install
PORT=3001 npm run dev
```

## Port Configuration (Next.js 14 vs 15)

- **Next.js 14:** Use `PORT=3001 npm run dev` ENV var
- **Next.js 15+:** Supports `server: { port: 3001 }` in config
- **Never use `turbopack: { root: ... }`** - causes file path issues
