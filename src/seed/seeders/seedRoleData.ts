import { Prisma } from '@prisma/client';
import { getSeedData } from './getSeedData';
import { RoleSeedData } from '../nonprod/roleSeedData';

export const seedRoleData = async (prisma: Prisma.TransactionClient) => {
  const seedData = getSeedData('Role') as unknown as RoleSeedData;
  const count = seedData.length;
  if (!count) {
    return;
  }
  for (const role of seedData) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: role,
      create: role,
    });
  }
};
