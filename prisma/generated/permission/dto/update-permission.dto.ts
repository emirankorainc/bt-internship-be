
import {Prisma} from '@prisma/client'




export class UpdatePermissionDto {
  action?: string;
subject?: string;
conditions?: Prisma.InputJsonValue;
reason?: string;
}
