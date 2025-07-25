'use client'

import { useState } from 'react'
import { Toaster } from 'sonner'
import EmployeeForm from '@/components/EmployeeForm'
import EmployeeDashboard from '@/components/EmployeeDashboard'
import CertificateViewer from '@/components/CertificateViewer'
import { Button } from '@/components/ui/button'
import { Users, Award, Plus } from 'lucide-react'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'add' | 'certificates'>('dashboard')
  const [refreshKey, setRefreshKey] = useState(0)

  const handleEmployeeAdded = () => {
    setRefreshKey(prev => prev + 1)
    setActiveTab('dashboard')
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Users },
    { id: 'add', label: 'Add Employee', icon: Plus },
    { id: 'certificates', label: 'Certificates', icon: Award },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Employee Management System
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Streamline your HR processes with automatic anniversary certificate generation and comprehensive employee tracking.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/20 backdrop-blur-md rounded-lg p-1 border border-white/30">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  className={`mx-1 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <div key={refreshKey}>
              <EmployeeDashboard />
            </div>
          )}
          {activeTab === 'add' && (
            <div className="flex justify-center">
              <EmployeeForm onEmployeeAdded={handleEmployeeAdded} />
            </div>
          )}
          {activeTab === 'certificates' && <CertificateViewer />}
        </div>

        <Toaster position="top-right" />
      </div>
    </div>
  )
}