import { databases, databaseId, isAppwriteConfigured } from '../../services/appwrite';
import { ID, Query } from 'appwrite';
import {
  IRepository,
  Property,
  Unit,
  UnitBlock,
  Customer,
  Booking,
  Payment,
  Notification,
  BusinessSettings
} from './types';

// Appwrite collections configuration
export const APPWRITE_COLLECTIONS = {
  properties: 'properties',
  units: 'units',
  unit_blocks: 'unit_blocks',
  customers: 'customers',
  bookings: 'bookings',
  payments: 'payments',
  notifications: 'notifications',
  settings: 'settings',
};

function fromAppwriteDocument<T>(document: { $id: string }): T {
  return { ...document, id: document.$id } as unknown as T;
}

export class AppwriteRepository implements IRepository {
  private dbId = databaseId;

  private checkConfigured() {
    if (!isAppwriteConfigured || !this.dbId) {
      throw new Error('Appwrite database is not configured');
    }
  }

  // --- Properties ---
  async getProperties(): Promise<Property[]> {
    this.checkConfigured();
    const res = await databases.listDocuments(this.dbId, APPWRITE_COLLECTIONS.properties);
    return res.documents.map((document) => fromAppwriteDocument<Property>(document));
  }

  async getProperty(id: string): Promise<Property | null> {
    this.checkConfigured();
    try {
      const doc = await databases.getDocument(this.dbId, APPWRITE_COLLECTIONS.properties, id);
      return fromAppwriteDocument<Property>(doc);
    } catch {
      return null;
    }
  }

  async createProperty(data: Omit<Property, 'id' | 'created_at'>): Promise<Property> {
    this.checkConfigured();
    const doc = await databases.createDocument(
      this.dbId,
      APPWRITE_COLLECTIONS.properties,
      ID.unique(),
      { ...data, created_at: new Date().toISOString() }
    );
    return fromAppwriteDocument<Property>(doc);
  }

  async updateProperty(id: string, data: Partial<Property>): Promise<Property> {
    this.checkConfigured();
    const doc = await databases.updateDocument(
      this.dbId,
      APPWRITE_COLLECTIONS.properties,
      id,
      data
    );
    return fromAppwriteDocument<Property>(doc);
  }

  // --- Units ---
  async getUnits(propertyId?: string): Promise<Unit[]> {
    this.checkConfigured();
    const queries: string[] = [Query.orderAsc('sort_order')];
    if (propertyId) queries.push(Query.equal('property_id', propertyId));
    const res = await databases.listDocuments(this.dbId, APPWRITE_COLLECTIONS.units, queries);
    return res.documents.map((document) => fromAppwriteDocument<Unit>(document));
  }

  async getUnit(id: string): Promise<Unit | null> {
    this.checkConfigured();
    try {
      const doc = await databases.getDocument(this.dbId, APPWRITE_COLLECTIONS.units, id);
      return fromAppwriteDocument<Unit>(doc);
    } catch {
      return null;
    }
  }

  async createUnit(data: Omit<Unit, 'id' | 'created_at'>): Promise<Unit> {
    this.checkConfigured();
    const doc = await databases.createDocument(
      this.dbId,
      APPWRITE_COLLECTIONS.units,
      ID.unique(),
      { ...data, created_at: new Date().toISOString() }
    );
    return fromAppwriteDocument<Unit>(doc);
  }

  async updateUnit(id: string, data: Partial<Unit>): Promise<Unit> {
    this.checkConfigured();
    const doc = await databases.updateDocument(
      this.dbId,
      APPWRITE_COLLECTIONS.units,
      id,
      data
    );
    return fromAppwriteDocument<Unit>(doc);
  }

  // --- Unit Blocks ---
  async getUnitBlocks(propertyId?: string): Promise<UnitBlock[]> {
    this.checkConfigured();
    const queries: string[] = [];
    if (propertyId) queries.push(Query.equal('property_id', propertyId));
    const res = await databases.listDocuments(this.dbId, APPWRITE_COLLECTIONS.unit_blocks, queries);
    return res.documents.map((document) => fromAppwriteDocument<UnitBlock>(document));
  }

  async createUnitBlock(data: Omit<UnitBlock, 'id' | 'created_at'>): Promise<UnitBlock> {
    this.checkConfigured();
    const doc = await databases.createDocument(
      this.dbId,
      APPWRITE_COLLECTIONS.unit_blocks,
      ID.unique(),
      { ...data, created_at: new Date().toISOString() }
    );
    return fromAppwriteDocument<UnitBlock>(doc);
  }

  async deleteUnitBlock(id: string): Promise<void> {
    this.checkConfigured();
    await databases.deleteDocument(this.dbId, APPWRITE_COLLECTIONS.unit_blocks, id);
  }

  // --- Customers ---
  async getCustomers(): Promise<Customer[]> {
    this.checkConfigured();
    const res = await databases.listDocuments(this.dbId, APPWRITE_COLLECTIONS.customers, [
      Query.orderDesc('created_at')
    ]);
    return res.documents.map((document) => fromAppwriteDocument<Customer>(document));
  }

  async getCustomer(id: string): Promise<Customer | null> {
    this.checkConfigured();
    try {
      const doc = await databases.getDocument(this.dbId, APPWRITE_COLLECTIONS.customers, id);
      return fromAppwriteDocument<Customer>(doc);
    } catch {
      return null;
    }
  }

