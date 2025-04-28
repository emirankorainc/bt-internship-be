import { Prisma } from '@prisma/client';
import { getSeedData } from './getSeedData';
import { UserSeedData } from '../nonprod/userSeedData';

export const seedUserData = async (prisma: Prisma.TransactionClient) => {
  const seedData = getSeedData('User') as unknown as UserSeedData;
  const count = seedData.length;
  if (!count) {
    return;
  }
  for (const data of seedData) {
    const user = await prisma.user.findFirst({
      where: { email: data.email },
    });

    if (!user) {
      const userRole = await prisma.role.findFirst({
        where: { isDefault: true },
      });

      if (userRole) {
        await prisma.user.create({
          data: {
            ...data,
            roleId: userRole.id,
          },
        });
      }
    } else {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data,
      });
    }
  }
};
