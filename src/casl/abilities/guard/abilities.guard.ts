import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  AppAbility,
  CaslAbilityFactory,
} from '../../casl-ability.factory/casl-ability.factory';
import { PrismaService } from '../../../prisma/prisma.service';
import { AbilityHandler } from '../ability-handler.interface';
import { CHECK_ABILITY } from '../decorator';

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const abilityHandlers =
      this.reflector.get<AbilityHandler[]>(
        CHECK_ABILITY,
        context.getHandler(),
      ) || [];

    if (abilityHandlers.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user } = request;

    if (!user) {
      return false;
    }

    const userWithRole = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!userWithRole || !userWithRole.role) {
      return false;
    }

    const ability = this.caslAbilityFactory.createForUser(userWithRole);

    request.ability = ability;

    return abilityHandlers.every((handler) =>
      this.execAbilityHandler(handler, ability),
    );
  }

  private execAbilityHandler(
    handler: AbilityHandler,
    ability: AppAbility,
  ): boolean {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
