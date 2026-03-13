/*
  # Create Waitlist Table

  1. New Tables
    - `waitlist_signups`
      - `id` (uuid, primary key)
      - `email` (text, unique, required)
      - `role` (text, optional)
      - `company` (text, optional)
      - `interested_in_paid` (boolean, default false)
      - `created_at` (timestamptz, default now())
  
  2. Security
    - Enable RLS on `waitlist_signups` table
    - Add policy for public INSERT access (anyone can sign up)
    - No public SELECT access (admin only)
*/

CREATE TABLE IF NOT EXISTS waitlist_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role text,
  company text,
  interested_in_paid boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE waitlist_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can sign up for waitlist"
  ON waitlist_signups
  FOR INSERT
  TO anon
  WITH CHECK (true);
