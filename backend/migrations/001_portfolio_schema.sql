-- 001_portfolio_schema.sql
--
-- Puts every portfolio table in its own `portfolio` schema.
--
-- WHY: this Postgres instance is shared with at least one other project, whose
-- tables live in `public` (e.g. demo_bioinf_results). Sharing `public` means
-- two projects compete for table names, and a careless "make the database
-- match the schema file" would drop the other project's data. A dedicated
-- schema removes the collision entirely: this app's search_path is set to
-- `portfolio` (see db.js), so it can only see its own tables.
--
-- This migration never touches anything outside the three tables named here —
-- other projects' tables stay in `public`, untouched and unmoved.

CREATE SCHEMA IF NOT EXISTS portfolio;

-- Move the existing tables rather than recreating them, so the rows already in
-- them survive. Each is guarded: move only if it is still in `public` AND not
-- already in `portfolio`, which makes this safe to re-run and safe on a fresh
-- database where neither exists.
DO $$
DECLARE
    t text;
BEGIN
    FOREACH t IN ARRAY ARRAY['users', 'projects', 'contact_messages'] LOOP
        IF EXISTS (
            SELECT 1 FROM information_schema.tables
            WHERE table_schema = 'public' AND table_name = t
        ) AND NOT EXISTS (
            SELECT 1 FROM information_schema.tables
            WHERE table_schema = 'portfolio' AND table_name = t
        ) THEN
            EXECUTE format('ALTER TABLE public.%I SET SCHEMA portfolio', t);
            RAISE NOTICE 'moved public.% to portfolio.%', t, t;
        END IF;
    END LOOP;
END $$;

-- Create any table that did not already exist (a fresh database, or one where
-- a table was never created — contact_messages was missing in exactly this way).
CREATE TABLE IF NOT EXISTS portfolio.users (
    id              VARCHAR PRIMARY KEY,
    name            TEXT        NOT NULL,
    email           TEXT,
    profile_img_url TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS portfolio.projects (
    id          VARCHAR PRIMARY KEY,
    title       TEXT        NOT NULL,
    description TEXT,
    url         TEXT,
    tags        TEXT[],
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS portfolio.contact_messages (
    id         VARCHAR PRIMARY KEY,
    name       TEXT        NOT NULL,
    email      TEXT        NOT NULL,
    message    TEXT        NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Newest-first reads are the common query on both of these.
CREATE INDEX IF NOT EXISTS projects_created_at_idx
    ON portfolio.projects (created_at DESC);
CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx
    ON portfolio.contact_messages (created_at DESC);
