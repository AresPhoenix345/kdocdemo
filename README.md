# KubeStellar Documentation Initiative (Prototype)

This `kdemo/` folder is a **deployable prototype documentation site** showcasing the vision and deliverables for the **LFX Mentorship 2026 Term 1** project: **KubeStellar Documentation and Self-Service Enablement**.

It is designed to look and feel like a real project docs site while focusing on:
- A **≤ 30-minute** quickstart experience
- **Interactive, self-serve learning** (Killercoda-style tutorial preview)
- A **20-issue troubleshooting guide** with error signatures
- Use cases and migration playbooks that accelerate real adoption

## Repository Context

This repository contains two relevant source folders:

- `kubestellar/`: the main KubeStellar repository (core concepts, scripts, docs)
- `ks-docs/`: the documentation repository (additional explanations and content)

This prototype **extracts and repackages** key concepts from both into a Docusaurus site under `kdemo/`.

## Tech Stack

- **Docusaurus v3** (React-based documentation framework)
- **Netlify** deployment via `kdemo/netlify.toml`

## Local Development

From the repo root:

```bash
cd kdemo
npm install
npm start
```

Then open the local dev URL printed by Docusaurus (typically `http://localhost:3000`).

## Production Build (Netlify)

Netlify is configured to:
- **Base directory**: `kdemo`
- **Build command**: `npm run build`
- **Publish directory**: `kdemo/build`

To test locally:

```bash
cd kdemo
npm install
npm run build
npm run serve
```

## Site Structure

Key areas:

- **Homepage**: project vision, deliverables, timeline, metrics, architecture preview  
  - `kdemo/src/pages/index.js`
- **Docs**:
  - `docs/quickstart/`: ≤30 minute path to first success
  - `docs/tutorials/`: interactive tutorial preview + video series outline
  - `docs/troubleshooting/`: 20 common issues + error reference
  - `docs/use-cases/`: 5 real-world patterns
  - `docs/migration/`: 3 migration playbooks (ArgoCD, Karmada, Cluster API)
  - `docs/architecture/`: WDS, ITS, WECs, BindingPolicy
- **Blog**:
  - `blog/2026-02-10-project-vision.md`
  - `blog/2026-02-11-mentorship-opportunity.md`
- **Static assets**:
  - `static/img/logo.svg`
  - `static/img/architecture-diagram.svg`
  - `static/img/timeline.svg`

## How This Prototype Maps to Mentorship Deliverables

- **Quickstart guide**: `docs/quickstart/`
- **Interactive tutorial**: `docs/tutorials/interactive-tutorial-preview.md`
- **Video series**: `docs/tutorials/video-series-outline.md`
- **Troubleshooting guide (20 issues)**: `docs/troubleshooting/common-issues.md`
- **Use-case documentation (5 patterns)**: `docs/use-cases/`
- **Migration guides (3 scenarios)**: `docs/migration/`

## References (Upstream)

- KubeStellar website: `https://kubestellar.io`
- KubeStellar GitHub: `https://github.com/kubestellar/kubestellar`
- CNCF Slack channel: `#kubestellar-dev` in `https://communityinviter.com/apps/cloud-native/cncf`

## Contributing / Feedback

This is a prototype; feedback is welcome:

- Open issues in the main repo (or your fork) describing doc friction
- Suggest improvements to quickstart flow, troubleshooting coverage, and navigation

## Mentorship Inquiries

Applications and program details:

`https://mentorship.lfx.linuxfoundation.org/`

