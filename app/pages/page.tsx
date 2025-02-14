import Link from 'next/link'
import { Stethoscope, Dna, Droplet } from 'lucide-react'

export default function ManagementHub() {
  const managementAreas = [
    {
      title: "Doctor Management",
      description: "Manage doctor profiles, schedules, and specialties",
      icon: Stethoscope,
      href: "/pages/doctor"
    },
    {
      title: "Stemcell Management",
      description: "Track and manage stemcell inventory and research",
      icon: Dna,
      href: "/pages/stemcells"
    },
    {
      title: "Donor Management",
      description: "Oversee donor information, donations, and follow-ups",
      icon: Droplet,
      href: "/pages/donor"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">Management Hub</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {managementAreas.map((area, index) => (
            <Link 
              href={area.href} 
              key={index} 
              className="block transform transition duration-500 hover:scale-105"
            >
              <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 h-full p-6">
                <div className="flex flex-col items-center">
                  <div className="rounded-full bg-blue-100 p-3 mb-4">
                    <area.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">
                    {area.title}
                  </h2>
                  <p className="text-center text-gray-600">
                    {area.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}