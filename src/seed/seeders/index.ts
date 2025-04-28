import { PrismaClient } from '@prisma/client';
import { seedUserData } from './seedUserData';
import { seedRoleData } from './seedRoleData';
import { seedPermissionData } from './seedPermissionData';

export const seedAllEntities = async (client: PrismaClient) => {
  await client.$transaction(async (prisma) => {
    await seedRoleData(prisma);
    await seedPermissionData(prisma);
    await seedUserData(prisma);
  });
};
