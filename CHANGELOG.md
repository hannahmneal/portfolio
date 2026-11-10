# Changelog

All notable changes to this project are documented in this file.

This file is maintained automatically by
[release-please](https://github.com/googleapis/release-please) from
[Conventional Commits](https://www.conventionalcommits.org/) - add entries by
writing commit messages like `feat: add contact form`, not by editing here.

The version in `version.txt`, `frontend/package.json` and
`backend/package.json` is kept in sync with the most recent release tag.

## 0.3.0 (2026-10-28)

Version baseline for the `0.x` series. Before this, no `package.json` in the
repo carried a real version - the frontend sat at the Vite default `0.0.0` and
the backend at the `npm init` default `1.0.0`, and there was no changelog.

The work at this baseline was published as the
[`v1.0.0`](https://github.com/hannahmneal/portfolio/releases/tag/v1.0.0) tag,
which is retained as the historical record of that deploy:

### Infrastructure

* Infra now uses GitHub Actions, Neon, and Render ([#31](https://github.com/hannahmneal/portfolio/pull/31))

> Note: `v1.0.0` sorts above the `0.x` tags that follow it. It is kept
> deliberately; releases from 0.3.1 onward are cut by release-please, which
> reads `.release-please-manifest.json` rather than tag order, so the
> numbering sequence is unaffected.
