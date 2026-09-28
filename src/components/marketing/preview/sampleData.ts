export interface SampleProperty {
  id: string;
  name: string;
  roomCount: number;
}

export interface SampleGuest {
  id: string;
  name: string;
}

export interface SampleBooking {
  id: string;
  propertyId: string;
  guestId: string;
  room: string;
  roomType: string;
  rate: number;
  checkIn: string;
  checkOut: string;
  extras: number;
  paid: number;
  arrivalTime?: string;
}

export const SAMPLE_TODAY = '2026-09-28';
export const SAMPLE_TIME = '08:30';

export const sampleProperties: SampleProperty[] = [
  { id: 'fern', name: 'The Fern Residency', roomCount: 24 },
  { id: 'valley', name: 'Valley View Resort', roomCount: 16 },
  { id: 'coral', name: 'Coral Beach Homestay', roomCount: 6 },
];

export const sampleGuests: SampleGuest[] = [
  { id: 'meera', name: 'Meera Rao' },
  { id: 'ananya', name: 'Ananya Desai' },
  { id: 'priya-patel', name: 'Priya Patel' },
  { id: 'rohan', name: 'Rohan Bose' },
  { id: 'priya-nair', name: 'Priya Nair' },
  { id: 'karan', name: 'Karan Mehta' },
  { id: 'neha', name: 'Neha Kapoor' },
  { id: 'vikram', name: 'Vikram Singh' },
  { id: 'sonal', name: 'Sonal Iyer' },
  { id: 'filler-0', name: 'Aarav Shah' },
  { id: 'filler-1', name: 'Ishita Menon' },
  { id: 'filler-2', name: 'Kabir Das' },
  { id: 'filler-3', name: 'Nisha Rao' },
  { id: 'filler-4', name: 'Dev Malhotra' },
  { id: 'filler-5', name: 'Tara Bose' },
  { id: 'filler-6', name: 'Arjun Iyer' },
  { id: 'filler-7', name: 'Riya Sen' },
  { id: 'filler-8', name: 'Manav Joshi' },
  { id: 'filler-9', name: 'Leela Nair' },
];

export const sampleBookings: SampleBooking[] = [
  { id: 'BK-1046', propertyId: 'fern', guestId: 'meera', room: '102', roomType: 'Deluxe Twin', rate: 5500, checkIn: '2026-09-25', checkOut: '2026-09-28', extras: 4540, paid: 3000 },
  { id: 'BK-1048', propertyId: 'fern', guestId: 'ananya', room: '101', roomType: 'Deluxe King', rate: 5000, checkIn: '2026-09-26', checkOut: '2026-09-29', extras: 0, paid: 15000 },
  { id: 'BK-1045', propertyId: 'fern', guestId: 'priya-patel', room: '103', roomType: 'Executive Suite', rate: 9000, checkIn: '2026-09-27', checkOut: '2026-09-30', extras: 0, paid: 27000 },
  { id: 'BK-1044', propertyId: 'fern', guestId: 'rohan', room: '104', roomType: 'Standard', rate: 3500, checkIn: '2026-09-26', checkOut: '2026-09-28', extras: 0, paid: 7000 },
  { id: 'BK-1052', propertyId: 'fern', guestId: 'priya-nair', room: '201', roomType: 'Deluxe King', rate: 5000, checkIn: '2026-09-28', checkOut: '2026-09-30', extras: 0, paid: 4000, arrivalTime: '14:00' },
  { id: 'BK-1053', propertyId: 'fern', guestId: 'karan', room: '202', roomType: 'Deluxe King', rate: 5000, checkIn: '2026-09-28', checkOut: '2026-09-29', extras: 0, paid: 0, arrivalTime: '12:30' },
  { id: 'BK-1054', propertyId: 'fern', guestId: 'neha', room: '203', roomType: 'Standard', rate: 3500, checkIn: '2026-09-28', checkOut: '2026-10-01', extras: 0, paid: 5000, arrivalTime: '15:00' },
  { id: 'BK-1049', propertyId: 'fern', guestId: 'vikram', room: '105', roomType: 'Deluxe Twin', rate: 5500, checkIn: '2026-09-29', checkOut: '2026-10-01', extras: 0, paid: 3000, arrivalTime: '13:00' },
  { id: 'BK-1050', propertyId: 'fern', guestId: 'sonal', room: '106', roomType: 'Standard', rate: 3500, checkIn: '2026-09-29', checkOut: '2026-10-02', extras: 0, paid: 2000, arrivalTime: '14:00' },
  ...Array.from({ length: 10 }, (_, index): SampleBooking => ({
    id: `BK-${1100 + index}`,
    propertyId: 'fern',
    guestId: `filler-${index}`,
    room: String(107 + index),
    roomType: index % 2 === 0 ? 'Standard' : 'Deluxe',
    rate: index % 2 === 0 ? 3500 : 5000,
    checkIn: '2026-09-26',
    checkOut: '2026-09-30',
    extras: 0,
    paid: (index % 2 === 0 ? 3500 : 5000) * 4,
  })),
  { id: 'BK-2051', propertyId: 'valley', guestId: 'priya-patel', room: 'C-01', roomType: 'Cottage', rate: 7200, checkIn: '2026-09-26', checkOut: '2026-09-30', extras: 0, paid: 14400 },
  { id: 'BK-2052', propertyId: 'valley', guestId: 'rohan', room: 'V-02', roomType: 'Valley Room', rate: 4800, checkIn: '2026-09-27', checkOut: '2026-09-29', extras: 0, paid: 4800 },
  { id: 'BK-3051', propertyId: 'coral', guestId: 'meera', room: 'H-01', roomType: 'Garden Room', rate: 4200, checkIn: '2026-09-27', checkOut: '2026-09-30', extras: 0, paid: 4200 },
];

