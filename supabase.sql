CREATE OR REPLACE FUNCTION requesting_user_id()
RETURNS TEXT AS $$
    SELECT NULLIF(
        current_setting('request.jwt.claims', true)::json->>'sub',
        ''
    )::text;
$$ LANGUAGE SQL STABLE;


CREATE TABLE
  users (
    id TEXT PRIMARY KEY,
    username TEXT,
    first_name TEXT,
    email TEXT,
    avatar_url TEXT
  );

CREATE TABLE
  boards (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title TEXT NOT NULL,
    owner_id text NOT NULL REFERENCES users (id),
    background TEXT
  );

CREATE POLICY "create user board" ON "public"."boards"
AS PERMISSIVE FOR INSERT
TO authenticated

WITH CHECK (requesting_user_id() = owner_id)

CREATE POLICY "select user board" ON "public"."boards"
AS PERMISSIVE FOR SELECT
TO authenticated

USING (requesting_user_id() = owner_id)

-- TODO: Update

-- CREATE TABLE
--   lists (
--     id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
--     title TEXT NOT NULL,
--     board_id BIGINT NOT NULL REFERENCES boards (id)
--   );

-- CREATE TABLE
--   cards (
--     id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
--     title TEXT NOT NULL,
--     description TEXT,
--     list_id BIGINT NOT NULL REFERENCES lists (id)
--   );

-- CREATE TABLE
--   card_comments (
--     id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
--     comment_text TEXT NOT NULL,
--     card_id BIGINT NOT NULL REFERENCES cards (id),
--     user_id BIGINT NOT NULL REFERENCES users (id),
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
--   );



-- CREATE TABLE
--   users (
--     id uuid references auth.users on delete cascade not null primary key,
--     updated_at timestamp with time zone,
--     username TEXT unique,
--     full_name TEXT,
--     email TEXT,
--     avatar_url TEXT,
--     constraint username_length check (char_length(username) >= 3)
--   );

-- CREATE TABLE
--   boards (
--     id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
--     title TEXT NOT NULL,
--     owner_id BIGINT NOT NULL REFERENCES users (id),
--     background TEXT
--   );