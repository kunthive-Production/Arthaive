# Contributing to Arthaive

Thanks for helping build India's open startup funding intelligence platform. Contributions of all sizes are welcome — data corrections, new sources, bug fixes, and features.

## Ways to contribute

- **Data corrections** — spotted a wrong amount, stage, investor, or a missing source link? Open an issue with the deal and the correct value, ideally with a source URL.
- **New sources** — suggest a publication or feed worth crawling. Note its reliability and coverage.
- **Code** — bug fixes, performance, accessibility, new analytics, API improvements.
- **Docs** — clarifications and corrections to the [`documentation/`](documentation/) folder.

## Before you start

For anything beyond a small fix, **open an issue first** so we can agree on the approach before you invest time.

## Development setup

See the [Local Development](README.md#local-development) section of the README. In short:

```bash
git clone https://github.com/kunthive-Labs/Arthaive.git
cd Arthaive
npm install
npm run dev
```

The app falls back to the static `data/funding-data.ts` fixture when Supabase env vars are unset, so you can run and test without any backend.

## Pull request checklist

Before opening a PR, make sure the production checks pass:

```bash
npx tsc --noEmit   # zero TypeScript errors
npm run build      # clean build
npm test           # all green (Vitest)
```

- Keep PRs focused — one logical change per PR.
- Match the surrounding code style (TypeScript, Tailwind, shadcn/ui conventions).
- Reference the issue your PR closes.
- For data changes, include the source URL in the PR description.

## Code of conduct

Be respectful and constructive. We're here to build a useful public resource together.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
