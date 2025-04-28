
import {Prisma} from '@prisma/client'




export class CreatePermissionDto {
  action: string;
subject: string;
conditions?: Prisma.InputJsonValue;
reason?: string;
}
