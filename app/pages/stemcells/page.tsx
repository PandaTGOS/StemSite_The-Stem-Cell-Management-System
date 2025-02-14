'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const API_URL = '/api/StemCells'

export default function StemCellManagement() {
  const [stemCells, setStemCells] = useState([])
  const [newStemCell, setNewStemCell] = useState({
    Type: '',
    CollectionDate: '',
    ExpiryDate: '',
    StorageCondition: '',
    PatientID: '',
    DonorID: '',
    Status: '',
    HospitalID: '',
  })
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchStemCells()
  }, [])

  const fetchStemCells = async () => {
    try {
      const response = await fetch(API_URL)
      const data = await response.json()
      setStemCells(data)
      setMessage('Stem cells fetched successfully')
    } catch (error) {
      setMessage('Error fetching stem cells: ' + error.message)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewStemCell((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreate = async () => {
    try {
      const stemCellData = {
        ...newStemCell,
        PatientID: newStemCell.PatientID ? parseInt(newStemCell.PatientID) : null,
        DonorID: newStemCell.DonorID ? parseInt(newStemCell.DonorID) : null,
        HospitalID: newStemCell.HospitalID ? parseInt(newStemCell.HospitalID) : null,
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stemCellData),
      })
      if (response.ok) {
        fetchStemCells()
        setNewStemCell({
          Type: '',
          CollectionDate: '',
          ExpiryDate: '',
          StorageCondition: '',
          PatientID: '',
          DonorID: '',
          Status: '',
          HospitalID: '',
        })
        setMessage('Stem cell created successfully')
      } else {
        throw new Error('Failed to create stem cell')
      }
    } catch (error) {
      setMessage('Error creating stem cell: ' + error.message)
    }
  }

  const handleUpdate = async (id) => {
    try {
      const stemCellData = {
        ...newStemCell,
        PatientID: newStemCell.PatientID ? parseInt(newStemCell.PatientID) : null,
        DonorID: newStemCell.DonorID ? parseInt(newStemCell.DonorID) : null,
        HospitalID: newStemCell.HospitalID ? parseInt(newStemCell.HospitalID) : null,
      }

      const response = await fetch(`${API_URL}?id=${id}&idField=StemCellID`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stemCellData),
      })
      if (response.ok) {
        fetchStemCells()
        setEditingId(null)
        setNewStemCell({
          Type: '',
          CollectionDate: '',
          ExpiryDate: '',
          StorageCondition: '',
          PatientID: '',
          DonorID: '',
          Status: '',
          HospitalID: '',
        })
        setMessage('Stem cell updated successfully')
      } else {
        throw new Error('Failed to update stem cell')
      }
    } catch (error) {
      setMessage('Error updating stem cell: ' + error.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}?id=${id}&idField=StemCellID`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchStemCells()
        setMessage('Stem cell deleted successfully')
      } else {
        throw new Error('Failed to delete stem cell')
      }
    } catch (error) {
      setMessage('Error deleting stem cell: ' + error.message)
    }
  }

  const startEditing = (stemCell) => {
    setEditingId(stemCell.StemCellID)
    setNewStemCell({
      ...stemCell,
      CollectionDate: stemCell.CollectionDate ? stemCell.CollectionDate.split('T')[0] : '',
      ExpiryDate: stemCell.ExpiryDate ? stemCell.ExpiryDate.split('T')[0] : '',
      PatientID: stemCell.PatientID?.toString() || '',
      DonorID: stemCell.DonorID?.toString() || '',
      HospitalID: stemCell.HospitalID?.toString() || '',
    })
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toISOString().split('T')[0]
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-8">
        <Link href="/dashboard" passHref>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            aria-label="Back to landing page"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-center flex-grow">Stem Cell Management</h1>
      </div>

      {message && (
        <div className={`p-2 mb-4 ${message.includes('Error') ? 'bg-red-200' : 'bg-green-200'} border rounded`}>
          {message}
        </div>
      )}

      <div className="mb-8 p-6 border rounded-lg shadow-sm bg-card">
        <h2 className="text-2xl font-semibold mb-4">Add/Edit Stem Cell</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {['Type', 'CollectionDate', 'ExpiryDate', 'StorageCondition', 'PatientID', 'DonorID', 'Status', 'HospitalID'].map((field) => (
            <div key={field}>
              <Label htmlFor={field}>{field.replace(/([A-Z])/g, ' $1')}</Label>
              <Input 
                id={field} 
                name={field} 
                value={newStemCell[field]} 
                
                onChange={handleInputChange}
                type={field === 'CollectionDate' || field === 'ExpiryDate' ? 'date' : 'text'}
              />
            </div>
          ))}
        </div>
        <Button className="mt-6" onClick={editingId ? () => handleUpdate(editingId) : handleCreate}>
          {editingId ? 'Update' : 'Add'} Stem Cell
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {['ID', 'Type', 'Collection Date', 'Expiry Date', 'Storage Condition', 'Patient ID', 'Donor ID', 'Status', 'Hospital ID', 'Actions'].map((header) => (
                <TableHead key={header}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {stemCells.map((stemCell) => (
              <TableRow key={stemCell.StemCellID}>
                {['StemCellID', 'Type', 'CollectionDate', 'ExpiryDate', 
                  'StorageCondition', 'PatientID', 'DonorID', 'Status', 'HospitalID'].map((field) => (
                  <TableCell key={field}>
                    {field === 'CollectionDate' || field === 'ExpiryDate' 
                      ? formatDate(stemCell[field]) 
                      : stemCell[field]}
                  </TableCell>
                ))}
                <TableCell>
                  <Button variant="outline" className="mr-2" onClick={() => startEditing(stemCell)}>Edit</Button>
                  <Button variant="destructive" onClick={() => handleDelete(stemCell.StemCellID)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}