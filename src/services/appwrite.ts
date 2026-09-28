import { Client, Account, Databases, Storage } from 'appwrite';

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || '';
const project = import.meta.env.VITE_APPWRITE_PROJECT || '';
export const databaseId = import.meta.env.VITE_APPWRITE_DB_ID || '';

export const isAppwriteConfigured = Boolean(endpoint && project);

export const appwriteClient = new Client();

if (isAppwriteConfigured) {
  appwriteClient
    .setEndpoint(endpoint)
    .setProject(project);
}

export const account = new Account(appwriteClient);
export const databases = new Databases(appwriteClient);
export const storage = new Storage(appwriteClient);
