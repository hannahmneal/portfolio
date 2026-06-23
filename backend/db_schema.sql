DROP TABLE IF EXISTS users, projects, contact_messages, demo_bioinf_results;

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
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  content     JSONB
);

INSERT INTO users (id, name, email) VALUES ('01KT2Y0J95EATCKP7CMNEM4JZ7', 'Test', 'test@email.test');

-- Seed a sample project so the frontend has something to display immediately
INSERT INTO projects (
    id,
    title,
    description,
    url,
    tags
  ) VALUES
  ('01KT2XWJ9G63F5JVNXQFEECYJJ', 'Portfolio', 'Ask me about my projects!', 'https://github.com/hannahmneal/portfolio', ARRAY['React', 'Node', 'Cloudflare', 'Terraform', 'Demo'])
ON CONFLICT DO NOTHING;
-- 'This site — React frontend, Node/Express API, self-hosted Postgres, deployed via Cloudflare Pages + Tunnel.'

CREATE TABLE IF NOT EXISTS demo_bioinf_results (
  id              VARCHAR         PRIMARY KEY,
  run_id          TEXT            NOT NULL,
  patient_id      TEXT,
  variants        JSONB           NOT NULL DEFAULT '[]',
  metadata        JSONB,
  submitted_at    TIMESTAMPTZ     NOT NULL DEFAULT now()
);