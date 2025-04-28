import { AppAbility } from '../casl-ability.factory/casl-ability.factory';

interface IAbilityHandler {
  handle(ability: AppAbility): boolean;
}

type AbilityHandlerCallback = (ability: AppAbility) => boolean;

export type AbilityHandler = IAbilityHandler | AbilityHandlerCallback;
