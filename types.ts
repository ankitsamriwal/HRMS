
export enum EmploymentType {
  FULL_TIME = 'Full-Time',
  PART_TIME = 'Part-Time',
  TEMPORARY = 'Temporary'
}

export enum VisaStatus {
  RESIDENT = 'Resident',
  VISIT = 'Visit',
  PROCESSING = 'Processing',
  EXPIRED = 'Expired'
}

export enum RequestStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  PAID = 'Paid'
}

export type Role = 'Admin' | 'Supervisor' | 'Employee';
export type Language = 'EN' | 'AR';
export type Department = 'Engineering' | 'HR' | 'Finance' | 'Marketing' | 'Operations' | 'Legal';

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: Department;
  joiningDate: string;
  basicSalary: number;
  totalSalary: number;
  visaStatus: VisaStatus;
  isEmirati: boolean;
  email: string;
  avatar: string;
  supervisorId?: string;
  leaveBalances: {
    annual: number;
    sick: number;
    parental: number;
  };
  attritionRisk?: 'Low' | 'Medium' | 'High';
  onboardingProgress?: number;
  engagementScore?: number;
}

export interface TrainingCourse {
  id: string;
  title: string;
  provider: string;
  relevance: string;
}

export type ReimbursementType = 'Travel Ticket' | 'Petty Cash' | 'Cash Advance' | 'Fuel/Salik' | 'Food' | 'Parking';

export interface ReimbursementRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: ReimbursementType;
  amount: number;
  date: string;
  description: string;
  status: RequestStatus;
  receiptUrl?: string;
  isPushedToERP?: boolean;
  complianceRisk?: 'Low' | 'Medium' | 'High';
  complianceReason?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: Date;
  ipAddress: string;
  status: 'Success' | 'Warning' | 'Failure';
}

export interface ERPConfig {
  provider: 'SAP' | 'Oracle' | 'Odoo' | 'Dynamics';
  connected: boolean;
  lastSync?: string;
}

export interface GLMapping {
  expenseType: ReimbursementType;
  glCode: string;
  costCenter: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'Annual' | 'Sick' | 'Parental' | 'Unpaid';
  startDate: string;
  endDate: string;
  status: RequestStatus;
  documentUrl?: string;
  reason: string;
}

export interface Policy {
  id: string;
  title: string;
  description: string;
  lastUpdated: string;
  isSigned: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface GratuityResult {
  years: number;
  months: number;
  days: number;
  gratuityAmount: number;
  explanation: string;
}
