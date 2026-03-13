/*
  # Create waitlist table for AI Game Master landing page

  1. New Tables
    - `waitlist`
      - `id` (uuid, primary key) - Unique identifier for each signup
      - `email` (text, unique, not null) - User's email address
      - `role` (text, not null) - User's role (e.g., Indie Developer, Game Studio, etc.)
      - `company` (text, nullable) - Optional company name
      - `interested_in_paid` (boolean, default false) - Whether user is interested in paid early access
      - `created_at` (timestamptz, default now()) - Timestamp of signup
      - `metadata` (jsonb, nullable) - Additional metadata for future use

  2. Security
    - Enable RLS on `waitlist` table
    - Add policy for public inserts (anyone can sign up)
    - Add policy for authenticated admin reads
*/

CREATE TABLE IF NOT EXISTS waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role text NOT NULL,
  company text,
  interested_in_paid boolean DEFAULT false,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can sign up for waitlist"
  ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all waitlist entries"
  ON waitlist
  FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);