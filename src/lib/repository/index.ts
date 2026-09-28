import { DemoRepository } from './demo';
import { AppwriteRepository } from './appwrite';
import { IRepository } from './types';
import { isAppwriteConfigured } from '../../services/appwrite';

const appwriteRepo = new AppwriteRepository();

export function getRepository(isAppwriteUser = false): IRepository {
  if (isAppwriteConfigured && isAppwriteUser) {
    return appwriteRepo;
  }
  return DemoRepository;
}

export const repository = DemoRepository;
export * from './types';
export * from './demo';
export * from './appwrite';
