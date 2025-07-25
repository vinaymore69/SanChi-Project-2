/*
  # Employee Management System Database Schema

  1. New Tables
    - `employees`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `position` (text)
      - `department` (text)
      - `join_date` (date)
      - `created_at` (timestamp)
    
    - `certificates`
      - `id` (uuid, primary key)
      - `employee_id` (uuid, foreign key)
      - `certificate_type` (text)
      - `issue_date` (date)
      - `year_of_service` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public access (can be restricted later)
*/

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  position text NOT NULL,
  department text NOT NULL,
  join_date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
  certificate_type text NOT NULL DEFAULT 'work_anniversary',
  issue_date date NOT NULL,
  year_of_service integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Create policies for employees table
CREATE POLICY "Allow public access to employees"
  ON employees
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create policies for certificates table
CREATE POLICY "Allow public access to certificates"
  ON certificates
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
CREATE INDEX IF NOT EXISTS idx_employees_join_date ON employees(join_date);
CREATE INDEX IF NOT EXISTS idx_certificates_employee_id ON certificates(employee_id);
CREATE INDEX IF NOT EXISTS idx_certificates_year_service ON certificates(employee_id, year_of_service);