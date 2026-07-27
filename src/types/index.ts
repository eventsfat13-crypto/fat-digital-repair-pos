export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatar: string | null;
  phone: string | null;
  isActive: boolean;
  isLocked: boolean;
  twoFactorEnabled: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'RECEPTION' | 'TECHNICIAN';

export interface Customer {
  id: string;
  customerId: string;
  name: string;
  mobile: string | null;
  whatsapp: string | null;
  email: string | null;
  cnic: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  photo: string | null;
  signature: string | null;
  notes: string | null;
  totalRepairs: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}

export interface Technician {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  photo: string | null;
  skills: string[];
  experience: string | null;
  salary: number | null;
  commission: number | null;
  workingHours: string | null;
  isAvailable: boolean;
  isActive: boolean;
  completedRepairs: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceCategory {
  id: string;
  name: string;
  icon: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface DeviceBrand {
  id: string;
  name: string;
  logo: string | null;
  isActive: boolean;
  categoryId: string;
  category?: DeviceCategory;
  _count?: { models: number };
}

export interface DeviceModel {
  id: string;
  name: string;
  series: string | null;
  year: string | null;
  isActive: boolean;
  brandId: string;
  brand?: DeviceBrand;
}

export interface RepairService {
  id: string;
  name: string;
  icon: string | null;
  category: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface InspectionItem {
  id: string;
  name: string;
  category: string | null;
  isActive: boolean;
  sortOrder: number;
}

export type RepairStatus =
  | 'PENDING'
  | 'DEVICE_RECEIVED'
  | 'DIAGNOSING'
  | 'WAITING_APPROVAL'
  | 'WAITING_PARTS'
  | 'IN_PROGRESS'
  | 'TESTING'
  | 'QUALITY_CHECK'
  | 'READY_FOR_PICKUP'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED';

export type Priority = 'NORMAL' | 'HIGH' | 'EMERGENCY';

export interface Repair {
  id: string;
  repairOrderId: string;
  trackingId: string;
  status: RepairStatus;
  priority: Priority;
  categoryId: string | null;
  brandId: string | null;
  modelId: string | null;
  deviceInfo: any;
  customerId: string | null;
  customerName: string | null;
  customerMobile: string | null;
  customerEmail: string | null;
  estimatedTime: string | null;
  estimatedDuration: number | null;
  expectedDeliveryAt: string | null;
  completedAt: string | null;
  countdownStartedAt: string | null;
  labourCost: number;
  partsCost: number;
  tax: number;
  discount: number;
  advancePayment: number;
  grandTotal: number;
  remainingBalance: number;
  primaryTechnicianId: string | null;
  complaint: string | null;
  repairNotes: string | null;
  technicianNotes: string | null;
  isDraft: boolean;
  step: number;
  createdAt: string;
  updatedAt: string;
  category?: DeviceCategory;
  brand?: DeviceBrand;
  model?: DeviceModel;
  customer?: Customer;
  primaryTechnician?: Technician;
  services?: RepairItem[];
  inspection?: InspectionResult[];
  parts?: RepairPart[];
  images?: RepairImage[];
  _count?: { services: number; parts: number; images: number };
}

export interface RepairItem {
  id: string;
  repairId: string;
  serviceId: string;
  price: number;
  service?: RepairService;
}

export interface InspectionResult {
  id: string;
  repairId: string;
  itemId: string;
  status: 'WORKING' | 'NOT_WORKING' | 'NOT_TESTED';
  item?: InspectionItem;
}

export interface RepairPart {
  id: string;
  repairId: string;
  productId: string | null;
  name: string;
  quantity: number;
  cost: number;
  warranty: string | null;
  serialNumber: string | null;
  oldReturned: boolean;
  notes: string | null;
}

export interface RepairImage {
  id: string;
  repairId: string;
  url: string;
  category: string | null;
  notes: string | null;
  createdAt: string;
}

export interface InventoryProduct {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  categoryId: string | null;
  supplierId: string | null;
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  lowStockAlert: number;
  serialNumber: string | null;
  warranty: string | null;
  barcode: string | null;
  qrCode: string | null;
  isActive: boolean;
  category?: InventoryCategory;
  supplier?: Supplier;
}

export interface InventoryCategory {
  id: string;
  name: string;
  isActive: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  isActive: boolean;
}

export interface SalesOrder {
  id: string;
  orderNumber: string;
  customerId: string | null;
  walkInName: string | null;
  walkInPhone: string | null;
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  paidAmount: number;
  status: 'COMPLETED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
  notes: string | null;
  createdAt: string;
  items?: SaleItem[];
}

export interface SaleItem {
  id: string;
  salesOrderId: string;
  productId: string | null;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CompanySettings {
  id: string;
  name: string;
  logo: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  currency: string;
  currencySymbol: string;
  timezone: string;
  taxRate: number;
  invoicePrefix: string;
  repairPrefix: string;
  trackingPrefix: string;
  customerPrefix: string;
  termsAndConditions: string | null;
}

export interface DashboardStats {
  totalRepairs: number;
  activeRepairs: number;
  pendingRepairs: number;
  completedRepairs: number;
  deliveredRepairs: number;
  todayRepairs: number;
  dailySales: number;
  weeklySales: number;
  monthlySales: number;
  yearlySales: number;
  lowStockItems: number;
  totalCustomers: number;
  totalTechnicians: number;
}

export interface StatusHistory {
  id: string;
  repairId: string;
  status: RepairStatus;
  notes: string | null;
  changedBy: string | null;
  createdAt: string;
}
