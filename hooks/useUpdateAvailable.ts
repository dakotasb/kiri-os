'use client';

import { useState, useEffect } from 'react';

export interface UpdateInfo {
  available: boolean;
  commitCount: number;
  latestTag: string;
}

const STORAGE_KEY = 'kiri_update_available';

// Dev-only seed: uncomment to test the banner without writing to localStorage manually.
// if (typeof window !== 'undefined') {
//   localStorage.setItem(STORAGE_KEY, JSON.stringify({ available: true, commitCount: 4, latestTag: 'v0.9.2' }));
// }

export function useUpdateAvailable(): UpdateInfo | null {
  const [info, setInfo] = useState<UpdateInfo | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed: UpdateInfo = JSON.parse(raw);
      if (parsed?.available) setInfo(parsed);
    } catch {
      // malformed entry — ignore silently
    }
  }, []);

  return info;
}
