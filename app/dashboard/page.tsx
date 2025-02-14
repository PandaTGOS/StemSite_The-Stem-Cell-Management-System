'use client'

import { useEffect, useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { Bell, LayoutDashboard, Users, Hospital, Database, ShoppingCart, Settings, Stethoscope, Dna, Droplet, Moon, Sun } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DashboardData, OverviewCard, RecentUser, StorageData } from '@/types'

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const fetchDashboardData = async () => {
      const response = await fetch('/api/dashboard')
      const data = await response.json()
      setDashboardData(data)
    }

    fetchDashboardData()
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  if (!dashboardData) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} transition-colors duration-200`}>
      {/* Sidebar */}
      <aside className={`w-64 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md transition-colors duration-200`}>
        <div className="p-4">
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Stem Cell Bank</h2>
        </div>
        <nav className="mt-6">
          <Button variant="ghost" className={`w-full justify-start ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : ''}`}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Link href="/pages/doctor" passHref>
            <Button variant="ghost" className={`w-full justify-start ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : ''}`}>
              <Stethoscope className="mr-2 h-4 w-4" />
              Doctors
            </Button>
          </Link>
          <Link href="/pages/donor" passHref>
            <Button variant="ghost" className={`w-full justify-start ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : ''}`}>
              <Droplet className="mr-2 h-4 w-4" />
              Donors
            </Button>
          </Link>
          <Link href="/pages/stemcells" passHref>
            <Button variant="ghost" className={`w-full justify-start ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : ''}`}>
              <Dna className="mr-2 h-4 w-4" />
              Stem Cells
            </Button>
          </Link>
          <Button variant="ghost" className={`w-full justify-start ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : ''}`}>
            <Hospital className="mr-2 h-4 w-4" />
            Hospitals
          </Button>
          <Button variant="ghost" className={`w-full justify-start ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : ''}`}>
            <Database className="mr-2 h-4 w-4" />
            Storage Units
          </Button>
          <Link href="/pages/wamsg" passHref>
            <Button variant="ghost" className={`w-full justify-start ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : ''}`}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Marketplace
            </Button>
          </Link>
          <Button variant="ghost" className={`w-full justify-start ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : ''}`}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </nav>
      </aside>

      {/* Main content */}
      <main className={`flex-1 overflow-y-auto p-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-200`}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Input
              type="search"
              placeholder="Search..."
              className={`w-64 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Bell className="h-4 w-4" />
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>New user registration</DropdownMenuItem>
                <DropdownMenuItem>Storage unit alert</DropdownMenuItem>
                <DropdownMenuItem>Marketplace request update</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Admin User</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="icon" onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          {dashboardData.overviewCards.map((card: OverviewCard, index: number) => (
            <Card key={index} className={isDarkMode ? 'bg-gray-800 text-white' : ''}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                  {card.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 mb-8 md:grid-cols-2">
          {/* Recent Users */}
          <Card className={isDarkMode ? 'bg-gray-800 text-white' : ''}>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
              <CardDescription className={isDarkMode ? 'text-gray-400' : ''}>Latest user registrations and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={isDarkMode ? 'text-gray-300' : ''}>Name</TableHead>
                    <TableHead className={isDarkMode ? 'text-gray-300' : ''}>Role</TableHead>
                    <TableHead className={isDarkMode ? 'text-gray-300' : ''}>Hospital</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData.recentUsers.map((user: RecentUser) => (
                    <TableRow key={user.id} className={isDarkMode ? 'hover:bg-gray-700' : ''}>
                      <TableCell className={isDarkMode ? 'text-gray-300' : ''}>{user.name}</TableCell>
                      <TableCell className={isDarkMode ? 'text-gray-300' : ''}>{user.role}</TableCell>
                      <TableCell className={isDarkMode ? 'text-gray-300' : ''}>{user.hospital}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Storage Units Overview */}
          <Card className={isDarkMode ? 'bg-gray-800 text-white' : ''}>
            <CardHeader>
              <CardTitle>Storage Units Overview</CardTitle>
              <CardDescription className={isDarkMode ? 'text-gray-400' : ''}>Capacity utilization across hospitals</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.storageData}>
                  <XAxis dataKey="name" stroke={isDarkMode ? '#fff' : '#000'} />
                  <YAxis stroke={isDarkMode ? '#fff' : '#000'} />
                  <Bar dataKey="used" stackId="a" fill={isDarkMode ? '#8884d8' : '#8884d8'} />
                  <Bar dataKey="total" stackId="a" fill={isDarkMode ? '#82ca9d' : '#82ca9d'} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className={isDarkMode ? 'bg-gray-800 text-white' : ''}>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription className={isDarkMode ? 'text-gray-400' : ''}>Frequently used admin functions</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button className={isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : ''}>Add New User</Button>
            <Button className={isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : ''}>Register Hospital</Button>
            <Button className={isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : ''}>Manage Storage Units</Button>
            <Button className={isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : ''}>View Marketplace Requests</Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}