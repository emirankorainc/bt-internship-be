import {
  AbilityBuilder,
  createMongoAbility,
  MongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Permission } from '../../../prisma/generated/permission/entities';
import { Role } from '../../../prisma/generated/role/entities';
import { User } from '../../../prisma/generated/user/entities';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export enum Subject {
  User = 'User',
  Role = 'Role',
  Permission = 'Permission',
  All = 'all',
}

export type AppAbility = MongoAbility<[Action, Subject | Record<string, any>]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User & { role: Role & { permissions: Permission[] } }) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    );

    if (!user || !user.role || !user.role.permissions) {
      return build();
    }

    user.role.permissions.forEach((permission) => {
      const action = permission.action as Action;
      const subjectType = permission.subject as Subject;

      if (permission.conditions) {
        can(action, subjectType, permission.conditions as any);
      } else {
        can(action, subjectType);
      }
    });

    return build();
  }
}
