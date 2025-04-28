import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AppAbility } from '../../casl-ability.factory/casl-ability.factory';

export const RequestAbility = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AppAbility => {
    const request = ctx.switchToHttp().getRequest();
    return request.ability;
  },
);
