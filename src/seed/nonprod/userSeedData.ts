export const userSeedData = [
  {
    id: '00000000-0000-1000-a000-000000000010',
    email: 'johndoe@example.com',
    password: '123ABcd.',
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '+38761234567',
    dateOfBirth: new Date('2000-01-02T00:00:00.000Z'),
  },
];

export type UserSeedData = typeof userSeedData;
