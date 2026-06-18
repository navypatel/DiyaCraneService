export interface EntryRecord {
  id: string;
  projectName: string;
  serviceType: 'HYDRA' | 'FARANA';
  craneNumber: string; // Registration number or asset identifier
  clientName: string; // Contact Person
  clientCompanyName: string; // Separate Corporate Entity Name
  location: string;
  dateOfOperation: string; // YYYY-MM-DD
  timeOfOperation: string; // HH:mm (Shift start)
  shiftEndTime: string;    // HH:mm (Shift end)
  duration: number; // hours
  amount?: number; // optional currency number
  notes?: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  status: 'Active' | 'Deleted';
}

export interface EnquiryRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: 'General Inquiry' | 'HYDRA' | 'FARANA';
  projectDetails: string;
  submissionDate: string; // ISO timestamp
  status: 'New' | 'In Progress' | 'Closed';
}

export interface UserSession {
  username: string;
  name: string;
  role: string;
}

export interface DashboardStats {
  totalEnquiries: number;
  totalEntries: number;
  recentEnquiriesCount: number; // last 7 days
  monthlyOperations: number; // current month
}
