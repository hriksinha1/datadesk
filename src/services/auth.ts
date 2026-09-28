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
  isDemo?: boolean;
}

const LOCAL_STORAGE_KEY = 'mytrackyo_session';
const LOCAL_USER_KEY = 'mytrackyo_user';

function createLocalFallbackUser(
  email: string,
  fullName?: string,
  propertyName?: string,
  propertyType?: string,
  isDemo = true
): UserProfile {
  const derivedName =
    fullName ||
    email
      .split('@')[0]
      .replace(/[._]/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  return {
    id: 'user-' + Date.now(),
    name: derivedName,
    email: email.trim().toLowerCase(),
    role: 'owner',
    propertyName: propertyName || 'MyTrackYo Property',
    propertyType: propertyType || 'Hotel',
    unitCount: '24',
    isDemo,
  };
}

function isNetworkOrFetchError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const anyErr = err as { message?: string; name?: string; code?: number };
  const msg = (anyErr.message || '').toLowerCase();
  const name = (anyErr.name || '').toLowerCase();
  return (
    msg.includes('fetch') ||
    msg.includes('network') ||
    msg.includes('cors') ||
    msg.includes('failed to fetch') ||
    msg.includes('project_not_found') ||
    msg.includes('general_unknown_origin') ||
    name === 'typeerror' ||
    anyErr.code === 0
  );
}

export const authService = {
  isConfigured(): boolean {
    return isAppwriteConfigured;
  },

  async getCurrentUser(): Promise<UserProfile | null> {
    if (isAppwriteConfigured) {
      try {
        const appwriteUser = await account.get();
        const prefs = (appwriteUser.prefs || {}) as Record<string, string>;
        const profile: UserProfile = {
          id: appwriteUser.$id,
          name: appwriteUser.name || appwriteUser.email.split('@')[0],
          email: appwriteUser.email,
          role: (prefs.role as UserProfile['role']) || 'owner',
          propertyName: prefs.propertyName || undefined,
          propertyType: prefs.propertyType || undefined,
          isDemo: false,
        };
        return profile;
      } catch {
        // Appwrite session doesn't exist or is invalid
        // If there was a demo session explicitly stored, allow it
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored === 'demo') {
          const userStr = localStorage.getItem(LOCAL_USER_KEY);
          if (userStr) {
            try {
              return JSON.parse(userStr);
            } catch {
              // ignore
            }
          }
        }
        return null;
      }
    }

    // Local fallback session when Appwrite is not configured
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

    return createLocalFallbackUser('owner@mytrackyo.local', 'Property Manager', undefined, undefined, true);
  },

  async login(email: string, password: string): Promise<UserProfile> {
    const cleanEmail = email.trim().toLowerCase();

    if (isAppwriteConfigured) {
      try {
        await account.createEmailPasswordSession(cleanEmail, password);
        const appwriteUser = await account.get();
        const prefs = (appwriteUser.prefs || {}) as Record<string, string>;
        const profile: UserProfile = {
          id: appwriteUser.$id,
          name: appwriteUser.name || cleanEmail.split('@')[0],
          email: appwriteUser.email,
          role: (prefs.role as UserProfile['role']) || 'owner',
          propertyName: prefs.propertyName || undefined,
          propertyType: prefs.propertyType || undefined,
          isDemo: false,
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, 'appwrite');
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
        return profile;
      } catch (err: unknown) {
        if (isNetworkOrFetchError(err)) {
          throw new Error("Can't reach the server. Check your connection and try again.");
        }
        const anyErr = err as { code?: number; type?: string; message?: string };
        if (anyErr.code === 401 || anyErr.type === 'user_invalid_credentials') {
          throw new Error('Invalid email or password. Please verify your credentials or use the sample workspace.');
        }
        throw new Error(anyErr.message || 'Unable to sign in. Please try again.');
      }
    }

    // Local simulation ONLY when Appwrite is NOT configured
    const profile = createLocalFallbackUser(cleanEmail, undefined, undefined, undefined, true);
    localStorage.setItem(LOCAL_STORAGE_KEY, 'demo');
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
    const cleanEmail = data.email.trim().toLowerCase();

    if (isAppwriteConfigured) {
      try {
        const userId = ID.unique();
        await account.create(userId, cleanEmail, data.password, data.fullName);
        await account.createEmailPasswordSession(cleanEmail, data.password);
        try {
          await account.updatePrefs({
            propertyName: data.propertyName,
            propertyType: data.propertyType,
            unitCount: data.unitCount,
            role: 'owner',
          });
        } catch {
          // Non-blocking
        }

        const profile: UserProfile = {
          id: userId,
          name: data.fullName,
          email: cleanEmail,
          role: 'owner',
          propertyName: data.propertyName,
          propertyType: data.propertyType,
          unitCount: data.unitCount,
          isDemo: false,
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, 'appwrite');
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
        return profile;
      } catch (err: unknown) {
        if (isNetworkOrFetchError(err)) {
          throw new Error("Can't reach the server. Check your connection and try again.");
        }
        const anyErr = err as { message?: string };
        throw new Error(anyErr.message || 'Signup failed. Please try again.');
      }
    }

    // Local simulation for demo
    const profile: UserProfile = {
      id: 'user-' + Date.now(),
      name: data.fullName,
      email: cleanEmail,
      role: 'owner',
      propertyName: data.propertyName,
      propertyType: data.propertyType,
      unitCount: data.unitCount,
      isDemo: true,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, 'demo');
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
  },

  async quickDemoLogin(): Promise<UserProfile> {
    const demoProfile: UserProfile = {
      id: 'demo-user-fern',
      name: 'Rohan Sharma',
      email: 'owner@mytrackyo.local',
      role: 'owner',
      propertyName: 'The Fern Residency',
      propertyType: 'Boutique Hotel',
      unitCount: '24',
      isDemo: true,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, 'demo');
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(demoProfile));
    return demoProfile;
  },

  async sendPasswordReset(email: string): Promise<void> {
    if (isAppwriteConfigured) {
      const redirectUrl = `${window.location.origin}/reset-password`;
      await account.createRecovery(email, redirectUrl);
      return;
    }
    await new Promise((r) => setTimeout(r, 400));
  },

  async confirmPasswordReset(userId: string, secret: string, password: string): Promise<void> {
    if (isAppwriteConfigured) {
      await account.updateRecovery(userId, secret, password);
      return;
    }
    await new Promise((r) => setTimeout(r, 400));
  },

  async sendVerificationEmail(): Promise<void> {
    if (isAppwriteConfigured) {
      const redirectUrl = `${window.location.origin}/verify-email`;
      await account.createVerification(redirectUrl);
      return;
    }
    await new Promise((r) => setTimeout(r, 400));
  },
};
