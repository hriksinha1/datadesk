import { account, isAppwriteConfigured } from './appwrite';
import { ID } from 'appwrite';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'manager' | 'receptionist' | 'staff';
  propertyName?: string;
  propertyType?: string;
  unitCount?: string;
}

const LOCAL_STORAGE_KEY = 'mytrackyo_session';
const LOCAL_USER_KEY = 'mytrackyo_user';

export const authService = {
  isConfigured(): boolean {
    return isAppwriteConfigured;
  },

  async getCurrentUser(): Promise<UserProfile | null> {
    if (isAppwriteConfigured) {
      try {
        const appwriteUser = await account.get();
        return {
          id: appwriteUser.$id,
          name: appwriteUser.name || 'Property Manager',
          email: appwriteUser.email,
          role: 'owner',
        };
      } catch {
        return null;
      }
    }

    // Local fallback session
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stored) return null;

    const userStr = localStorage.getItem(LOCAL_USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        // ignore
      }
    }

    return {
      id: 'demo-user-1',
      name: 'Rohan Sharma',
      email: 'rohan@thefernresidency.com',
      role: 'owner',
      propertyName: 'The Fern Residency',
      propertyType: 'Boutique Hotel',
      unitCount: '24',
    };
  },

  async login(email: string, password: string): Promise<UserProfile> {
    if (isAppwriteConfigured) {
      await account.createEmailPasswordSession(email, password);
      const appwriteUser = await account.get();
      const profile: UserProfile = {
        id: appwriteUser.$id,
        name: appwriteUser.name || email.split('@')[0],
        email: appwriteUser.email,
        role: 'owner',
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
      return profile;
    }

    // Local simulation for demo/evaluation
    const profile: UserProfile = {
      id: 'user-' + Date.now(),
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email,
      role: 'owner',
      propertyName: 'The Fern Residency',
      propertyType: 'Boutique Hotel',
    };

    localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
    return profile;
  },

  async signup(data: {
    fullName: string;
    email: string;
    password: string;
    propertyName: string;
    propertyType: string;
    unitCount: string;
  }): Promise<UserProfile> {
    if (isAppwriteConfigured) {
      await account.create(ID.unique(), data.email, data.password, data.fullName);
      await account.createEmailPasswordSession(data.email, data.password);
      const appwriteUser = await account.get();
      const profile: UserProfile = {
        id: appwriteUser.$id,
        name: data.fullName,
        email: data.email,
        role: 'owner',
        propertyName: data.propertyName,
        propertyType: data.propertyType,
        unitCount: data.unitCount,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
      return profile;
    }

    // Local simulation
    const profile: UserProfile = {
      id: 'user-' + Date.now(),
      name: data.fullName,
      email: data.email,
      role: 'owner',
      propertyName: data.propertyName,
      propertyType: data.propertyType,
      unitCount: data.unitCount,
    };

    localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
    return profile;
  },

  async logout(): Promise<void> {
    if (isAppwriteConfigured) {
      try {
        await account.deleteSession('current');
      } catch {
        // ignore
      }
    }
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(LOCAL_USER_KEY);
    localStorage.removeItem('demo_session');
  },

  async quickDemoLogin(): Promise<UserProfile> {
    const demoProfile: UserProfile = {
      id: 'demo-user-fern',
      name: 'Rohan Sharma',
      email: 'owner@thefernresidency.com',
      role: 'owner',
      propertyName: 'The Fern Residency',
      propertyType: 'Boutique Hotel',
      unitCount: '24',
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(demoProfile));
    return demoProfile;
  },

  async sendPasswordReset(email: string): Promise<void> {
    if (isAppwriteConfigured) {
      const redirectUrl = `${window.location.origin}/reset-password`;
      await account.createRecovery(email, redirectUrl);
      return;
    }
    // Local simulation: delay 500ms
    await new Promise(r => setTimeout(r, 600));
  },

  async confirmPasswordReset(userId: string, secret: string, password: string): Promise<void> {
    if (isAppwriteConfigured) {
      await account.updateRecovery(userId, secret, password);
      return;
    }
    await new Promise(r => setTimeout(r, 600));
  },

  async sendVerificationEmail(): Promise<void> {
    if (isAppwriteConfigured) {
      const redirectUrl = `${window.location.origin}/verify-email`;
      await account.createVerification(redirectUrl);
      return;
    }
    await new Promise(r => setTimeout(r, 600));
  }
};
