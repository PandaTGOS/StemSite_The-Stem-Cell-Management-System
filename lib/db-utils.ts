// db-utils.ts
import { connectToDatabase } from './db';
import { DashboardData, OverviewCard, RecentUser, StorageData } from '@/types';

export async function executeQuery(query: string, values: any[] = []) {
  const connection = await connectToDatabase();
  try {
    const [results] = await connection.execute(query, values);
    return results;
  } finally {
    await connection.end();
  }
}

export async function getAllRecords(table: string) {
  const query = `SELECT * FROM \`${table}\``;
  return executeQuery(query);
}

export async function getRecordById(table: string, id: number, idField: string) {
  const query = `SELECT * FROM \`${table}\` WHERE ${idField} = ?`;
  const results = await executeQuery(query, [id]);
  return results[0];
}

export async function createRecord(table: string, data: Record<string, any>) {
  const columns = Object.keys(data).join(', ');
  const placeholders = Object.keys(data).map(() => '?').join(', ');
  const values = Object.values(data);

  const query = `INSERT INTO \`${table}\` (${columns}) VALUES (${placeholders})`;
  return executeQuery(query, values);
}

export async function updateRecord(table: string, id: number, data: Record<string, any>, idField: string) {
  const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
  const values = Object.values(data);

  const query = `UPDATE \`${table}\` SET ${setClause} WHERE ${idField} = ?`;
  return executeQuery(query, [...values, id]);
}

export async function removeRecord(table: string, id: number, idField: string) {
  const query = `DELETE FROM \`${table}\` WHERE ${idField} = ?`;
  return executeQuery(query, [id]);
}

// db-utils.ts

export async function getDashboardData(): Promise<DashboardData> {
  const connection = await connectToDatabase();
  try {
    // Fetch total users (Doctors + Donors)
    const [totalUsersResult] = await connection.execute(`
      SELECT 
        (SELECT COUNT(*) FROM Doctors) + (SELECT COUNT(*) FROM Donors) as total_users
    `);

    // Fetch total stem cells
    const [totalStemCellsResult] = await connection.execute(`
      SELECT COUNT(*) as total_stem_cells FROM StemCells
    `);

    // Fetch other overview cards data
    const [overviewCardsResult] = await connection.execute(`
      SELECT 
        (SELECT COUNT(*) FROM Hospitals) as total_hospitals,
        (SELECT COUNT(*) FROM StorageUnits) as storage_units,
        (SELECT COUNT(*) FROM MarketplaceRequests WHERE Status = 'pending') as pending_requests
    `);

    const overviewCards: OverviewCard[] = [
      { title: 'Total Users', value: totalUsersResult[0].total_users, change: '+5%' },
      { title: 'Total Hospitals', value: overviewCardsResult[0].total_hospitals, change: '+2%' },
      { title: 'Storage Units', value: overviewCardsResult[0].storage_units, change: '0%' },
      { title: 'Pending Requests', value: overviewCardsResult[0].pending_requests, change: '-10%' },
      { title: 'Available Stem Cells', value: totalStemCellsResult[0].total_stem_cells, change: '+15%' },
    ];

    // Fetch recent users (combining Doctors and Donors)
    const [recentUsersResult] = await connection.execute(`
      (SELECT 
        DoctorID as id, 
        CONCAT(FirstName, ' ', LastName) as name, 
        'Doctor' as role, 
        h.Name as hospital
      FROM Doctors d
      LEFT JOIN Hospitals h ON d.HospitalID = h.HospitalID
      ORDER BY DoctorID DESC
      LIMIT 2)
      UNION ALL
      (SELECT 
        DonorID as id, 
        CONCAT(FirstName, ' ', LastName) as name, 
        'Donor' as role, 
        'N/A' as hospital
      FROM Donors
      ORDER BY DonorID DESC
      LIMIT 2)
      ORDER BY id DESC
      LIMIT 4
    `);
    const recentUsers: RecentUser[] = recentUsersResult as RecentUser[];

    // Fetch storage data by hospital
    const [storageDataResult] = await connection.execute(`
      SELECT h.Name as name, SUM(s.Capacity) as total_capacity, SUM(s.CurrentLoad) as current_load
      FROM Hospitals h
      JOIN StorageUnits s ON h.HospitalID = s.HospitalID
      GROUP BY h.HospitalID
      LIMIT 4
    `);
    const storageData: StorageData[] = storageDataResult.map((record: any) => ({
      name: record.name,
      total: record.total_capacity,
      used: record.current_load,
    })) as StorageData[];

    return {
      overviewCards,
      recentUsers,
      storageData,
    };
  } finally {
    await connection.end();
  }
}