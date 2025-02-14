'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Moon, Sun } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const API_URL = '/api/Doctors'

export default function DoctorManagement() {
  const [doctors, setDoctors] = useState([])
  const [newDoctor, setNewDoctor] = useState({
    FirstName: '',
    LastName: '',
    Specialization: '',
    ContactInformation: '',
    HospitalID: 0,
  })
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    fetchDoctors()
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const fetchDoctors = async () => {
    try {
      const response = await fetch(`${API_URL}`)
      const data = await response.json()
      setDoctors(data)
      setMessage('Doctors fetched successfully')
    } catch (error) {
      setMessage('Error fetching doctors: ' + error.message)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewDoctor((prev) => ({
      ...prev,
      [name]: name === 'HospitalID' ? parseInt(value) : value,
    }))
  }

  const handleCreate = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDoctor),
      })
      if (response.ok) {
        fetchDoctors()
        setNewDoctor({
          FirstName: '',
          LastName: '',
          Specialization: '',
          ContactInformation: '',
          HospitalID: 0,
        })
        setMessage('Doctor created successfully')
      } else {
        throw new Error('Failed to create doctor')
      }
    } catch (error) {
      setMessage('Error creating doctor: ' + error.message)
    }
  }

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`${API_URL}?id=${id}&idField=DoctorID`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDoctor),
      })
      if (response.ok) {
        fetchDoctors()
        setEditingId(null)
        setNewDoctor({
          FirstName: '',
          LastName: '',
          Specialization: '',
          ContactInformation: '',
          HospitalID: 0,
        })
        setMessage('Doctor updated successfully')
      } else {
        throw new Error('Failed to update doctor')
      }
    } catch (error) {
      setMessage('Error updating doctor: ' + error.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}?id=${id}&idField=DoctorID`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchDoctors()
        setMessage('Doctor deleted successfully')
      } else {
        throw new Error('Failed to delete doctor')
      }
    } catch (error) {
      setMessage('Error deleting doctor: ' + error.message)
    }
  }

  const startEditing = (doctor) => {
    setEditingId(doctor.DoctorID)
    setNewDoctor(doctor)
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-200`}>
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard" passHref>
            <Button
              variant="outline"
              size="icon"
              className={`rounded-full ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
              aria-label="Back to landing page"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-center flex-grow">Doctor Management</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`rounded-full ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>

        {message && (
          <div className={`p-2 mb-4 ${message.includes('Error') ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'} border rounded`}>
            {message}
          </div>
        )}

        <div className={`mb-8 p-6 border rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-2xl font-semibold mb-4">Add/Edit Doctor</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="FirstName">First Name</Label>
              <Input id="FirstName" name="FirstName" value={newDoctor.FirstName} onChange={handleInputChange} className={isDarkMode ? 'bg-gray-700 text-white' : ''} />
            </div>
            <div>
              <Label htmlFor="LastName">Last Name</Label>
              <Input id="LastName" name="LastName" value={newDoctor.LastName} onChange={handleInputChange} className={isDarkMode ? 'bg-gray-700 text-white' : ''} />
            </div>
            <div>
              <Label htmlFor="Specialization">Specialization</Label>
              <Input id="Specialization" name="Specialization" value={newDoctor.Specialization} onChange={handleInputChange} className={isDarkMode ? 'bg-gray-700 text-white' : ''} />
            </div>
            <div>
              <Label htmlFor="ContactInformation">Contact Information</Label>
              <Input id="ContactInformation" name="ContactInformation" value={newDoctor.ContactInformation} onChange={handleInputChange} className={isDarkMode ? 'bg-gray-700 text-white' : ''} />
            </div>
            <div>
              <Label htmlFor="HospitalID">Hospital ID</Label>
              <Input id="HospitalID" name="HospitalID" type="number" value={newDoctor.HospitalID} onChange={handleInputChange} className={isDarkMode ? 'bg-gray-700 text-white' : ''} />
            </div>
          </div>
          <Button className="mt-6" onClick={editingId ? () => handleUpdate(editingId) : handleCreate}>
            {editingId ? 'Update' : 'Add'} Doctor
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={isDarkMode ? 'text-gray-300' : ''}>ID</TableHead>
                <TableHead className={isDarkMode ? 'text-gray-300' : ''}>First Name</TableHead>
                <TableHead className={isDarkMode ? 'text-gray-300' : ''}>Last Name</TableHead>
                <TableHead className={isDarkMode ? 'text-gray-300' : ''}>Specialization</TableHead>
                <TableHead className={isDarkMode ? 'text-gray-300' : ''}>Contact Information</TableHead>
                <TableHead className={isDarkMode ? 'text-gray-300' : ''}>Hospital ID</TableHead>
                <TableHead className={isDarkMode ? 'text-gray-300' : ''}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doctors.map((doctor) => (
                <TableRow key={doctor.DoctorID} className={isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}>
                  <TableCell className={isDarkMode ? 'text-gray-300' : ''}>{doctor.DoctorID}</TableCell>
                  <TableCell className={isDarkMode ? 'text-gray-300' : ''}>{doctor.FirstName}</TableCell>
                  <TableCell className={isDarkMode ? 'text-gray-300' : ''}>{doctor.LastName}</TableCell>
                  <TableCell className={isDarkMode ? 'text-gray-300' : ''}>{doctor.Specialization}</TableCell>
                  <TableCell className={isDarkMode ? 'text-gray-300' : ''}>{doctor.ContactInformation}</TableCell>
                  <TableCell className={isDarkMode ? 'text-gray-300' : ''}>{doctor.HospitalID}</TableCell>
                  <TableCell>
                    <Button variant="outline" className="mr-2" onClick={() => startEditing(doctor)}>Edit</Button>
                    <Button variant="destructive" onClick={() => handleDelete(doctor.DoctorID)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}