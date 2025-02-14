// app/api/[table]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAllRecords, getRecordById, createRecord, updateRecord, removeRecord } from '@/lib/db-utils';

export async function GET(request: NextRequest, { params }: { params: { table: string } }) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const idField = searchParams.get('idField') || 'id';

  try {
    if (id) {
      const record = await getRecordById(params.table, Number(id), idField);
      return NextResponse.json(record);
    } else {
      const records = await getAllRecords(params.table);
      return NextResponse.json(records);
    }
  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { table: string } }) {
  const data = await request.json();

  if (!data) {
    return NextResponse.json({ error: 'Data is required' }, { status: 400 });
  }

  try {
    const result = await createRecord(params.table, data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json({ error: 'Error creating data' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { table: string } }) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const idField = searchParams.get('idField') || 'id';
  const data = await request.json();

  if (!id || !data) {
    return NextResponse.json({ error: 'ID and data are required' }, { status: 400 });
  }

  try {
    const result = await updateRecord(params.table, Number(id), data, idField);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in PUT request:", error);
    return NextResponse.json({ error: 'Error updating data' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { table: string } }) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const idField = searchParams.get('idField') || 'id';

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const result = await removeRecord(params.table, Number(id), idField);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in DELETE request:", error);
    return NextResponse.json({ error: 'Error deleting data' }, { status: 500 });
  }
}