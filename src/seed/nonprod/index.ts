import { SeedData } from '../types';
import { roleSeedData } from './roleSeedData';
import { userSeedData } from './userSeedData';
import { permissionSeedData } from './permissionSeedData';

export default {
  Role: {
    data: roleSeedData,
    overwrite: true,
  },
  Permission: {
    data: permissionSeedData,
    overwrite: true,
  },
  User: {
    data: userSeedData,
    overwrite: true,
  },
} as SeedData;
