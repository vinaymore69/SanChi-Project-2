'use client'

import { useState, useEffect } from 'react'
import { getEmployees, getCertificatesByEmployee, checkAndGenerateAnniversaryCertificates } from '@/lib/database'
import { Employee, Certificate } from '@/lib/supabase'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format, differenceInYears } from 'date-fns'
import { motion } from 'framer-motion'
import { User, Mail, Building, Calendar, Award } from 'lucide-react'

export default function EmployeeDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [certificates, setCertificates] = useState<{ [key: string]: Certificate[] }>({})
  const [isLoading, setIsLoading] = useState(true)

  const loadData = async () => {
    try {
      const [employeesData] = await Promise.all([
        getEmployees(),
      ])
      
      setEmployees(employeesData)

      // Load certificates for each employee
      const certificateData: { [key: string]: Certificate[] } = {}
      for (const employee of employeesData) {
        const empCertificates = await getCertificatesByEmployee(employee.id)
        certificateData[employee.id] = empCertificates
      }
      setCertificates(certificateData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateCertificates = async () => {
    try {
      const generatedCount = await checkAndGenerateAnniversaryCertificates()
      if (generatedCount > 0) {
        await loadData() // Reload data to show new certificates
      }
    } catch (error) {
      console.error('Error generating certificates:', error)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const getYearsOfService = (joinDate: string) => {
    return differenceInYears(new Date(), new Date(joinDate))
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Employee Dashboard
        </h2>
        <Button 
          onClick={handleGenerateCertificates}
          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
        >
          <Award className="w-4 h-4 mr-2" />
          Generate Certificates
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((employee, index) => {
          const yearsOfService = getYearsOfService(employee.join_date)
          const employeeCertificates = certificates[employee.id] || []

          return (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <span className="text-lg font-semibold">{employee.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-600" />
                    <span>{employee.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Building className="w-4 h-4 text-gray-600" />
                    <span>{employee.position} • {employee.department}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span>Joined: {format(new Date(employee.join_date), 'MMM dd, yyyy')}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Badge variant={yearsOfService > 0 ? "default" : "secondary"}>
                      {yearsOfService > 0 ? `${yearsOfService} year${yearsOfService > 1 ? 's' : ''}` : 'New Employee'}
                    </Badge>
                    
                    {employeeCertificates.length > 0 && (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                        <Award className="w-3 h-3 mr-1" />
                        {employeeCertificates.length} Certificate{employeeCertificates.length > 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>

                  {employeeCertificates.length > 0 && (
                    <div className="mt-3 space-y-1">
                      <p className="text-xs font-medium text-gray-600">Recent Certifications:</p>
                      {employeeCertificates.slice(0, 2).map((cert) => (
                        <div key={cert.id} className="text-xs bg-blue-50 p-2 rounded">
                          {cert.year_of_service} Year Anniversary - {format(new Date(cert.issue_date), 'MMM yyyy')}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {employees.length === 0 && (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">No employees found</h3>
          <p className="text-gray-500">Add your first employee to get started!</p>
        </div>
      )}
    </div>
  )
}