const guestById = new Map(sampleGuests.map((guest) => [guest.id, guest]));
const DAY_MS = 24 * 60 * 60 * 1000;

export function getGuest(guestId: string): SampleGuest | undefined {
  return guestById.get(guestId);
}

export function getProperty(propertyId: string): SampleProperty | undefined {
  return sampleProperties.find((property) => property.id === propertyId);
}

export function getNights(booking: SampleBooking): number {
  return Math.max(0, (Date.parse(`${booking.checkOut}T00:00:00Z`) - Date.parse(`${booking.checkIn}T00:00:00Z`)) / DAY_MS);
}

export function getTotal(booking: SampleBooking): number {
  return getNights(booking) * booking.rate + booking.extras;
}

export function getBalance(booking: SampleBooking): number {
  return Math.max(0, getTotal(booking) - booking.paid);
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
}

export function getArrivals(day = SAMPLE_TODAY): SampleBooking[] {
  return sampleBookings.filter((booking) => booking.checkIn === day);
}

export function getDepartures(day = SAMPLE_TODAY): SampleBooking[] {
  return sampleBookings.filter((booking) => booking.checkOut === day);
}

export function getOccupiedCount(propertyId: string, day = SAMPLE_TODAY): number {
  return sampleBookings.filter((booking) => booking.propertyId === propertyId && booking.checkIn < day && booking.checkOut >= day).length;
}

export function getOpenBalance(propertyId: string): number {
  return sampleBookings
    .filter((booking) => booking.propertyId === propertyId)
    .reduce((total, booking) => total + getBalance(booking), 0);
}

export function getPortfolioOpenBalance(): number {
  return sampleBookings.reduce((total, booking) => total + getBalance(booking), 0);
}

export function getPortfolioTotals(day = SAMPLE_TODAY): { rooms: number; occupied: number; properties: number } {
  return sampleProperties.reduce((totals, property) => ({
    rooms: totals.rooms + property.roomCount,
    occupied: totals.occupied + getOccupiedCount(property.id, day),
    properties: totals.properties + 1,
  }), { rooms: 0, occupied: 0, properties: 0 });
}