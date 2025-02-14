'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface PhoneNumber {
  id: number
  phoneNumber: string
  name: string
}

export default function WhatsAppForm() {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([])
  const [selectedPhoneNumbers, setSelectedPhoneNumbers] = useState<string[]>([])
  const [message, setMessage] = useState<string>('')
  const [status, setStatus] = useState<string>('')

  useEffect(() => {
    const fetchPhoneNumbers = async () => {
      try {
        const response = await fetch('/api/getPhoneNumbers')
        if (response.ok) {
          const data = await response.json()
          setPhoneNumbers(data)
        } else {
          console.error('Failed to fetch phone numbers')
        }
      } catch (error) {
        console.error('Error fetching phone numbers:', error)
      }
    }

    fetchPhoneNumbers()
  }, [])

  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value)
    setSelectedPhoneNumbers(selectedOptions)
  }

  const sendMessage = async () => {
    try {
      const response = await fetch('/api/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumbers: selectedPhoneNumbers, message }),
      })

      const data = await response.json()
      setStatus(data.message)
    } catch (error) {
      console.error(error)
      setStatus('Error sending messages')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 to-blue-100">
        <Link href="/dashboard" passHref>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full absolute top-2 left-2"
              aria-label="Back to landing page"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
      <div className="relative max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 to-blue-500"></div>
        <div className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 rounded-full bg-gradient-to-br from-teal-200 to-blue-200 transform rotate-45"></div>
        <div className="relative">
          <h2 className="text-2xl font-bold mb-6 text-teal-700 mt-4">Send Donation Reminder</h2>
        </div>
        <div className="mb-4">
          <label htmlFor="phoneNumbers" className="block text-sm font-medium text-gray-700 mb-1">
            Select Recipients (hold Ctrl/Cmd to select multiple)
          </label>
          <select
            id="phoneNumbers"
            multiple
            value={selectedPhoneNumbers}
            onChange={handlePhoneNumberChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-teal-100 focus:border-teal-300 text-gray-900"
            size={5}
          >
            {phoneNumbers.map((phone) => (
              <option key={phone.id} value={phone.phoneNumber} className="text-gray-900">
                {phone.name} - {phone.phoneNumber}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            id="message"
            placeholder="Enter your message here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-teal-100 focus:border-teal-300 text-gray-900"
          />
        </div>
        <button
          onClick={sendMessage}
          disabled={selectedPhoneNumbers.length === 0 || !message}
          className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send to {selectedPhoneNumbers.length} recipient(s)
        </button>
        {status && (
          <p className="mt-4 text-sm text-center font-medium text-teal-600">{status}</p>
        )}
      </div>
    </div>
  )
}