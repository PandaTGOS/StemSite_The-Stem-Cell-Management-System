'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Moon, Sun } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const  API_URL = '/api/Donors'

export default function DonorManagement() {
  const [donors, setDonors] = useState([])
  const [newDonor, setNewDonor] = useState({
    FirstName: '',
    LastName: '',
    DateOfBirth: '',
    Gender: '',
    ContactInformation: '',
    Address: '',
    MedicalHistory: '',
    DonationHistory: '',
  })
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    fetchDonors()
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const fetchDonors = async () => {
    try {
      const response = await fetch(API_URL)
      const data = await response.json()
      setDonors(data)
      setMessage('Donors fetched successfully')
    } catch (error) {
      setMessage('Error fetching donors: ' + error.message)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewDonor((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreate = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDonor),
      })
      if (response.ok) {
        fetchDonors()
        setNewDonor({
          FirstName: '',
          LastName: '',
          DateOfBirth: '',
          Gender: '',
          ContactInformation: '',
          Address: '',
          MedicalHistory: '',
          DonationHistory: '',
        })
        setMessage('Donor created successfully')
      } else {
        throw new Error('Failed to create donor')
      }
    } catch (error) {
      setMessage('Error creating donor: ' + error.message)
    }
  }

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`${API_URL}?id=${id}&idField=DonorID`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDonor),
      })
      if (response.ok) {
        fetchDonors()
        setEditingId(null)
        setNewDonor({
          FirstName: '',
          LastName: '',
          DateOfBirth: '',
          Gender: '',
          ContactInformation: '',
          Address: '',
          MedicalHistory: '',
          DonationHistory: '',
        })
        setMessage('Donor updated successfully')
      } else {
        throw new Error('Failed to update donor')
      }
    } catch (error) {
      setMessage('Error updating donor: ' + error.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}?id=${id}&idField=DonorID`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchDonors()
        setMessage('Donor deleted successfully')
      } else {
        throw new Error('Failed to delete donor')
      }
    } catch (error) {
      setMessage('Error deleting donor: ' + error.message)
    }
  }

  const startEditing = (donor) => {
    setEditingId(donor.DonorID)
    setNewDonor({
      ...donor,
      DateOfBirth: donor.DateOfBirth ? donor.DateOfBirth.split('T')[0] : '',
    })
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toISOString().split('T')[0]
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
          <h1 className="text-3xl font-bold text-center flex-grow">Donor Management</h1>
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
          <h2 className="text-2xl font-semibold mb-4">Add/Edit Donor</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {['FirstName', 'LastName', 'DateOfBirth', 'Gender', 'ContactInformation', 'Address', 'MedicalHistory', 'DonationHistory'].map((field) => (
              <div key={field}>
                <Label htmlFor={field}>{field.replace(/([A-Z])/g, ' $1')}</Label>
                <Input 
                  id={field} 
                  name={field} 
                  value={newDonor[field]} 
                  onChange={handleInputChange}
                  type={field === 'DateOfBirth' ? 'date' : 'text'}
                  className={isDarkMode ? 'bg-gray-700 text-white' : ''}
                />
              </div>
            ))}
          </div>
          <Button className="mt-6" onClick={editingId ? () => handleUpdate(editingId) : handleCreate}>
            {editingId ? 'Update' : 'Add'} Donor
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {['ID', 'First Name', 'Last Name', 'DOB', 'Gender', 'Contact Info', 'Address', 'Medical History', 'Donation History', 'Actions'].map((header) => (
                  <TableHead key={header} className={isDarkMode ? 'text-gray-300' : ''}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {donors.map((donor) => (
                <TableRow key={donor.DonorID} className={isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}>
                  {['DonorID', 'FirstName', 'LastName', 'DateOfBirth', 'Gender', 'ContactInformation', 'Address', 'MedicalHistory', 'DonationHistory'].map((field) => (
                    <TableCell key={field} className={isDarkMode ? 'text-gray-300' : ''}>
                      {field === 'DateOfBirth' ? formatDate(donor[field]) : donor[field]}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button variant="outline" className="mr-2" onClick={() => startEditing(donor)}>Edit</Button>
                    <Button variant="destructive" onClick={() => handleDelete(donor.DonorID)}>Delete</Button>
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