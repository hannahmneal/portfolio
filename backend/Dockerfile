FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
# NOTE: this is a broad copy, and the published image is PUBLIC on GHCR
# (ghcr.io/<owner>/portfolio-api), so anything it picks up is world-readable.
# .dockerignore is what keeps that safe - it excludes `.env` and `.env.*`,
# and a developer's backend/.env holds live credentials (Cloudflare and
# Terraform Cloud API tokens, a GitHub PAT, the DB password). CI builds from
# a clean `actions/checkout` where those gitignored files are absent, so the
# exclusion is the second of two safeguards rather than the only one.
#
# Before adding a build ARG/secret here or relaxing .dockerignore, either
# keep the value out of the image or make the GHCR package private first
# (that needs a render_registry_credential so Render can still pull it).
COPY . .

ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "server.js"]
