export default function SettingsPage() {
  const gatewayUrl =
    process.env.NEXT_PUBLIC_HERMES_GATEWAY_URL ?? 'http://localhost:8642';

  return (
    <div className="h-full overflow-y-auto p-8 animate-fade-in">
      <h1 className="text-2xl font-semibold text-tx mb-2">Settings</h1>
      <p className="text-sm text-tx-3 mb-8">
        Kiri OS configuration and service connections
      </p>

      <div className="grid gap-4 max-w-lg">
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold text-tx mb-3">Hermes Gateway</h2>
          <div className="flex items-center gap-3">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: '#6CD9BA', boxShadow: '0 0 6px rgba(108,217,186,0.8)' }}
            />
            <div>
              <p className="text-xs font-mono text-tx">{gatewayUrl}</p>
              <p className="text-[11px] text-tx-3 mt-0.5">
                API server · Port 8642
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold text-tx mb-3">MemPalace</h2>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full shrink-0 bg-purple-400/60" />
            <div>
              <p className="text-xs font-mono text-tx">http://localhost:3100</p>
              <p className="text-[11px] text-tx-3 mt-0.5">Memory graph · Qdrant 6333</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold text-tx mb-3">Dashboard API</h2>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full shrink-0 bg-cyan-400/60" />
            <div>
              <p className="text-xs font-mono text-tx">http://localhost:4000</p>
              <p className="text-[11px] text-tx-3 mt-0.5">Express · kanban.db · goals.db</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