  async createCustomer(data: Omit<Customer, 'id' | 'created_at'>): Promise<Customer> {
    this.checkConfigured();
    const doc = await databases.createDocument(
      this.dbId,
      APPWRITE_COLLECTIONS.customers,
      ID.unique(),
      { ...data, created_at: new Date().toISOString() }
    );
    return fromAppwriteDocument<Customer>(doc);
  }

  // --- Bookings ---
  async getBookings(propertyId?: string): Promise<Booking[]> {
    this.checkConfigured();
    const queries = [Query.orderDesc('created_at')];
    if (propertyId) queries.push(Query.equal('property_id', propertyId));
    const res = await databases.listDocuments(this.dbId, APPWRITE_COLLECTIONS.bookings, queries);
    return res.documents.map((document) => fromAppwriteDocument<Booking>(document));
  }

  async getBooking(id: string): Promise<Booking | null> {
    this.checkConfigured();
    try {
      const doc = await databases.getDocument(this.dbId, APPWRITE_COLLECTIONS.bookings, id);
      return fromAppwriteDocument<Booking>(doc);
    } catch {
      return null;
    }
  }

  async createBooking(data: Omit<Booking, 'id' | 'created_at'>): Promise<Booking> {
    this.checkConfigured();
    const doc = await databases.createDocument(
      this.dbId,
      APPWRITE_COLLECTIONS.bookings,
      ID.unique(),
      { ...data, created_at: new Date().toISOString() }
    );
    return fromAppwriteDocument<Booking>(doc);
  }

  async updateBooking(id: string, data: Partial<Booking>): Promise<Booking> {
    this.checkConfigured();
    const doc = await databases.updateDocument(
      this.dbId,
      APPWRITE_COLLECTIONS.bookings,
      id,
      data
    );
    return fromAppwriteDocument<Booking>(doc);
  }

  // --- Payments ---
  async getPayments(bookingId?: string): Promise<Payment[]> {
    this.checkConfigured();
    const queries = [Query.orderDesc('created_at')];
    if (bookingId) queries.push(Query.equal('booking_id', bookingId));
    const res = await databases.listDocuments(this.dbId, APPWRITE_COLLECTIONS.payments, queries);
    return res.documents.map((document) => fromAppwriteDocument<Payment>(document));
  }

  async getAllPayments(propertyId?: string): Promise<Payment[]> {
    this.checkConfigured();
    const queries = [Query.orderDesc('created_at')];
    if (propertyId) queries.push(Query.equal('property_id', propertyId));
    const res = await databases.listDocuments(this.dbId, APPWRITE_COLLECTIONS.payments, queries);
    return res.documents.map((document) => fromAppwriteDocument<Payment>(document));
  }

  async createPayment(data: Omit<Payment, 'id' | 'created_at'>): Promise<Payment> {
    this.checkConfigured();
    const doc = await databases.createDocument(
      this.dbId,
      APPWRITE_COLLECTIONS.payments,
      ID.unique(),
      { ...data, created_at: new Date().toISOString() }
    );
    return fromAppwriteDocument<Payment>(doc);
  }

  // --- Notifications ---
  async getNotifications(bookingId?: string): Promise<Notification[]> {
    this.checkConfigured();
    const queries = [Query.orderDesc('created_at')];
    if (bookingId) queries.push(Query.equal('booking_id', bookingId));
    const res = await databases.listDocuments(this.dbId, APPWRITE_COLLECTIONS.notifications, queries);
    return res.documents.map((document) => fromAppwriteDocument<Notification>(document));
  }

  async createNotification(data: Omit<Notification, 'id' | 'created_at'>): Promise<Notification> {
    this.checkConfigured();
    const doc = await databases.createDocument(
      this.dbId,
      APPWRITE_COLLECTIONS.notifications,
      ID.unique(),
      { ...data, created_at: new Date().toISOString() }
    );
    return fromAppwriteDocument<Notification>(doc);
  }

  // --- Settings ---
  async getSettings(): Promise<BusinessSettings> {
    this.checkConfigured();
    try {
      const res = await databases.listDocuments(this.dbId, APPWRITE_COLLECTIONS.settings, [Query.limit(1)]);
      if (res.documents.length > 0) {
        return res.documents[0] as unknown as BusinessSettings;
      }
    } catch {
      // fallback
    }
    return {
      name: 'MyTrackYo Hospitality',
      legalName: 'MyTrackYo Hospitality Pvt. Ltd.',
      gstin: ''
    };
  }

  async updateSettings(data: Partial<BusinessSettings>): Promise<BusinessSettings> {
    this.checkConfigured();
    const res = await databases.listDocuments(this.dbId, APPWRITE_COLLECTIONS.settings, [Query.limit(1)]);
    if (res.documents.length > 0) {
      const doc = await databases.updateDocument(
        this.dbId,
        APPWRITE_COLLECTIONS.settings,
        res.documents[0].$id,
        data
      );
      return doc as unknown as BusinessSettings;
    }
    const doc = await databases.createDocument(
      this.dbId,
      APPWRITE_COLLECTIONS.settings,
      ID.unique(),
      data
    );
    return doc as unknown as BusinessSettings;
  }

  async resetDemoData(): Promise<void> {
    // No-op for remote database
  }
}
