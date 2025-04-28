export const roleSeedData = [
  {
    name: 'admin',
    description: 'Administrator with full access',
    isDefault: false,
  },
  {
    name: 'team_lead',
    description: 'Team Lead with elevated permissions',
    isDefault: false,
  },
  {
    name: 'user',
    description: 'Regular user with limited access',
    isDefault: true,
  },
];

export type RoleSeedData = typeof roleSeedData;
