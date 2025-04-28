import { Module } from '@nestjs/common';
import { AbilitiesGuard } from './abilities/guard/abilities.guard';
import { CaslAbilityFactory } from './casl-ability.factory/casl-ability.factory';

@Module({
  providers: [CaslAbilityFactory, AbilitiesGuard],
  exports: [CaslAbilityFactory, AbilitiesGuard],
})
export class CaslModule {}
