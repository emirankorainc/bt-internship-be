import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { JwtGuard } from '../auth/guard';
import { AbilitiesGuard } from '../casl/abilities/guard/abilities.guard';
import { CheckAbilities } from '../casl/abilities/decorator/check-abilities.decorator';
import {
  Action,
  AppAbility,
  Subject,
} from '../casl/casl-ability.factory/casl-ability.factory';
import { subject } from '@casl/ability';
import { RequestAbility } from '../casl/abilities/decorator/request-ability.decorator';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('current-user')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities((ability: AppAbility) =>
    ability.can(Action.Read, Subject.User),
  )
  async findAll(@RequestAbility() ability: AppAbility) {
    const users = await this.userService.findAll();

    const filteredUsers = users.filter((user) =>
      ability.can(Action.Read, subject(Subject.User, user)),
    );

    if (filteredUsers.length === 0)
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );

    return filteredUsers;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
