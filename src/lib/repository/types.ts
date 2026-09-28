export const BOOKING_STATUSES = ['Confirmed', 'Checked In', 'Completed', 'Cancelled'] as const;
export type BookingStatus = typeof BOOKING_STATUSES[number];

export const PAYMENT_STATUSES = ['Unpaid', 'Partially Paid', 'Paid'] as const;
export type PaymentStatus = typeof PAYMENT_STATUSES[number];

export function isBookingStatus(val: unknown): val is BookingStatus {
  return typeof val === 'string' && (BOOKING_STATUSES as readonly string[]).includes(val);
}

export function isPaymentStatus(val: unknown): val is PaymentStatus {
  return typeof val === 'string' && (PAYMENT_STATUSES as readonly string[]).includes(val);
}

export interface Property {
  id: string;
  name: string;
  property_type: string;
  location: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  gstin?: string;
  check_in_time: string;
  check_out_time: string;
  description?: string;
  active: boolean;
  created_at: string;
}

export interface Unit {
  id: string;
  property_id: string;
  number: string;
  unit_type: string;
  floor?: string;
  capacity?: number;
  status: 'active' | 'inactive';
  sort_order?: number;
  created_at: string;
}

export interface UnitBlock {
  id: string;
  unit_id: string;
  property_id: string;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD (exclusive)
  reason: 'Maintenance' | 'Other';
  note?: string;
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  created_at: string;
}

export interface Booking {
  id: string;
  booking_no: string;
  customer_id: string;
  property_id: string;
  unit_id?: string;
  check_in: string;
  check_out: string;
  nights: number;
  rooms: number;
  guests: number;
  room_type: string;
  room_number?: string;
  notes?: string;
  base_amount: number;
  tax_enabled: boolean;
  tax_rate: number;
  tax_amount: number;
  grand_total: number;
  booking_status: BookingStatus | string;
  payment_status: PaymentStatus | string;
  created_at: string;
  customer?: Customer;
  property?: Property;
  unit?: Unit;
}

export interface Payment {
  id: string;
  payment_no: string;
  booking_id: string;
  date: string;
  amount: number;
  method: string;
  ref_id?: string;
  purpose?: string;
  status: string;
  created_at: string;
  booking?: Booking;
}

export interface Notification {
  id: string;
  booking_id: string;
  customer_id: string;
  channel: string; // 'Email' | 'WhatsApp'
  type: string; // 'Booking Confirmation' | 'Payment Receipt'
  recipient: string;
  status: string; // 'Demo Sent' | 'Sent' | 'Failed'
  created_at: string;
}

export interface BusinessSettings {
  name: string;
  legalName: string;
  gstin: string;
}

export interface IRepository {
  getProperties(): Promise<Property[]>;
  getProperty(id: string): Promise<Property | null>;
  createProperty(data: Omit<Property, 'id' | 'created_at'>): Promise<Property>;
  updateProperty(id: string, data: Partial<Property>): Promise<Property>;

  getUnits(propertyId?: string): Promise<Unit[]>;
  getUnit(id: string): Promise<Unit | null>;
  createUnit(data: Omit<Unit, 'id' | 'created_at'>): Promise<Unit>;
  updateUnit(id: string, data: Partial<Unit>): Promise<Unit>;

  getUnitBlocks(propertyId?: string): Promise<UnitBlock[]>;
  createUnitBlock(data: Omit<UnitBlock, 'id' | 'created_at'>): Promise<UnitBlock>;
  deleteUnitBlock(id: string): Promise<void>;

  getCustomers(): Promise<Customer[]>;
  getCustomer(id: string): Promise<Customer | null>;
  createCustomer(data: Omit<Customer, 'id' | 'created_at'>): Promise<Customer>;

  getBookings(propertyId?: string): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking | null>;
  createBooking(data: Omit<Booking, 'id' | 'created_at'>): Promise<Booking>;
  updateBooking(id: string, data: Partial<Booking>): Promise<Booking>;

  getPayments(bookingId?: string): Promise<Payment[]>;
  getAllPayments(propertyId?: string): Promise<Payment[]>;
  createPayment(data: Omit<Payment, 'id' | 'created_at'>): Promise<Payment>;

  getNotifications(bookingId?: string): Promise<Notification[]>;
  createNotification(data: Omit<Notification, 'id' | 'created_at'>): Promise<Notification>;

  getSettings(): Promise<BusinessSettings>;
  updateSettings(data: Partial<BusinessSettings>): Promise<BusinessSettings>;

  resetDemoData(): Promise<void>;
}
