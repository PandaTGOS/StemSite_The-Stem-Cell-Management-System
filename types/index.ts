export interface OverviewCard {
    title: string;
    value: string | number;
    change: string;
  }
  
  export interface RecentUser {
    id: number;
    name: string;
    role: string;
    hospital: string;
  }
  
  export interface StorageData {
    name: string;
    total: number;
    used: number;
  }
  
  export interface DashboardData {
    overviewCards: OverviewCard[];
    recentUsers: RecentUser[];
    storageData: StorageData[];
  }