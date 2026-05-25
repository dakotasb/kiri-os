# Kiri OS

Kiri is an AI agent system built on [Hermes](https://github.com/NousResearch/hermes-agent) with persistent memory via [MemPalace](https://github.com/mehmetkirkoca/MemPalace). Deploy her as a Discord bot in minutes.

## What's included

- **Kiri gateway** — Discord bot powered by the Hermes agent runtime
- **MemPalace** — persistent vector + graph memory (Qdrant + Neo4j)
- **Kiri profile** — personality, skills, and orchestration config
- **UI** — dashboard for managing Kiri and her agent fleet (see `ui/`)

## Quick start

```bash
git clone https://github.com/dakotasb/kiri-os
cd kiri-os
cp .env.example .env        # fill in DISCORD_BOT_TOKEN + OLLAMA_API_KEY
docker compose up -d        # Kiri is live
```

## Repository structure

```
kiri-os/
├── docker-compose.yml      deploy stack (Qdrant, Neo4j, MemPalace, Kiri)
├── .env.example            required secrets template
├── profiles/
│   └── kiri/               personality, config, and skills
│       ├── SOUL.md
│       ├── config.yaml
│       └── skills/
├── ui/                     Next.js dashboard (coming soon)
└── docs/                   design specs, architecture, roadmap
```

## Documentation

- [Design Spec](docs/KIRI_OS_DESIGN_SPEC.md)
- [Product Vision](docs/PRODUCT_VISION.md)
- [Architecture](docs/architecture/ARCHITECTURE.md)
- [Roadmap](docs/vF4-ROADMAP.md)

## Engines

- Hermes agent runtime: [dakotasb/hermes-agent](https://github.com/dakotasb/hermes-agent)
- MemPalace memory layer: [dakotasb/mempalace](https://github.com/dakotasb/mempalace)
