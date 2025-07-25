'use client'

import { useState, useEffect } from 'react'
import { getCertificates } from '@/lib/database'
import { Certificate } from '@/lib/supabase'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { Award, Calendar, User } from 'lucide-react'

export default function CertificateViewer() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCertificates = async () => {
      try {
        const data = await getCertificates()
        setCertificates(data)
      } catch (error) {
        console.error('Error loading certificates:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCertificates()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        Work Anniversary Certificates
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((certificate, index) => (
          <motion.div
            key={certificate.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-800">
                  Work Anniversary Certificate
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div>
                  <Badge variant="secondary" className="bg-yellow-200 text-yellow-800 mb-2">
                    {certificate.year_of_service} Year{certificate.year_of_service > 1 ? 's' : ''} of Service
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="font-semibold text-gray-800">
                      {certificate.employee?.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Issued: {format(new Date(certificate.issue_date), 'MMMM dd, yyyy')}</span>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-white/60 rounded-lg">
                  <p className="text-sm text-gray-700 italic">
                    "In recognition of {certificate.year_of_service} year{certificate.year_of_service > 1 ? 's' : ''} of 
                    dedicated service and outstanding commitment to excellence."
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {certificates.length === 0 && (
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">No certificates found</h3>
          <p className="text-gray-500">Certificates will be automatically generated for employees on their work anniversaries.</p>
        </div>
      )}
    </div>
  )
}