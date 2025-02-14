import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db-utils'
import bcrypt from 'bcrypt'

export async function POST(request: Request) {
  const { username, password, role, hospitalId } = await request.json()

  try {
    // Check if username already exists
    const existingUser = await executeQuery('SELECT UserID FROM Users WHERE Username = ?', [username]) as any[]
    
    if (existingUser.length > 0) {
      return NextResponse.json({ message: 'Username already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    
    await executeQuery(
      'INSERT INTO Users (Username, PasswordHash, Role, HospitalID) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, role, hospitalId]
    )

    return NextResponse.json({ message: 'Account created successfully' }, { status: 201 })
  } catch (error) {
    console.error('Account creation error:', error)
    return NextResponse.json({ message: 'An error occurred while creating your account' }, { status: 500 })
  }
}