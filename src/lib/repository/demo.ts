import { IRepository, Property, Customer, Booking, Payment, Notification, BusinessSettings } from './types';
import { generateId } from '../utils/formatters';

const STORAGE_KEY = 'hotel_manager_demo_db_v2';

interface DemoDB {
  properties: Property[];
  customers: Customer[];
  bookings: Booking[];
  payments: Payment[];
  notifications: Notification[];
  settings: BusinessSettings;
}

// Utility to format dates relative to today: offset in days
function getRelDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

function buildSeedData(): DemoDB {
  const properties: Property[] = [
    {
      id: 'p1',
      name: 'The Fern Residency',
      property_type: 'Hotel',
      location: 'City Center',
      address: '12 Temple Road',
      city: 'Mysuru',
      state: 'Karnataka',
      pincode: '570001',
      phone: '+91 98765 43210',
      email: 'fern@mytrackyo.local',
      gstin: '29ABCDE1234F1Z5',
      check_in_time: '14:00',
      check_out_time: '11:00',
      active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'p2',
      name: 'Valley View Resort',
      property_type: 'Resort',
      location: 'Hill Station',
      address: 'Mist Point View',
      city: 'Munnar',
      state: 'Kerala',
      pincode: '685612',
      phone: '+91 98765 43211',
      email: 'valley@mytrackyo.local',
      gstin: '32ABCDE1234F1Z5',
      check_in_time: '13:00',
      check_out_time: '11:00',
      active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'p3',
      name: 'Coral Beach Homestay',
      property_type: 'Homestay',
      location: 'North Goa',
      address: 'Beach Lane 4',
      city: 'Anjuna',
      state: 'Goa',
      pincode: '403509',
      phone: '+91 98765 43212',
      email: 'coral@mytrackyo.local',
      check_in_time: '14:00',
      check_out_time: '11:00',
      active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'p4',
      name: 'Pinecrest Cabin',
      property_type: 'Homestay',
      location: 'Old Manali',
      address: 'Orchard Road',
      city: 'Manali',
      state: 'Himachal Pradesh',
      pincode: '175131',
      phone: '+91 98765 43213',
      email: 'pine@mytrackyo.local',
      check_in_time: '12:00',
      check_out_time: '11:00',
      active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'p5',
      name: 'Oasis Business Hotel',
      property_type: 'Hotel',
      location: 'Tech Park Corridor',
      address: 'Outer Ring Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560037',
      phone: '+91 98765 43214',
      email: 'oasis@mytrackyo.local',
      gstin: '29ABCDE1234F1Z5',
      check_in_time: '14:00',
      check_out_time: '12:00',
      active: true,
      created_at: new Date().toISOString()
    }
  ];

  const customers: Customer[] = [
    { id: 'c1', name: 'Rahul Sharma', phone: '+91 91234 56701', email: 'rahul.sharma@gmail.com', created_at: new Date().toISOString() },
    { id: 'c2', name: 'Priya Patel', phone: '+91 91234 56702', email: 'priya.patel@outlook.com', created_at: new Date().toISOString() },
    { id: 'c3', name: 'Ananya Desai', phone: '+91 91234 56703', email: 'ananya.desai@gmail.com', created_at: new Date().toISOString() },
    { id: 'c4', name: 'Vikram Singh', phone: '+91 91234 56704', email: 'vikram.singh@yahoo.com', created_at: new Date().toISOString() },
    { id: 'c5', name: 'Neha Gupta', phone: '+91 91234 56705', email: 'neha.gupta@corp.in', created_at: new Date().toISOString() },
    { id: 'c6', name: 'Karthik Reddy', phone: '+91 91234 56706', email: 'karthik.reddy@tech.com', created_at: new Date().toISOString() },
    { id: 'c7', name: 'Sonal Iyer', phone: '+91 91234 56707', email: 'sonal.iyer@live.com', created_at: new Date().toISOString() },
    { id: 'c8', name: 'Arjun Nair', phone: '+91 91234 56708', email: 'arjun.nair@voyage.in', created_at: new Date().toISOString() },
    { id: 'c9', name: 'Meera Rao', phone: '+91 91234 56709', email: 'meera.rao@design.studio', created_at: new Date().toISOString() },
    { id: 'c10', name: 'Rohan Mehta', phone: '+91 91234 56710', email: 'rohan.mehta@finance.co', created_at: new Date().toISOString() },
    { id: 'c11', name: 'Sunita Menon', phone: '+91 91234 56711', email: 'sunita.m@gmail.com', created_at: new Date().toISOString() },
    { id: 'c12', name: 'Tanmay Ghosh', phone: '+91 91234 56712', email: 'tanmay.ghosh@iit.ac.in', created_at: new Date().toISOString() }
  ];

  // Bookings with dynamic dates relative to today
  const bookings: Booking[] = [
    // Today's Arrival: Room 101 - The Fern Residency
    {
      id: 'b1',
      booking_no: 'BK-1048',
      customer_id: 'c3',
      property_id: 'p1',
      check_in: getRelDate(0), // Today
      check_out: getRelDate(3),
      nights: 3,
      rooms: 1,
      guests: 2,
      room_type: 'Deluxe Room',
      room_number: '101',
      base_amount: 15000,
      tax_enabled: true,
      tax_rate: 12,
      tax_amount: 1800,
      grand_total: 16800,
      booking_status: 'Confirmed',
      payment_status: 'Partially Paid',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      notes: 'Late arrival estimated around 15:30 IST. Requested high floor.'
    },
    // Today's Arrival: Room 102 - The Fern Residency
    {
      id: 'b2',
      booking_no: 'BK-1049',
      customer_id: 'c4',
      property_id: 'p1',
      check_in: getRelDate(0), // Today
      check_out: getRelDate(2),
      nights: 2,
      rooms: 1,
      guests: 2,
      room_type: 'Deluxe Room',
      room_number: '102',
      base_amount: 11000,
      tax_enabled: true,
      tax_rate: 12,
      tax_amount: 1320,
      grand_total: 12320,
      booking_status: 'Confirmed',
      payment_status: 'Fully Paid',
      created_at: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    // Today's Departure: Room 104 - The Fern Residency (Stayed from 2 days ago to today)
    {
      id: 'b3',
      booking_no: 'BK-1043',
      customer_id: 'c1',
      property_id: 'p1',
      check_in: getRelDate(-3),
      check_out: getRelDate(0), // Today checkout
      nights: 3,
      rooms: 1,
      guests: 1,
      room_type: 'Standard Room',
      room_number: '104',
      base_amount: 9000,
      tax_enabled: true,
      tax_rate: 12,
      tax_amount: 1080,
      grand_total: 10080,
      booking_status: 'Confirmed',
      payment_status: 'Partially Paid', // Checkout pending folio clearance
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      notes: 'Airport taxi requested for 11:30 AM.'
    },
    // In-House Guest: Room 103 Suite (Checked in yesterday, leaves in 2 days)
    {
      id: 'b4',
      booking_no: 'BK-1045',
      customer_id: 'c2',
      property_id: 'p1',
      check_in: getRelDate(-1),
      check_out: getRelDate(2),
      nights: 3,
      rooms: 1,
      guests: 3,
      room_type: 'Executive Suite',
      room_number: '103',
      base_amount: 27000,
      tax_enabled: true,
      tax_rate: 18,
      tax_amount: 4860,
      grand_total: 31860,
      booking_status: 'Checked In',
      payment_status: 'Fully Paid',
      created_at: new Date(Date.now() - 86400000 * 4).toISOString()
    },
    // In-House Guest: Room 201 Deluxe
    {
      id: 'b5',
      booking_no: 'BK-1046',
      customer_id: 'c5',
      property_id: 'p1',
      check_in: getRelDate(-2),
      check_out: getRelDate(1),
      nights: 3,
      rooms: 1,
      guests: 2,
      room_type: 'Deluxe Room',
      room_number: '201',
      base_amount: 16500,
      tax_enabled: true,
      tax_rate: 12,
      tax_amount: 1980,
      grand_total: 18480,
      booking_status: 'Checked In',
      payment_status: 'Fully Paid',
      created_at: new Date(Date.now() - 86400000 * 6).toISOString()
    },
    // In-House Guest: Room 202 Deluxe
    {
      id: 'b6',
      booking_no: 'BK-1047',
      customer_id: 'c6',
      property_id: 'p1',
      check_in: getRelDate(-1),
      check_out: getRelDate(3),
      nights: 4,
      rooms: 1,
      guests: 2,
      room_type: 'Deluxe Room',
      room_number: '202',
      base_amount: 22000,
      tax_enabled: true,
      tax_rate: 12,
      tax_amount: 2640,
      grand_total: 24640,
      booking_status: 'Checked In',
      payment_status: 'Partially Paid',
      created_at: new Date(Date.now() - 86400000 * 4).toISOString()
    },
    // Upcoming: Room 104 starts tomorrow
    {
      id: 'b7',
      booking_no: 'BK-1050',
      customer_id: 'c7',
      property_id: 'p1',
      check_in: getRelDate(1), // Tomorrow
      check_out: getRelDate(4),
      nights: 3,
      rooms: 1,
      guests: 2,
      room_type: 'Standard Room',
      room_number: '104',
      base_amount: 10500,
      tax_enabled: true,
      tax_rate: 12,
      tax_amount: 1260,
      grand_total: 11760,
      booking_status: 'Confirmed',
      payment_status: 'Fully Paid',
      created_at: new Date(Date.now() - 86400000).toISOString()
    },
    // Upcoming: Room 203 Suite starts in 2 days
    {
      id: 'b8',
      booking_no: 'BK-1051',
      customer_id: 'c8',
      property_id: 'p1',
      check_in: getRelDate(2),
      check_out: getRelDate(5),
      nights: 3,
      rooms: 1,
      guests: 2,
      room_type: 'Executive Suite',
      room_number: '203',
      base_amount: 30000,
      tax_enabled: true,
      tax_rate: 18,
      tax_amount: 5400,
      grand_total: 35400,
      booking_status: 'Confirmed',
      payment_status: 'Unpaid',
      created_at: new Date().toISOString()
    },

    // --- Property 2: Valley View Resort ---
    {
      id: 'b9',
      booking_no: 'BK-2021',
      customer_id: 'c9',
      property_id: 'p2',
      check_in: getRelDate(0), // Today arrival
      check_out: getRelDate(3),
      nights: 3,
      rooms: 1,
      guests: 2,
      room_type: 'Cottage Villa',
      room_number: 'C-01',
      base_amount: 28000,
      tax_enabled: true,
      tax_rate: 18,
      tax_amount: 5040,
      grand_total: 33040,
      booking_status: 'Confirmed',
      payment_status: 'Partially Paid',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'b10',
      booking_no: 'BK-2022',
      customer_id: 'c10',
      property_id: 'p2',
      check_in: getRelDate(-2),
      check_out: getRelDate(1),
      nights: 3,
      rooms: 1,
      guests: 4,
      room_type: 'Valley Suite',
      room_number: 'V-04',
      base_amount: 45000,
      tax_enabled: true,
      tax_rate: 18,
      tax_amount: 8100,
      grand_total: 53100,
      booking_status: 'Checked In',
      payment_status: 'Fully Paid',
      created_at: new Date(Date.now() - 86400000 * 5).toISOString()
    },
    {
      id: 'b11',
      booking_no: 'BK-2023',
      customer_id: 'c11',
      property_id: 'p2',
      check_in: getRelDate(-3),
      check_out: getRelDate(0), // Today checkout
      nights: 3,
      rooms: 1,
      guests: 2,
      room_type: 'Cottage Villa',
      room_number: 'C-02',
      base_amount: 26000,
      tax_enabled: true,
      tax_rate: 18,
      tax_amount: 4680,
      grand_total: 30680,
      booking_status: 'Confirmed',
      payment_status: 'Fully Paid',
      created_at: new Date(Date.now() - 86400000 * 4).toISOString()
    },

    // --- Property 3: Coral Beach Homestay ---
    {
      id: 'b12',
      booking_no: 'BK-3011',
      customer_id: 'c12',
      property_id: 'p3',
      check_in: getRelDate(-1),
      check_out: getRelDate(2),
      nights: 3,
      rooms: 1,
      guests: 2,
      room_type: 'Sea View Room',
      room_number: 'H-01',
      base_amount: 12000,
      tax_enabled: false,
      tax_rate: 0,
      tax_amount: 0,
      grand_total: 12000,
      booking_status: 'Checked In',
      payment_status: 'Partially Paid',
      created_at: new Date(Date.now() - 86400000 * 3).toISOString()
    }
  ];

  // Payments matching the bookings
  const payments: Payment[] = [
    // b1 (Ananya Desai - ₹16,800 total, paid ₹8,300 advance -> ₹8,500 due)
    {
      id: 'pay1',
      payment_no: 'PAY-9011',
      booking_id: 'b1',
      date: getRelDate(-2),
      amount: 8300,
      method: 'UPI',
      ref_id: 'UPI98234812',
      purpose: 'Advance Deposit',
      status: 'Completed',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    // b2 (Vikram Singh - Fully Paid ₹12,320)
    {
      id: 'pay2',
      payment_no: 'PAY-9012',
      booking_id: 'b2',
      date: getRelDate(-3),
      amount: 12320,
      method: 'Card',
      ref_id: 'TXN4892019',
      purpose: 'Full Prepayment',
      status: 'Completed',
      created_at: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    // b3 (Rahul Sharma - Total ₹10,080, paid ₹5,000 -> ₹5,080 due at checkout)
    {
      id: 'pay3',
      payment_no: 'PAY-9013',
      booking_id: 'b3',
      date: getRelDate(-3),
      amount: 5000,
      method: 'Google Pay',
      ref_id: 'GPAY7482910',
      purpose: 'Advance',
      status: 'Completed',
      created_at: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    // b4 (Priya Patel - Fully Paid ₹31,860)
    {
      id: 'pay4',
      payment_no: 'PAY-9014',
      booking_id: 'b4',
      date: getRelDate(-4),
      amount: 31860,
      method: 'NEFT Transfer',
      ref_id: 'NEFT84920491',
      purpose: 'Full Payment',
      status: 'Completed',
      created_at: new Date(Date.now() - 86400000 * 4).toISOString()
    },
    // b5 (Neha Gupta - Fully Paid ₹18,480)
    {
      id: 'pay5',
      payment_no: 'PAY-9015',
      booking_id: 'b5',
      date: getRelDate(-6),
      amount: 18480,
      method: 'Card',
      ref_id: 'POS-89214',
      purpose: 'Full Payment',
      status: 'Completed',
      created_at: new Date(Date.now() - 86400000 * 6).toISOString()
    },
    // b6 (Karthik Reddy - Total ₹24,640, paid ₹15,000 -> ₹9,640 due)
    {
      id: 'pay6',
      payment_no: 'PAY-9016',
      booking_id: 'b6',
      date: getRelDate(-4),
      amount: 15000,
      method: 'UPI',
      ref_id: 'UPI8391024',
      purpose: 'Advance',
      status: 'Completed',
      created_at: new Date(Date.now() - 86400000 * 4).toISOString()
    },
    // b7 (Sonal Iyer - Fully Paid ₹11,760)
    {
      id: 'pay7',
      payment_no: 'PAY-9017',
      booking_id: 'b7',
      date: getRelDate(-1),
      amount: 11760,
      method: 'UPI',
      ref_id: 'UPI9019284',
      purpose: 'Full Payment',
      status: 'Completed',
      created_at: new Date(Date.now() - 86400000).toISOString()
    },
    // b9 (Meera Rao - Total ₹33,040, paid ₹15,000 -> ₹18,040 due)
    {
      id: 'pay8',
      payment_no: 'PAY-9018',
      booking_id: 'b9',
      date: getRelDate(-2),
      amount: 15000,
      method: 'Card',
      ref_id: 'POS-77192',
      purpose: 'Advance',
      status: 'Completed',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    // b10 (Rohan Mehta - Fully Paid ₹53,100)
    {
      id: 'pay9',
      payment_no: 'PAY-9019',
      booking_id: 'b10',
      date: getRelDate(-5),
      amount: 53100,
      method: 'Bank Transfer',
      ref_id: 'RTGS9102941',
      purpose: 'Corporate Full Payment',
      status: 'Completed',
      created_at: new Date(Date.now() - 86400000 * 5).toISOString()
    },
    // b11 (Sunita Menon - Fully Paid ₹30,680)
    {
      id: 'pay10',
      payment_no: 'PAY-9020',
      booking_id: 'b11',
      date: getRelDate(-4),
      amount: 30680,
      method: 'UPI',
      ref_id: 'UPI8892102',
      purpose: 'Full Payment',
      status: 'Completed',
      created_at: new Date(Date.now() - 86400000 * 4).toISOString()
    },
    // b12 (Tanmay Ghosh - Total ₹12,000, paid ₹6,000 -> ₹6,000 due)
    {
      id: 'pay11',
      payment_no: 'PAY-9021',
      booking_id: 'b12',
      date: getRelDate(-3),
      amount: 6000,
      method: 'Cash',
      purpose: 'Cash Advance',
      status: 'Recorded',
      created_at: new Date(Date.now() - 86400000 * 3).toISOString()
    }
  ];

  return {
    settings: {
      name: 'The Fern Hospitality Group',
      legalName: 'Fern Hospitality Services Pvt. Ltd.',
      gstin: '29ABCDE1234F1Z5'
    },
    properties,
    customers,
    bookings,
    payments,
    notifications: []
  };
}

class DemoRepositoryImpl implements IRepository {
  private db: DemoDB;

  constructor() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        this.db = JSON.parse(stored);
      } catch (e) {
        this.db = buildSeedData();
        this.save();
      }
    } else {
      this.db = buildSeedData();
      this.save();
    }
  }

  private save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.db));
  }

  // --- Properties ---
  async getProperties() {
    return [...this.db.properties];
  }
  async getProperty(id: string) {
    return this.db.properties.find(p => p.id === id) || null;
  }
  async createProperty(data: Omit<Property, 'id' | 'created_at'>) {
    const prop: Property = { ...data, id: generateId('P-'), created_at: new Date().toISOString() };
    this.db.properties.push(prop);
    this.save();
    return prop;
  }
  async updateProperty(id: string, data: Partial<Property>) {
    const idx = this.db.properties.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Property not found');
    this.db.properties[idx] = { ...this.db.properties[idx], ...data };
    this.save();
    return this.db.properties[idx];
  }

  // --- Customers ---
  async getCustomers() {
    return [...this.db.customers].reverse();
  }
  async getCustomer(id: string) {
    return this.db.customers.find(c => c.id === id) || null;
  }
  async createCustomer(data: Omit<Customer, 'id' | 'created_at'>) {
    const cust: Customer = { ...data, id: generateId('C-'), created_at: new Date().toISOString() };
    this.db.customers.push(cust);
    this.save();
    return cust;
  }

  // --- Bookings ---
  async getBookings(propertyId?: string) {
    let bs = [...this.db.bookings];
    if (propertyId) bs = bs.filter(b => b.property_id === propertyId);
    return bs.reverse();
  }
  async getBooking(id: string) {
    return this.db.bookings.find(b => b.id === id) || null;
  }
  async createBooking(data: Omit<Booking, 'id' | 'created_at'>) {
    const booking: Booking = { ...data, id: generateId('B-'), created_at: new Date().toISOString() };
    this.db.bookings.push(booking);
    this.save();
    return booking;
  }
  async updateBooking(id: string, data: Partial<Booking>) {
    const idx = this.db.bookings.findIndex(b => b.id === id);
    if (idx === -1) throw new Error('Booking not found');
    this.db.bookings[idx] = { ...this.db.bookings[idx], ...data };
    this.save();
    return this.db.bookings[idx];
  }

  // --- Payments ---
  async getPayments(bookingId?: string) {
    let ps = [...this.db.payments];
    if (bookingId) ps = ps.filter(p => p.booking_id === bookingId);
    return ps.reverse();
  }
  async getAllPayments(propertyId?: string) {
    let ps = [...this.db.payments];
    if (propertyId) {
      const bIds = this.db.bookings.filter(b => b.property_id === propertyId).map(b => b.id);
      ps = ps.filter(p => bIds.includes(p.booking_id));
    }
    return ps.reverse();
  }
  async createPayment(data: Omit<Payment, 'id' | 'created_at'>) {
    const payment: Payment = { ...data, id: generateId('PAY-'), created_at: new Date().toISOString() };
    this.db.payments.push(payment);
    this.save();
    return payment;
  }

  // --- Notifications ---
  async getNotifications(bookingId?: string) {
    let ns = [...this.db.notifications];
    if (bookingId) ns = ns.filter(n => n.booking_id === bookingId);
    return ns.reverse();
  }
  async createNotification(data: Omit<Notification, 'id' | 'created_at'>) {
    const notif: Notification = { ...data, id: generateId('N-'), created_at: new Date().toISOString() };
    this.db.notifications.push(notif);
    this.save();
    return notif;
  }

  // --- Settings ---
  async getSettings() {
    return { ...this.db.settings };
  }
  async updateSettings(data: Partial<BusinessSettings>) {
    this.db.settings = { ...this.db.settings, ...data };
    this.save();
    return this.db.settings;
  }

  async resetDemoData() {
    this.db = buildSeedData();
    this.save();
  }
}

export const DemoRepository = new DemoRepositoryImpl();
