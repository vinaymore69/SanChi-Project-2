import { supabase } from './supabase'
import { differenceInYears, format } from 'date-fns'

export async function createEmployee(employeeData: {
  name: string
  email: string
  position: string
  department: string
  join_date: string
}) {
  const { data, error } = await supabase
    .from('employees')
    .insert([employeeData])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getEmployees() {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function checkAndGenerateAnniversaryCertificates() {
  const { data: employees, error } = await supabase
    .from('employees')
    .select('*')

  if (error) throw error

  const today = new Date()
  const certificatesToGenerate = []

  for (const employee of employees) {
    const joinDate = new Date(employee.join_date)
    const yearsOfService = differenceInYears(today, joinDate)
    
    if (yearsOfService > 0) {
      // Check if certificate already exists for this year
      const { data: existingCertificate } = await supabase
        .from('certificates')
        .select('*')
        .eq('employee_id', employee.id)
        .eq('year_of_service', yearsOfService)
        .single()

      if (!existingCertificate) {
        certificatesToGenerate.push({
          employee_id: employee.id,
          certificate_type: 'work_anniversary',
          issue_date: format(today, 'yyyy-MM-dd'),
          year_of_service: yearsOfService
        })
      }
    }
  }

  if (certificatesToGenerate.length > 0) {
    const { error: insertError } = await supabase
      .from('certificates')
      .insert(certificatesToGenerate)

    if (insertError) throw insertError
  }

  return certificatesToGenerate.length
}

export async function getCertificates() {
  const { data, error } = await supabase
    .from('certificates')
    .select(`
      *,
      employee:employees(*)
    `)
    .order('issue_date', { ascending: false })

  if (error) throw error
  return data
}

export async function getCertificatesByEmployee(employeeId: string) {
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('employee_id', employeeId)
    .order('year_of_service', { ascending: false })

  if (error) throw error
  return data
}