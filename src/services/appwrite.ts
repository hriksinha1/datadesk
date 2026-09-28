import { Client, Account, Databases, Storage } from 'appwrite';

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || '';
const project = import.meta.env.VITE_APPWRITE_PROJECT || '';
export const databaseId = import.meta.env.VITE_APPWRITE_DB_ID || '';

// Verify whether the values are genuine credentials or default placeholders
const isPlaceholder = (val?: string): boolean => {
  if (!val) return true;
  const s = val.toLowerCase().trim();
  return (
    s === '' ||
    s === 'your_project_id' ||
    s === 'project_id' ||
    s.includes('your_') ||
    s.includes('<') ||
    s.includes('[') ||
    s.includes('placeholder') ||
    s === 'main'
  );
};

export const isAppwriteConfigured = Boolean(
  endpoint &&
  !isPlaceholder(endpoint) &&
  project &&
  !isPlaceholder(project)
);

export const appwriteClient = new Client();

if (isAppwriteConfigured) {
  try {
    appwriteClient
      .setEndpoint(endpoint)
      .setProject(project);
  } catch (err) {
    console.warn('Appwrite client initialization skipped:', err);
  }
}

export const account = new Account(appwriteClient);
export const databases = new Databases(appwriteClient);
export const storage = new Storage(appwriteClient);
