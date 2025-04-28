
import {Role} from '../../role/entities/role.entity'


export class User {
  id: string ;
createdAt: Date ;
updatedAt: Date ;
email: string ;
password: string ;
firstName: string ;
lastName: string ;
phoneNumber: string ;
dateOfBirth: Date ;
role?: Role ;
roleId: string ;
}
