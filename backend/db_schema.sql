-- =============================================================================
-- psql -U postgres -d portfolio -f schema.sql
--
-- To create the database first:
--   psql -U postgres -c "CREATE DATABASE portfolio;"
-- =============================================================================

CREATE TABLE IF NOT EXISTS users (
  id              VARCHAR PRIMARY KEY,
  name            TEXT        NOT NULL,
  email           TEXT,
  profile_img_url TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id          VARCHAR PRIMARY KEY,
  title       TEXT        NOT NULL,
  description TEXT,
  url         TEXT,
  tags        TEXT[],
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id         VARCHAR PRIMARY KEY,
  name       TEXT        NOT NULL,
  email      TEXT        NOT NULL,
  message    TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


INSERT INTO users (id, name, email, profile_img_url) VALUES ('01KT2Y0J95EATCKP7CMNEM4JZ7'::uuid, 'Test', 'test@email.test')

-- Seed a sample project so the frontend has something to display immediately
INSERT INTO projects (id, title, description, url, tags) VALUES
  ('01KT2XWJ9G63F5JVNXQFEECYJJ'::uuid, 'Portfolio', 'This site — React frontend, Node/Express API, self-hosted Postgres, deployed via Cloudflare Pages + Tunnel.', 'https://github.com/hannahmneal/portfolio', ARRAY['React', 'Node', 'Cloudflare', 'Terraform'])
ON CONFLICT DO NOTHING;