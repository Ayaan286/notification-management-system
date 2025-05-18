/*
  # Notification System Schema

  1. New Tables
    - `notifications`
      - `id` (uuid, primary key)
      - `type` (enum: email, sms, in-app)
      - `recipient` (text)
      - `subject` (text, nullable)
      - `title` (text, nullable)
      - `message` (text)
      - `priority` (enum: low, normal, high, urgent)
      - `status` (enum: sent, failed, pending, retrying)
      - `retries` (int)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on notifications table
    - Add policies for:
      - Users can read their own notifications
      - Users can create notifications
      - System role can update notification status
*/

-- Create enum types
CREATE TYPE notification_type AS ENUM ('email', 'sms', 'in-app');
CREATE TYPE notification_priority AS ENUM ('low', 'normal', 'high', 'urgent');
CREATE TYPE notification_status AS ENUM ('sent', 'failed', 'pending', 'retrying');

-- Create notifications table
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type notification_type NOT NULL,
  recipient text NOT NULL,
  subject text,
  title text,
  message text NOT NULL,
  priority notification_priority DEFAULT 'normal',
  status notification_status DEFAULT 'pending',
  retries int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create notifications"
  ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update notification status"
  ON notifications
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);