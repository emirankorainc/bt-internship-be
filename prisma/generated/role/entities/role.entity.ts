
import {User} from '../../user/entities/user.entity'
import {Permission} from '../../permission/entities/permission.entity'


export class Role {
  id: string ;
name: string ;
description: string  | null;
isDefault: boolean ;
createdAt: Date ;
updatedAt: Date ;
users?: User[] ;
permissions?: Permission[] ;
}
