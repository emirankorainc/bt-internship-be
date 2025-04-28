import { Action } from '../../casl/casl-ability.factory/casl-ability.factory';

export const permissionSeedData = [
  { admin: [{ action: Action.Manage, subject: 'all' }] },
  {
    team_lead: [
      { action: Action.Read, subject: 'User' },
      {
        action: Action.Update,
        subject: 'User',
        conditions: { id: { $ne: '${user.id}' } },
      },
      { action: Action.Read, subject: 'Role' },
    ],
  },
  {
    user: [
      {
        action: Action.Read,
        subject: 'User',
        conditions: { id: { $eq: '${user.id}' } },
      },
      {
        action: Action.Update,
        subject: 'User',
        conditions: { id: { $eq: '${user.id}' } },
      },
    ],
  },
];

export type PermissionSeedData = typeof permissionSeedData;
