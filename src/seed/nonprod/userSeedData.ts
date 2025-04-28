export const userSeedData = [
  {
    email: 'johndoe@example.com',
    password: '123ABcd.',
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '+38761234567',
    dateOfBirth: new Date('2000-01-02T00:00:00.000Z'),
  },
  {
    email: 'janesmith@example.com',
    password: '123ABcd.',
    firstName: 'Jane',
    lastName: 'Smith',
    phoneNumber: '+38761234567',
    dateOfBirth: new Date('2000-01-02T00:00:00.000Z'),
  },
  {
    email: 'samlee@example.com',
    password: '123ABcd.',
    firstName: 'Sam',
    lastName: 'Lee',
    phoneNumber: '+38761234567',
    dateOfBirth: new Date('2000-01-02T00:00:00.000Z'),
  },
];

export type UserSeedData = typeof userSeedData;
