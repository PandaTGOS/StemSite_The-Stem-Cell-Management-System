import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db-utils'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
  const { username, password } = await request.json()

  try {
    const results = await executeQuery(
      'SELECT UserID, Username, PasswordHash, Role FROM Users WHERE Username = ?',
      [username]
    ) as any[]

    if (results.length === 0) {
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 })
    }

    const user = results[0]
    const passwordMatch = await bcrypt.compare(password, user.PasswordHash)

    if (!passwordMatch) {
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 })
    }

    const token = jwt.sign(
      { userId: user.UserID, username: user.Username, role: user.Role },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    )

    const response = NextResponse.json({ message: 'Login successful' }, { status: 200 })
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ message: 'An error occurred during login' }, { status: 500 })
  }
}