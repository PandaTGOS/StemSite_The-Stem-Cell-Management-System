import { NextResponse } from 'next/server';
import { getDashboardData } from '@/lib/db-utils';

export async function GET() {
  try {
    const dashboardData = await getDashboardData();
    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ error: 'Error fetching dashboard data' }, { status: 500 });
  }
}