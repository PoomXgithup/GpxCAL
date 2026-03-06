/*
  # GPA Calculator Database Schema

  ## Overview
  Creates tables for storing user subjects, cumulative GPA data, and semester information
  for a modern GPA calculator application.

  ## New Tables
  
  ### `subjects`
  Stores individual subject/course information for GPA calculation
  - `id` (uuid, primary key) - Unique identifier for each subject
  - `title` (text) - Subject/course name
  - `credits` (numeric) - Credit hours for the subject
  - `grade` (numeric) - Grade point (0.00 - 4.00)
  - `semester` (text) - Semester identifier (e.g., "Fall 2024", "Current")
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `user_settings`
  Stores cumulative GPA and settings for GPAX calculations
  - `id` (uuid, primary key) - Unique identifier
  - `current_cumulative_gpa` (numeric) - Current overall GPA
  - `total_credits_earned` (numeric) - Total credits earned so far
  - `target_gpax` (numeric) - Target GPA goal
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on all tables
  - Public access policies (no authentication required for this demo app)
  - Users can read, insert, update, and delete their own data
*/

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  credits numeric NOT NULL CHECK (credits > 0),
  grade numeric NOT NULL CHECK (grade >= 0 AND grade <= 4.00),
  semester text DEFAULT 'Current',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  current_cumulative_gpa numeric DEFAULT 0 CHECK (current_cumulative_gpa >= 0 AND current_cumulative_gpa <= 4.00),
  total_credits_earned numeric DEFAULT 0 CHECK (total_credits_earned >= 0),
  target_gpax numeric DEFAULT 4.00 CHECK (target_gpax >= 0 AND target_gpax <= 4.00),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Policies for subjects table (public access for demo)
CREATE POLICY "Anyone can view subjects"
  ON subjects FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert subjects"
  ON subjects FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can update subjects"
  ON subjects FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete subjects"
  ON subjects FOR DELETE
  TO anon
  USING (true);

-- Policies for user_settings table (public access for demo)
CREATE POLICY "Anyone can view settings"
  ON user_settings FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert settings"
  ON user_settings FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can update settings"
  ON user_settings FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete settings"
  ON user_settings FOR DELETE
  TO anon
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subjects_semester ON subjects(semester);
CREATE INDEX IF NOT EXISTS idx_subjects_created_at ON subjects(created_at);

-- Insert default user settings
INSERT INTO user_settings (current_cumulative_gpa, total_credits_earned, target_gpax)
VALUES (0, 0, 4.00)
ON CONFLICT DO NOTHING;