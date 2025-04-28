import { Prisma } from '@prisma/client';
import { getSeedData } from './getSeedData';
import { PermissionSeedData } from '../nonprod/permissionSeedData';

export const seedPermissionData = async (prisma: Prisma.TransactionClient) => {
  const seedData = getSeedData('Permission') as unknown as PermissionSeedData;
  const count = seedData.length;
  if (!count) {
    return;
  }
  for (const roleEntry of seedData) {
    const roleName = Object.keys(roleEntry)[0];
    const permissions = roleEntry[roleName];

    const role = await prisma.role.findFirst({
      where: { name: roleName },
    });

    if (role) {
      for (const perm of permissions) {
        const permission = await prisma.permission.upsert({
          where: {
            action_subject: {
              action: perm.action,
              subject: perm.subject,
            },
          },
          update: {
            action: perm.action,
            subject: perm.subject,
            conditions: perm.conditions || null,
          },
          create: {
            action: perm.action,
            subject: perm.subject,
            conditions: perm.conditions || null,
          },
        });

        await prisma.role.update({
          where: { id: role.id },
          data: {
            permissions: {
              connect: { id: permission.id },
            },
          },
        });
      }
    }
  }
};
