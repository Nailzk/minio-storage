import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { User } from '../entities';
import { UsersService } from '../providers';

@Crud({
  model: {
    type: User,
  },
  params: {
    id: {
      field: 'id',
      type: 'number',
      primary: true,
    },
  },
})
@ApiTags('users')
@Controller('/users')
export class UsersController implements CrudController<User> {
  constructor(public service: UsersService) {}
}
