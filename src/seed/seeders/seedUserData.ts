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
      where: { id: data.id },
    });

    if (!user) {
      await prisma.user.create({
        data,
      });
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
