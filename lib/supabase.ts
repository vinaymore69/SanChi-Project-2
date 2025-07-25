import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Employee = {
  id: string
  name: string
  email: string
  position: string
  department: string
  join_date: string
  created_at: string
}

export type Certificate = {
  id: string
  employee_id: string
  certificate_type: string
  issue_date: string
  year_of_service: number
  employee?: Employee
}